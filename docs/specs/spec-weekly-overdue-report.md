# Spec: weekly overdue report

- Status: ready to build
- Source: librarian interview, "report of everything overdue, every monday"
  (`research/Interviews/librarian-interview-2026-10-20.md`)

## Summary

Add `GET /reports/overdue` that lists every active loan past its due date, with the member, the
book, days late and the fine so far. The library runs it every Monday.

## Requirements

1. Only loans with `returnedAt === null` and `dueAt` before `now` are included.
2. Each row: `loanId`, `bookTitle`, `memberName`, `memberEmail`, `dueAt`, `daysLate`, `fineCents`.
3. Rows are sorted by `daysLate`, most late first.
4. `fineCents` comes from `fineFor` in `src/services/fines.js`; do not recompute it.
5. An optional `?minDaysLate=N` query filters out rows with fewer days late.
6. The logic lives in `src/services/reports.js` and takes `(store, { now, minDaysLate })`.

## Acceptance

- `test/reports.test.js` covers: empty store, one overdue loan, sorting, the `minDaysLate`
  filter, and that returned loans are excluded.
- `npm test` passes.
- Follows `AGENTS.md`.

## Out of scope

- Emailing the report. That comes with reservations notifications.
