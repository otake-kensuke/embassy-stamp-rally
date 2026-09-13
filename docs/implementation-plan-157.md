# Day1-10 Official 157-entry Rollout Plan

## Purpose

Prepare the next implementation step for expanding from the validated Day1 13-entry dataset to the official Day1-10 157-entry dataset.

This document is a planning artifact only. Do not implement the 157-entry data until the PM judgment items below are resolved.

## Current Project State

- GitHub Pages + iPhone Safari is the official delivery approach.
- HTML / CSS / Vanilla JavaScript structure is retained.
- Personal data remains in each device's `localStorage`.
- Day1 official 13-entry integration passed PC validation and iPhone real-device validation.
- The app currently has one active Day screen and stores `settings.activeDay = 1`.

## Implementation Plan

1. Extract official Day1-10 data from the Primary Source.
2. Validate row counts, Day values, visit order, country names, spot names, addresses, and Map queries against the workbook.
3. Decide and document stable IDs for all 157 entries.
4. Update `EMBASSY_MASTER` to include all 157 entries after PM approval.
5. Add the minimum Day selection behavior needed to move between Day1-10 while preserving the NEXT-centered screen.
6. Preserve `localStorage` and JSON Backup / Restore compatibility as much as possible.
7. Regenerate `prototype/embassy-rally-prototype.html` and `release/embassy-rally-v0.1.html`.
8. Create a v0.5 test plan covering Day switching, per-Day NEXT, route list counts, Google Maps links, walk logs, timeline, persistence, and JSON Backup / Restore.
9. Run PC validation.
10. Upload to GitHub Pages and run iPhone Safari validation.

## PM Judgment Required

- Day switching UI: how the user chooses Day1-10 without breaking the NEXT-centered design.
- Start screen behavior: whether reopening should restore the last Day as well as the last screen.
- `localStorage` migration: whether to keep `dataVersion: "1.0"` or introduce a migration/version bump for 157 entries.
- Existing user data: whether Day1 acquired status should be preserved when the 157-entry dataset is introduced.
- Stable ID policy: whether IDs should be manually readable slugs or generated from the official master.
- Release naming: whether to keep `Prototype v0.1` visible, rename to v0.5, or separate product version from data version.
- `prototype/` and `release/` role: whether both generated single HTML files remain necessary after GitHub Pages adoption.
- Validation scope: whether PM wants all 157 Google Maps links manually spot-checked or sampled by Day.

## Data Handling Rules

- Primary Source: `embassy_stamp_rally_157攻略表_住所マスター確定版_20260906.xlsx`
- Do not infer or change country names, addresses, Day assignments, or visit order.
- If workbook data conflicts with implementation assumptions, record an Issue and ask for PM judgment.
- Do not add external services, cloud sync, login, frameworks, npm, Supabase, Firebase, Vercel, or databases.

## Proposed Next Action

PM should review the judgment items above. After approval, the next implementation task can be defined as v0.5: official Day1-10 157-entry integration.
