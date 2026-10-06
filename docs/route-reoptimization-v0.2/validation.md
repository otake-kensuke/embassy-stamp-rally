# Route Re-optimization v0.2 Validation
**Status: ANALYSIS ONLY / PM REVIEW PENDING**

## 機械検証対象

- 最新Backup `embassy-rally-backup-2026-10-03 2.json`は`dataVersion: "1.1"`、取得済み51件、未取得106件。
- Candidate A / B / Cそれぞれで未取得106件をDay4〜Day10へ一度ずつ割り当てる。
- Afghanistanは所在地未確定としてDay10別枠に一度だけ保持し、徒歩計算から除外する。
- 正式ID、国名、大使館名、住所、現行Master Dayを`js/data.js`と比較する。
- 取得済み51件の混入、重複、欠落、Day1〜Day3への再配置がないことを確認する。
- OSM徒歩route再検証21件が成功していることを確認する。

## 結果

- OSM連続徒歩route: 21ルート / **PASS**
- A: 106件、重複0、欠落0、取得済み混入0
- B: 106件、重複0、欠落0、取得済み混入0
- C: 106件、重複0、欠落0、取得済み混入0
- 最終結果: **PASS**

実行コマンド: `node tests/route-reoptimization-v0.2-validation.js`
