# Route Re-optimization v0.2
**Analysis history: retained**

**Candidate B' current status: PM APPROVED / PRODUCTION IMPLEMENTED / PC VERIFIED / iPhone standalone確認待ち**

## 成果物

- `candidate-a-efficiency.md`: v0.1比+4.0%で効率維持を優先する案
- `candidate-b-balanced.md`: 徒歩・件数・総距離のバランス案（推奨）
- `candidate-c-daily-comfort.md`: 19件を許容し、参考実利用負荷を平準化する案
- `comparison.md`: v0.1 / A / B / C比較とPM Recommendation
- `candidate-b-prime-analysis.md`: ベナン・ザンビア別枠、Cameroon比較、Day10交通手段比較
- `candidate-b-prime-data.json`: Candidate B'の徒歩・車ルート計算結果
- `validation.md`: 機械検証範囲と結果
- `candidate-data.json`: 3案の正式ID、順序、OSM徒歩route結果
- `walking-matrix.json`: 探索用OSM徒歩距離・時間行列

## 方法

- v0.1の105座標化済み未取得地点を使用した。Afghanistanは別枠。
- OSM routed-footの距離・時間行列で、1件移動、2〜4件近接cluster移動、交換を探索した。
- 各最終ルートは行列2-opt順とOSM trip順を連続routeで比較し、短い順序を採用した。
- Composite Loadは`徒歩時間 + 訪問件数×仮定時間`とし、3分・5分の両方を表示する。
- 係数は候補探索・比較用であり、数学的な大域最適解を保証しない。

## Candidate B'追加分析

- Day4はベナンを飛び地回収候補へ分離し、GOALを新富町駅へ変更する案を比較した。
- Day5〜Day8はCandidate BのDay構成とSTART / GOALを固定して訪問順を再計算した。
- Day9はザンビアを飛び地回収候補へ分離し、CameroonのDay9維持 / Day10移動を比較した。
- Day10は徒歩、公共交通併用、車利用候補を分けた。公共交通の所要時間は推測していない。
- Afghanistanは未確定のまま、全ルート計算から除外した。

## 本番保護

分析フェーズでは`js/data.js`、Day割当、訪問順、START / GOAL、Backup、localStorage、UI、World Map、Migration、`dataVersion: "1.1"`を変更していない。PM承認後のProduction反映では、正式Masterを維持し、`js/route-plan.js`へ今後の攻略計画を分離した。

## Production追加判断

- Homeにベナン・ザンビアの飛び地回収カードを追加し、既存取得状態から進捗を導出する。
- 飛び地専用の保存状態や専用画面は追加しない。既存の検索・Google Maps・当日追加を使う。
- Candidate B'のDay4〜Day10は実施順ではなく攻略コース番号であり、前Day完了条件やunlockは持たない。
- 活動日と攻略コースは、`actualDayActivities.localDate`と`plannedDay`で分離する。
