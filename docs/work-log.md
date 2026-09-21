# Work Log

This file records only important project milestones. It is not a detailed daily work log.

## v0.1

- Created the first Prototype with HTML/CSS/Vanilla JavaScript.
- Implemented Day1 5-entry prototype data.
- Implemented NEXT display, Google Maps link, manual acquisition status, walk logs, review timeline, and JSON Backup / Restore.
- Tested direct execution from OneDrive/iCloud Drive on iPhone.
- OneDrive/iCloud direct HTML execution failed for practical use because external links, `localStorage`, save behavior, and JavaScript execution were unreliable.
- Switched the official prototype delivery approach to GitHub Pages.
- Confirmed GitHub Pages + iPhone Safari + `localStorage` works on a real iPhone.

## v0.2

- Added a toast after saving `＋記録`.
- Added cache-busting query parameters for CSS/JS references.
- Confirmed on iPhone Safari that `記録を保存しました` appears after saving and disappears automatically.

## v0.3

- Added Day screen restore using `settings.lastScreen`.
- Day screen is restored after reopening/reloading when the user last used Day.
- Returning to Home stores `settings.lastScreen = "home"`.
- Confirmed on iPhone Safari that Day restore works.

## v0.4

- Replaced the Prototype 5-entry Day1 data with the official Day1 13-entry dataset from `embassy_stamp_rally_157攻略表_住所マスター確定版_20260906.xlsx`.
- Kept the existing GitHub Pages, HTML/CSS/Vanilla JavaScript, `localStorage`, NEXT-centered UI, and JSON Backup / Restore structure.
- Regenerated the single HTML prototype and release files.
- PC-side validation passed.
- iPhone Safari validation passed.

## v0.5

- Japanese-localized `AGENTS.md` and made it the ongoing project rule file.
- Reflected PM decisions for Day1-10 switching, restart behavior, `localStorage` versioning, ID design, version display, `prototype/` and `release/`, and Google Maps validation.
- Extracted official Day1-10 157-entry data mechanically from `embassy_stamp_rally_157攻略表_住所マスター確定版_20260906.xlsx`.
- Added Home-screen Day1-10 selection while preserving the NEXT-centered Day screen.
- Kept `dataVersion: "1.0"` and preserved existing Day1 IDs.
- Added data extraction tooling and v0.5 validation docs.
- PC-side validation passed.
- iPhone Safari validation passed.
- Day10 Afghanistan `地図要確認` behavior passed on iPhone Safari.
- Day10 Afghanistan remains a source-data issue because the Primary Source Map field is `要確認`.

## v0.6

- Updated the visible app name to `大使館スタンプラリー` and subtitle to `世界とつながる 東京散歩`.
- Refreshed the UI palette to green, sky blue, and cream while keeping the NEXT-centered Day screen.
- Added guide character image assets based on the user-provided source image.
- Fixed the Day screen `＋記録` scroll-position issue by removing sticky positioning from the button.
- Kept official 157-entry data, Day1-10 structure, `localStorage` structure, `dataVersion: "1.0"`, Google Maps behavior, Afghanistan `地図要確認`, and JSON Backup / Restore unchanged.
- PC-side validation passed.
- iPhone Safari validation is pending after GitHub Pages update.

## v0.6 Asset Load Fix (intermediate)

- Changed guide character rendering from CSS background images to normal image elements so missing GitHub uploads are easier to detect and cache behavior is clearer.
- Confirmed locally that the home and Day screen guide characters render.
- Clarified that `次` and `その次` are information rows, not buttons.

## v0.6.3

- Reworked the Home screen to be much closer to the reference image: sky background, speech bubbles, central title, guide characters, stamp globe, and skyline-style lower band.
- Updated the Day screen header and large NEXT card styling while preserving the existing NEXT-centered behavior.
- Added screen-change scroll reset so each screen opens from the top.
- Updated cache-busting query strings to `v=0.6.3`.
- PC validation passed.

## v0.6.4 Final Implementation

- Rebuilt the v0.6 UI against the approved four-screen Design Target instead of extending the previous draft design.
- Added separate Home, Day list, Today's route, and Day / NEXT views while preserving the v0.5 data and NEXT behavior.
- Removed the large central `STAMP` treatment.
- Rebuilt the Home Hero with sky, clouds, a small airplane, a city silhouette, guide characters, and an earth illustration.
- Replaced rectangular source-image crops with independent transparent PNG assets for the male character, female character, and earth.
- Kept all UI text, progress, embassy names, and buttons in HTML/CSS.
- Moved the long route list to its own screen and kept `＋記録` in normal document flow on the Day / NEXT screen.
- Added Google Maps and manual NEXT controls to each route row.
- Verified 390x844 and 320px mobile layouts without horizontal overflow or title/character overlap.
- Re-ran data, storage, NEXT, route, record, review, restore, Afghanistan, and `dataVersion: "1.0"` regression checks; PC validation passed.
- iPhone Safari validation remains pending after GitHub Pages update.

