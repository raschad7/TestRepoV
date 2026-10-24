import assert from "node:assert/strict";
import { test } from "node:test";

import { createMember } from "../src/models/member.js";
import { availableCopies, checkout, returnBook } from "../src/services/loans.js";
import { cancelReservation, expireHolds, positionInQueue, promoteNext, reserve } from "../src/services/reservations.js";
import { addDays } from "../src/util/dates.js";
import { ConflictError } from "../src/util/errors.js";
import { T0, seededStore } from "./helpers.js";

function storeWithEmmaOut() {
  const seeded = seededStore();
  const { store, other, member } = seeded;
  checkout(store, { bookId: other.id, memberId: member.id, now: T0 });
  const bob = store.saveMember(createMember({ id: "m2", name: "Bob", email: "bob@example.com" }));
  const cy = store.saveMember(createMember({ id: "m3", name: "Cy", email: "cy@example.com" }));
  return { ...seeded, bob, cy };
}

test("cannot reserve a book that has a free copy", () => {
  const { store, book, member } = seededStore();
  assert.throws(() => reserve(store, { bookId: book.id, memberId: member.id, now: T0 }), ConflictError);
});

test("queue is first come first served", () => {
  const { store, other, bob, cy } = storeWithEmmaOut();
  reserve(store, { bookId: other.id, memberId: cy.id, now: addDays(T0, 2) });
  reserve(store, { bookId: other.id, memberId: bob.id, now: addDays(T0, 1) });
  assert.equal(positionInQueue(store, { bookId: other.id, memberId: bob.id }), 1);
  assert.equal(positionInQueue(store, { bookId: other.id, memberId: cy.id }), 2);
});

test("a member cannot queue twice for the same book", () => {
  const { store, other, bob } = storeWithEmmaOut();
  reserve(store, { bookId: other.id, memberId: bob.id, now: T0 });
  assert.throws(() => reserve(store, { bookId: other.id, memberId: bob.id, now: T0 }), ConflictError);
});

test("cancelling leaves the queue", () => {
  const { store, other, bob, cy } = storeWithEmmaOut();
  const r = reserve(store, { bookId: other.id, memberId: bob.id, now: T0 });
  reserve(store, { bookId: other.id, memberId: cy.id, now: addDays(T0, 1) });
  cancelReservation(store, { reservationId: r.id });
  assert.equal(positionInQueue(store, { bookId: other.id, memberId: bob.id }), null);
  assert.equal(positionInQueue(store, { bookId: other.id, memberId: cy.id }), 1);
});

test("a returned copy is held for the first member in line", () => {
  const { store, other, member, bob } = storeWithEmmaOut();
  reserve(store, { bookId: other.id, memberId: bob.id, now: T0 });
  const [loan] = store.activeLoansForMember(member.id);
  returnBook(store, { loanId: loan.id, now: addDays(T0, 5) });
  const ready = promoteNext(store, { bookId: other.id, now: addDays(T0, 5) });
  assert.equal(ready.memberId, bob.id);
  assert.equal(ready.holdUntil.toISOString(), addDays(T0, 8).toISOString());
  assert.equal(availableCopies(store, other.id), 0);
});

test("only the holder can borrow a held copy", () => {
  const { store, other, member, bob, cy } = storeWithEmmaOut();
  reserve(store, { bookId: other.id, memberId: bob.id, now: T0 });
  const [loan] = store.activeLoansForMember(member.id);
  returnBook(store, { loanId: loan.id, now: addDays(T0, 5) });
  promoteNext(store, { bookId: other.id, now: addDays(T0, 5) });
  assert.throws(() => checkout(store, { bookId: other.id, memberId: cy.id, now: addDays(T0, 6) }), ConflictError);
  assert.ok(checkout(store, { bookId: other.id, memberId: bob.id, now: addDays(T0, 6) }));
});

test("an unclaimed hold expires and moves to the next member", () => {
  const { store, other, member, bob, cy } = storeWithEmmaOut();
  reserve(store, { bookId: other.id, memberId: bob.id, now: T0 });
  reserve(store, { bookId: other.id, memberId: cy.id, now: addDays(T0, 1) });
  const [loan] = store.activeLoansForMember(member.id);
  returnBook(store, { loanId: loan.id, now: addDays(T0, 5) });
  promoteNext(store, { bookId: other.id, now: addDays(T0, 5) });
  assert.equal(expireHolds(store, { now: addDays(T0, 9) }), 1);
  assert.ok(checkout(store, { bookId: other.id, memberId: cy.id, now: addDays(T0, 9) }));
});
