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

export function availableCopies(store, bookId) {
  const book = store.getBook(bookId);
  return book.copies - store.activeLoansForBook(bookId).length;
}

export function checkout(store, { bookId, memberId, now = new Date() }) {
  store.getMember(memberId);
  if (availableCopies(store, bookId) <= 0) throw new ConflictError("no copies available");
  if (store.activeLoansForMember(memberId).length >= policy.maxActiveLoans) {
    throw new ConflictError(`member already has ${policy.maxActiveLoans} active loans`);
  }

  return store.saveLoan({
    id: store.newId(),
    bookId,
    memberId,
    borrowedAt: now,
    dueAt: addDays(now, policy.loanPeriodDays),
    returnedAt: null,
  });
}

/** Pushes the due date back by one loan period. */
export function renew(store, { loanId, now = new Date() }) {
  const loan = store.getLoan(loanId);
  if (loan.returnedAt) throw new ConflictError("loan already returned");
  const renewals = loan.renewals ?? 0;
  if (renewals > 2) throw new ConflictError("loan cannot be renewed again");

  const renewed = {
    ...loan,
    dueAt: addDays(loan.dueAt, policy.loanPeriodDays),
    renewals: renewals + 1,
    lastRenewedAt: now,
  };
  return store.saveLoan(renewed);
}

export function returnBook(store, { loanId, now = new Date() }) {
  const loan = store.getLoan(loanId);
  if (loan.returnedAt) throw new ConflictError("loan already returned");
  const returned = { ...loan, returnedAt: now };
  store.saveLoan(returned);
  return { loan: returned, fineCents: fineFor(returned) };
}
