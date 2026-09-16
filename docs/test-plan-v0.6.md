# Test Plan v0.6

## 対象

v0.6 UI/UX改善と `＋記録` スクロール位置Bug Fixの回帰確認。

## PC自動・半自動確認

Result: PASS

- JavaScript構文確認: PASS
- 正式157件件数確認: PASS
- Day別件数確認: PASS
  - Day1: 13
  - Day2: 14
  - Day3: 19
  - Day4: 18
  - Day5: 16
  - Day6: 16
  - Day7: 22
  - Day8: 21
  - Day9: 10
  - Day10: 8
- ID重複なし: PASS
- Day内巡回順の連番確認: PASS
- Google Maps URL形式確認: PASS
- Afghanistan `地図要確認`: PASS
- `dataVersion: "1.0"` 維持: PASS
- JSON Backup / Restore相当の検証: PASS
- NEXT / 次 / その次表示: PASS
- `取得済み` -> NEXT自動更新: PASS
- 手動NEXT: PASS
- `＋記録` 保存Toast: PASS
- Toast約2秒後非表示: PASS
- 振り返り表示: PASS
- 再読み込み後のDay復元: PASS
- `＋記録` ボタンが `position: sticky` ではないこと: PASS
- ルート展開後スクロール時に `＋記録` が中途半端に追従しないこと: PASS
- v0.6.1で案内役キャラクター画像が通常の画像要素として読み込まれること: PASS

## iPhone Safari実機確認項目

GitHub Pages反映後、ユーザー側で確認する。

- ホーム画面で新タイトルとサブタイトルが見やすい
- 案内役キャラクターが表示される
- `assets/guide-man.png` と `assets/guide-woman.png` がGitHubへアップロードされている
- Day画面でNEXT大使館名とGoogle Mapsボタンが見やすい
- `今日のルートを見る` を開いてスクロールしても `＋記録` が中途半端な位置に残らない
- NEXT / 次 / その次
- `取得済み` -> NEXT自動更新
- 手動NEXT
- Google Maps
- Afghanistan `地図要確認`
- `＋記録` / 振り返り
- Safari再起動後のDay復元
- JSON Backup / Restore
