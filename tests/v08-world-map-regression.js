const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const mappingPath = path.join(root, "data", "world-map", "embassy-country-mapping-v0.8.json");
const validationMappingPath = path.join(root, "prototype", "world-map-concept", "data", "embassy-country-mapping-v0.8.json");
const mapPath = path.join(root, "data", "world-map", "ne_110m_admin_0_countries.geojson");
const fixturePath = path.join(__dirname, "fixtures", "v063-golden-state.json");

const context = {};
vm.createContext(context);
vm.runInContext(
  `${fs.readFileSync(path.join(root, "js", "data.js"), "utf8")};globalThis.master = EMBASSY_MASTER;`,
  context
);

const master = JSON.parse(JSON.stringify(context.master));
const mapping = JSON.parse(fs.readFileSync(mappingPath, "utf8"));
const validationMapping = JSON.parse(fs.readFileSync(validationMappingPath, "utf8"));
const mapData = JSON.parse(fs.readFileSync(mapPath, "utf8"));
const fixture = JSON.parse(fs.readFileSync(fixturePath, "utf8"));
const rows = mapping.rows;
const featureCodes = new Set(mapData.features.map((feature) => feature.properties.ADM0_A3));

assert.deepStrictEqual(mapping, validationMapping);
assert.strictEqual(master.length, 157);
assert.strictEqual(rows.length, 157);
assert.strictEqual(new Set(rows.map((row) => row.embassyId)).size, 157);
assert.strictEqual(new Set(rows.map((row) => row.countryCode)).size, 157);

const masterById = new Map(master.map((embassy) => [embassy.id, embassy]));
rows.forEach((row) => {
  const embassy = masterById.get(row.embassyId);
  assert.ok(embassy, `Missing master entry: ${row.embassyId}`);
  assert.strictEqual(row.embassyName, embassy.embassyName);
  assert.strictEqual(row.masterDay, embassy.day);
  assert.strictEqual(row.masterOrder, embassy.order);
  assert.strictEqual(row.address, embassy.address);
  assert.ok(row.countryCode);
  assert.ok(row.naturalEarthAdm0A3);
  assert.ok(row.naturalEarthContinent);
  assert.ok(row.appRegion);
  assert.ok(row.regionColor);
});

const regionCounts = rows.reduce((counts, row) => {
  counts[row.appRegion] = (counts[row.appRegion] || 0) + 1;
  return counts;
}, {});
assert.deepStrictEqual(regionCounts, {
  Americas: 23,
  Europe: 41,
  Asia: 44,
  Africa: 40,
  Oceania: 9
});

const polygons = rows.filter((row) => row.renderMethod === "polygon");
const markers = rows.filter((row) => row.renderMethod === "marker");
assert.strictEqual(polygons.length, 145);
assert.strictEqual(markers.length, 12);
assert.strictEqual(rows.filter((row) => row.renderMethod === "TBD").length, 0);
assert.ok(polygons.every((row) => row.has110mGeometry && featureCodes.has(row.naturalEarthAdm0A3)));
assert.ok(markers.every((row) => !row.has110mGeometry
  && Number.isFinite(row.markerLongitude)
  && Number.isFinite(row.markerLatitude)));
assert.deepStrictEqual(markers.map((row) => row.countryOrRegionNameJa), [
  "バーレーン",
  "ローマ法王庁",
  "モルディブ",
  "サンマリノ",
  "マルタ",
  "トンガ",
  "サモア",
  "パラオ",
  "シンガポール",
  "ミクロネシア",
  "モーリシャス",
  "マーシャル諸島"
]);

function acquiredRows(state) {
  return rows.filter((row) => state.embassies[row.embassyId]?.status === "acquired");
}

const emptyState = {
  embassies: Object.fromEntries(master.map((embassy) => [embassy.id, { status: "unvisited" }]))
};
assert.strictEqual(acquiredRows(emptyState).length, 0);
Object.keys(regionCounts).forEach((region) => {
  assert.strictEqual(acquiredRows(emptyState).filter((row) => row.appRegion === region).length, 0);
});

const firstId = rows[0].embassyId;
emptyState.embassies[firstId].status = "acquired";
assert.strictEqual(acquiredRows(emptyState).length, 1);
emptyState.embassies[firstId].status = "unvisited";
assert.strictEqual(acquiredRows(emptyState).length, 0);

const goldenAcquired = acquiredRows(fixture);
assert.strictEqual(goldenAcquired.length, 14);
assert.ok(goldenAcquired.some((row) => row.countryOrRegionNameJa === "ノルウェー"));

const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const worldMapSource = fs.readFileSync(path.join(root, "js", "world-map.js"), "utf8");
assert.ok(html.includes('id="world-mapScreen"'));
assert.ok(html.includes('data-screen="world-map"'));
assert.ok(html.includes('js/world-map.js?v=0.8'));
assert.ok(!worldMapSource.includes("localStorage"));
assert.ok(fs.existsSync(path.join(root, "data", "world-map", "NATURAL-EARTH-LICENSE.md")));
assert.ok(fs.existsSync(path.join(root, "vendor", "D3-LICENSE.txt")));

console.log("v0.8 World Map regression: PASS");
