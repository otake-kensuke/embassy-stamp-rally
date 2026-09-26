# App Design v0.8

## Status

PC検証とiPhone standalone Acceptance全12項目を完了した。

`v0.8 RELEASE / STABLE`

## 目的

既存の取得状態から「スタンプを集めると、世界が色づいていく」体験を提供する。World Mapは進捗を変更する機能ではなく、v0.7.3の`embassy.status`を読み取って描画するVIEWである。

## 画面構成

- Homeに`世界を旅した記録`を追加し、現在の`取得済み / 157 国・地域`を表示する。
- World Map画面はHeader / Navigation、地域タブ、Summary、Map、Legend、取得済み国・地域一覧で構成する。
- 地域タブは`世界 / 欧州 / アジア / アフリカ / 北米・中南米 / オセアニア`とし、狭い画面では44px以上の横スクロール可能な操作領域にする。
- Summaryは選択中の地域だけを主表示し、世界値との重複表示は行わない。
- 取得済み一覧は地域色のaccentを持つchipとし、0件では簡潔なempty stateを表示する。

## データ構成

- 正式157件マスターは`js/data.js`のまま変更しない。
- World Map補助データは`data/world-map/embassy-country-mapping-v0.8.json`で管理する。
- 157件はすべて一意の国・地域へ対応し、Europe 41、Asia 44、Africa 40、Americas 23、Oceania 9とする。
- 145件はNatural Earth 110m polygon、110m geometryを持たない12件は検証済み10m `LABEL_X / LABEL_Y`のmarkerで表現する。
- 取得判定は常に`state.embassies[embassyId].status === "acquired"`から導出する。World Map専用の取得状態は作らない。

## 描画

- D3 v7.9.0を使用し、Natural Earth Vector v5.1.2の110m countries GeoJSONをSVGへ描画する。
- World Map画面を初めて開いた時だけD3と地図・mappingデータを読み込み、同一ページ内ではPromiseを再利用する。
- 世界表示では取得済み対象を地域別カラー、未取得対象を`#E6EEE9`で表示する。
- 地域表示では対象地域を拡大し、取得済み対象だけを地域色で表示する。
- markerは世界表示で4px、地域表示で7pxを基本とし、白縁と濃色outlineを併用する。
- 色だけに依存せず、数値、Legend、取得済み一覧、SVGの説明とmarker labelでも状態を伝える。

## 地域カラー

| Region | Color | Count |
| --- | --- | ---: |
| Europe | `#347FD1` | 41 |
| Asia | `#DF7B2D` | 44 |
| Africa | `#C99618` | 40 |
| Americas | `#D85D70` | 23 |
| Oceania | `#7C63C7` | 9 |

未取得は`#E6EEE9`とする。

## Navigation

- World Map画面を既存のBack / Forward / Homeへ統合する。
- Navigation snapshotへ`mapRegion`を含め、`World Map → 欧州 → Home → Back`では欧州表示を復元する。
- 地域タブ切替だけでは履歴entryを増やさず、現在のWorld Map snapshotを更新する。
- 履歴は表示状態だけを扱い、`manualNextId`、取得状態、記録、当日実績を変更しない。

## 保存とBackup

- `dataVersion`は`"1.1"`を維持する。
- World Map専用状態を`localStorage`やBackupへ追加しない。
- Restore後は、復元された`embassy.status`とmappingから地図を自動再構成する。
- v1.0からv1.1へのMigrationとv1.1 round tripを変更しない。

## Source / License

- Natural Earth Vector v5.1.2, 1:110m countries: Public Domain。
- D3 v7.9.0: ISC License。
- 詳細は`data/world-map/NATURAL-EARTH-LICENSE.md`、`vendor/D3-LICENSE.txt`、`data/world-map/README.md`に残す。

## Scope外

Guide Comment / 吹き出しVisual Polish、国・地域詳細、取得日、Timeline連携、MapからEmbassyへの移動、GPS、pinch zoom、animation、外部同期はv0.8では実装しない。
