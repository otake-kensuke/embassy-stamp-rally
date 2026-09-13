# App Design v0.3

## 目的

街歩き中にSafariを閉じて再度開いたとき、最後に使っていたDay画面へ戻れるようにする。v0.2までのGitHub Pages + iPhone Safari + `localStorage` 方針を維持し、画面復元だけを小さく追加する。

## 維持する方針

- HTML/CSS/Vanilla JavaScriptの構成を維持する
- npm、フレームワーク、外部DB、ログインは追加しない
- `localStorage`による端末内保存を維持する
- GitHub Pages公開を前提にする
- Day1の仮データ5件のままとする
- `dataVersion: "1.0"` のままとする

## v0.3で対応すること

- Day画面を開いたら `settings.lastScreen = "day"` を保存する
- ホームに戻ったら `settings.lastScreen = "home"` を保存する
- 起動時に `settings.lastScreen === "day"` の場合だけDay画面から開始する
- 壊れた値、不明な値、`review`、`settings` は復元せずホーム画面から開始する

## v0.3で対応しないこと

- 振り返り画面や設定画面の自動復元
- 複数Day対応
- データ構造のバージョンアップ
- 157件の本データ投入

## 理由

実地利用中に戻りたい可能性が高いのはDay画面。振り返りや設定に復帰すると意図しない画面から始まる印象があるため、v0.3ではDay画面だけを復元対象にする。
