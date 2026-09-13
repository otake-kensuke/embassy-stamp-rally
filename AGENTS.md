# AGENTS.md

## Project Purpose

This app is a personal Companion App for visiting embassies during the digital stamp rally for foreign embassies in Japan. It does not replace the official stamp rally.

Main roles:

- Day1-10 route support
- NEXT embassy display
- Google Maps integration
- Manual acquisition status management
- Walk logs
- Timeline review
- JSON Backup / Restore

## Current Architecture

Adopted architecture:

- GitHub Pages
- iPhone Safari
- HTML
- CSS
- Vanilla JavaScript
- `localStorage`
- JSON Backup / Restore

Do not use:

- Supabase
- Firebase
- Vercel
- React
- Next.js
- External database
- Login
- Cloud sync

Personal data:

- Stored in each iPhone's `localStorage`
- No sync between partners/devices

Photos:

- Managed in the iPhone Photos app
- Not stored in this web app

## Historical Decision

The project originally considered running a single HTML file directly from OneDrive or iCloud Drive.

iPhone real-device test result:

- HTML display: possible
- Google Maps external link: FAIL
- `localStorage`: FAIL
- `＋記録` save: FAIL
- Script error occurred

Decision:

The OneDrive/iCloud direct HTML execution approach is discontinued.

The project changed to GitHub Pages + iPhone Safari, and real-device testing confirmed that this approach works. Do not return to the OneDrive/iCloud direct execution approach.

## UX Principle

Most important principle:

「当日利用時はNEXT中心の1画面構成。詳細情報・全ルート・記録履歴は必要時に展開する。」

Additional principles:

- iPhone portrait orientation
- Outdoor use
- One-handed operation
- NEXT should be visible without scrolling
- Main actions should take 1-2 taps
- Do not shrink text to cram information
- Inputs should mostly be optional
- Records should be editable later

## Primary Data Source

The primary source for the official 157 embassy dataset is:

```text
embassy_stamp_rally_157攻略表_住所マスター確定版_20260906.xlsx
```

When importing official data, use this master file as the source of truth.

Do not infer or modify country names, addresses, Day assignments, or visit order. If the master and implementation data conflict, do not silently fix the data. Report it as an Issue and ask for PM judgment.

## Current Development Stage

Prototype technical validation is complete.

v0.1:

- GitHub Pages + iPhone Safari + `localStorage` approach validated

v0.2:

- Added toast after saving `＋記録`

v0.3:

- Added Day screen restore

v0.4:

- Integrated official Day1 13-entry real dataset
- PC validation passed
- iPhone Safari validation passed

Next Gate:

- Plan Day1-10 official 157-entry rollout
- Resolve PM judgment items before implementation

Do not expand to all 157 entries until the rollout plan and PM judgment items are confirmed.

## Codex Can Decide

Codex may proceed autonomously with the following, as long as existing specifications are preserved:

- Minor bug fixes
- Code cleanup
- Minor UI improvements
- Responsive adjustments
- Tests
- Documentation updates
- Data conversion
- Normal GitHub Pages updates
- Implementation that follows existing specifications

## PM Approval Required

Do not change the following without PM approval:

- Basic app purpose
- Basic screen structure
- NEXT-centered UI principle
- `localStorage` storage approach
- External service additions
- Cloud database introduction
- Authentication
- Partner/device sync
- Photo management approach
- Official stamp site integration approach
- Day1-10 route structure
- Large new features
- Primary Source data changes
- Hosting change away from GitHub Pages

If needed, organize the topic as an Issue and request PM judgment.

## Start-of-Work Procedure

At the start of a new Codex session, review at least:

1. `AGENTS.md`
2. `README.md`
3. `docs/app-design-v0.1.md`
4. `docs/issues.md`
5. `docs/work-log.md`
6. Relevant test plans as needed

If implementation and documentation conflict, do not decide unilaterally which one is correct. Ask or record the discrepancy as an Issue.

## End-of-Work Procedure

At the end of work, generally perform:

1. Required tests
2. Documentation updates
3. `docs/work-log.md` updates
4. `docs/issues.md` review/update
5. Git diff/status check when Git is available

Final report should include:

- Work performed
- Changed files
- Test results
- Unresolved Issues
- Next Action
- Items requiring PM judgment
