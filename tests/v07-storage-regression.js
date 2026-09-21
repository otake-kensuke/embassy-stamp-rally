const assert = require("assert");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const fixturePath = path.join(__dirname, "fixtures", "v063-golden-state.json");
const fixture = JSON.parse(fs.readFileSync(fixturePath, "utf8"));
const storage = new Map();
const context = {
  console,
  Date,
  Intl,
  Set,
  Map,
  JSON,
  localStorage: {
    getItem: (key) => storage.has(key) ? storage.get(key) : null,
    setItem: (key, value) => storage.set(key, value)
  }
};
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(root, "js", "data.js"), "utf8"), context);
vm.runInContext(fs.readFileSync(path.join(root, "js", "day-meta.js"), "utf8"), context);
vm.runInContext(fs.readFileSync(path.join(root, "js", "guide-comments.js"), "utf8"), context);
vm.runInContext(fs.readFileSync(path.join(root, "js", "storage.js"), "utf8"), context);
vm.runInContext(fs.readFileSync(path.join(root, "js", "activity-model.js"), "utf8"), context);
vm.runInContext(fs.readFileSync(path.join(root, "js", "log-model.js"), "utf8"), context);
vm.runInContext("this.master = EMBASSY_MASTER; this.meta = DAY_META;", context);

const acquiredBefore = Object.entries(fixture.embassies)
  .filter(([, value]) => value.status === "acquired")
  .map(([id]) => id)
  .sort();
const acquiredAtBefore = Object.fromEntries(acquiredBefore.map((id) => [id, fixture.embassies[id].acquiredAt]));
const logTimestampsBefore = fixture.walkLogs.map((log) => log.timestamp);

const first = context.prepareState(fixture);
assert.strictEqual(first.error, "");
assert.strictEqual(first.migrated, true);
assert.strictEqual(first.state.dataVersion, "1.1");
const migratedState = JSON.parse(JSON.stringify(first.state));
const master = JSON.parse(JSON.stringify(context.master));

const acquiredAfter = master
  .filter((embassy) => migratedState.embassies[embassy.id].status === "acquired")
  .map((embassy) => embassy.id)
  .sort();
assert.deepStrictEqual(acquiredAfter, acquiredBefore);
assert.deepStrictEqual(
  Object.fromEntries(acquiredAfter.map((id) => [id, migratedState.embassies[id].acquiredAt])),
  acquiredAtBefore
);
assert.strictEqual(migratedState.walkLogs.length, 4);
assert.deepStrictEqual(migratedState.walkLogs.map((log) => log.timestamp), logTimestampsBefore);
assert.strictEqual(migratedState.settings.activeDay, 1);
assert.strictEqual(migratedState.settings.lastScreen, "home");

const dayOne = master.filter((embassy) => embassy.day === 1);
assert.strictEqual(dayOne.filter((embassy) => migratedState.embassies[embassy.id].status === "acquired").length, 13);
const norway = master.find((embassy) => embassy.id === "embassy-ノルウェー");
assert.strictEqual(norway.day, 4);
assert.strictEqual(migratedState.embassies[norway.id].status, "acquired");
const norwayActivity = migratedState.actualDayActivities.find((activity) => activity.plannedDay === 1
  && activity.addedEmbassies.some((entry) => entry.embassyId === norway.id));
assert.ok(norwayActivity);
const norwayAdded = norwayActivity.addedEmbassies.find((entry) => entry.embassyId === norway.id);
assert.strictEqual(norwayAdded.masterDay, 4);
assert.strictEqual(norwayAdded.addedAt, null);
assert.strictEqual(norwayAdded.source, "migration");
assert.strictEqual(norwayActivity.routeEvents.length, 0);

const second = context.prepareState(first.state);
assert.strictEqual(second.error, "");
assert.strictEqual(second.migrated, false);
assert.deepStrictEqual(JSON.parse(JSON.stringify(second.state)), migratedState);

storage.set("embassyStampRally.appState", JSON.stringify(fixture));
const loaded = context.loadState();
assert.strictEqual(loaded.dataVersion, "1.1");
assert.strictEqual(JSON.parse(storage.get("embassyStampRally.appState")).dataVersion, "1.1");

