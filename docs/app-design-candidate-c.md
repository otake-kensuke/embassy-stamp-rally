# Candidate C Production Design

Status: **PM APPROVED / PRODUCTION IMPLEMENTED / PC VERIFIED**  
Publish: **GitHub Pages公開・iPhone移行・Acceptance待ち**

## 目的

Candidate B'を履歴として残し、2026年10月9日の実績をDay4へ集約する。残り83件は徒歩約3時間と地理的近接性を優先したDay5〜10へ再構成する。

正式157件Master、ID、取得状態、取得日時、過去のDay1〜3実績、World Map mapping、Backup形式、`dataVersion: "1.1"`は変更しない。

## データ層

- `js/data.js`: 正式157件Master。Candidate Cでは変更しない。
- `js/route-plan.js`: Candidate Cの攻略コース、Day10区間、Turkmenistan住所補正を保持する。
- `js/day-meta.js`: Candidate CのSTART / GOAL / 経由 / 表示種別を保持する。
- `js/candidate-c-migration.js`: 確認済みの2バックアップだけを完全一致で識別し、2026年10月9日の所属Dayを移行する。
- `state.embassies`: 取得状態と`acquiredAt`のSource of Truth。移行では変更しない。
- `actualDayActivities.localDate`: 実施日。`plannedDay`とは独立して扱う。

攻略計画は配信コードであり保存schemaではないため、`dataVersion`は`"1.1"`を維持する。

## 攻略コース

| Day | 件数 | START | GOAL | 距離・方針 |
|---|---:|---|---|---|
| 1 | 13 | 既存 | 既存 | 変更なし |
| 2 | 14 | 既存 | 既存 | 変更なし |
| 3 | 19 | 既存 | 既存 | 変更なし |
| 4 | 23 | 実績記録なし | 白金高輪駅（記録より） | 2026-10-09実績、距離未計測 |
| 5 | 17 | 池ノ上駅 | 恵比寿駅 | 約11.6km |
| 6 | 23 | 六本木一丁目駅 | 恵比寿駅 | 約11.3km、高負荷コース |
| 7 | 9 | 六本木一丁目駅 | 新富町駅 | 約8.2km |
| 8 | 18 | 品川駅 | 品川駅 | 約12.1km |
| 9 | 10 | 祐天寺駅 | 都立大学駅 | 約11.5km |
| 10 | 6 | 用賀駅 | 後楽園駅 | 約11.7km、田園調布駅経由・鉄道併用 |

Day4の順序:

```text
チリ → キューバ → トンガ → ボリビア → グアテマラ → ホンジュラス →
ハイチ → フィジー → ロシア → サモア → ナミビア → エクアドル →
パラオ → アフガニスタン → カザフスタン → キルギス → オーストラリア →
イタリア → ハンガリー → クウェート → ジンバブエ → スリランカ → ウズベキスタン
```

Day5〜10の正式なID順は`js/route-plan.js`を実装上の正とする。Day5〜10は合計83件で、重複・欠落・取得済み混入を機械検証する。

## Day10交通区間

Day10は単一の徒歩ルートとして扱わない。

1. 徒歩: 用賀駅から5大使館を経由して田園調布駅
2. 鉄道: 田園調布駅から後楽園駅
3. 徒歩: 後楽園駅からベナン大使館を経由して後楽園駅

画面では3本のGoogle Maps導線を分けて表示する。鉄道時間は徒歩時間へ加算しない。具体的な列車時刻は固定しない。

## 2026-10-09移行

対象は事前レビュー済みの夫婦それぞれのBackupだけとする。

- acquired 74件と未取得83件を維持する。
- 各大使館のstatus、`acquiredAt`、`updatedAt`を変更しない。
- 2026-10-09のDay6 activityをDay4へ移す。
- 正しい当日追加16件とroute-added event 16件を維持する。
- 同日のWalk Log 4件はID、本文、category、日時を維持し、`day`だけ`6 → 4`へ変更する。
- 片方のBackupにある旧Day4のChile誤追加1件とevent 1件は表示対象から外し、移行監査情報へ原形を保存する。
- 新Day4の基本23件に含まれる当日追加は、UIで重複表示しない。
- 移行markerにより二重実行しても状態を変えない。

移行前状態のfingerprintが確認済みBackupと一致しない場合は`blocked`とし、localStorageへ書き込まない。個人のBackup本文や記録内容はコード・fixture・GitHubへ含めない。

## 検索・NEXT・履歴

- 検索結果のDayはCandidate C攻略コースから導出する。
- Day途中で別Day対象を取得しても、`state.embassies[id].status`により他Dayで再取得を要求しない。
- manual NEXT、auto NEXT、Navigation snapshotの既存優先順位を維持する。
- Review / Timelineでは実施日と攻略コースDayを混同しない。
- World Mapは取得状態だけから再構成し、Candidate C専用状態を持たない。

## 住所補正

TurkmenistanはMasterを変更せず、攻略計画レイヤーで`東京都港区元麻布2-8-4`を表示・検索する。公式ラリーのスタンプ取得地点は未確認のため、画面に確認注記を表示する。

AfghanistanはDay4取得済みとして扱うが、MasterのGoogle Maps未確定状態と`地図要確認`を維持する。

## 公開条件

- GitHub Pagesへのpush / 公開はPMの別承認後に行う。
- 公開前に各端末から最新Backupを書き出し、確認済み状態との一致を再確認する。
- 端末移行とiPhone standalone Acceptanceが完了するまで`RELEASE / STABLE`へしない。
