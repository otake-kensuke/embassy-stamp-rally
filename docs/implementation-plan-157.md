# Day1〜10・正式157件統合 実装計画

## 目的

v0.4で検証済みの正式Day1 13件から、Day1〜10の正式157件へ展開する。

この文書に記載していたPM判断事項は正式決定済み。v0.5では、この決定に従って実装する。

## 現在のプロジェクト状態

- GitHub Pages + iPhone Safariを正式公開方式とする
- HTML / CSS / Vanilla JavaScript構成を維持する
- 個人データは各端末の `localStorage` に保存する
- 正式Day1 13件はPC検証、iPhone実機検証ともにPASS
- 現在のアプリは `settings.activeDay = 1` を使ってDay画面を表示している

## PM決定事項

### Day1〜10切替

- ホーム画面からDay1〜10を選択する
- Day画面は現在のNEXT中心UIを維持する

### 再起動時

- 最後に見ていたDayを復元する

### `localStorage` dataVersion

- 今回は `"1.0"` を維持する
- 保存データ構造変更時にversion upを検討する

### Day1既存進捗

- 既存Day1 13件の進捗を引き継ぐ
- 既存IDは変更しない

### ID設計

- 既存Day1 IDを維持する
- 新規144件は安定した人間可読IDとする
- Day番号や巡回順変更でIDが変わらない設計にする

### バージョン表示

- UI上の `Prototype v0.1` 表記は廃止方向
- 開発Versionは `docs/work-log.md` で管理する
- アプリ画面に開発Versionを強調表示しない

### `prototype/` と `release/`

- 今回は削除しない
- ただし157件統合時の再生成は必須としない
- GitHub Pages本体を優先する
- 役割整理は157件統合後に再判断する

### Google Maps検証

- 全157件についてCodex側でURL/住所生成を機械チェックする
- iPhone実機では各Dayの代表地点を確認する
- 特に住所変更履歴のある以下5件は重点確認する
  - Côte d’Ivoire
  - Botswana
  - Mauritania
  - Haiti
  - Djibouti

## 実装計画

1. Primary SourceからDay1〜10の正式データを機械抽出する
2. 期待件数と照合する
3. Day、巡回順、国名、スポット名、住所、Map queryを検証する
4. 既存Day1 IDを維持し、新規144件に安定した人間可読IDを付与する
5. `EMBASSY_MASTER` を157件へ更新する
6. ホーム画面にDay1〜10選択を追加する
7. Day画面はNEXT中心UIを維持する
8. 最後に見ていたDayを復元する
9. `dataVersion: "1.0"` を維持し、既存Day1進捗を引き継ぐ
10. v0.5テスト計画を作成する
11. 自動検証とPC検証を行う
12. GitHub Pagesへ反映できる状態で停止する

## 期待件数

| Day | 件数 |
| --- | ---: |
| Day1 | 13 |
| Day2 | 14 |
| Day3 | 19 |
| Day4 | 18 |
| Day5 | 16 |
| Day6 | 16 |
| Day7 | 22 |
| Day8 | 21 |
| Day9 | 10 |
| Day10 | 8 |
| Total | 157 |

## 検証項目

- 総件数157件
- Day別件数
- Day値
- 巡回順
- 国名
- スポット名
- 住所
- ID重複なし
- 既存Day1 ID維持
- Google Maps URL生成
- 重点確認5件の抽出
- Day切替
- NEXT
- 次
- その次
- 取得済み後の自動NEXT
- 手動NEXT
- 今日のルート一覧
- `＋記録`
- 振り返り
- `localStorage`
- JSON Backup / Restore

## 実装後の次Action

ユーザーがGitHub Pagesへ反映し、iPhone Safariで各Dayの代表地点と重点確認5件を確認する。
