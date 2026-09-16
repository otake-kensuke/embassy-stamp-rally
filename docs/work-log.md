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

## v0.6.1

- Changed guide character rendering from CSS background images to normal image elements so missing GitHub uploads are easier to detect and cache behavior is clearer.
- Confirmed locally that the home and Day screen guide characters render.
- Clarified that `次` and `その次` are information rows, not buttons.

## v0.6.3

- Reworked the Home screen to be much closer to the reference image: sky background, speech bubbles, central title, guide characters, stamp globe, and skyline-style lower band.
- Updated the Day screen header and large NEXT card styling while preserving the existing NEXT-centered behavior.
- Added screen-change scroll reset so each screen opens from the top.
- Updated cache-busting query strings to `v=0.6.3`.
- PC validation passed.

## Current Next Gate

- Upload the v0.6.3 files to GitHub Pages.
- Confirm the v0.6.3 UI and `＋記録` scroll behavior on iPhone Safari.
- After v0.6 iPhone confirmation passes, return to real-use standby and keep unresolved Issues visible.

## Project Management Setup

- Added `AGENTS.md` as the standing instruction file for future Codex sessions.
- Rewrote `README.md` to present GitHub Pages + iPhone Safari as the current official approach.
- Reorganized `docs/issues.md` into Open Issues and Closed Issues.
- Kept the existing GitHub Pages app structure unchanged.
