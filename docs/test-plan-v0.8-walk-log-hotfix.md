# v0.8 Walk Log Day Hotfix テスト計画

## 目的

新規walkLogを、保存時の`settings.activeDay`ではなく、`＋記録`を開いたDay画面へ正しく紐付ける。既存データ、取得状態、当日実績、World Map、Navigation、Backup形式へ影響を与えないことを確認する。

## PC自動検証

- Day3 snapshotから解決したDayが`3`: PASS
- Day9 snapshotから解決したDayが`9`: PASS
- `settings.activeDay: 9`相当の状態でも、Day3 snapshotから作成した記録が`day: 3`: PASS
- Home / 記録一覧等のDay文脈なしでは新規walkLogを作成しない: PASS
- Day3 / Day9の新規walkLog追加: PASS
- category / text編集後も既存`day`を維持: PASS
- walkLog削除: PASS
- 日別Timelineの時刻順表示: PASS
- embassy acquisition event: PASS
- `actualDayActivities`: PASS
- Backup / Restoreと`dataVersion: "1.1"`: PASS
- World Map Regression: PASS
- Navigationの既存snapshot Regression: PASS

## 対象Backup検証

- 原本は変更しない: PASS
- 対象walkLog 1件の`day`だけを`9 → 3`へ変更: PASS
- 他のwalkLogs、embassies、`acquiredAt`、`actualDayActivities`、manual NEXT、settingsを変更しない: PASS
- 修正版Backupを復元後、2026年10月3日の日別一覧が`Day 3`だけを表示: PASS
- 同日のTimelineに対象記録が残る: PASS

## iPhone standalone確認待ち

1. Day3画面から`＋記録`を保存し、日別記録がDay3だけになることを確認する。
2. Day9画面から`＋記録`を保存し、日別記録がDay9になることを確認する。
3. 別Dayを閲覧した後にDay3へ戻り、Day3から保存した記録がDay3へ紐付くことを確認する。
4. 記録のcategory / textを編集しても、所属Dayが変わらないことを確認する。
5. 記録削除、Timeline、Backup書き出し・復元が従来どおり動作することを確認する。
6. World Map、Back / Forward / Home、取得状態、当日追加に影響がないことを確認する。

## Status

`IMPLEMENTED / PC VERIFIED`

`iPhone standalone確認待ち`
