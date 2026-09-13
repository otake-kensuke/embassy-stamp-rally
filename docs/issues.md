# Issues

## Open Issues

### Day1 13-entry iPhone Validation

Status: OPEN

GitHub Pages upload and iPhone Safari validation are still required for the Day1 13-entry dataset.

### Prototype / Release Folder Role

Status: OPEN

`prototype/` and `release/` are still present and should not be deleted or moved during Project Management Setup. Their role may be thinner after GitHub Pages adoption, so future cleanup can be considered separately.

## Closed Issues

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
