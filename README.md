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
- `js/app.js`: UI、NEXTロジック、画面復元
- `js/data.js`: 現在のDay1〜10正式データ
- `js/storage.js`: `localStorage` 保存、復元データ検証
- `js/backup.js`: JSON Backup / Restore
- `docs/`: 設計、テスト計画、Issue、作業履歴
- `prototype/`: 単一HTML版
- `release/`: 配布確認用HTML
- `tools/extract-embassy-master.py`: Primary Sourceから `js/data.js` を生成する抽出スクリプト
- `.nojekyll`: GitHub PagesでJekyll処理を行わないためのファイル
- `AGENTS.md`: 今後のCodex実装担当向けプロジェクト指示書

## 保存方式

個人データは各iPhone Safariの `localStorage` に `embassyStampRally.appState` として保存します。夫婦間・端末間の同期は行いません。

保存データには `dataVersion: "1.0"` を含めます。保存対象は大使館ごとの状態、取得日時、手動NEXT、街歩き記録、メモ、設定です。

## Backup / Restore

設定画面から現在の保存状態をJSONファイルとして書き出せます。復元時はJSON形式と `dataVersion` を確認し、不正データの場合は既存の保存状態を上書きしません。

## 現在の開発段階

Prototypeの技術検証は完了しています。

- v0.1: GitHub Pages + iPhone Safari + `localStorage` 方式成立
- v0.2: `＋記録` 保存後Toast
- v0.3: Day画面復元
- v0.4: 正式Day1 13件データ統合、iPhone実機検証PASS
- v0.5: 正式Day1〜10 157件データ統合、PC検証PASS、iPhone実機検証PASS
- v0.6: Design Targetに沿った4画面UI、背景透過キャラクターAsset、`＋記録` スクロール位置Bug Fix、PC検証PASS、iPhone実機確認待ち

現在の状態は、v0.6 GitHub Pages反映・iPhone Safari実機確認待ちです。使用開始前チェックリストは `docs/pre-use-checklist.md` で管理します。

次のGateは、v0.6をGitHub Pagesへ反映した後のiPhone Safari実機確認です。v0.6確認PASS後、実際のスタンプラリーで使用した後の実地運用レビューへ進みます。

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
