import { policy } from "../config.js";
import { addDays } from "../util/dates.js";
import { ConflictError } from "../util/errors.js";
import { fineFor } from "./fines.js";

/**
 * @typedef {object} Loan
 * @property {string} id
 * @property {string} bookId
 * @property {string} memberId
 * @property {Date} borrowedAt
 * @property {Date} dueAt
 * @property {Date | null} returnedAt
 */

export function loanPeriodFor(member) {
  return member.tier === "Staff" ? policy.staffLoanPeriodDays : policy.loanPeriodDays;
}

export function availableCopies(store, bookId) {
  const book = store.getBook(bookId);
  return book.copies - store.activeLoansForBook(bookId).length;
}

export function checkout(store, { bookId, memberId, now = new Date() }) {
  const member = store.getMember(memberId);
  if (availableCopies(store, bookId) <= 0) throw new ConflictError("no copies available");
  if (store.activeLoansForMember(memberId).length >= policy.maxActiveLoans) {
    throw new ConflictError(`member already has ${policy.maxActiveLoans} active loans`);
  }

  return store.saveLoan({
    id: store.newId(),
    bookId,
    memberId,
    borrowedAt: now,
    dueAt: addDays(now, loanPeriodFor(member)),
    returnedAt: null,
  });
}

export function returnBook(store, { loanId, now = new Date() }) {
  const loan = store.getLoan(loanId);
  if (loan.returnedAt) throw new ConflictError("loan already returned");
  const returned = { ...loan, returnedAt: now };
  store.saveLoan(returned);
  return { loan: returned, fineCents: fineFor(returned, now, store.getMember(loan.memberId)) };
}
