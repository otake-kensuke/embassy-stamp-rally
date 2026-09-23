# App Design v0.7

## 目的

Day1実運用で発生した「計画Day以外の大使館にも立ち寄る」という行動を、正式157件マスターを変更せずに記録できるようにする。v0.6.3のNEXT中心UI、Google Maps、取得状態、街歩き記録、GitHub Pages運用は維持する。

最優先事項は、既存の実利用データを失わずに `dataVersion: "1.0"` から `"1.1"` へ移行することである。

## 保存構造 1.1

既存の `embassies`、`manualNextId`、`walkLogs`、`memo`、`settings` に、ローカル日付単位の `actualDayActivities` とMigration記録を追加する。

```text
AppState
  dataVersion: "1.1"
  embassies
  manualNextId
  actualDayActivities[]
    id
    localDate
    plannedDay
    addedEmbassies[]
      embassyId
      masterDay
      addedAt
      source
    routeEvents[]
  walkLogs[]
  memo
  migrations
  settings
```

`plannedDay` はその日に実行した計画Day、`masterDay` は追加した大使館の正式Dayを表す。同じ計画Dayを別日に実行した場合は別activityとして扱う。日付は端末のローカル日付を用いる。

## Migration

保存データとBackup Restoreは同じ処理を通す。

1. JSONを解析する
2. versionを判定する
3. `1.0` の場合は `1.1` へMigrationする
4. 正規化後の状態を検証する
5. 検証成功時のみ保存状態を置き換える
6. 失敗時は元データを変更しない

Day1基本13件とノルウェー大使館が取得済みのGolden Caseでは、ノルウェーをDay1 actual activityへ `addedAt: null`、`source: "migration"` として関連付ける。正式DayはDay4のまま、既存の `acquiredAt` を保持し、架空のroute-added eventは作らない。Migrationは何度実行しても重複を作らない。

## START / GOAL

START / GOALは `js/day-meta.js` で管理し、157件マスターや進捗には含めない。

| Day | START | GOAL |
| --- | --- | --- |
| 1 | 恵比寿駅 | 麻布十番駅 |
| 2 | 溜池山王駅 | 表参道駅 |
| 3 | 九段下駅 | 神楽坂駅 |
| 4 | 大門駅 | 品川駅 |
| 5 | 代々木駅 | 原宿駅 |
| 6 | 広尾駅 | 麻布十番駅 |
| 7 | 虎ノ門駅 | 六本木駅 |
| 8 | 品川駅 | 中目黒駅 |
| 9 | 都立大学駅 | 後楽園駅 |
| 10 | 下北沢駅 | 田園調布駅 |

## Navigation

- Back: 実際の画面履歴を1つ戻る
- Forward: Backした履歴を1つ進む
- Home: Homeへ移動し、その遷移も履歴へ含める

履歴はセッション中だけ保持し、`localStorage` へ保存しない。再起動時は従来どおり安全なHomeまたはDayを復元する。Homeでは通常Navigationを隠し、履歴がある場合だけ必要なBack / Forwardを控えめに表示する。

## Day / NEXT

未完了Dayではv0.6.3の情報優先順位を維持する。START / GOALはコンパクトに表示し、NEXT、大使館名、住所、Google Maps、次、その次、取得操作をfirst viewportから押し出さない。

基本ルート完了時は通常NEXTカードを出さず、以下を分けて表示する。

- 基本ルート取得数
- 当日追加の取得数
- 今日の訪問数
- 未取得の当日追加NEXT

Day1を `14 / 13` とは表示しない。

## 当日追加

今日のルートは基本ルートのFull Embassy Cardを維持し、その後に当日追加セクションを表示する。157件マスターを国名または大使館名で検索する。

- 正式DayとIDは変更しない
- 同じactivityへの重複追加は禁止する
- 未取得の当日追加だけルートから外せる
- 取得済みの当日追加は実績として削除できない
- ユーザーの新規追加時だけroute-added eventを作る
- 当日追加も手動NEXTに指定できる

## 記録

Homeの記録導線は日付別一覧へ進む。一覧には、その日のstamp acquisition数とuser-created walkLogs数を表示する。詳細Timelineは取得、walkLog、route-added eventを実時刻順で統合する。

Migrationで関連付けたノルウェーはroute-added eventを持たないが、取得イベントに `当日追加・本来 Day4` と表示する。

