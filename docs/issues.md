# Issues

## Open Issues

### Prototype / Release Folder Role

Status: OPEN

`prototype/` and `release/` are still present and should not be deleted or moved during Project Management Setup. Their role may be thinner after GitHub Pages adoption, so future cleanup can be considered separately.

### Afghanistan Google Maps Query

Status: OPEN

Primary Source marks Day10 Afghanistan as `要確認` rather than a normal Google Maps URL. The app does not infer a map query and shows the map button as disabled for this entry.

Current behavior:

- PC validation passed.
- iPhone Safari validation passed.
- App shows `地図要確認` and disables the map link.

## Closed Issues

### v0.6 `＋記録` Scroll Position

Status: CLOSED

Result:

- Cause: the Day screen `＋記録` button used `position: sticky`, which could remain in an unnatural mid-screen position while the long route list was expanded and scrolled on iPhone Safari.
- Fix: changed the button back to normal document flow so it no longer follows or remains mid-scroll.
- PC validation passed.
- iPhone Safari validation is pending after GitHub Pages update.

### v0.6 UI/UX Refresh

Status: CLOSED

Result:

- Updated displayed app title to `大使館スタンプラリー`.
- Added subtitle `世界とつながる 東京散歩`.
- Shifted colors to a brighter green, sky blue, and cream palette.
- Added guide character assets derived from the user-provided image.
- Preserved official 157-entry data, Day1-10 structure, NEXT-centered flow, Google Maps behavior, JSON Backup / Restore, and `dataVersion: "1.0"`.
- PC validation passed.
- iPhone Safari validation is pending after GitHub Pages update.
- v0.6.1 changed guide characters from CSS background images to normal image elements to make GitHub upload/cache issues easier to catch.

### Official Day1 13-entry Data Integration

Status: CLOSED

Result:

- Integrated the official Day1 13-entry dataset using the primary source:

```text
embassy_stamp_rally_157攻略表_住所マスター確定版_20260906.xlsx
```

- Did not expand to all 157 entries.
- Kept `dataVersion: "1.0"` and the existing `EMBASSY_MASTER` shape.
- PC-side validation passed.

### Day1 13-entry iPhone Validation

Status: CLOSED

Result:

- iPhone Safari real-device validation passed.
- Confirmed Day1 13-entry display.
- Confirmed NEXT / 次 / その次.
- Confirmed `取得済み` auto-NEXT.
- Confirmed manual NEXT via `今日のルートを見る` -> `ここをNEXTにする`.
- Confirmed Google Maps, route list, `＋記録`, review timeline, `localStorage`, and JSON Backup / Restore.

### Day1-10 Official 157-entry Rollout PM Decisions

Status: CLOSED

Result:

- PM decisions were finalized and reflected in `AGENTS.md` and `docs/implementation-plan-157.md`.
- v0.5 implementation may proceed under those decisions.

### Official Day1-10 157-entry Integration

Status: CLOSED

Result:

- Extracted 157 entries mechanically from the Primary Source.
- Day counts match expected counts.
- Existing Day1 IDs are preserved.
- Added Home-screen Day1-10 selection.
- Kept `localStorage` `dataVersion: "1.0"`.
- PC validation passed.
- iPhone Safari validation passed.

### v0.5 iPhone Real-device Validation

Status: CLOSED

Result:

- Day1-10 display and switching passed.
- NEXT / 次 / その次 passed for each Day.
- Day restore after Safari restart passed.
- `取得済み` auto-NEXT passed.
- Manual NEXT passed.
- Representative Google Maps checks passed for each Day.
- Five address-change focus entries passed.
- Afghanistan `地図要確認` behavior passed.
- `＋記録` / review timeline passed.
- JSON Backup / Restore passed.

### OneDrive HTML Preview

Status: CLOSED

Result:

- HTML display was possible on iPhone.
- Google Maps external link failed.
- `localStorage` persistence failed.
- `＋記録` save failed.
- Script error occurred.

Decision:

- Discontinue OneDrive/iCloud direct HTML execution.
- Adopt GitHub Pages + iPhone Safari.
- Do not return to the OneDrive/iCloud direct execution approach.

### Save Completion Feedback

Status: CLOSED

Result:

- `＋記録` save completion was unclear in v0.1.
- v0.2 added the `記録を保存しました` toast.
- iPhone Safari test passed.

### Day Screen Restore

Status: CLOSED

Result:

- Safari restart/reopen previously returned to Home even after using Day.
- v0.3 added Day screen restore with `settings.lastScreen`.
- iPhone Safari test passed.
