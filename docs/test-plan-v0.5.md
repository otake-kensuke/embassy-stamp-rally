# Test Plan v0.5

## 目的

正式Day1〜10の157件統合後、Day切替、NEXT、保存、復元、Google Maps生成が成立することを確認する。

## 自動検証

1. Primary Sourceから157件を機械抽出できる
2. Day別件数が期待値と一致する
3. 総件数が157件になる
4. Day、巡回順、国名、スポット名、住所が欠けていない
5. ID重複がない
6. 既存Day1 IDが維持されている
7. Google Maps queryが生成できる
8. 重点確認5件を抽出できる

## PC確認

1. `index.html` をローカルHTTP配信で開ける
2. ホーム進捗が `0 / 157` になる
3. ホームにDay1〜10の選択ボタンが表示される
4. Day1を開くとNEXTがペルー大使館になる
5. Day2を開くとNEXTがアメリカ合衆国大使館になる
6. Day8を開くとルート一覧が21件になる
7. Day10を開くとルート一覧が8件になる
8. `取得済み` 後にNEXTが自動更新される
9. ルート一覧から手動NEXTを変更できる
10. Google Mapsリンクが通常のHTTPS URLになる
11. Map queryがない地点は地図ボタンが無効表示になる
12. `＋記録` を保存するとトーストが表示され、振り返りに表示される
13. 再読み込みまたは開き直し後も最後に見ていたDayと状態が残る
14. JSON Backup / Restoreが動作する

## 自動検証結果

Status: PASS WITH SOURCE ISSUE

- Primary Sourceから157件を機械抽出
- Day別件数は期待値と一致
- 総件数157件
- ID重複なし
- 既存Day1 ID維持
- `localStorage` `dataVersion: "1.0"` 維持
- 既存Day1進捗互換性を確認
- Google Maps queryは156件で生成可能
- Day10 アフガニスタンのみPrimary Source上のMap欄が `要確認`

## PC確認結果

Status: PASS WITH SOURCE ISSUE

- ホーム進捗 `0 / 157` を確認
- ホームにDay1〜10選択が表示されることを確認
- Day1でNEXTがペルー大使館になることを確認
- Day2でNEXTがアメリカ合衆国大使館になることを確認
- Day8でルート一覧21件を確認
- Day10でルート一覧8件を確認
- `取得済み` 後の自動NEXTを確認
- ルート一覧から手動NEXTを確認
- 通常地点のGoogle Maps HTTPS URLを確認
- Day10 アフガニスタンは `地図要確認` の無効表示になることを確認
- `＋記録` 保存後のToastと振り返り表示を確認
- 新規の街歩き記録に現在Dayが付与されることを確認
- 同じURLを開き直して最後のDayと状態が残ることを確認
- JSON Backup / Restore相当の保存JSON構造、`dataVersion` 検証、157件正規化を確認

## iPhone実機確認

1. GitHub Pages URLで157件版が表示される
2. ホームからDay1〜10を選択できる
3. 各DayでNEXT / 次 / その次が表示される
4. 取得済み後に自動NEXTされる
5. 手動NEXTが動作する
6. 各Dayの代表地点でGoogle Mapsが開く
7. 重点確認5件のGoogle Maps起動と住所表示を確認する
8. 今日のルート一覧が表示される
9. `＋記録` と振り返りが動作する
10. Safariを閉じて再度開いても最後のDayと状態が残る
11. JSON Backup / Restoreが動作する

## iPhone実機確認結果

Status: PASS

- Day1〜10表示／切替: PASS
- 各DayのNEXT／次／その次: PASS
- Safari再起動後のDay復元: PASS
- 取得済み後の自動NEXT: PASS
- 手動NEXT: PASS
- 各Day代表地点のGoogle Maps: PASS
- 住所変更5件のGoogle Maps: PASS
- アフガニスタン `地図要確認`: PASS
- `＋記録`／振り返り: PASS
- JSON Backup / Restore: PASS

## 重点確認5件

- Côte d’Ivoire / コートジボワール
- Botswana / ボツワナ
- Mauritania / モーリタニア
- Haiti / ハイチ
- Djibouti / ジブチ
