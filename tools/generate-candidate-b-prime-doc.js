const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const DATA_PATH = path.join(ROOT, "docs", "route-reoptimization-v0.2", "candidate-b-prime-data.json");
const OUTPUT_PATH = path.join(ROOT, "docs", "route-reoptimization-v0.2", "candidate-b-prime-analysis.md");
const data = JSON.parse(fs.readFileSync(DATA_PATH, "utf8"));

function delta(after, before) {
  return {
    distance: Number((after.distanceKm - before.distanceKm).toFixed(2)),
    minutes: after.durationMinutes - before.durationMinutes,
    percent: Number((((after.distanceKm - before.distanceKm) / before.distanceKm) * 100).toFixed(1)),
  };
}

function signed(value, unit = "") {
  return `${value > 0 ? "+" : ""}${value}${unit}`;
}

function routeText(route) {
  return route.entries.map((entry) => entry.country).join(" → ");
}

function entryTable(route) {
  return route.entries.map((entry) =>
    `| ${entry.order} | \`${entry.id}\` | ${entry.country} | ${entry.currentDay} | 未取得 | ${entry.address} |`
  ).join("\n");
}

const d4Same = delta(data.day4.sameEndpoints, data.baseline[4]);
const d4Practical = delta(data.day4.practicalShortest, data.baseline[4]);
const d9Stay = delta(data.day9.cameroonStay, data.baseline[9]);
const d9Move = delta(data.day9.cameroonMoveToWest, data.baseline[9]);
const d9MoveVsStay = delta(data.day9.cameroonMoveToWest, data.day9.cameroonStay);
const d10MoveVsStay = delta(data.day10.cameroonMoveFromDay9.walking, data.day10.cameroonStayDay9.walking);
const combinedStay = {
  distanceKm: Number((data.day9.cameroonStay.distanceKm + data.day10.cameroonStayDay9.walking.distanceKm).toFixed(2)),
  durationMinutes: data.day9.cameroonStay.durationMinutes + data.day10.cameroonStayDay9.walking.durationMinutes,
};
const combinedMove = {
  distanceKm: Number((data.day9.cameroonMoveToWest.distanceKm + data.day10.cameroonMoveFromDay9.walking.distanceKm).toFixed(2)),
  durationMinutes: data.day9.cameroonMoveToWest.durationMinutes + data.day10.cameroonMoveFromDay9.walking.durationMinutes,
};
const combinedDelta = delta(combinedMove, combinedStay);

const fixedRows = Object.entries(data.fixedDay5To8).map(([day, route]) => {
  const change = delta(route, data.baseline[day]);
  return `| Day${day} | ${route.embassyCount} | ${route.start} | ${route.goal} | ${route.distanceKm}km / ${route.durationMinutes}分 | ${signed(change.distance, "km")} / ${signed(change.minutes, "分")} |`;
}).join("\n");

const fixedDetails = Object.entries(data.fixedDay5To8).map(([day, route]) => `
### Day${day}

- START / GOAL: ${route.start} → ${route.goal}
- 件数: ${route.embassyCount}件
- 推定徒歩: ${route.distanceKm}km / ${route.durationMinutes}分
- 訪問順: ${routeText(route)}

| 順 | 正式ID | 国・地域 | Master Day | 状態 | 正式住所 |
|---:|---|---|---:|---|---|
${entryTable(route)}
`).join("\n");

const recovery = ["embassy-ベナン", "embassy-ザンビア"].map((id) => {
  const all = [
    ...data.day4.sameEndpoints.entries,
    ...data.day9.cameroonStay.entries,
  ];
  const sourceData = JSON.parse(fs.readFileSync(path.join(ROOT, "docs", "route-reoptimization-v0.2", "candidate-data.json"), "utf8"));
  const original = sourceData.candidates.B.days.flatMap((day) => day.entries).find((entry) => entry.id === id);
  return `| \`${id}\` | ${original.country} | ${original.currentDay} | 未取得 | ${original.address} |`;
}).join("\n");

