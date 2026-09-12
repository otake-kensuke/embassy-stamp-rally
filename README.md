# 大使館スタンプラリー Companion App Prototype v0.1

東京都内の駐日大使館デジタルスタンプラリーを巡るときに使う、個人用のCompanion App技術検証版です。公式スタンプラリーを置き換えるものではなく、次に行く大使館の確認、Google Maps起動、取得状態と街歩き記録の保存、JSONバックアップ/復元が単一HTMLで成立するかを確認します。

## 起動方法

PCでは `index.html` をブラウザで開きます。iPhone実機検証では `prototype/embassy-rally-prototype.html` をOneDriveまたはiCloud Driveに置き、ファイルアプリなどから開きます。

GitHub Pagesで確認する場合は、リポジトリのルートを公開元にし、`index.html` をエントリーポイントとして使います。公開後は `https://<GitHubユーザー名>.github.io/<リポジトリ名>/` から開きます。

## フォルダ構成

- `index.html`: 開発用の分割版エントリ
- `css/style.css`: 画面スタイル
- `js/app.js`: UIとNEXTロジック
- `js/data.js`: Prototype用Day1データ
- `js/storage.js`: localStorage保存、復元データ検証
- `js/backup.js`: JSONバックアップ書き出し/読み込み
- `data/embassy-master.json`: 将来拡張を想定した大使館マスター
- `docs/app-design-v0.1.md`: 設計メモ
- `docs/test-plan-v0.1.md`: 実機確認計画
- `docs/issues.md`: 制約と確認事項
- `prototype/embassy-rally-prototype.html`: 単一HTML版
- `release/embassy-rally-v0.1.html`: 配布確認用コピー
- `.nojekyll`: GitHub PagesでJekyll処理を行わず静的ファイルとして公開するためのファイル

## 保存方式

個人データはブラウザの `localStorage` に `embassyStampRally.appState` として保存します。保存データには `dataVersion: "1.0"` を含め、画面コードやマスターデータとユーザーデータを分離しています。

保存対象は大使館ごとの状態、取得日時、手動NEXT、街歩き記録、メモ、設定です。

## JSONバックアップ

設定画面から現在の保存状態をJSONファイルとして書き出せます。復元時はJSON形式と `dataVersion` を確認し、不正データの場合は既存の保存状態を上書きしません。

## iPhone実機テスト手順

1. `prototype/embassy-rally-prototype.html` をOneDriveまたはiCloud Driveに配置します。
2. iPhoneのファイルアプリからHTMLを開きます。
3. Day 1画面でNEXTがスクロールなしに読めることを確認します。
4. 地図ボタン、取得済み、記録、振り返り、バックアップ、復元を確認します。
5. HTMLを閉じて再度開き、状態が残るか確認します。

## 現時点の制約

Day1の仮データ5件のみです。住所の正確性検証、写真、GPS判定、クラウド同期、ログイン、公式API連携、自動ルート最適化は含めていません。OneDrive/iCloud Driveから直接開いた場合の `localStorage` 永続性は環境差があるため、実機で重点確認が必要です。
