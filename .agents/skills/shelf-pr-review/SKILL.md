---
name: shelf-pr-review
description: Review a Shelf pull request against AGENTS.md. Use when reviewing a PR in the Shelf (TestRepoV) repository, or when asked to check money handling, policy values or tests in Shelf.
---

# Shelf PR review

Read `AGENTS.md` first, then the diff. Report findings ranked by what they cost a member.

## Check, in this order

1. **Money.** Any arithmetic on fines must stay in integer cents. A float, a division, or a
   `toFixed` near money is a finding.
2. **Policy.** A number like 14, 5, 25 or 1000 outside `src/config.js` is a hard-coded policy
   value. A change to `src/config.js` must be called out in the PR description.
3. **Time.** Services take `now`. A bare `new Date()` inside service logic makes tests flaky.
4. **Errors.** Failures throw from `src/util/errors.js`; handlers do not build error bodies.
5. **Tests.** Every behaviour change has a test with fixed dates (`T0`).
6. **Secrets.** Keys, tokens or passwords in code are always high risk.

## Output

One line per finding: `file:line — what is wrong — what it costs`. Say "no findings" when
there are none.