const stayTransit = data.day10.cameroonStayDay9.transitHybridStructure;
const moveTransit = data.day10.cameroonMoveFromDay9.transitHybridStructure;
const stayCar = data.day10.cameroonStayDay9.carCandidate;
const moveCar = data.day10.cameroonMoveFromDay9.carCandidate;
const stayWalk = data.day10.cameroonStayDay9.walking;
const moveWalk = data.day10.cameroonMoveFromDay9.walking;

const transitSegments = (value) => value.segments
  .map((segment) => `${segment.from} → ${segment.to}（徒歩換算 ${segment.distanceKm}km / ${segment.durationMinutes}分）`)
  .join("、");

const content = `# Candidate B' Analysis

Current Status: **PM APPROVED / PRODUCTION IMPLEMENTED / PC VERIFIED / iPhone standalone確認待ち**

Analysis Status at creation: **ANALYSIS ONLY / PM REVIEW PENDING**

作成日: 2026-10-05

## 1. 分析範囲

Route Re-optimization v0.2のCandidate Bを基準に、次の条件だけを変更して比較した。

- ベナン大使館とザンビア大使館を通常Dayから外し、飛び地回収候補として別枠管理する。
- Day5〜Day8は大使館のDay構成とSTART / GOALを維持し、訪問順だけを再最適化する。
- カメルーン大使館は「Day9維持」と「西部広域回収Day10へ移動」を比較する。
- Day10は徒歩、公共交通併用、車利用候補の3方式で比較する。
- Afghanistanは場所未確定のため件数管理だけを行い、全ルート計算から除外する。
- 正式Master、Backup、本番Day、UI、storage、Migration、\`dataVersion: "1.1"\`は変更しない。

徒歩はOSM routed-foot、車はOSM routed-carによる推定で、訪問、休憩、信号待ち、混雑などは含まない。公共交通は時刻・待ち時間・乗換を推測せず、長い徒歩区間の置換候補だけを示す。

## 2. Executive Summary

- **Day4:** ベナン除外だけでは${Math.abs(d4Same.distance)}km・${Math.abs(d4Same.minutes)}分短縮。終点を後楽園駅から新富町駅へ変えると、Candidate B比で**${Math.abs(d4Practical.distance)}km・${Math.abs(d4Practical.minutes)}分短縮**できる。
- **Day9:** ザンビア除外で、カメルーン維持なら${Math.abs(d9Stay.distance)}km・${Math.abs(d9Stay.minutes)}分短縮。カメルーンも移動して得られる追加短縮は**${Math.abs(d9MoveVsStay.distance)}km・${Math.abs(d9MoveVsStay.minutes)}分だけ**。
- **Cameroon:** Day10へ移すとDay10徒歩は${d10MoveVsStay.distance}km・${d10MoveVsStay.minutes}分増え、Day9+Day10合計も${combinedDelta.distance}km・${combinedDelta.minutes}分増える。**Day9維持を推奨**する。
- **Day10:** 徒歩は長い3区間が負荷の中心。公共交通併用はこの3区間を置換候補とし、車は移動そのものは短時間だが、駐車・乗降・渋滞・駐停車可否を別途確認する必要がある。

## 3. Day4 短縮効果

| 案 | 件数 | START → GOAL | 推定徒歩 | Candidate B比 |
|---|---:|---|---:|---:|
| Candidate B | 15 | 赤羽橋駅 → 後楽園駅 | 13.85km / 185分 | 基準 |
| ベナン除外・駅維持 | 14 | 赤羽橋駅 → 後楽園駅 | 12.45km / 166分 | ${signed(d4Same.distance, "km")} / ${signed(d4Same.minutes, "分")}（${signed(d4Same.percent, "%")}） |
| **B'実用案** | 14 | 赤羽橋駅 → 新富町駅 | **7.61km / 102分** | **${signed(d4Practical.distance, "km")} / ${signed(d4Practical.minutes, "分")}（${signed(d4Practical.percent, "%")}）** |

Candidate Bの後楽園駅GOALは、中央区入船のベネズエラ大使館から5.47km離れていた。ベナンを通常ルートから外した後は後楽園駅へ向かう理由がなくなるため、最終地点に近い新富町駅をGOALとするのが自然である。

訪問順: ${routeText(data.day4.practicalShortest)}

| 順 | 正式ID | 国・地域 | Master Day | 状態 | 正式住所 |
|---:|---|---|---:|---|---|
${entryTable(data.day4.practicalShortest)}

## 4. Day5〜Day8 訪問順再最適化

Day構成、件数、START / GOALはCandidate Bのまま固定した。再計算結果はCandidate Bですでに採用した行列2-opt順と一致し、距離・時間の追加改善はなかった。

| Day | 件数 | START | GOAL | 推定徒歩 | Candidate B比 |
|---|---:|---|---|---:|---:|
${fixedRows}

${fixedDetails}

## 5. Day9: Cameroon比較

| 案 | 件数 | START → GOAL | 推定徒歩 | Candidate B比 | Day9維持案比 |
|---|---:|---|---:|---:|---:|
| Candidate B | 13 | 都立大学駅 → 北品川駅 | 13.09km / 175分 | 基準 | - |
| **ザンビア除外・Cameroon維持** | 12 | 都立大学駅 → 北品川駅 | **12.61km / 169分** | ${signed(d9Stay.distance, "km")} / ${signed(d9Stay.minutes, "分")} | 基準 |
| ザンビア除外・CameroonをDay10へ | 11 | 都立大学駅 → 北品川駅 | 12.47km / 167分 | ${signed(d9Move.distance, "km")} / ${signed(d9Move.minutes, "分")} | ${signed(d9MoveVsStay.distance, "km")} / ${signed(d9MoveVsStay.minutes, "分")} |

Cameroonはスーダンとモーリタニアの間に自然に入る。Day9から外しても追加短縮は0.14km・2分に留まる。

**Day9維持案の訪問順:** ${routeText(data.day9.cameroonStay)}

**Day10移動案のDay9訪問順:** ${routeText(data.day9.cameroonMoveToWest)}

## 6. Day10: 3方式比較

Afghanistanは場所未確定のため、下表の件数・距離・時間に含めない。

### 6.1 CameroonをDay9に維持（推奨）

| 方式 | 対象 | 距離・時間 | 評価 |
|---|---:|---:|---|
| 徒歩 | 9件 | ${stayWalk.distanceKm}km / ${stayWalk.durationMinutes}分 | 全区間徒歩。休憩・訪問時間を含まない |
| 公共交通併用 | 9件 | 残存徒歩 ${stayTransit.residualWalkingDistanceKm}km / ${stayTransit.residualWalkingMinutes}分 + 交通時間TBD | ${stayTransit.replaceableDistanceKm}km / ${stayTransit.replaceableWalkingMinutes}分相当を置換候補化 |
| 車利用候補 | 9件 | ${stayCar.distanceKm}km / ${stayCar.durationMinutes}分 | 走行推定のみ。駐車等を含まない |

公共交通置換候補: ${transitSegments(stayTransit)}

徒歩順: ${routeText(stayWalk)}

車順: ${routeText(stayCar)}

### 6.2 CameroonをDay10へ移動

| 方式 | 対象 | 距離・時間 | 維持案との差 |
|---|---:|---:|---:|
| 徒歩 | 10件 | ${moveWalk.distanceKm}km / ${moveWalk.durationMinutes}分 | ${signed(d10MoveVsStay.distance, "km")} / ${signed(d10MoveVsStay.minutes, "分")} |
| 公共交通併用 | 10件 | 残存徒歩 ${moveTransit.residualWalkingDistanceKm}km / ${moveTransit.residualWalkingMinutes}分 + 交通時間TBD | 残存徒歩 ${signed(Number((moveTransit.residualWalkingDistanceKm - stayTransit.residualWalkingDistanceKm).toFixed(2)), "km")} |
| 車利用候補 | 10件 | ${moveCar.distanceKm}km / ${moveCar.durationMinutes}分 | ${signed(Number((moveCar.distanceKm - stayCar.distanceKm).toFixed(2)), "km")} / ${signed(moveCar.durationMinutes - stayCar.durationMinutes, "分")} |

公共交通置換候補: ${transitSegments(moveTransit)}

徒歩順: ${routeText(moveWalk)}

車順: ${routeText(moveCar)}

### 6.3 Day9 + Day10合計

| Cameroon | 合計徒歩距離 | 合計徒歩時間 | 比較 |
|---|---:|---:|---:|
| **Day9維持** | **${combinedStay.distanceKm}km** | **${combinedStay.durationMinutes}分** | 推奨 |
| Day10移動 | ${combinedMove.distanceKm}km | ${combinedMove.durationMinutes}分 | ${signed(combinedDelta.distance, "km")} / ${signed(combinedDelta.minutes, "分")} |

## 7. 飛び地回収候補

| 正式ID | 国・地域 | Master Day | 状態 | 正式住所 |
|---|---|---:|---|---|
${recovery}

ベナンとザンビアは未取得のまま通常Dayから外すだけで、取得済み扱いにはしない。回収日、交通手段、他目的地との組合せは別途PM判断とする。

## 8. Afghanistan

- 正式ID: \`embassy-アフガニスタン\`
- 状態: 未取得
- Primary SourceのMap欄: \`要確認\`
- 扱い: 未取得総数には含めるが、住所・地点を推測せず、徒歩・公共交通・車の全計算から除外する。

## 9. 全件整合性

- 最新Backupの取得済み: 51件
- 未取得: 106件
- B'通常ルート内の座標確定済み対象: 103件
- 飛び地回収候補: 2件（ベナン、ザンビア）
- 場所未確定: 1件（Afghanistan）
- 合計: **106件**
- B'-1（Cameroon Day9維持）、B'-2（Cameroon Day10移動）の双方で重複0、欠落0、取得済み混入0を機械検証する。

## 10. PM Recommendation

1. Day4はベナンを飛び地回収候補へ分離し、赤羽橋駅 → 新富町駅の14件ルートを採用候補とする。
2. Day5〜Day8はCandidate BのDay構成・START / GOAL・訪問順を維持する。
3. Day9はザンビアを飛び地回収候補へ分離し、CameroonはDay9に維持する。
4. Day10は徒歩完遂を前提にせず、実施日のGoogle Mapsで3つの長区間を確認して公共交通併用を第一候補、車は駐車条件を確認できた場合の候補とする。
5. Afghanistan、ベナン、ザンビアの回収方法が決まるまで、本番Day割当・START / GOALは変更しない。

## 11. Production保護

この分析で\`js/data.js\`、\`js/day-meta.js\`、Backup、localStorage、Migration、UI、World Map、正式Master Day、\`dataVersion: "1.1"\`は変更していない。

## 12. PM決定とProduction反映

2026-10-06のPMレビューで、次を正式決定した。

- Day4は赤羽橋駅 → 新富町駅の14件案を採用した。
- Day5〜Day8はCandidate Bの構成、START / GOAL、訪問順を採用した。
- Day9はザンビアを外し、Cameroonを維持する12件案を採用した。
- Day10はCameroonを移動せず、公共交通併用Dayとした。
- ベナン・ザンビアは飛び地回収候補、Afghanistanは未確定別枠とした。

Productionでは正式Masterを変更せず、今後の攻略計画を\`js/route-plan.js\`へ分離した。\`js/day-meta.js\`はSTART / GOALとDay10方針だけを保持する。既存Backupの保存schemaは変更せず、\`dataVersion: "1.1"\`を維持した。

PC RegressionはPASS。iPhone standalone Acceptance待ちであり、まだ\`RELEASE / STABLE\`ではない。

## 13. PM追加判断: 飛び地表示と攻略コース順

- Homeにベナン・ザンビアの飛び地回収カードを追加し、既存取得状態から\`0 / 2\`〜\`2 / 2 完了\`を導出する。
- カードから既存の追加画面へ進み、住所、Google Maps、取得状態、当日追加を確認できる。
- Candidate B'のDay4〜Day10は実施日・実施順ではなく攻略コース番号とする。
- 任意順で選択でき、前Day完了条件、unlock、sequential progressionは追加しない。
- 実際の活動日はactual activityの日付、攻略コースは\`plannedDay\`で管理する。
- 保存schemaは変更せず、\`dataVersion: "1.1"\`を維持する。
`;

fs.writeFileSync(OUTPUT_PATH, content, "utf8");
console.log(`Wrote ${path.relative(ROOT, OUTPUT_PATH)}`);
