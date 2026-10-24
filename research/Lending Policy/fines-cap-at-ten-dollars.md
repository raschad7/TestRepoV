---
type: Decision
title: Cap late fines at $10 per loan
description: A single loan never costs a member more than $10 in late fines.
tags: [fines, policy]
status: stable
generated: { by: human:rashad, at: 2026-10-20T09:00:00Z }
verified:
  - { by: human:rashad, at: 2026-10-21T09:00:00Z }
sources:
  - id: librarian-interview
    resource: ../Interviews/librarian-interview-2026-10-20.md
    title: Interview with the head librarian
---

# Decision

Late fines are 25 cents per whole day, capped at **$10 (1000 cents)** per loan.

# Why

Uncapped fines made members stop returning books at all once a fine got large. See the
[interview](../Interviews/librarian-interview-2026-10-20.md).

# In the code

`policy.maxFineCents` in `src/config.js`, applied in `src/services/fines.js`.
