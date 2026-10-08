# v0.8 GitHub Pages反映前後チェックリスト

## 現在の状態

v0.6.3はiPhone Safari確認後、Day1で実運用済み。実利用状態はDay1基本13 / 13、ノルウェー大使館取得済み、全体14 / 157、walkLogs 4件である。

v0.7.2はPC検証とiPhone standalone最終実機確認を完了し、RELEASE / STABLEとなった。Migration、14 / 157、Day1基本13 / 13、ノルウェー当日追加、Navigation、manual NEXT、完了画面、Guide Footer、記録、当日追加、Backup、既存データ保持はPASSしている。

v0.7.3はDay2実利用フィードバックを反映し、Home検索、`Day Xへ戻る`、Guide人物位置の微調整を実装した。PC RegressionとiPhone standalone Acceptanceを完了し、RELEASE / STABLEとなった。v0.7.2のデータ、Migration、正式157件、実績、記録、Backup仕様は変更していない。

v0.8はWorld Mapを本番実装し、PC RegressionとiPhone standalone Acceptance全12項目を完了した。現在の正式安定版はv0.8 RELEASE / STABLEである。`dataVersion: "1.1"`、Migration、正式157件、既存実績、記録、Backup仕様は変更していない。

v0.8 Walk Log Day Hotfixは実装・PC検証を完了し、iPhone standalone確認待ちである。新規記録は`＋記録`を開いたDay画面へ紐付け、保存時の`settings.activeDay`は使用しない。

Candidate B'攻略計画はPC RegressionとiPhone standalone Acceptance全項目を完了し、RELEASE / STABLEとなった。正式157件Masterと保存データは維持し、今後の攻略計画だけを`js/route-plan.js`へ分離している。

## 更新前

- iPhoneのv0.6.3から最新のJSON Backupを書き出す
- BackupをiPhoneのファイルアプリ等で開ける場所に保管する
- BackupファイルをGitHubへアップロードしない
- 全体14 / 157、Day1 13 / 13、ノルウェー取得済み、記録4件を更新前に確認する

## Migration確認

- GitHub Pagesでv0.7を開き、既存状態が自動的に表示されることを確認する
- 全体が14 / 157であることを確認する
- Day1が基本ルート13 / 13であることを確認する
- 当日追加が1 / 1、ノルウェー大使館、本来Day4、取得済みであることを確認する
- Day1を14 / 13と表示していないことを確認する
- 既存の街歩き記録4件と作成時刻が残っていることを確認する
- Day4でもノルウェーが取得済みであることを確認する

## UI / Navigation

- Home → 今日のルート → BackでHomeへ戻る
- Day → 今日のルート → BackでDayへ戻る
- 今日のルート → Home → Backで今日のルートへ戻る
- Back後のForwardが動作し、履歴がないボタンは無効になる
- Safari / standalone再起動後、安全な最後のHomeまたはDayを復元する
- START / GOALが表示され、NEXTをfirst viewportから押し出していない
- standaloneでGuide Footerに巨大な空白、画像や吹き出しの重なりがない
- 320〜430px相当の縦画面で横スクロールがない
- HomeのBack / Forwardが重ならず、各44px前後のtouch targetを持つ
- Homeの矢印とHero titleが干渉せず、Home buttonが表示されない
- 履歴ありHomeでNavigation rowがHeroより上に表示され、吹き出しや装飾と重ならない
- Day完了summaryがcompactな1つのrow/cardとして読める
- Day action buttonsとGuide Footerの吹き出しが重ならない
- Guide Footerがviewport bottomへ引き伸ばされない
- Guide人物の足元がskyline / groundへ接地し、浮いて見えない
- Day2でアメリカ取得後にバーレーンへ進み、Route、Homeを経てBackするとバーレーン、アメリカの順に表示が戻る
- 過去のアメリカ画面でも取得済み状態と現在進捗が維持され、Forwardでバーレーンへ進める
- Homeの`大使館を検索`が見つけやすく、押しやすい
- 国名・大使館名の部分一致検索と前後空白の除去が動作する
- 検索結果に大使館名、現在の攻略コースDayまたは当日追加Day、飛び地 / 要確認、現在の取得状態が表示され、旧Master Dayは表示されない
- 検索結果から正しいDayのRouteへ移動し、対象カードがすぐ見つかる
- Searchと検索結果RouteがBack / Forward / Homeの履歴に含まれる
- 検索だけではmanual NEXTが変わらない
- `Day Xへ戻る`で過去snapshotではなく最新のmanual NEXTまたはauto NEXTを表示する
- 完了Dayと当日追加ありDayでも`Day Xへ戻る`が正しい表示へ移動する

