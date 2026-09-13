# AGENTS.md

## プロジェクトの目的

このアプリは、東京都内の駐日大使館デジタルスタンプラリーを巡るための個人用Companion Appです。公式スタンプラリーを置き換えるものではありません。

主な役割:

- Day1〜10の巡回支援
- NEXT大使館の表示
- Google Maps連携
- 取得状態の手動管理
- 街歩き記録
- 時系列の振り返り
- JSON Backup / Restore

## 現在のアーキテクチャ

採用済みの構成:

- GitHub Pages
- iPhone Safari
- HTML
- CSS
- Vanilla JavaScript
- `localStorage`
- JSON Backup / Restore

使用しないもの:

- Supabase
- Firebase
- Vercel
- React
- Next.js
- 外部データベース
- ログイン
- クラウド同期

個人データ:

- 各iPhoneの `localStorage` に保存する
- 夫婦間、端末間の同期は行わない

写真:

- iPhoneの写真アプリで管理する
- このWebアプリ内には保存しない

## 過去の判断

当初は、単一HTMLファイルをOneDriveまたはiCloud Driveから直接開く方式も検討した。

iPhone実機テスト結果:

- HTML表示: 可能
- Google Maps外部リンク: FAIL
- `localStorage`: FAIL
- `＋記録` 保存: FAIL
- Script error発生

判断:

OneDrive/iCloud DriveからHTMLを直接実行する方式は廃止する。

プロジェクトはGitHub Pages + iPhone Safari方式へ移行し、実機テストで成立を確認済み。この方式へ戻さない。

## UX原則

最重要原則:

「当日利用時はNEXT中心の1画面構成。詳細情報・全ルート・記録履歴は必要時に展開する。」

補足原則:

- iPhone縦持ちを前提にする
- 屋外利用を前提にする
- 片手操作を前提にする
- NEXTはスクロールなしで見えることを重視する
- 主要操作は1〜2タップで完了できるようにする
- 情報を詰め込むために文字を小さくしない
- 入力はできるだけ任意にする
- 記録は後から編集できる設計を目指す

## Primary Source

正式157件データのPrimary Sourceは次のファイルです。

```text
embassy_stamp_rally_157攻略表_住所マスター確定版_20260906.xlsx
```

正式データを取り込む場合は、このマスターを唯一の正とする。

国名、住所、Day割当、巡回順を推測で変更しない。Primary Sourceと実装データが矛盾する場合は、黙って修正せず、Issueとして記録しPM判断を求める。

## 現在の開発段階

Prototypeの技術検証は完了しています。

v0.1:

- GitHub Pages + iPhone Safari + `localStorage` 方式を検証済み

v0.2:

- `＋記録` 保存後のToastを追加

v0.3:

- Day画面復元を追加

v0.4:

- 正式Day1 13件データを統合
- PC検証PASS
- iPhone Safari実機検証PASS

Next Gate:

- v0.5としてDay1〜10・正式157件統合を実施する
- 実装後、PC検証まで行い、GitHub Pagesへ反映できる状態で停止する
- iPhone実機確認はユーザー側で行う

## v0.5 PM決定事項

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

## Codexが判断してよいこと

既存仕様を守る範囲で、Codexは次の作業を自律的に進めてよい。

- 軽微なバグ修正
- コード整理
- 軽微なUI改善
- レスポンシブ調整
- テスト
- ドキュメント更新
- データ変換
- 通常のGitHub Pages更新
- 既存仕様に沿った実装

## PM承認が必要なこと

次の変更はPM承認なしに行わない。

- アプリの基本目的
- 基本画面構成
- NEXT中心UI原則
- `localStorage` 保存方式
- 外部サービス追加
- クラウドデータベース導入
- 認証
- 夫婦間、端末間同期
- 写真管理方針
- 公式スタンプサイト連携方針
- Day1〜10ルート構造
- 大きな新機能
- Primary Sourceデータの変更
- GitHub Pages以外へのホスティング変更

必要な場合は、Issueとして整理してPM判断を求める。

## 作業開始時の手順

新しいCodexセッションの開始時は、少なくとも次を確認する。

1. `AGENTS.md`
2. `README.md`
3. `docs/app-design-v0.1.md`
4. `docs/issues.md`
5. `docs/work-log.md`
6. 必要に応じて関連するテスト計画

実装とドキュメントが矛盾する場合は、どちらが正しいかを独断で決めない。質問するか、Issueとして記録する。

## 作業終了時の手順

作業終了時は、原則として次を行う。

1. 必要なテスト
2. ドキュメント更新
3. `docs/work-log.md` 更新
4. `docs/issues.md` 確認、更新
5. Gitが利用可能な場合はgit diff/status確認

完了報告には次を含める。

- 実施内容
- 変更ファイル
- テスト結果
- 未解決Issue
- 次Action
- PM判断が必要な事項
