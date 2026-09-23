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

v0.5:

- 正式Day1〜10 157件データを統合
- PC検証PASS
- iPhone Safari実機検証PASS
- Day10 アフガニスタンはPrimary Source上のMap欄が `要確認` のため、アプリでは `地図要確認` として無効表示する

v0.6:

- UI/UX改善として、Design Targetに沿ったホーム、Day一覧、今日のルート、Day / NEXTの4画面を実装
- アプリ名称、配色、背景透過の案内役キャラクター表示を更新
- `＋記録` ボタンのスクロール中の不自然な残留を修正
- 正式157件データ、Day1〜10構成、NEXT中心UI、`localStorage` 構造、`dataVersion: "1.0"` は変更しない
- iPhone Safari実機レビューを実施し、情報密度とAsset活用に改善余地があることを確認

v0.6.1 Responsive & Visual Polish:

- v0.6の機能、正式157件データ、保存構造を維持したままiPhone向け情報密度を調整
- Heroを短縮し、地球、スタンプ風モチーフ、東京の街並みを追加
- Day一覧、Day / NEXT、今日のルートを狭い画面向けに再調整
- NEXT画面は主要情報と操作を1画面内で確認しやすい構成へ変更
- `＋記録` は通常のコンテンツフローを維持
- PC検証PASS
- iPhone Safari実機レビューを実施し、ホーム下部の空白、案内役の向きと吹き出し、地球サイズ、Day画面の取得状態表現に改善余地があることを確認

v0.6.2 Final Visual Polish:

- ホームHeroのコンパクトさを維持したまま、男性・地球・女性を内向きに配置
- 吹き出し、4つの雲、アプリロゴ、地球サイズ、下部の街並みフッターを調整
- Day画面の名称を統一し、`NEXT` ラベルを廃止
- 未取得時の操作を `スタンプを取得した`、取得後の確認を薄緑の `✓ 取得済み` ステータスとして分離
- Day画面下部に男性・吹き出し・女性・街並みの案内フッターを追加
- 正式157件、保存構造、NEXTロジック、Day一覧、今日のルートは変更しない
- PC検証PASS
- iPhone Safari実機レビューを実施し、人物の高さ、地球と街並みの間隔、Visual Footerの位置、取得時のLayout Shiftに最終調整が必要と判断

v0.6.3 Final Layout Tuning:

- ホームとDay画面の人物サイズを調整し、男性を女性より見た目で約7.5%高く統一
- ホームの地球を上へ20px移動し、街並みとの見た目上の空きを確保
- ホームVisual Footerの街並みを20px下げ、飛行機、雲、スタンプ、移動経路と分離
- Day案内フッターを通常フローのまま画面下部まで展開し、飛行機、雲、スタンプ、移動経路、街並みを追加
- `スタンプを取得した` 実行後の通常フロー内ステータスを廃止し、Toast `スタンプを取得しました` へ変更
- 取得前後で主要操作と案内フッターの位置差0pxをPC計測
- 正式157件、保存構造、NEXTロジック、Day一覧、今日のルートは変更しない
- PC検証PASS
- iPhone Safari実機確認後、Day1で実運用を開始

v0.7 Actual Day Activity:

- `dataVersion`を`"1.1"`へ更新し、`1.0` Backupを安全にMigrationする
- 計画Day、取得状態、ローカル日付ごとの当日実績を分離する
- Day1実績として、本来Day4のノルウェー大使館を`addedAt: null / source: migration`で関連付ける
- START / GOAL、Back / Forward / Home、当日大使館追加、日付別記録一覧、記録編集・削除を追加する
- 基本ルート完了と当日追加を分けて表示し、Day1を14 / 13とは表示しない
- 正式157件、ID、master Day、順序、住所、Google Maps情報は変更しない
- PC検証PASS
- Migration GateはiPhone standalone実機でPASS

v0.7.1 iPhone Hotfix:

- HomeのBack / Forwardを独立した44px touch targetとして通常フローへ配置
- Dayの操作ボタン、案内吹き出し、人物、街並みを独立Footer内の通常フローへ分離
- Day完了summaryを3列のcompact cardへ統合
- Navigation entryへDay表示モードと表示対象大使館IDを追加
- Back / Forwardで過去のNEXT表示を再現するが、取得状態、記録、当日実績は巻き戻さない
- `dataVersion: "1.1"`、Migration、正式157件、activity modelは変更しない
- PC検証PASS
- iPhone standaloneでMigration、Day1完了compact layout、action buttonsとGuide Footerの非重複を確認済み

v0.7.2 iPhone Hotfix 2:

- HomeのBack / ForwardをHeroより上の独立Navigation rowへ移動
- Guide Footer内で人物の足元をskyline / groundへ接地
- manual NEXTを保存後に最新Day snapshotへ遷移し、大使館名入りToastを表示
- 過去snapshotは表示履歴だけに使用し、現在のmanual NEXTや永続データを上書きしない
- `dataVersion: "1.1"`、Migration、正式157件、activity modelは変更しない
- PC検証PASS
- iPhone standalone実機検証PASS
- Final Status: RELEASE / STABLE

v0.7.3 Day2実利用フィードバック反映:

- Homeメニューから正式157件を国名または大使館名で部分一致検索できる画面を追加
- 検索結果に正式Dayと現在の取得状態を表示し、該当DayのRouteカードへスクロール・一時強調する
- 検索画面と検索結果RouteをBack / Forward / Homeの表示履歴へ含める
- 検索では`manualNextId`を変更せず、既存の`ここをNEXTにする`操作だけがmanual NEXTを変更する
- 今日のルート上部に`Day Xへ戻る`を追加し、過去snapshotではなく最新のmanual NEXT、auto NEXT、取得状態、当日追加状態からDay画面を表示する
- Guide Footerの基本構造とnormal flowを維持したまま、男女の人物を6px下げて街並みへの接地を強める
- `dataVersion: "1.1"`、Migration、正式157件、activity model、取得状態、記録、Backup / Restoreは変更しない
- PC Regression PASS
- iPhone standalone Acceptance PASS
- Final Status: RELEASE / STABLE

現在の状態:

- v0.6.3はiPhone Safari実機確認後、Day1で実運用済み
- 実運用データはDay1基本13 / 13、ノルウェー取得済み、全体14 / 157
- v0.7 Migration GateはiPhone standalone実機でPASS
- v0.7.1実機確認でMigration、Day完了compact layout、Footer非重複はPASS
- v0.7.2 Hotfix 2は実装・PC検証・iPhone standalone実機検証完了
- v0.7.2 RELEASE / STABLEの履歴を維持する
- v0.7.3 Day2実利用フィードバック反映は実装・PC検証・iPhone standalone実機検証完了
- 現在の正式安定版はv0.7.3 RELEASE / STABLE
- 使用開始前チェックリストは `docs/pre-use-checklist.md` で管理する

Next Gate:

- v0.7.3 RELEASE / STABLEとして実地利用を継続する
- Guide Comment / 吹き出しの人物との縦間隔、文字サイズ、日本語改行を次VersionのVisual Polish候補とする
- Afghanistanの地図情報確定、`prototype/` / `release/`の役割整理は継続Issueとする

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
