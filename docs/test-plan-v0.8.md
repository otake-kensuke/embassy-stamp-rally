# Test Plan v0.8

## Status

`IMPLEMENTED / PC VERIFIED`

`iPhone standalone Acceptance Pending`

## 自動検証

実行:

```text
node tests/v07-storage-regression.js
node tests/v08-world-map-regression.js
```

結果: PASS

### v0.7.3 Regression

- 正式157件、Day別件数、ID、順序、住所、mapQuery、Afghanistan: PASS
- `dataVersion: "1.1"`: PASS
- v1.0からv1.1 Migration、14 / 157、全`acquiredAt`、walkLogs 4件: PASS
- Day1基本13 / 13、Norway当日追加・正式Day4: PASS
- activity model、manual NEXT、auto NEXT、当日追加: PASS
- Backup / Restore、v1.1 round trip、不正Backup保護: PASS

### World Map Data

- 正式masterとmapping: 157 / 157 PASS
- embassy ID / country code重複なし: PASS
- masterの大使館名、Day、順序、住所との一致: PASS
- 地域件数 Europe 41 / Asia 44 / Africa 40 / Americas 23 / Oceania 9: PASS
- polygon 145 / marker 12 / TBD 0: PASS
- polygonのNatural Earth geometry対応: PASS
- marker 12件の代表座標: PASS
- Golden fixture 14件とNorway反映: PASS
- World Map専用`localStorage`なし: PASS

## PCブラウザ確認

- Home入口と動的`14 / 157 国・地域`: PASS
- 新規状態0 / 157と各地域empty state: PASS
- Golden状態14 / 157: PASS
- 地域別取得数 Europe 8 / Asia 5 / Africa 0 / Americas 1 / Oceania 0: PASS
- 世界、欧州、アジア、アフリカ、北米・中南米、オセアニア切替: PASS
- 145 polygonと12 marker描画: PASS
- 全markerが世界・該当地域のSVG表示範囲内: PASS
- 157 / 157時に145 polygonと12 markerがすべて取得済み表示: PASS
- 157件chip表示時に横overflowなし: PASS
- `World Map → 地域 → Home → Back`で地域復元: PASS
- Back / Forward / Home: PASS
- 320 / 375 / 390 / 430pxで横overflowなし: PASS
- 地域tabのtouch target 44px以上: PASS
- Map、Legend、marker、chip、Navigation、text wrapping: PASS
- JavaScript console errorなし: PASS

## iPhone standalone Acceptance Pending

GitHub Pages反映後に次を確認する。

1. Homeの`世界を旅した記録`入口と現在の取得数
2. 世界表示と地域別カラー
3. 6つの地域切替と横スクロールtab
4. polygonと12件markerの視認性
5. 選択地域のSummaryと取得済み一覧
6. 0件地域の地図とempty state
7. Back / Forward / Homeと地域表示の復元
8. スタンプ取得後に対象国・地域が着色されること
9. 取得取消後に未取得表示へ戻ること
10. Backup Restore後に同じ地図が再構成されること
11. World Map初回表示と再表示の体感速度
12. 320〜430px相当で横overflow、文字切れ、操作しにくい箇所がないこと

## Release Gate

iPhone standalone Acceptance完了まではv0.8をRELEASE / STABLEにしない。