Note: `v0.6.3` / `v0.6.4 Final Implementation` はDesign Targetへ近づける途中で使用した作業ラベルである。その後の正式な調整履歴は `v0.6.1 Responsive & Visual Polish`、`v0.6.2 Final Visual Polish`、`v0.6.3 Final Layout Tuning` として管理した。過去記録は当時の作業名として保持する。

## v0.6.1 Responsive & Visual Polish

- Applied the iPhone Safari review findings to the v0.6 Final Implementation without changing app data, logic, or storage.
- Shortened the Home Hero and completed the visual language with earth, stamp, clouds, airplane, and a Tokyo skyline Asset.
- Replaced abstract Home menu marks with practical list, location, record, and backup icons.
- Compressed Day list cards while retaining Day colors and touch targets.
- Kept the NEXT screen's core information and actions within the first iPhone viewport at tested widths.
- Moved `次` and `その次` into the NEXT card and arranged route / record actions in two columns.
- Compressed route cards and kept map, manual NEXT, and status controls at least 44px high.
- Verified Day7 and Day8 long routes without sticky/fixed `＋記録` residue.
- Re-ran data, storage, NEXT, record, review, restore, Afghanistan, and responsive regression checks; PC validation passed.
- iPhone Safari validation is pending after GitHub Pages update.

## v0.6.2 Final Visual Polish

- Applied the final Visual Issue findings from the v0.6.1 iPhone Safari review without changing app data, storage, or route logic.
- Reoriented the Home guide characters toward the enlarged globe and added speech-bubble tails and four clouds.
- Replaced the duplicated globe mark beside the title with a small airplane app logo.
- Added a restrained Home footer using the Tokyo skyline, airplane, cloud, stamp, and route motifs.
- Renamed the Day heading to `Day X 今日のルート` and removed the `NEXT` label.
- Separated the unacquired `スタンプを取得した` action from the acquired light-green `✓ 取得済み` status.
- Added a 120〜133px Day guide footer below the core actions.
- Verified 320, 375, 390, and 430px layouts without horizontal overflow.
- Re-ran official data, NEXT, manual NEXT, route, record, review, restore, maps, Afghanistan, storage, and Backup / Restore compatibility checks; PC validation passed.
- iPhone Safari validation is pending after GitHub Pages update.

## v0.6.3 Final Layout Tuning (2026-09-19)

- Kept the v0.6.2 screen structure, official 157-entry data, NEXT logic, and storage structure unchanged.
- Adjusted the Home and Day guide characters so the male character is visually about 7.5% taller than the female character at 320, 375, 390, and 430px widths.
- Raised the Home globe by 20px and lowered the Home footer skyline by 20px.
- Extended the Day visual footer in normal flex flow and added the shared airplane, cloud, stamp, route, and skyline motifs.
- Removed the acquired-status row that changed document height after acquisition.
- Added `スタンプを取得しました` to the existing Toast after acquisition while preserving save, progress update, and automatic NEXT.
- Measured 0px vertical movement for the acquisition button, route and record actions, footer, characters, and skyline before/after acquisition at 390x844.
- Re-ran responsive, data, NEXT, manual NEXT, route, record, review, restore, maps, Afghanistan, storage, and Backup / Restore compatibility checks; PC validation passed.
- iPhone Safari validation passed after the GitHub Pages update.
- Day1で実運用し、Day1基本ルート13件と本来Day4のノルウェー大使館を取得した。
- 実利用状態は全体14 / 157、Day1基本13 / 13、walkLogs 4件となり、v0.7 MigrationのGolden Caseに採用した。

## v0.7 Actual Day Activity (2026-09-21)

