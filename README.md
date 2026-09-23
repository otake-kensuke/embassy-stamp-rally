# 大使館スタンプラリー Companion App

東京都内の駐日大使館デジタルスタンプラリーを巡るための個人用Companion Appです。公式スタンプラリーを置き換えるものではなく、次に行く大使館の確認、Google Maps起動、取得状態管理、街歩き記録、振り返り、JSON Backup / Restoreを支援します。

## 現在の公開方式

正式採用方式は以下です。

```text
GitHub Pages
↓
iPhone Safari
↓
HTML / CSS / Vanilla JavaScript
↓
localStorage
```

GitHub Pagesでは、リポジトリのルートにある `index.html` を公開エントリーポイントとして使います。公開URLはGitHub Pages設定で管理します。

## 基本構成

- `index.html`: GitHub Pages公開用エントリ
- `css/style.css`: 画面スタイル
- `assets/`: 背景透過キャラクター、地球、東京の街並みAsset
- `js/app.js`: UI、NEXTロジック、画面復元
- `js/data.js`: 現在のDay1〜10正式データ
- `js/day-meta.js`: Day1〜10のSTART / GOAL
- `js/activity-model.js`: 計画ルートと当日実績の分離
- `js/log-model.js`: 街歩き記録の編集・削除
- `js/guide-comments.js`: 案内役の動的コメント
- `js/storage.js`: `localStorage` 保存、Migration、復元データ検証
- `js/backup.js`: JSON Backup / Restore
- `tests/fixtures/v063-golden-state.json`: 個人メモを含まない匿名化Migration fixture
- `tests/v07-storage-regression.js`: v0.7のMigration・保存・Master回帰テスト
- `docs/`: 設計、テスト計画、Issue、作業履歴
- `prototype/`: 単一HTML版
- `release/`: 配布確認用HTML
- `tools/extract-embassy-master.py`: Primary Sourceから `js/data.js` を生成する抽出スクリプト
- `.nojekyll`: GitHub PagesでJekyll処理を行わないためのファイル
- `AGENTS.md`: 今後のCodex実装担当向けプロジェクト指示書

## 保存方式

個人データは各iPhone Safariの `localStorage` に `embassyStampRally.appState` として保存します。夫婦間・端末間の同期は行いません。

保存データには `dataVersion: "1.1"` を含めます。保存対象は大使館ごとの状態、取得日時、手動NEXT、日付別の当日実績、当日追加大使館、ルート追加イベント、街歩き記録、メモ、設定です。

## Backup / Restore

設定画面から現在の保存状態をJSONファイルとして書き出せます。v0.6.3の`dataVersion: "1.0"` Backupは、検証後に`1.1`へMigrationして復元できます。不正データの場合は既存の保存状態を上書きしません。

実機から書き出した `embassy-rally-backup-*.json` は個人データを含むためGitHubへアップロードしません。テストには匿名化fixtureだけを使用します。

## 現在の開発段階

Prototypeの技術検証は完了しています。

- v0.1: GitHub Pages + iPhone Safari + `localStorage` 方式成立
- v0.2: `＋記録` 保存後Toast
- v0.3: Day画面復元
- v0.4: 正式Day1 13件データ統合、iPhone実機検証PASS
- v0.5: 正式Day1〜10 157件データ統合、PC検証PASS、iPhone実機検証PASS
- v0.6: Design Targetに沿った4画面UI、背景透過キャラクターAsset、`＋記録` スクロール位置Bug Fix
- v0.6.1 Responsive & Visual Polish: Hero短縮、Asset活用、Day一覧・NEXT・ルートのiPhone向け情報密度調整、iPhone実機レビュー完了
- v0.6.2 Final Visual Polish: ホームの人物・地球・吹き出し・雲・下部フッター、Day画面の文言・取得状態・案内フッターを調整。iPhoneレビュー結果をv0.6.3へ引き継ぎ
- v0.6.3 Final Layout Tuning: 人物の見た目上の高さ、地球と街並みの間隔、ホーム・DayのVisual Footerを調整し、取得時のLayout ShiftをToast方式で解消。PC・iPhone検証後、Day1で実運用
- v0.7: 実利用Day1を受け、計画ルートと当日実績を分離、START / GOAL、画面履歴、当日追加、日付別記録、記録編集・削除、完了画面、動的案内コメントを追加。`1.0 → 1.1` MigrationとPC検証PASS
- v0.7.1 iPhone Hotfix: Home履歴ボタン、Day案内Footer、完了summaryを調整し、Dayの表示対象を含むBack / Forward履歴へ拡張。Migration・保存構造・正式157件は変更なし
- v0.7.2 Hotfix 2: Home NavigationをHero外へ分離し、Guide人物の足元を街並みに接地。manual NEXTを保存後に最新Day snapshotへ遷移する方式へ修正。PC・iPhone standalone実機検証PASS
- v0.7.3 Day2実利用フィードバック反映: Homeからの157件検索、検索結果から該当Routeへの移動、Routeから最新状態のDayへ戻る導線、Guide人物位置の微調整を追加。PC検証PASS、iPhone standalone実機確認待ち

v0.6.3はiPhone実機確認後、Day1で実運用されました。Day1基本ルート13件と本来Day4のノルウェー大使館を取得し、実運用データは14 / 157です。

v0.7.2はMigration、既存14 / 157、Day1基本13 / 13、ノルウェー当日追加、Navigation、manual NEXT、完了画面、Guide Footer、記録、当日追加、Backupを含むPC・iPhone standalone実機検証をすべて完了しました。

**Final Status: v0.7.2 RELEASE / STABLE**

v0.7.3はv0.7.2を安定版ベースとするadditiveな小規模改修として実装・PC検証を完了しています。`dataVersion: "1.1"`、Migration、正式157件、取得状態、記録、当日実績、Backup / Restoreは変更していません。現在はGitHub Pages反映後のiPhone standalone実機確認待ちです。

継続Issueはv0.7.3実機確認、Afghanistanの地図情報確定、`prototype/` / `release/`の役割整理です。

## 開発時の確認

PCではローカルHTTP配信で `index.html` を確認します。依存パッケージやnpmビルドは不要です。

例:

```text
node -e "const http=require('http'),fs=require('fs'),path=require('path');const root=process.cwd();const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8'};http.createServer((req,res)=>{const url=new URL(req.url,'http://localhost');let p=decodeURIComponent(url.pathname);if(p==='/' )p='/index.html';const file=path.join(root,p);fs.readFile(file,(err,data)=>{if(err){res.writeHead(404);return res.end('not found')}res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream'});res.end(data)})}).listen(8000,'127.0.0.1',()=>console.log('http://127.0.0.1:8000/'))"
```

## Docs

- `AGENTS.md`: Codex実装担当向けの基本方針
- `docs/work-log.md`: 重要な変更履歴
- `docs/issues.md`: Open/Closed Issue
- `docs/app-design-v*.md`: バージョン別設計
- `docs/test-plan-v*.md`: バージョン別テスト計画
- `docs/release-notes-v*.md`: 検証結果

## 現時点の制約

- 現在の実装データは正式Day1〜10 157件
- Day10のアフガニスタンはPrimary Source上でMap欄が `要確認` のため、アプリでは `地図要確認` として無効表示します
- 写真、GPS判定、クラウド同期、ログイン、公式API連携、自動ルート最適化は未実装
- 写真はiPhone写真アプリで管理し、Webアプリ内には保存しません
