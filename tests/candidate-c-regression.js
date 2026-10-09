const assert = require("assert");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.resolve(__dirname, "..");
const context = { console, Date, Intl, Set, Map, JSON, URLSearchParams };
vm.createContext(context);
[
  "data.js",
  "day-meta.js",
  "route-plan.js",
  "candidate-c-migration.js",
  "storage.js",
  "activity-model.js",
  "log-model.js"
].forEach((file) => vm.runInContext(fs.readFileSync(path.join(ROOT, "js", file), "utf8"), context));
vm.runInContext(`
  this.master = EMBASSY_MASTER;
  this.meta = DAY_META;
  this.plan = CURRENT_ROUTE_PLAN;
  this.planIds = Object.fromEntries(routePlanDayNumbers().map((day) => [day, routePlanIdsForDay(day)]));
  this.planDayFor = (id) => routePlanDayForEmbassy(id);
  this.planEmbassy = (id) => routePlanEmbassyById(id);
  this.prepare = (state, options) => prepareState(state, options);
  this.createInitial = () => createInitialState();
  this.registerCandidateCFixture = (profile, state) => {
    CANDIDATE_C_EXPECTED_FINGERPRINTS[profile] = candidateCStateFingerprint(state);
  };
`, context);

const master = JSON.parse(JSON.stringify(context.master));
const plan = JSON.parse(JSON.stringify(context.plan));
const planIds = JSON.parse(JSON.stringify(context.planIds));
const meta = JSON.parse(JSON.stringify(context.meta));
const masterById = new Map(master.map((embassy) => [embassy.id, embassy]));
const masterSnapshot = master.map(({ id, day, order, country, embassyName, address, googleMapsQuery }) => ({
  id, day, order, country, embassyName, address, googleMapsQuery
}));

assert.strictEqual(master.length, 157);
assert.strictEqual(new Set(master.map((embassy) => embassy.id)).size, 157);
assert.strictEqual(
  crypto.createHash("sha256").update(JSON.stringify(masterSnapshot)).digest("hex"),
  "fab0e37fcc9ebb4f7b95c5c2ec14acc3175a6345f8d07bef33bb3dc770840dbe"
);
assert.strictEqual(plan.id, "candidate-c-2026-10-09");
assert.deepStrictEqual(Object.values(planIds).map((ids) => ids.length), [13, 14, 19, 23, 17, 23, 9, 18, 10, 6]);

for (const day of [1, 2, 3]) {
  const original = master
    .filter((embassy) => embassy.day === day)
    .sort((a, b) => a.order - b.order)
    .map((embassy) => embassy.id);
  assert.deepStrictEqual(planIds[day], original, `Day${day} history route changed`);
}

const allPlanIds = Object.values(planIds).flat();
assert.strictEqual(allPlanIds.length, 152);
assert.strictEqual(new Set(allPlanIds).size, 152);
assert.deepStrictEqual(
  master.map((embassy) => embassy.id).filter((id) => !allPlanIds.includes(id)).sort(),
  ["embassy-エストニア", "embassy-スペイン", "embassy-スウェーデン", "embassy-トルコ", "embassy-ノルウェー"].sort()
);
assert.strictEqual(Object.values(planIds).slice(4).flat().length, 83);
assert.strictEqual(context.planDayFor("embassy-ベナン"), 10);
assert.strictEqual(context.planDayFor("embassy-ザンビア"), 8);
assert.strictEqual(context.planDayFor("embassy-アフガニスタン"), 4);
assert.strictEqual(plan.recoveryCandidateIds.length, 0);
assert.strictEqual(plan.unlocatedIds.length, 0);
assert.strictEqual(Boolean(masterById.get("embassy-アフガニスタン").googleMapsQuery), false);

assert.strictEqual(meta[5].start, "池ノ上駅");
assert.strictEqual(meta[5].goal, "恵比寿駅");
assert.strictEqual(meta[6].start, "六本木一丁目駅");
assert.strictEqual(meta[7].goal, "新富町駅");
assert.strictEqual(meta[8].start, "品川駅");
assert.strictEqual(meta[8].goal, "品川駅");
assert.strictEqual(meta[9].start, "祐天寺駅");
assert.strictEqual(meta[9].goal, "都立大学駅");
assert.strictEqual(meta[10].via, "田園調布駅");
assert.strictEqual(meta[10].goal, "後楽園駅");
assert.strictEqual(plan.days[6].loadLabel, "23件・高負荷コース");
assert.strictEqual(plan.days[10].travelSegments.length, 3);
assert.deepStrictEqual(plan.days[10].travelSegments.map((segment) => segment.travelMode), ["walking", "transit", "walking"]);

