# v0.7 GitHub Pages反映前後チェックリスト

## 現在の状態

v0.6.3はiPhone Safari確認後、Day1で実運用済み。実利用状態はDay1基本13 / 13、ノルウェー大使館取得済み、全体14 / 157、walkLogs 4件である。

v0.7のMigration GateはiPhone standalone実機でPASSした。v0.7.1のDay完了compact layoutとFooter非重複も実機PASS。v0.7.2 Hotfix 2はPC検証まで完了している。次GateはGitHub Pages反映後のHome Navigation、Guide人物接地、manual NEXT再確認である。

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
- user-created記録のcategory / textを編集でき、作成時刻は変わらない
- 記録削除前に確認が表示される
- 日付別一覧にstamp数と記録数が表示される
- Timelineに取得、記録、v0.7のroute-added eventが時刻順で表示される
- v1.1 JSON Backupを書き出して復元できる
- 更新前のv1.0 Backupをv0.7へ復元できる
- 不正なBackupで現在のデータが消えない

## 継続確認

- Day7 / Day8の長いルートで `＋記録` が画面途中に残留しない
- Day10 アフガニスタンが `地図要確認` のまま表示される
- 写真はiPhone写真アプリで管理し、Webアプリ内には保存しない

## 既知Issue

- Day10 アフガニスタンはPrimary Source上のMap欄が `要確認`
- `prototype/` と `release/` の役割整理は別途PM判断
- v0.7.2 Home Navigation、Guide人物接地、manual NEXTのiPhone standalone実機確認は未完了