- `dataVersion`を`"1.1"`へ更新した。
- 保存データ解析、version判定、Migration、validation、成功時保存の順を固定し、失敗時に元データを上書きしないようにした。
- v0.6.3の`1.0` Backup Restoreも同じMigration pathへ統合した。
- 個人メモを含まない匿名化Golden fixtureを追加し、取得済み14件、全`acquiredAt`、walkLogs 4件と全timestamp、settingsの保持を機械比較した。
- ノルウェー大使館を正式Day4のままDay1 actual activityへ`addedAt: null / source: migration`で関連付け、架空のroute-added eventは生成しない。
- Master routeとactual activityを分離し、ローカル日付とplanned Dayごとに当日実績を保持する構造を追加した。
- 正式START / GOALを`js/day-meta.js`へ分離した。
- セッション中のBack / Forward / Home履歴を追加し、HomeまたはDayだけを安全な再起動復元対象とした。
- 今日のルートに当日追加セクションと157件検索を追加し、重複防止、未取得のみ削除、追加大使館の手動NEXTに対応した。
- 基本ルート完了UI、未取得の当日追加NEXT、日付別記録一覧、統合Timeline、walkLog編集・削除を追加した。
- 動的案内コメントを`js/guide-comments.js`へ分離し、Guide Footerをnormal flowで調整した。
- `js/data.js`の157件、Day別件数、ID、順序、住所、mapQuery、master Day、Afghanistanの扱いは変更しなかった。
- Migration・保存・Master回帰テストと、320 / 375 / 390 / 430pxのPCブラウザ確認をPASSした。
- iPhone Safari / standalone実機確認はGitHub Pages反映後に行う。

## v0.7.1 iPhone Standalone Hotfix (2026-09-21)

- v0.7 Migration GateはiPhone standaloneでPASSした。
- 保存構造、Migration、正式157件、activity model、Backup / Restoreには変更を加えなかった。
- HomeのBack / Forwardを通常フローの独立した44px touch targetへ変更し、disabled時も位置を固定した。
- Day案内Footerをaction buttons後の独立sectionへ変更し、吹き出し、人物、skylineをnormal flowへ配置した。
- Day完了summaryの3項目を1つのcompactな3列cardへ統合し、重複する上部進捗を完了時だけ隠した。
- Navigation entryに`dayMode`と`nextEmbassyId`を追加し、Back / Forwardで過去のDay / NEXT表示対象を復元できるようにした。
- 履歴表示時も取得状態と進捗は現在値を使用し、既に取得済みの過去NEXTは`取得済み（履歴表示）`として操作不可にした。
- 320 / 375 / 390 / 430pxでHome Navigation、完了summary、Footer非重複、横overflowなしを確認した。
- Day2で`アメリカ → バーレーン → Route → Home`を作り、Backで`Route → バーレーン → アメリカ`、Forwardでバーレーンを再現した。
- auto NEXTとmanual NEXT、Golden Migration、正式157件の回帰をPASSした。

## v0.7.2 iPhone Standalone Hotfix 2 (2026-09-21)

- v0.7.1実機確認でPASSしたMigration、Day1完了compact layout、action buttonsとGuide Footerの非重複を維持した。
- HomeのBack / ForwardをHero外の独立Navigation rowへ移し、履歴がない場合はrowを表示しない構成へ変更した。
- Guide Footer内で人物の足元をskyline / groundへ接地させ、Footerのnormal flowとaction buttons後の間隔を維持した。
- manual NEXTは`manualNextId`保存後に指定先を持つ最新Day snapshotを追加し、Day画面へ戻すよう修正した。
- 同じDayの再選択ではmanual NEXTを維持し、別Dayへの切替時だけ解除するようにした。
- manual NEXT成功時に大使館名入りToastを表示した。
- 320 / 375 / 390 / 430pxのHome Navigation、Guide Footer、横overflowを確認した。
- Day2南スーダンのmanual NEXT、再読込・Home経由の保持、取得後auto NEXT、Back / Forwardの永続データ非rollbackを確認した。
- 匿名化Goldenを再復元し、14 / 157、Day1基本13 / 13、Day4 1 / 18を確認した。
- `dataVersion: "1.1"`、Migration、正式157件、activity model、Backup / Restoreは変更していない。

## Current Next Gate

- v0.7.2変更ファイルをGitHub Pagesへ反映する。
- Home NavigationのHero非干渉、Guide人物接地、manual NEXTの保存・Day表示をiPhone standaloneで確認する。
- Hotfix実機確認PASS後、Day2以降の実地運用へ進む。

## Project Management Setup

- Added `AGENTS.md` as the standing instruction file for future Codex sessions.
- Rewrote `README.md` to present GitHub Pages + iPhone Safari as the current official approach.
- Reorganized `docs/issues.md` into Open Issues and Closed Issues.
- Kept the existing GitHub Pages app structure unchanged.