const turkmenistan = JSON.parse(JSON.stringify(context.planEmbassy("embassy-トルクメニスタン")));
assert.strictEqual(turkmenistan.address, "〒106-0046 東京都港区元麻布2-8-4");
assert(turkmenistan.googleMapsQuery.includes("元麻布2-8-4"));
assert(turkmenistan.routeLocationNote.includes("スタンプ取得地点"));
assert.notStrictEqual(masterById.get(turkmenistan.id).address, turkmenistan.address);

function acquiredIds(state) {
  return Object.entries(state.embassies)
    .filter(([, embassy]) => embassy.status === "acquired")
    .map(([id]) => id)
    .sort();
}

function validateReviewedState(input, label) {
  const source = JSON.parse(JSON.stringify(input));
  const before = JSON.parse(JSON.stringify(source));
  const prepared = context.prepare(source);
  assert.strictEqual(prepared.error, "", `${label} migration error`);
  assert.strictEqual(prepared.candidateCMigrationApplied, true);
  const migrated = JSON.parse(JSON.stringify(prepared.state));
  assert.deepStrictEqual(source, before, "source backup mutated");
  assert.strictEqual(migrated.dataVersion, "1.1");
  assert.strictEqual(acquiredIds(migrated).length, 74);
  assert.deepStrictEqual(acquiredIds(migrated), acquiredIds(before));
  for (const id of acquiredIds(before)) assert.deepStrictEqual(migrated.embassies[id], before.embassies[id]);
  assert.deepStrictEqual(
    migrated.actualDayActivities.filter((activity) => activity.localDate < "2026-10-09"),
    before.actualDayActivities.filter((activity) => activity.localDate < "2026-10-09")
  );
  const day4 = migrated.actualDayActivities.find((activity) => activity.id === "activity-2026-10-09-day-4");
  assert(day4);
  assert.strictEqual(day4.addedEmbassies.length, 16);
  assert.strictEqual(day4.routeEvents.length, 16);
  assert(!migrated.actualDayActivities.some((activity) => activity.id === "activity-2026-10-09-day-6"));
  const datedLogs = migrated.walkLogs.filter((log) => context.candidateCJapanDate(log.timestamp) === "2026-10-09");
  assert.strictEqual(datedLogs.length, 4);
  assert(datedLogs.every((log) => log.day === 4));
  const oldDatedLogs = before.walkLogs.filter((log) => context.candidateCJapanDate(log.timestamp) === "2026-10-09");
  datedLogs.forEach((log) => {
    const original = oldDatedLogs.find((entry) => entry.id === log.id);
    assert(original);
    assert.deepStrictEqual({ ...log, day: original.day }, original);
  });
  const marker = migrated.migrations.candidateC20261009;
  assert(marker);
  assert.strictEqual(marker.originalActivities.length, before.actualDayActivities.some((activity) => activity.id === "activity-2026-10-09-day-4") ? 2 : 1);
  const second = context.prepare(migrated);
  assert.strictEqual(second.error, "");
  assert.strictEqual(second.candidateCMigration.status, "already-applied");
  assert.deepStrictEqual(JSON.parse(JSON.stringify(second.state)), migrated);

  const changed = JSON.parse(JSON.stringify(before));
  changed.memo = `${changed.memo || ""} changed`;
  const rejected = context.prepare(changed);
  assert.strictEqual(rejected.candidateCMigration.status, "blocked");
  assert(rejected.error.includes("保存データは変更していません"));
  assert.deepStrictEqual(changed.embassies, before.embassies);

  const acquiredOnOctoberNinth = acquiredIds(before).filter((id) => (
    context.candidateCJapanDate(before.embassies[id].acquiredAt) === "2026-10-09"
  ));
  assert.strictEqual(acquiredOnOctoberNinth.length, 23);
  assert.deepStrictEqual(acquiredOnOctoberNinth.sort(), planIds[4].slice().sort());
  const futureIds = [5, 6, 7, 8, 9, 10].flatMap((day) => planIds[day]);
  assert(futureIds.every((id) => before.embassies[id].status !== "acquired"));
}

