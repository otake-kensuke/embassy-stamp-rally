const assert = require("assert");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.resolve(__dirname, "..");
const BACKUP = JSON.parse(fs.readFileSync(path.join(ROOT, "embassy-rally-backup-2026-10-03 2.json"), "utf8"));
const ANALYSIS = JSON.parse(fs.readFileSync(
  path.join(ROOT, "docs", "route-reoptimization-v0.2", "candidate-b-prime-data.json"),
  "utf8"
));
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
[
  "data.js",
  "day-meta.js",
  "route-plan.js",
  "storage.js",
  "activity-model.js",
  "log-model.js"
].forEach((file) => vm.runInContext(fs.readFileSync(path.join(ROOT, "js", file), "utf8"), context));
vm.runInContext(`
  this.master = EMBASSY_MASTER;
  this.meta = DAY_META;
  this.plan = CURRENT_ROUTE_PLAN;
  this.planDays = routePlanDayNumbers();
  this.planIds = Object.fromEntries(this.planDays.map((day) => [day, routePlanIdsForDay(day)]));
  this.planDayFor = (id) => routePlanDayForEmbassy(id);
  this.recovery = (id) => isRecoveryCandidate(id);
  this.recoveryEmbassies = () => recoveryCandidateEmbassies();
  this.recoveryProgress = (statuses) => recoveryCandidateProgress((id) => statuses[id] || "unvisited");
  this.unlocated = (id) => isUnlocatedRouteCandidate(id);
`, context);

const master = JSON.parse(JSON.stringify(context.master));
const meta = JSON.parse(JSON.stringify(context.meta));
const plan = JSON.parse(JSON.stringify(context.plan));
const planIds = JSON.parse(JSON.stringify(context.planIds));
const masterById = new Map(master.map((embassy) => [embassy.id, embassy]));
const acquiredBefore = Object.entries(BACKUP.embassies)
  .filter(([, value]) => value.status === "acquired")
  .map(([id]) => id)
  .sort();

assert.strictEqual(BACKUP.dataVersion, "1.1");
assert.strictEqual(master.length, 157);
assert.strictEqual(new Set(master.map((embassy) => embassy.id)).size, 157);
const masterSignature = JSON.stringify(master.map(({
  id, day, order, country, embassyName, address, googleMapsQuery
}) => ({ id, day, order, country, embassyName, address, googleMapsQuery })));
assert.strictEqual(
  crypto.createHash("sha256").update(masterSignature).digest("hex"),
  "fab0e37fcc9ebb4f7b95c5c2ec14acc3175a6345f8d07bef33bb3dc770840dbe"
);