## 当日追加 / NEXT

- 国名または大使館名で検索できる
- 追加後も `本来：Day X` が正しい
- 同じ大使館を同じ日に重複追加できない
- 未取得の当日追加をルートから外せる
- 取得済みの当日追加をルートから外せない
- 当日追加を `ここをNEXTにする` で指定できる
- 基本ルート完了後も、未取得の当日追加NEXTを別枠で操作できる
- 未完了Dayの既存auto NEXT / manual NEXTが動作する
- Day2で南スーダンを `ここをNEXTにする` で指定し、Toast後のDay画面、再読込、Home経由でも南スーダンがNEXTになる
- manual NEXT指定後のBack / Forwardが表示履歴だけを戻し、取得状態や記録をrollbackしない

## 記録 / Backup

- 記録を追加できる
- Day3画面から`＋記録`を作成すると、Backup内の新規`walkLog.day`が`3`になる
- Day9画面から`＋記録`を作成すると、Backup内の新規`walkLog.day`が`9`になる
- 別Dayを閲覧した後でも、Day3画面から開いた`＋記録`はDay3へ紐付く
- user-created記録のcategory / textを編集でき、作成時刻は変わらない
- user-created記録を編集しても既存の`day`が変わらない
- 記録削除前に確認が表示される
- 日付別一覧にstamp数と記録数が表示される
- Timelineに取得、記録、v0.7のroute-added eventが時刻順で表示される
- 2026年10月3日の修正版Backupでは日別一覧とTimelineが`Day 3`だけを表示し、`Day 3 / Day 9`にならない
- v1.1 JSON Backupを書き出して復元できる
- 更新前のv1.0 Backupをv0.7へ復元できる
- 不正なBackupで現在のデータが消えない

## 継続確認

- Day7 / Day8の長いルートで `＋記録` が画面途中に残留しない
- Day10 アフガニスタンが `地図要確認` のまま表示される
- 写真はiPhone写真アプリで管理し、Webアプリ内には保存しない

## Candidate B' iPhone standalone確認

Status: **PASS / RELEASE / STABLE**

- Homeが51 / 157で、Day1〜Day3が13 / 13、14 / 14、19 / 19のまま
- Day4は14件、赤羽橋駅 → 新富町駅、NEXTキューバ、ベナンなし
- Day5〜Day8は各17件で、NEXT、手動NEXT、Google Mapsが動作する
- Day9は12件、ザンビアなし、Cameroonあり、GOAL北品川駅
- Day10は9件、Cameroonなし、`公共交通併用Day`案内あり
- ベナンとザンビアをHome検索でき、`飛び地回収・取得状態`から当日追加へ進める
- Homeの飛び地回収カードが現在の取得状態を`0 / 2`〜`2 / 2 完了`で表示する
- 飛び地行から住所、Google Maps、当日追加へ進める
- Day6 → Day4 → Day8のように順不同で選択でき、前Day未完了による制限がない
- 実際の日付と攻略コース番号がReview / Timelineで混同されない
- Candidate B'通常対象は現在の攻略コースDayを表示し、当日追加実績はactual activityのDayを表示する
- Afghanistanが通常ルート外で、`地図要確認`のまま
- Back / Forward / Home、再起動後復元、Backup / Restore、World Map、記録に退行がない

## v0.8 World Map iPhone standalone Acceptance完了

- Home入口、世界地図初回描画、地域切替、地域カラー: PASS
- 小国・島国marker、オセアニア0 / 9 empty state: PASS
- 取得済み国・地域一覧、Back / Forward / Home: PASS
- 取得、取得取消からWorld Mapへの反映: PASS
- standalone再起動後の再構成: PASS
- iPhone UI、overflow、text wrapping: PASS

## 既知Issue

- Walk Log Day HotfixはiPhone standalone確認待ち
- 既存Walk LogのDay変更UIはFuture Candidate / PM判断
- Guide Comment / 吹き出しの人物との縦間隔、文字サイズ、日本語改行はv0.8.1 Candidate
- World Map世界タブのchip一覧は、取得数増加時に地域別group / 折りたたみを将来検討する
- Day10 アフガニスタンはPrimary Source上のMap欄が `要確認`
- `prototype/` と `release/` の役割整理は別途PM判断