function createAnonymousMigrationFixture() {
  const state = JSON.parse(JSON.stringify(context.createInitial()));
  const dayFourIds = planIds[4].slice();
  const pastAdditionIds = master
    .map((embassy) => embassy.id)
    .filter((id) => !allPlanIds.includes(id));
  const otherIds = [
    ...planIds[1],
    ...planIds[2],
    ...planIds[3],
    ...pastAdditionIds
  ];
  assert.strictEqual(otherIds.length, 51);
  [...dayFourIds, ...otherIds].forEach((id, index) => {
    const timestamp = index < dayFourIds.length
      ? `2026-10-09T${String(index % 9).padStart(2, "0")}:00:00.000Z`
      : `2026-10-03T${String(index % 9).padStart(2, "0")}:00:00.000Z`;
    state.embassies[id] = {
      status: "acquired",
      acquiredAt: timestamp,
      updatedAt: timestamp
    };
  });
  const addedIds = dayFourIds.slice(0, 16);
  state.actualDayActivities = [
    {
      id: "activity-2026-10-09-day-4",
      localDate: "2026-10-09",
      plannedDay: 4,
      addedEmbassies: [{
        embassyId: "embassy-チリ",
        masterDay: masterById.get("embassy-チリ").day,
        addedAt: "2026-10-09T00:10:00.000Z",
        source: "user"
      }],
      routeEvents: [{
        id: "route-fixture-chile",
        type: "route-added",
        embassyId: "embassy-チリ",
        timestamp: "2026-10-09T00:10:00.000Z"
      }]
    },
    {
      id: "activity-2026-10-09-day-6",
      localDate: "2026-10-09",
      plannedDay: 6,
      addedEmbassies: addedIds.map((id, index) => ({
        embassyId: id,
        masterDay: masterById.get(id).day,
        addedAt: `2026-10-09T0${index % 9}:20:00.000Z`,
        source: "user"
      })),
      routeEvents: addedIds.map((id, index) => ({
        id: `route-fixture-${index}`,
        type: "route-added",
        embassyId: id,
        timestamp: `2026-10-09T0${index % 9}:20:00.000Z`
      }))
    }
  ];
  state.walkLogs = Array.from({ length: 4 }, (_, index) => ({
    id: `log-fixture-${index}`,
    day: 6,
    category: "メモ",
    text: `匿名テスト記録${index + 1}`,
    timestamp: `2026-10-09T0${index + 1}:30:00.000Z`,
    updatedAt: null
  }));
  state.memo = "anonymous-candidate-c-fixture";
  return state;
}

const anonymousFixture = createAnonymousMigrationFixture();
context.registerCandidateCFixture("anonymous-test", anonymousFixture);
validateReviewedState(anonymousFixture, "anonymous fixture");

const reviewedBackups = [
  path.join(ROOT, "embassy-rally-backup-2026-10-09.json"),
  path.join(ROOT, "embassy-rally-backup-2026-10-09 1.json")
];
const availableReviewedBackups = reviewedBackups.filter((file) => fs.existsSync(file));
availableReviewedBackups.forEach((file) => {
  validateReviewedState(JSON.parse(fs.readFileSync(file, "utf8")), path.basename(file));
});

const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
const appSource = fs.readFileSync(path.join(ROOT, "js", "app.js"), "utf8");
const cssSource = fs.readFileSync(path.join(ROOT, "css", "style.css"), "utf8");
assert(html.includes("js/candidate-c-migration.js?v=candidate-c-20261009"));
assert(html.includes('id="routeTravelGuidance"'));
assert(/id="recoveryMenuEntry"[^>]*hidden/.test(html));
assert(html.includes("攻略コース 152件 ＋ コース外 5件 ＝ 全157件"));
assert(cssSource.includes("[hidden]"));
assert(appSource.includes("function renderRouteTravelGuidance()"));
assert(appSource.includes("!plannedIds.has(entry.embassy.id)"));
assert(!appSource.includes("unlockDay"));
assert(!appSource.includes("requiredPreviousDay"));

console.log("Candidate C regression: PASS");
console.log("Master 157 / acquired 74 / remaining 83 / route plan 152 + past additions 5");
console.log("Anonymous migration fixture / conflict guard / idempotence: PASS");
console.log(`Reviewed local backups checked: ${availableReviewedBackups.length} (optional, never committed)`);
