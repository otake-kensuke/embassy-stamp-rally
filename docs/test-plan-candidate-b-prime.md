# Candidate B' Production Test Plan

Status: **PC VERIFIED / iPhone Acceptance PAUSED after Step ⑦**

## PC自動検証

実行:

```text
node tests/candidate-b-prime-production-regression.js
node tests/candidate-b-prime-validation.js
node tests/route-reoptimization-v0.2-validation.js
node tests/route-reoptimization-v0.1-validation.js
node tests/v07-storage-regression.js
node tests/v08-world-map-regression.js
```

確認結果:

- 正式Master 157件、ID重複0、Master署名一致: PASS
- Candidate B'攻略計画149件、重複0: PASS
- ベナン、ザンビア、Afghanistanの通常ルート除外: PASS
- Day1〜Day3の正式順維持: PASS
- Day4〜Day10の承認済み順序・件数・START / GOAL: PASS
- Day9 Cameroonあり、Day10 Cameroonなし: PASS
- Day10公共交通併用表示、具体交通情報の非固定: PASS
- 最新Backupの取得済み51件と全`acquiredAt`: PASS
- walkLogs 13件、actualDayActivities 2件、manual NEXT、settings: PASS
- NorwayのDay1当日追加・正式Day4: PASS
- 2026-10-03の4記録がすべてDay3: PASS
- ベナン・ザンビアの検索対象、Google Maps、当日追加model: PASS
- 飛び地回収進捗`0 / 2 → 1 / 2 → 2 / 2 → 1 / 2`の状態導出: PASS
- 飛び地専用の永続状態なし、Backup / Restore後の再導出: PASS
- Day4〜Day10に前Day完了条件・unlockなし: PASS
- World Map 157 mappingと取得状態導出: PASS
- Backup / Restore、Migration、`dataVersion: "1.1"`: PASS
- Day一覧の攻略コース件数`13 / 14 / 19 / 14 / 17 / 17 / 17 / 17 / 12 / 9`、合計149件: PASS
- Day1当日追加1件、Day2当日追加4件、コース外の当日追加取得済み5件: PASS
- 攻略コース149 + コース外8 = Master 157の内訳表示: PASS
- Day4〜9の確定距離・推定徒歩表示、Day10公共交通併用の主表示: PASS
- 検索結果で旧Master Day表示なし、攻略コース / actual activity / 飛び地 / 要確認の優先表示: PASS

## PCブラウザ検証

- 最新Backup Restore後に51 / 157、32%: PASS
- Day1〜Day3が13 / 13、14 / 14、19 / 19: PASS
- Day4が0 / 14、赤羽橋駅 → 新富町駅、NEXTキューバ: PASS
- Day4 Route 14件、ベナンなし、正式順: PASS
- Day4 manual NEXTとToast: PASS
- Candidate B'通常対象の検索で現在の攻略コースDayだけを表示し、対象カードへ移動: PASS
- Day9が0 / 12、ザンビアなし、Cameroonあり、北品川GOAL: PASS
- Day10が0 / 9、Cameroonなし、公共交通併用案内: PASS
- ベナン・ザンビアを`飛び地回収`として検索: PASS
- ベナン選択後、当日追加画面へ移動し追加操作が有効: PASS
- Homeメニュー末尾、`バックアップ / 復元`直下の飛び地回収行が`0 / 2`とベナン・ザンビアを表示: PASS
- コンパクト行から既存の追加画面へ進み、2件の住所、Google Maps、当日追加へ到達: PASS
- Day6 → Day4 → Day8の順不同選択で各NEXT / Routeを表示: PASS
- Afghanistanを`地図要確認`として検索: PASS
- 2026-10-03の日別記録とTimelineがDay3のみ: PASS
- World Mapが最新Backupから51 / 157を再構成: PASS
- Browser console warning / errorなし: PASS
- 320 / 375 / 390 / 430pxのHome、Day一覧、Day、Route、検索で横overflowなし: PASS
- 320 / 375 / 390 / 430pxでHome Hero / Footerの街並みが画像本来の3:1比率で全体表示され、建物上端のクリップなし: PASS
- 320 / 375 / 390 / 430pxで追加後のDayカード、157件内訳、検索結果に横overflow・内部overflowなし: PASS
- Norway / Sweden / Benin / Zambia / Afghanistan / Cubaの実表示: PASS

## iPhone standalone確認項目

進捗: **①〜⑦ PASS保持。Step ⑦後に発見した表示整合Issueの再確認までPAUSED。**

1. 更新前に最新のJSON Backupを保存する。**PASS**
2. 更新後もHomeが51 / 157で、Day1〜Day3が13 / 13、14 / 14、19 / 19である。**PASS**
3. Day4が14件、START赤羽橋駅、GOAL新富町駅、NEXTキューバである。**PASS**
4. Day4の今日のルートにベナンがなく、最後がベネズエラである。**PASS**
5. Day5〜Day8の件数が17 / 17 / 17 / 17で、NEXT、手動NEXT、Google Mapsが動作する。**PASS**
6. Day9が12件、ザンビアなし、Cameroonあり、GOAL北品川駅である。**PASS**
7. Day10が9件、Cameroonなし、`公共交通併用Day`案内が表示される。**PASS**

### Issue修正後に先行して再確認

- Day一覧でDay1 13 / 13 + 当日追加1件、Day2 14 / 14 + 当日追加4件、Day3 19 / 19を確認する。
- Day4〜9の推定距離・徒歩時間、移動のみの注意書き、Day10の公共交通併用主表示を確認する。
- 一覧下部で攻略コース149、当日追加取得済み5、飛び地2、要確認1、全157件の関係を確認する。
- Norway / Swedenが当日追加Day1 / Day2、Benin / Zambiaが飛び地回収、Afghanistanが要確認、Candidate B'通常対象が攻略コースDayで表示され、旧Master Dayが出ないことを確認する。
- 横overflow、文字重なり、タップ領域不足がないことを確認する。
8. Homeの`バックアップ / 復元`直下にコンパクトな飛び地回収行があり、ベナン・ザンビアと現在値`0 / 2`を表示する。全体取得状況直下に大きな回収カードが残っていない。
9. 飛び地回収行全体をタップすると既存の追加画面が開き、ベナン・ザンビア2件の取得状態、正式住所、Google Maps、当日追加を確認できる。
10. テスト可能な状態で取得・取得取消を行い、行の進捗が`0 / 2 → 1 / 2 → 2 / 2 完了 ✓ → 1 / 2`と変わる。Restore後も既存取得状態から再構成される。
11. Home検索でもベナンとザンビアが`飛び地回収・取得状態`と表示され、旧Master Dayが表示されない。
12. Day6 → Day4 → Day8の順に選択でき、各コースのNEXT、manual NEXT、Routeが正常である。前Day未完了による制限がない。
13. 異なる日付でDay6、Day4を実施しても、actual activityの日付と`plannedDay`、Review / Timeline、Walk Logの所属が混同されない。
14. 攻略コース内の大使館で現在の攻略コースDayが表示され、検索結果からRouteへ正しく遷移する。
15. Afghanistanが通常ルート外かつ`地図要確認`のままである。
16. Back / Forward / Home、再起動後復元、Backup / Restore、World Map、日別記録に退行がない。
17. iPhone縦画面で飛び地回収行とNEXTが見やすく、横スクロールや文字・ボタンの重なりがない。Home Hero / Footerの街並みで建物上端が不自然に切れていない。

iPhone確認完了前は`RELEASE / STABLE`へ昇格しない。
