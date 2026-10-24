import { daysBetween } from "../util/dates.js";
import { fineFor } from "./fines.js";

// WIP: spec-weekly-overdue-report.md. Still missing the minDaysLate filter and tests.

export function overdueReport(store, { now = new Date() } = {}) {
  const rows = [];
  for (const loan of store.loans.values()) {
    if (loan.returnedAt || loan.dueAt >= now) continue;
    const book = store.getBook(loan.bookId);
    const member = store.getMember(loan.memberId);
    rows.push({
      loanId: loan.id,
      bookTitle: book.title,
      memberName: member.name,
      memberEmail: member.email,
      dueAt: loan.dueAt,
      daysLate: daysBetween(loan.dueAt, now),
      fineCents: fineFor(loan, now),
    });
  }
  return rows.sort((a, b) => b.daysLate - a.daysLate);
}
