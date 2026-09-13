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

## Current Next Gate

- Integrate the official Day1 13-entry real dataset.
- Do not proceed to all 157 entries until Day1 13-entry validation passes.

## Project Management Setup

- Added `AGENTS.md` as the standing instruction file for future Codex sessions.
- Rewrote `README.md` to present GitHub Pages + iPhone Safari as the current official approach.
- Reorganized `docs/issues.md` into Open Issues and Closed Issues.
- Kept the existing GitHub Pages app structure unchanged.
