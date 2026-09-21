# Test Plan v0.7

## 対象

v0.7 Actual Day Activity、`dataVersion: "1.1"`、`1.0 → 1.1` Migration、当日追加、画面履歴、日付別記録、完了画面、動的案内コメントを対象とする。

## PC自動検証結果

実行:

```text
node tests/v07-storage-regression.js
```

結果: PASS

### Master

- 正式157件: PASS
- Day別件数 `13 / 14 / 19 / 18 / 16 / 16 / 22 / 21 / 10 / 8`: PASS
- ID重複なし、ID・順序・住所・mapQuery・master Day保護: PASS
- Afghanistan `地図要確認`: PASS

### Golden Migration

- `1.0 → 1.1`: PASS
- 取得済み14件と全ID維持: PASS
- 全 `acquiredAt` 維持: PASS
- Day1基本ルート13 / 13: PASS
- ノルウェー取得済み、正式Day4のまま: PASS
- ノルウェーをDay1 actual activityへ関連付け: PASS
- `addedAt: null`、`source: migration`: PASS
- 架空のroute-added eventなし: PASS
- walkLogs 4件、全timestamp維持: PASS
- `activeDay: 1`、`lastScreen: home` 維持: PASS
- 複数回Migrationしても重複なし: PASS
- invalid stateで元localStorageを上書きしない: PASS

匿名化fixtureは `tests/fixtures/v063-golden-state.json` を使用する。実機Backupそのものはテストデータとして保存しない。

### Activity / Route Add

- ローカル日付とplanned Dayでactivity作成: PASS
- 検索、追加、重複防止: PASS
- 正式master Day維持: PASS
- 未取得追加の削除: PASS
- 取得済み追加の削除禁止: PASS
- ユーザー追加時だけroute-added event生成: PASS
- 当日追加を手動NEXTに指定: PASS

### Walk Log

- 追加: PASS
- 編集時にcategory / text更新: PASS
- 編集後も作成timestamp維持: PASS
- `updatedAt` 追加: PASS
- 削除model: PASS
- 削除前confirmationはブラウザUI実装を確認: PASS

## PCブラウザ確認結果

- Golden fixture Restore後、全体14 / 157: PASS
- Day1基本13 / 13、当日追加1 / 1、今日の訪問14: PASS
- Day4でノルウェー取得済み反映: PASS
- Home → Route → Back = Home: PASS
- Day → Route → Back = Day: PASS
- Route → Home → Back = Route: PASS
- Forwardとdisabled state: PASS
- 未完了Dayのauto NEXT: PASS
- 基本ルート完了後の当日追加NEXT: PASS
- START / GOAL表示: PASS
- 今日のルートFull Embassy Card維持: PASS
- 日付別記録一覧 `スタンプ14 / 記録4`: PASS
- Timelineの取得、walkLog、route-added時刻順表示: PASS
- ノルウェーMigration annotation: PASS
- 記録編集後も表示時刻維持: PASS
- 320 / 375 / 390 / 430pxで横スクロールなし: PASS
- JavaScript console errorなし: PASS

削除confirmationの実クリックとiPhone固有表示は実機確認対象とする。

## Backup / Restore

- v1.1 stateの書き出し対象に全状態を含む: PASS
- v1.1 prepare / save round trip: PASS
- v1.0 Backup RestoreでGolden Migrationを通る: PASS
- 不正Backupで現在データを置き換えない: PASS

## iPhone Safari / standalone確認項目

GitHub Pages反映後に、実機Backupを保持した状態で確認する。

