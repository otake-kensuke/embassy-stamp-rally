# Test Plan v0.1

## PCブラウザ確認

1. `index.html` を開ける
2. UIが崩れない
3. NEXTがスクロールせず確認できる
4. Google Mapsを開ける
5. 取得済みにできる
6. NEXTが自動更新される
7. HTMLを閉じて再度開いても状態が残る
8. ＋記録が保存できる
9. 振り返りに時系列表示される
10. JSONバックアップを書き出せる
11. JSONから復元できる
12. 不正JSONで既存データが壊れない

## iPhone実機重点確認

OneDriveまたはiCloud Driveから `prototype/embassy-rally-prototype.html` を直接開いた場合、ブラウザまたはファイルプレビューの扱いにより `localStorage` の保存先や永続性が変わる可能性がある。HTMLを閉じる、別アプリへ移動する、端末を再起動する、ファイルを更新する、同名ファイルに差し替える、という条件で保存状態が残るか確認する。

## 単一HTML確認

`prototype/embassy-rally-prototype.html` は外部CSS、外部JavaScript、CDNに依存しないことを確認する。`release/embassy-rally-v0.1.html` は同内容の配布確認用コピーとする。
