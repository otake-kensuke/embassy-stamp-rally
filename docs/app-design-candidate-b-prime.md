# Candidate B' Production Design

Status: **PM APPROVED / PRODUCTION IMPLEMENTED / PC VERIFIED / iPhone Acceptance PAUSED after Step ⑦**

## 目的

Day1〜Day3の実績と正式157件Masterを維持しながら、Day4〜Day10の今後の攻略計画だけをCandidate B'へ切り替える。

## Masterと攻略計画

- `js/data.js`: 正式157件のID、国名、住所、Master Day、Master order、Google Maps情報を保持する。
- `js/route-plan.js`: Day4〜Day10の今後の攻略Dayと訪問順を保持する。
- `js/day-meta.js`: 攻略計画のSTART / GOALとDay10の公共交通併用方針を保持する。
- Day1〜Day3は`js/data.js`の正式順をそのまま攻略計画として使用する。
- 保存状態は取得状態、`acquiredAt`、manual NEXT、当日実績、記録を保持し、攻略計画そのものは保存しない。

固定攻略計画はアプリ配信コードであり、保存schemaではない。このため`dataVersion: "1.1"`を維持し、Migrationを追加しない。

## Day4〜Day10

| Day | 件数 | START | GOAL | 方針 |
|---|---:|---|---|---|
| 4 | 14 | 赤羽橋駅 | 新富町駅 | Candidate B' 7.61km / 102分基準 |
| 5 | 17 | 池ノ上駅 | 代官山駅 | Candidate B |
| 6 | 17 | 赤羽橋駅 | 恵比寿駅 | Candidate B |
| 7 | 17 | 田町駅 | 大門駅 | Candidate B |
| 8 | 17 | 麻布十番駅 | 恵比寿駅 | Candidate B |
| 9 | 12 | 都立大学駅 | 北品川駅 | ザンビアなし、Cameroon維持 |
| 10 | 9 | 用賀駅 | 田園調布駅 | 公共交通併用Day、Cameroonなし |

### Day一覧の表示

- 攻略コース内の件数はDay1〜10合計149件とし、基本進捗を`13 / 13`等で表示する。
- Day1は`＋当日追加 1件`、Day2は`＋当日追加 4件`を基本進捗と分離して表示する。
- 一覧下部で、攻略コース149件、コース外8件（当日追加実績5件、飛び地2件、要確認1件）、全157件の関係を示す。
- Day4〜9は確定した距離と徒歩移動時間を丸めて表示する。徒歩時間はスタンプ取得、信号待ち、休憩、食事、寄り道を含まない。
- Day10は`公共交通併用`を主表示し、徒歩のみの場合の約14.1kmは補助情報とする。

Day10では具体的なバス系統、停留所、時刻表を固定しない。画面には公共交通併用Dayであることと、実施日にGoogle Mapsで確認する案内だけを表示する。

### Day番号の意味

- Day4〜Day10は日付や実施順ではなく、攻略コース番号である。
- Day6 → Day4 → Day8のように任意の順序で実施できる。
- Homeから任意の未完了コースを選択でき、前Day完了条件、unlock、sequential progressionは持たない。
- Dayを順不同に選択しても、NEXT、manual NEXT、取得状態、当日実績、Navigation、Review / Timeline、World Map、Backup / Restoreの意味を変更しない。
- 実際の活動日は`actualDayActivities.localDate`、攻略コースは`plannedDay`で管理する。Walk Logは記録を開いたDay画面の文脈へ紐付ける。

## 飛び地回収

- ベナンとザンビアは正式Masterに残し、通常攻略ルートからだけ除外する。
- Home検索では`飛び地回収・取得状態`と表示し、旧Master Dayは表示しない。
- Homeには小さな飛び地回収カードを表示し、既存の大使館取得状態から`0 / 2`〜`2 / 2 完了`を毎回導出する。
- 専用のlocalStorage / Backup項目は持たず、Source of Truthは`state.embassies[id].status`とする。
- カードの各行または検索結果の選択時は既存の当日追加画面へ移動する。
- 追加画面では正式住所、取得状態、Google Maps、当日追加を確認できる。取得済みの場合も状態表示を維持する。
- 当日追加、Google Maps、取得状態、World Map、Backup / Restoreは既存機能を使う。
- Day11や飛び地回収専用画面は追加しない。

## Afghanistan

- 正式Masterに残す。
- 通常攻略ルートと飛び地回収候補の双方から除外する。
- Home検索では`要確認`と表示し、旧Master Dayや推測した攻略Dayは表示しない。
- `googleMapsQuery`を推測せず、現行の`地図要確認`を維持する。

## 検索

- 通常攻略ルート内の大使館は`攻略コース Day X・取得状態`を表示し、Master Dayは表示しない。
- 通常攻略ルート外の当日追加は、`actualDayActivities[].addedEmbassies`から追加先Dayを一意に導出できる場合、`当日追加 Day X・取得状態`を表示する。一意に決められない場合は`通常ルート外・取得状態`とする。
- Norwayは当日追加Day1、Sweden / Spain / Estonia / Turkeyは当日追加Day2として既存actual activityから導出する。国名ごとのDayを表示用にハードコードしない。
- 通常攻略ルート外の大使館は、当日追加画面へ検索語を引き継ぐ。
- `actualDayActivities.addedEmbassies[].masterDay`は常に正式Master Dayを保存する。

## 保存データ保護

- `js/data.js`は変更しない。
- Backupの形式と内容を変更しない。
- `actualDayActivities`、`walkLogs`、取得状態、`acquiredAt`、manual NEXTをMigrationしない。
- World Mapは従来どおり正式157件と取得状態だけを参照する。
- Navigation snapshotは表示状態だけを保持し、永続データを変更しない。
- 飛び地回収カードは保存対象ではなく、起動時・取得変更時・Restore後に既存状態から再描画する。
