import { policy } from "../config.js";
import { daysBetween } from "../util/dates.js";

/**
 * Late fine for a loan, in cents. A loan returned on its due date owes nothing; each whole day
 * after that costs `finePerDayCents`, capped at `maxFineCents`.
 */
export function fineFor(loan, now = new Date()) {
  const end = loan.returnedAt ?? now;
  const daysLate = daysBetween(loan.dueAt, end);
  if (daysLate <= 0) return 0;
  return Math.min(daysLate * policy.finePerDayCents, policy.maxFineCents);
}

export function outstandingFines(loans, now = new Date()) {
  return loans.reduce((sum, loan) => sum + fineFor(loan, now), 0);
}
