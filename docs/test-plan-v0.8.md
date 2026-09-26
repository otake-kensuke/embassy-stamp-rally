# Test Plan v0.8

## Status

`RELEASE / STABLE`

PC Regression: PASS

iPhone standalone Acceptance: 全12項目PASS

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

## iPhone standalone Acceptance結果

GitHub PagesをiPhone standaloneで確認し、全項目PASSした。

1. Home入口: PASS
2. 世界地図初回描画: PASS
3. 地域切替: PASS
4. 地域カラー: PASS
5. 小国・島国marker: PASS
6. オセアニア0 / 9 empty state: PASS
7. 取得済み国・地域一覧: PASS
8. Back / Forward / Home: PASS
9. 取得からWorld Mapへの反映: PASS
10. 取得取消からWorld Mapへの反映: PASS
11. standalone再起動後の再構成: PASS
12. iPhone UI / overflow / text wrapping: PASS

## Release Gate

iPhone standalone Acceptance全12項目PASSにより、v0.8を`RELEASE / STABLE`としてCloseした。
