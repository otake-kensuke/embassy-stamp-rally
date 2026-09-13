# App Design v0.5

## 目的

正式Day1〜10の157件を取り込み、GitHub Pages + iPhone Safari + `localStorage` の構成を維持したまま、全DayでNEXT中心UIが成立することを確認する。

## Primary Source

```text
embassy_stamp_rally_157攻略表_住所マスター確定版_20260906.xlsx
```

使用シート:

- `Day01 実行表`
- `Day02 実行表`
- `Day03 実行表`
- `Day04 実行表`
- `Day05 実行表`
- `Day06 実行表`
- `Day07 実行表`
- `Day08 実行表`
- `Day09 実行表`
- `Day10 実行表`

## 画面

### ホーム

- 全体進捗を157件ベースで表示する
- Day1〜10の選択ボタンを表示する
- 各Dayボタンには、そのDayの取得数と件数を表示する
- 振り返り、設定への入口を維持する

### Day

- 現在のNEXT中心UIを維持する
- `settings.activeDay` のDayを表示する
- NEXT、次、その次、取得済み、今日のルート一覧、手動NEXT、`＋記録` を維持する
- Google Maps queryがない地点は地図ボタンを無効表示にする

### 振り返り

- 現在選択中のDayの取得履歴と街歩き記録を表示する
- v0.4以前の旧形式ログにはDay情報がないため、互換性のため全Dayで表示する

### 設定

- `localStorage` 保存、メモ、JSON Backup / Restoreを維持する

## データ構造

- `EMBASSY_MASTER` を157件に拡張する
- `dataVersion: "1.0"` を維持する
- `settings.activeDay` に最後に見ていたDayを保存する
- `settings.lastScreen` に最後に見ていた画面を保存する
- 新規の街歩き記録には保存時点の `day` を付与する
- 既存Day1 13件のIDは変更しない
- 新規144件は国名ベースの安定した人間可読IDにする

## 既存データ互換

Day1既存IDを維持するため、v0.4までに保存したDay1 13件の取得状態はv0.5でも引き継がれる。

## 注意点

Primary Source上で、Day10のアフガニスタンはMap欄が `要確認` であり、通常のGoogle Maps URLではない。推測で補完せず、地図ボタンは無効表示にする。
