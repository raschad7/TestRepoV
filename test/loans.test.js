import assert from "node:assert/strict";
import { test } from "node:test";

import { availableCopies, checkout, returnBook } from "../src/services/loans.js";
import { addDays } from "../src/util/dates.js";
import { ConflictError } from "../src/util/errors.js";
import { T0, seededStore } from "./helpers.js";

test("checkout reduces available copies and sets a 14-day due date", () => {
  const { store, book, member } = seededStore();
  const loan = checkout(store, { bookId: book.id, memberId: member.id, now: T0 });
  assert.equal(availableCopies(store, book.id), 1);
  assert.equal(loan.dueAt.toISOString(), addDays(T0, 14).toISOString());
});

test("checkout fails when no copies remain", () => {
  const { store, other, member } = seededStore();
  checkout(store, { bookId: other.id, memberId: member.id, now: T0 });
  assert.throws(() => checkout(store, { bookId: other.id, memberId: member.id, now: T0 }), ConflictError);
});

test("returning twice is a conflict", () => {
  const { store, book, member } = seededStore();
  const loan = checkout(store, { bookId: book.id, memberId: member.id, now: T0 });
  returnBook(store, { loanId: loan.id, now: addDays(T0, 2) });
  assert.throws(() => returnBook(store, { loanId: loan.id }), ConflictError);
});