1. 更新前にv0.6.3のJSON Backupをもう一度書き出す
2. v0.7初回表示後、全体14 / 157、Day1基本13 / 13を確認する
3. ノルウェーが当日追加1 / 1、本来Day4、取得済みで表示されることを確認する
4. 既存walkLogs 4件と内容・時刻が残ることを確認する
5. Back / Forward / Homeの3シーケンスを確認する
6. Safari再読み込み・再起動後に安全なHomeまたはDayへ戻ることを確認する
7. standaloneでもヘッダー、first viewport、Guide Footerに不自然な空白・重なりがないことを確認する
8. 未完了DayでNEXT、次、その次、地図、取得、auto NEXTを確認する
9. 当日追加を検索・追加・手動NEXT指定・取得する
10. 未取得追加は外せ、取得済み追加は外せないことを確認する
11. 記録を追加・編集・削除し、削除確認が出ることを確認する
12. 日付別一覧とTimelineの時刻順を確認する
13. v1.1 Backupを書き出し、復元できることを確認する
14. 保存済みv0.6.3 Backupをv0.7へ復元できることを確認する
15. Day7 / Day8長距離スクロールで `＋記録` が途中に残らないことを確認する

実機確認が完了するまでは、Safari / standalone項目をPASSと記録しない。

## v0.7.1 Hotfix PC確認

- Migration回帰、正式157件、Day別件数、ID、Afghanistan: PASS
- `dataVersion: "1.1"`、Golden 14 / 157、全`acquiredAt`、walkLogs 4件: PASS
- Home Back / Forwardは320 / 375 / 390 / 430pxで44x44px: PASS
- Homeボタン非表示、矢印間gap 10〜12px、Hero titleとの重なりなし: PASS
- Day action buttonsとGuide Footerの間隔16〜20px: PASS
- 吹き出し・人物・skylineはFooter内のnormal flowに収まる: PASS
- Day完了summaryは3列compact card、320pxでも横overflowなし: PASS
- Day2 アメリカ取得後のauto NEXTがバーレーン: PASS
- `Home → Route → Day2/バーレーン → Day2/アメリカ`のBack履歴: PASS
- 過去のアメリカ表示でも進捗1 / 14、取得済み表示のままでrollbackなし: PASS
- ForwardでDay2/バーレーンを再表示: PASS
- manual NEXTで南スーダンを指定: PASS
- ブラウザconsole errorなし: PASS

### v0.7.1 iPhone standalone確認待ち

- Home Navigationのtouch target、gap、title非干渉
- Day完了summaryの情報密度
- action buttonsとGuide Footerの重なり解消
- Back / ForwardによるDay表示対象の復元と永続データ非rollback

## v0.7.2 Hotfix 2 PC確認

- Home Navigationは320 / 375 / 390 / 430pxでHeroの直上にnormal flow配置: PASS
- Back / Forwardは44x44px、gap 10〜12px、横overflowなし: PASS
- 履歴なしではNavigation row非表示かつHero開始位置維持: PASS
- action buttonsとGuide Footerの間隔16〜20px: PASS
- Guide人物の足元はskylineへ10〜11px重なり、Footer外へ侵入しない: PASS
- Day2で南スーダンをmanual NEXT指定後、Dayへ遷移して同大使館を表示: PASS
- Toast `南スーダン大使館をNEXTに設定しました`: PASS
- 再読込とHome経由の同Day再選択後もmanual NEXT保持: PASS
- 南スーダン取得後、manual NEXT解除・auto NEXTでアメリカへ更新: PASS
- Backで南スーダンの過去表示を再現しつつ進捗1 / 14と取得済みを維持: PASS
- Forwardで最新auto NEXTのアメリカを再表示: PASS
- 匿名化Goldenを再復元し、14 / 157、Day1 13 / 13、Day4 1 / 18を確認: PASS

### v0.7.2 iPhone standalone確認待ち

- 履歴ありHomeでNavigation rowがHero内のタイトル、吹き出し、装飾と重ならない
- Guide人物の足元がskyline / groundへ接地し、Footer全体が過度に高くない
- Day2で南スーダンをmanual NEXT指定するとToast後にDayへ戻り、南スーダンを表示する
- 再読込、Home経由、Back / Forward後もmanual NEXTと現在の永続データが正しく扱われる
