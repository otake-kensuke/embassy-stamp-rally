# Issues

## Open Issues

### Official Day1 13-entry Data Integration

Status: OPEN

Next action is to integrate the official Day1 13-entry dataset using the primary source:

```text
embassy_stamp_rally_157攻略表_住所マスター確定版_20260906.xlsx
```

Do not infer or alter country names, addresses, Day assignments, or route order. If the master and implementation conflict, report the discrepancy before changing data.

### Prototype / Release Folder Role

Status: OPEN

`prototype/` and `release/` are still present and should not be deleted or moved during Project Management Setup. Their role may be thinner after GitHub Pages adoption, so future cleanup can be considered separately.

## Closed Issues

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