storage.clear();
const savedV11 = context.saveState(migratedState);
const roundTripV11 = context.loadState();
assert.deepStrictEqual(
  JSON.parse(JSON.stringify(roundTripV11)),
  JSON.parse(JSON.stringify(savedV11))
);

const invalidOriginal = storage.get("embassyStampRally.appState");
const invalid = context.prepareState({ dataVersion: "9.9" });
assert.ok(invalid.error);
assert.strictEqual(storage.get("embassyStampRally.appState"), invalidOriginal);

const counts = master.reduce((result, embassy) => {
  result[embassy.day] = (result[embassy.day] || 0) + 1;
  return result;
}, {});
assert.strictEqual(master.length, 157);
assert.deepStrictEqual(counts, { 1: 13, 2: 14, 3: 19, 4: 18, 5: 16, 6: 16, 7: 22, 8: 21, 9: 10, 10: 8 });
assert.strictEqual(new Set(master.map((embassy) => embassy.id)).size, 157);
assert.strictEqual(master.filter((embassy) => !embassy.googleMapsQuery).length, 1);
assert.strictEqual(master.find((embassy) => !embassy.googleMapsQuery).id, "embassy-アフガニスタン");
const masterSignature = JSON.stringify(master.map(({
  id, day, order, country, embassyName, address, googleMapsQuery
}) => ({ id, day, order, country, embassyName, address, googleMapsQuery })));
assert.strictEqual(
  crypto.createHash("sha256").update(masterSignature).digest("hex"),
  "fab0e37fcc9ebb4f7b95c5c2ec14acc3175a6345f8d07bef33bb3dc770840dbe"
);
const meta = JSON.parse(JSON.stringify(context.meta));
assert.deepStrictEqual(meta[1], { area: "南麻布・広尾", start: "恵比寿駅", goal: "麻布十番駅" });
assert.deepStrictEqual(meta[10], { area: "世田谷・田園調布＋最終回収", start: "下北沢駅", goal: "田園調布駅" });

const routeState = JSON.parse(JSON.stringify(migratedState));
const america = master.find((embassy) => embassy.country === "アメリカ合衆国");
const routeAddedAt = "2026-09-21T03:00:00.000Z";
const addResult = context.addEmbassyToActivity(routeState, america, "2026-09-21", 1, routeAddedAt);
assert.strictEqual(addResult.added, true);
assert.strictEqual(addResult.activity.addedEmbassies.length, 2);
assert.strictEqual(addResult.activity.routeEvents.length, 1);
assert.strictEqual(context.addEmbassyToActivity(routeState, america, "2026-09-21", 1, routeAddedAt).added, false);
assert.strictEqual(context.removeEmbassyFromActivity(routeState, addResult.activity.id, america.id, true), false);
assert.strictEqual(context.removeEmbassyFromActivity(routeState, addResult.activity.id, america.id, false), true);
assert.strictEqual(addResult.activity.addedEmbassies.some((entry) => entry.embassyId === america.id), false);
assert.strictEqual(addResult.activity.routeEvents.some((event) => event.embassyId === america.id), false);

assert.strictEqual(context.getGuideComments({ day: 1, area: "南麻布・広尾", complete: true }).man, "Day 1 コンプリート！");
assert.strictEqual(context.getGuideComments({ day: 1, area: "南麻布・広尾", complete: false, addedNext: true, nextName: "ノルウェー大使館" }).woman, "予定外の発見も街歩きの楽しみだね！");

const logState = JSON.parse(JSON.stringify(migratedState));
const originalTimestamp = logState.walkLogs[0].timestamp;
assert.strictEqual(context.updateWalkLog(logState, logState.walkLogs[0].id, "寄り道", "編集後", "2026-09-21T04:00:00.000Z"), true);
assert.strictEqual(logState.walkLogs[0].timestamp, originalTimestamp);
assert.strictEqual(logState.walkLogs[0].updatedAt, "2026-09-21T04:00:00.000Z");
const deletedLogId = logState.walkLogs[0].id;
assert.strictEqual(context.deleteWalkLogData(logState, deletedLogId), true);
assert.strictEqual(logState.walkLogs.some((log) => log.id === deletedLogId), false);

console.log("v0.7 storage/migration regression: PASS");
