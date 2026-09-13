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
- Day10 Afghanistan remains a source-data issue because the Primary Source Map field is `要確認`.

## Current Next Gate

- Upload v0.5 to GitHub Pages and validate on iPhone Safari.
- Confirm representative Google Maps links for each Day and the five重点確認 entries.

## Project Management Setup

- Added `AGENTS.md` as the standing instruction file for future Codex sessions.
- Rewrote `README.md` to present GitHub Pages + iPhone Safari as the current official approach.
- Reorganized `docs/issues.md` into Open Issues and Closed Issues.
- Kept the existing GitHub Pages app structure unchanged.