user-created walkLogsはcategoryとtextを編集できる。編集時も作成timestampを保持し、`updatedAt` のみ追加する。削除には確認を入れる。取得イベントとroute-added eventは編集・削除できない。

## Guide Footer

案内コメントは `js/guide-comments.js` の少数templateから状態に応じて生成する。優先順位は、Day完了、当日追加、残り少数、通常NEXT、Day開始。男性と女性は独立した吹き出しを持つ。

Footerはnormal flowに置き、standalone表示でも巨大な余白を作らない。人物比率はv0.6.3を維持し、男性を女性より見た目で約5〜10%大きくする。

## 変更しないもの

- `js/data.js` の正式157件
- Day別件数、ID、順序、住所、mapQuery、master Day
- Afghanistanの `地図要確認`
- GitHub Pages、iPhone Safari、Vanilla JavaScript、`localStorage`
- 写真管理、クラウド同期、ログインを導入しない方針

## v0.7.1 iPhone Hotfix

Migration Gateの実機PASS後に、UIとNavigationだけを調整する。

- HomeのBack / Forwardは44pxの独立touch targetとし、disabledでも位置と寸法を変えない
- HomeではHome buttonを表示しない
- Day Footerはaction buttonsの後から始まる独立sectionとし、吹き出し、人物、skylineをnormal flowへ置く
- Day完了summaryは基本ルート、当日追加、今日の訪問を1つの3列cardへまとめる
- Navigation entryは`screen`、`day`、`recordDate`に加え、Day表示用の`dayMode`と`nextEmbassyId`を持つ
- 過去のNEXTが既に取得済みの場合は、現在の取得状態のまま`取得済み（履歴表示）`として表示する
- Back / Forwardは表示状態だけを復元し、`embassies`、`walkLogs`、`actualDayActivities`等をrollbackしない

## v0.7.2 iPhone Hotfix 2

- Homeの履歴がある場合だけ、Back / ForwardをHeroより上の独立Navigation rowとしてnormal flowに表示する
- 履歴がない場合はNavigation rowを表示せず、Heroの開始位置を変えない
- Guide Footerは前sectionへ侵入させず、Footer内部で人物の足元とskyline / groundを重ねて接地させる
- manual NEXTは`manualNextId`を保存してから、その大使館を持つ最新のNEXT表示Day snapshotを履歴へ追加しDay画面へ遷移する。基本ルート完了後の未取得当日追加も同じ扱いとする
- Navigation snapshotの`nextEmbassyId`は過去表示の再現専用とし、現在の`manualNextId`を変更しない
- 同じDayをHomeから選び直した場合はmanual NEXTを維持し、別Dayへ切り替えた場合だけ解除する

## v0.7.2 Release Status

- PC検証とiPhone standalone実機検証を完了した
- Migration、既存データ、Navigation、manual NEXT、完了画面、Guide Footer、記録、当日追加、Backupを含む設計が実機で成立した
- v0.7.2をRELEASE / STABLEとする
- `dataVersion: "1.1"`を維持する

## v0.7.3 Day2実利用フィードバック反映

### Home検索

- Homeメニューから正式157件を国名または大使館名で日本語部分一致検索する
- 検索語は前後空白を除去する
- 結果には大使館名、正式Day、現在の取得状態を表示する
- 選択時は正式Dayの今日のルートへ移動し、対象カードへスクロール、フォーカス、一時強調する
- 検索画面は検索語を、検索結果Routeは対象大使館IDをNavigation snapshotに保持する
- 検索は`manualNextId`、取得状態、当日実績を変更しない

### RouteからDayへの移動

- 今日のルート上部のSTART付近に`Day Xへ戻る`を置く
- Backとは別の直接遷移とし、新しいNavigation entryとして追加する
- Day表示は現在保存されている`manualNextId`を最優先し、なければ既存auto NEXTを使う
- 過去snapshotの`nextEmbassyId`を再利用せず、取得状態と当日追加を含む最新状態から再計算する
- 基本ルート完了時は完了画面へ戻し、未取得の当日追加がmanual NEXTならNEXT画面へ戻す

### Guide Footer

- v0.7.2のnormal flow、操作領域との分離、吹き出し、人物比率、Footer高さを維持する
- 男女の人物だけを6px下げ、skyline / groundとの接地を強める
- Footer外の前sectionへ侵入させず、viewport bottomへstretchしない