assert.strictEqual(plan.id, "candidate-b-prime-2026-10-06");
assert.strictEqual(plan.status, "PM APPROVED / PRODUCTION IMPLEMENTED / PC VERIFIED");
assert.deepStrictEqual(JSON.parse(JSON.stringify(context.planDays)), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
assert.deepStrictEqual(Object.values(planIds).map((ids) => ids.length), [13, 14, 19, 14, 17, 17, 17, 17, 12, 9]);
assert.deepStrictEqual(
  Object.fromEntries([4, 5, 6, 7, 8, 9, 10].map((day) => [day, {
    km: plan.days[day].estimatedWalkingKm,
    minutes: plan.days[day].estimatedWalkingMinutes
  }])),
  {
    4: { km: 7.61, minutes: 102 },
    5: { km: 12.3, minutes: 164 },
    6: { km: 11.34, minutes: 151 },
    7: { km: 10.81, minutes: 144 },
    8: { km: 12.6, minutes: 168 },
    9: { km: 12.61, minutes: 169 },
    10: { km: 14.14, minutes: 189 }
  }
);
assert.strictEqual(plan.days[10].mode, "public-transit-hybrid");

for (const day of [1, 2, 3]) {
  const masterIds = master
    .filter((embassy) => embassy.day === day)
    .sort((a, b) => a.order - b.order)
    .map((embassy) => embassy.id);
  assert.deepStrictEqual(planIds[day], masterIds, `Day${day} history changed`);
}

const expectedRoutes = {
  4: ANALYSIS.day4.practicalShortest.entries,
  5: ANALYSIS.fixedDay5To8[5].entries,
  6: ANALYSIS.fixedDay5To8[6].entries,
  7: ANALYSIS.fixedDay5To8[7].entries,
  8: ANALYSIS.fixedDay5To8[8].entries,
  9: ANALYSIS.day9.cameroonStay.entries,
  10: ANALYSIS.day10.cameroonStayDay9.walking.entries
};
for (const day of [4, 5, 6, 7, 8, 9, 10]) {
  assert.deepStrictEqual(planIds[day], expectedRoutes[day].map((entry) => entry.id), `Day${day} route/order`);
}

const allPlanIds = Object.values(planIds).flat();
assert.strictEqual(allPlanIds.length, 149);
assert.strictEqual(new Set(allPlanIds).size, 149);
assert(!allPlanIds.includes("embassy-ベナン"));
assert(!allPlanIds.includes("embassy-ザンビア"));
assert(!allPlanIds.includes("embassy-アフガニスタン"));
assert(planIds[9].includes("embassy-カメルーン"));
assert(!planIds[10].includes("embassy-カメルーン"));
assert.strictEqual(context.recovery("embassy-ベナン"), true);
assert.strictEqual(context.recovery("embassy-ザンビア"), true);
assert.deepStrictEqual(
  JSON.parse(JSON.stringify(context.recoveryEmbassies().map((embassy) => embassy.id))),
  ["embassy-ベナン", "embassy-ザンビア"]
);
assert.deepStrictEqual(JSON.parse(JSON.stringify(context.recoveryProgress({}))), {
  done: 0, total: 2, complete: false
});
assert.deepStrictEqual(JSON.parse(JSON.stringify(context.recoveryProgress({ "embassy-ベナン": "acquired" }))), {
  done: 1, total: 2, complete: false
});
assert.deepStrictEqual(JSON.parse(JSON.stringify(context.recoveryProgress({
  "embassy-ベナン": "acquired",
  "embassy-ザンビア": "acquired"
}))), {
  done: 2, total: 2, complete: true
});
assert.deepStrictEqual(JSON.parse(JSON.stringify(context.recoveryProgress({ "embassy-ザンビア": "acquired" }))), {
  done: 1, total: 2, complete: false
});
assert.strictEqual(context.unlocated("embassy-アフガニスタン"), true);
assert.strictEqual(Boolean(masterById.get("embassy-アフガニスタン").googleMapsQuery), false);

const omitted = master.map((embassy) => embassy.id).filter((id) => !allPlanIds.includes(id));
assert.strictEqual(omitted.length, 8);
for (const id of omitted) {
  assert(
    plan.recoveryCandidateIds.includes(id)
      || plan.unlocatedIds.includes(id)
      || acquiredBefore.includes(id),
    `unaccounted route omission: ${id}`
  );
}

assert.deepStrictEqual(meta[4], { area: "東麻布・虎ノ門・築地・入船", start: "赤羽橋駅", goal: "新富町駅" });
assert.deepStrictEqual(meta[9], { area: "八雲・駒沢・五反田・北品川", start: "都立大学駅", goal: "北品川駅" });
assert.deepStrictEqual(meta[10], {
  area: "用賀・桜新町・八雲・田園調布",
  start: "用賀駅",
  goal: "田園調布駅",
  modeLabel: "公共交通併用Day"
});

const prepared = context.prepareState(BACKUP);
assert.strictEqual(prepared.error, "");
assert.strictEqual(prepared.migrated, false);
const restored = JSON.parse(JSON.stringify(prepared.state));
const acquiredAfter = Object.entries(restored.embassies)
  .filter(([, value]) => value.status === "acquired")
  .map(([id]) => id)
  .sort();
assert.strictEqual(acquiredAfter.length, 51);
assert.deepStrictEqual(acquiredAfter, acquiredBefore);
assert.deepStrictEqual(
  Object.fromEntries(acquiredAfter.map((id) => [id, restored.embassies[id].acquiredAt])),
  Object.fromEntries(acquiredBefore.map((id) => [id, BACKUP.embassies[id].acquiredAt]))
);
assert.deepStrictEqual(restored.walkLogs, BACKUP.walkLogs);
assert.deepStrictEqual(restored.actualDayActivities, BACKUP.actualDayActivities);
assert.strictEqual(restored.manualNextId, BACKUP.manualNextId);
assert.deepStrictEqual(restored.settings, BACKUP.settings);

const additionsById = new Map();
for (const activity of restored.actualDayActivities) {
  for (const addition of activity.addedEmbassies) {
    const rows = additionsById.get(addition.embassyId) || [];
    rows.push({ plannedDay: activity.plannedDay, addition });
    additionsById.set(addition.embassyId, rows);
  }
}
const expectedAddedDays = {
  "embassy-ノルウェー": 1,
  "embassy-スウェーデン": 2,
  "embassy-スペイン": 2,
  "embassy-エストニア": 2,
  "embassy-トルコ": 2
};
assert.strictEqual(additionsById.size, 5);
for (const [id, day] of Object.entries(expectedAddedDays)) {
  assert.deepStrictEqual(additionsById.get(id).map((row) => row.plannedDay), [day]);
  assert.strictEqual(restored.embassies[id].status, "acquired");
  assert.strictEqual(context.planDayFor(id), null);
}
assert.strictEqual(
  allPlanIds.length + additionsById.size + plan.recoveryCandidateIds.length + plan.unlocatedIds.length,
  157
);

const octoberThirdLogs = restored.walkLogs.filter((log) => (log.timestamp || log.createdAt || "").startsWith("2026-10-03"));
assert.strictEqual(octoberThirdLogs.length, 4);
assert(octoberThirdLogs.every((log) => log.day === 3));
assert(octoberThirdLogs.some((log) => log.text === "15:24の神楽坂で帰る！" && log.day === 3));

const norway = masterById.get("embassy-ノルウェー");
assert.strictEqual(norway.day, 4);
assert.strictEqual(restored.embassies[norway.id].status, "acquired");
const norwayAddition = restored.actualDayActivities
  .flatMap((activity) => activity.addedEmbassies.map((added) => ({ activity, added })))
  .find(({ added }) => added.embassyId === norway.id);
assert(norwayAddition);
assert.strictEqual(norwayAddition.activity.plannedDay, 1);
assert.strictEqual(norwayAddition.added.masterDay, 4);

for (const id of ["embassy-ベナン", "embassy-ザンビア"]) {
  const embassy = masterById.get(id);
  assert(embassy);
  assert(embassy.googleMapsQuery);
  const clone = JSON.parse(JSON.stringify(restored));
  const result = context.addEmbassyToActivity(clone, embassy, "2026-10-06", 4, "2026-10-06T01:00:00.000Z");
  assert.strictEqual(result.added, true);
  assert.strictEqual(result.activity.addedEmbassies[0].masterDay, embassy.day);
  assert.strictEqual(result.activity.addedEmbassies[0].embassyId, id);
}

const mapping = JSON.parse(fs.readFileSync(
  path.join(ROOT, "data", "world-map", "embassy-country-mapping-v0.8.json"),
  "utf8"
));
for (const id of ["embassy-ベナン", "embassy-ザンビア", "embassy-アフガニスタン"]) {
  assert(mapping.rows.some((row) => row.embassyId === id), `World Map mapping: ${id}`);
}

const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
const appSource = fs.readFileSync(path.join(ROOT, "js", "app.js"), "utf8");
assert(html.includes('js/route-plan.js?v=candidate-b-prime-recovery-20261006'));
assert(html.includes('id="recoveryProgress"'));
assert(html.includes('id="recoveryMenuEntry"'));
assert(html.includes('id="dayPlanBreakdownHeading"'));
assert(html.includes('id="dayPlanEquation"'));
assert(html.includes('id="dayAddedSummary"'));
assert(html.includes('id="dayRecoverySummary"'));
assert(html.includes('id="dayUnlocatedSummary"'));
assert(html.includes("徒歩時間は移動のみの目安です。"));
assert(!html.includes('id="recoveryList"'));
assert(!html.includes('class="recovery-card"'));
assert(html.indexOf('data-screen="settings"') < html.indexOf('id="recoveryMenuEntry"'));
assert(html.indexOf('id="recoveryMenuEntry"') < html.indexOf('class="home-visual-footer"'));
assert(html.includes("攻略コースを選択してください。順不同で実施できます。"));
assert(appSource.includes("function renderRecoveryCard()"));
assert(appSource.includes('normalized === "飛び地回収"'));
assert(appSource.includes("function openRecoveryCandidates()"));
assert(appSource.includes("function uniqueAddedDayForEmbassy(id)"));
assert(appSource.includes("function routePlanEstimateText(day)"));
assert(appSource.includes("function renderDayPlanBreakdown()"));
assert(appSource.includes("function searchResultDetail(embassy)"));
assert(appSource.includes('return `攻略コース Day ${plannedDay}・${statusLabel(embassy.id)}`'));
assert(appSource.includes('return `当日追加 Day ${addedDay}・${statusLabel(embassy.id)}`'));
assert(appSource.includes('return `飛び地回収・${statusLabel(embassy.id)}`'));
assert(appSource.includes('if (isUnlocatedRouteCandidate(embassy.id)) return "要確認"'));
assert(!appSource.includes("飛び地回収・正式Day"));
assert(!appSource.includes("地図要確認・正式Day"));
assert(!appSource.includes("通常ルート外・正式Day"));
assert(appSource.includes('mapLink.className = "search-result-map"'));
assert(appSource.includes('mapLink.target = "_blank"'));
assert(!appSource.includes("unlockDay"));
assert(!appSource.includes("requiredPreviousDay"));
for (const day of [6, 4, 8]) {
  assert(planIds[day].length > 0, `arbitrary course selection Day${day}`);
}
assert(html.indexOf("js/data.js") < html.indexOf("js/route-plan.js"));
assert(html.indexOf("js/route-plan.js") < html.indexOf("js/app.js"));
assert.strictEqual(context.DATA_VERSION, undefined);
assert.strictEqual(restored.dataVersion, "1.1");

console.log("Candidate B' production regression: PASS");
console.log("Master 157 / acquired 51 / route plan 149 + recovery 2 + unlocated 1");
console.log("Backup user data preserved / dataVersion 1.1");
