# AGENTS.md

Rules for anyone (human or agent) changing Shelf. Reviewers check PRs against this file.

## Code

- Plain Node.js ESM, no build step, no runtime dependencies. Imports keep their `.js` extension.
- Money is always integer **cents** (`fineCents`, `finePerDayCents`). Never use floats for money.
- Lending policy numbers live only in `src/config.js`. Do not hard-code a loan period, limit or
  fine anywhere else.
- Services take the `store` as their first argument and accept an optional `now` so tests can
  control time. Do not call `new Date()` inside a service except as that default.
- Failures throw one of the errors in `src/util/errors.js`. Handlers never build error responses
  by hand; the server maps `err.status`.
- No `console.log` outside `src/index.js`.
- No secrets in the repository. Anything secret comes from an environment variable.

## Tests

- Every behaviour change ships with a test in `test/`. Run `npm test` before opening a PR.
- Tests use fixed dates (`T0` in `test/helpers.js`), never the real clock.

## Pull requests

- One intent per PR. Mechanical changes (renames, formatting) go in their own PR, separate from
  behaviour changes.
- A PR that changes `src/config.js` must say so in its description, because it changes what
  members are charged.
