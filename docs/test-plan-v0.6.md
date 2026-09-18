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
- v0.6.3でホーム画面が参考画像に近い構成になっていること: PASS
- v0.6.3で画面切替時に先頭位置から表示されること: PASS
- v0.6.4でDesign Targetに沿ったホーム、Day一覧、今日のルート、Day / NEXTの4画面構成: PASS
- iPhone相当390x844表示でタイトル、人物、地球、吹き出し、操作要素の重なりなし: PASS
- 320px幅で横スクロールなし、タイトル欠けなし: PASS
- 320px幅で長い大使館名が折り返され、NEXTと地図ボタンが確認可能: PASS
- 男性、女性、地球が背景透過PNGで読み込まれること: PASS
- 透明PNGの四隅alpha値が0であること: PASS
- Day1〜Day10のDay一覧表示と選択: PASS
- 今日のルートで各行のGoogle Mapsと手動NEXTを表示: PASS
- Day7 22件のルートを末尾までスクロール可能: PASS
- Day7ルートのスクロール途中・末尾に `＋記録` が残留しない: PASS
- Browser操作による手動NEXT: PASS
- Browser操作による `取得済み` -> NEXT自動更新: PASS
- Browser操作による `＋記録` 保存、Toast、振り返り表示: PASS
- Toast約2秒後非表示: PASS
- Browser再読み込み後のDay7復元: PASS
- Day10 Afghanistanの `地図要確認`、リンクなし: PASS
- ユーザー入力・復元値を `innerHTML` へ埋め込む箇所なし: PASS

## v0.6.1 Responsive & Visual Polish PC確認

Result: PASS

- 320 / 375 / 390 / 430px幅で横スクロールなし: PASS
- Hero高さ224〜242px、タイトル・人物・地球・吹き出しの重なりなし: PASS
- 東京の街並みAsset表示: PASS
- Homeの主要メニュー操作領域48px: PASS
- Day一覧で390x844表示時にDay1〜Day10を確認可能: PASS
- Day / NEXTで390x844表示時に主要操作が約482px以内: PASS
- 320px幅で長い大使館名が折り返され、主要操作が約494px以内: PASS
- NEXT名24〜30px、地図ボタン46px: PASS
- `取得済み` 全幅、`今日のルート` / `＋記録` 2列表示: PASS
- 今日のルートのGoogle Maps / 手動NEXT / 状態操作領域44px以上: PASS
- Day7 22件、Day8 21件のルート生成とスクロール可能な高さ: PASS
- Day7 / Day8で表示中のsticky/fixed要素なし、`＋記録` 残留なし: PASS
- 手動NEXT、取得済みからの自動NEXT、進捗更新: PASS
- 記録保存Toast、約2秒後非表示、振り返り表示: PASS
- 再読み込み後のDayとNEXT復元: PASS
- 正式157件、Day別件数、ID重複、巡回順、Google Maps、Afghanistan: PASS
- `dataVersion: "1.0"`、旧Day1進捗、JSON Backup / Restore互換: PASS

## iPhone Safari実機確認項目

GitHub Pages反映後、ユーザー側で確認する。

- ホーム画面で新タイトルとサブタイトルが見やすい
- 案内役キャラクターが表示される
- `assets/guide-man-clean.png`、`assets/guide-woman-clean.png`、`assets/hero-globe.png`、`assets/tokyo-skyline.png` がGitHubへアップロードされている
- ホーム画面が参考画像の印象に近づいている
- 人物が背景から独立しており、矩形の空・木・階段・看板が残っていない
- タイトル、キャラクター、吹き出しが重なっていない
- Heroが大きすぎず、主要メニューへ自然に到達できる
- Day一覧でDay1〜Day10と取得数を選択できる
- Day画面でNEXT大使館名とGoogle Mapsボタンが見やすい
- Day7 / Day8の `今日のルート` を末尾までスクロールしても `＋記録` が中途半端な位置に残らない
- NEXT / 次 / その次
- `取得済み` -> NEXT自動更新
- 手動NEXT
- Google Maps
- Afghanistan `地図要確認`
- `＋記録` / 振り返り
- Safari再起動後のDay復元
- JSON Backup / Restore
- 320〜430px相当で横スクロール、文字切れ、画像と文字の重なりがない
- Day / NEXTの主要情報と操作がスクロールなしで確認できる
- 今日のルートのGoogle Maps、手動NEXT、取得状態が片手で操作しやすい

## v0.6.2 Final Visual Polish PC確認

Result: PASS

- 320 / 375 / 390 / 430px幅で横スクロールなし: PASS
- ホームHeroの人物、地球、タイトル、吹き出し、4つの雲に文字切れ・不自然な重なりなし: PASS
- 男性が地球側、女性が地球側を向く構図: PASS
- タイトル左を飛行機モチーフのアプリロゴへ変更: PASS
- 地球をレスポンシブに拡大し、人物・吹き出しと分離: PASS
- ホーム下部の街並み、飛行機、雲、スタンプ風モチーフ、移動経路表示: PASS
- Day見出し `Day X 今日のルート`: PASS
- `NEXT` ラベル削除: PASS
- 未取得時 `スタンプを取得した`: PASS
- 取得後に薄緑の `✓ 取得済み` ステータス表示: PASS
- 取得済み保存とNEXT自動更新: PASS
- Day案内フッター120〜133px、主要操作との重なりなし: PASS
- Day7 22件、Day8 21件、sticky/fixed要素なし: PASS
- 手動NEXT: PASS
- 記録保存Toast、約2秒後非表示、振り返り表示: PASS
- 再読み込み後のDay復元: PASS
- 正式157件、Day別件数、ID重複なし、巡回順: PASS
- Google Maps URL、Afghanistan `地図要確認`: PASS
- `dataVersion: "1.0"`、保存・JSON Backup / Restore互換: PASS

### v0.6.2 iPhone Safari確認項目

- ホームで男性・地球・女性が内向きに見える
- 2つの吹き出しが話者と明確につながり、4つの雲と区別できる
- 地球が人物やタイトルと重ならず、十分な大きさで見える
- ホーム下部フッターが操作より目立たず、不要に広い空白が軽減されている
- Day画面で `Day X 今日のルート`、現在の大使館名、住所、地図、次、その次を確認できる
- 未取得時に `スタンプを取得した` と表示される
- タップ後、NEXTが自動更新され、直前の大使館が薄緑の `✓ 取得済み` ステータスで確認できる
- Day案内フッターが主要操作と重ならない
- 320〜430px相当で横スクロール、タイトル切れ、画像と文字の重なりがない
