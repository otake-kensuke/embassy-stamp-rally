# Candidate C Test Plan

Status: **PC Regression PASS / GitHub Pages公開・iPhone Migration・Acceptance待ち**

## PC自動検証

```text
node --check js/route-plan.js
node --check js/day-meta.js
node --check js/candidate-c-migration.js
node --check js/storage.js
node --check js/app.js
node tests/candidate-c-regression.js
node tests/v07-storage-regression.js
node tests/v08-world-map-regression.js
node tests/route-reoptimization-v0.1-validation.js
node tests/route-reoptimization-v0.2-validation.js
```

確認項目:

- Master 157件、ID重複0、Master署名不変
- Day1〜3のID・順序不変
- Day4が取得時刻順23件
- Day5〜10が17 / 23 / 9 / 18 / 10 / 6、合計83件
- Day5〜10の重複0、欠落0、取得済み混入0
- ベナンDay10、ザンビアDay8、Afghanistan Day4
- Day6高負荷表示
- Day10の徒歩 / 鉄道 / 徒歩3区間
- Turkmenistan補正住所と未確認注記、Master住所不変
- `dataVersion: "1.1"`

## 移行検証

匿名fixtureで次を検証する。

- acquired 74件を維持
- 2026-10-09 Day6 activityをDay4へ移動
- 当日追加16件とevent 16件を保持
- Walk Log 4件はDayだけ`6 → 4`
- Chile誤追加とeventを監査情報へ保持して表示対象から除外
- 2回目の実行は`already-applied`で完全同一
- fingerprint不一致は`blocked`となり保存しない

ローカルに個人Backupが存在する場合だけ、同じテストで2件を独立に追加監査する。個人Backupはテストfixtureとしてcommitしない。

## PCブラウザ検証

- 新規状態が0 / 157である
- 320 / 375 / 390 / 430pxで横overflowがない
- 旧飛び地回収カードがHomeに表示されない
- Day一覧が10コース、攻略コース152 + 過去当日追加5 = 157と表示される
- Day4が`2026年10月9日実績・距離未計測`
- Day6が`23件・高負荷コース`
- Day10が公共交通併用、徒歩約11.7km、鉄道時間を含まないと表示される
- Day10 Routeで3本の区間別Google Mapsを表示する
- 確認済みBackup移行後に74 / 157、Day4 23 / 23
- 新Day4の当日追加16件が基本23件と重複表示されない
- 移行完了noticeを表示する

## iPhone standalone Acceptance

公開承認後、端末ごとに実施する。

1. 公開前に最新Backupを新規作成し、ファイルを別場所へ保管する。
2. 更新前表示が各人の確認済みBackupと一致することを確認する。
3. GitHub Pages更新後、Homeが74 / 157、Day4が23 / 23である。
4. 2026-10-09のReview / TimelineがDay4だけを表示する。
5. 10月9日の4 Walk Logの本文・時刻が保持される。
6. 正しい当日追加16件と履歴16件が保持され、Day4 Routeへ重複表示されない。
7. 対象端末ではChileが二重計上されず、取得状態と取得日時が保持される。
8. Day5〜10の件数、START / GOAL、NEXT / 次 / その次を確認する。
9. Day6の高負荷表示を確認する。
10. Day10で徒歩 / 鉄道 / 徒歩のGoogle Maps導線を確認する。
11. Turkmenistanの補正住所と未確認注記を確認する。
12. Afghanistanが取得済みかつ`地図要確認`を維持する。
13. 検索、取得取消・再取得、World Map、Backup / Restoreを確認する。
14. 新しいBackupを書き出し、`candidateC20261009` migration markerを確認する。

## 停止条件

- 更新直前Backupが確認済み状態と一致しない
- Homeの移行noticeが競合停止を示す
- 74 / 157、Day4 23 / 23、Walk Log、activityのいずれかが一致しない
- 片方の端末の結果をもう片方へ流用しない

停止時は操作を続けず、更新前Backupと画面の状態を保存してPMレビューへ戻す。

## 端末別移行手順

1. 夫側端末で最新Backupを書き出し、以後の記録追加を一時停止する。
2. 公開済みCandidate Cを開き、移行完了notice、74 / 157、Day4 23 / 23を確認する。
3. Walk Log、当日追加、Chile、検索、World Mapを確認し、移行後Backupを書き出す。
4. 妻側端末でも別のBackupを使って同じ手順を最初から実施する。
5. 2人のBackup、移行後Backup、確認結果を混ぜずに保管する。

fingerprint不一致時は移行を実行せず、localStorageへ書き込まない。新しい状態を推測で作らず、最新Backupを再監査する。

## ロールバック

移行後に新しい記録を作っていない場合:

1. GitHub PagesをCandidate B'の確認済みcommitへ戻す。
2. 該当端末本人の移行前BackupをRestoreする。
3. 取得数、取得日時、Walk Log、actual activityを確認する。

移行後に新しい取得・記録がある場合は、移行前BackupをそのままRestoreしない。新規データを失うため、まず現状態をBackupし、`migrations.candidateC20261009`内の`originalActivities`、`movedWalkLogs`、除外したChile監査情報を使う個別復旧をPMレビュー下で行う。
