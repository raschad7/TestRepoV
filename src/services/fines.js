import { policy } from "../config.js";
import { daysBetween } from "../util/dates.js";

/**
 * Late fine for a loan, in cents. A loan returned on its due date owes nothing; each whole day
 * after that costs `finePerDayCents`, capped at `maxFineCents`. Staff members get a discount.
 */
export function fineFor(loan, now = new Date(), member = null) {
  const end = loan.returnedAt ?? now;
  const daysLate = daysBetween(loan.dueAt, end);
  if (daysLate <= 0) return 0;
  const fine = Math.min(daysLate * policy.finePerDayCents, policy.maxFineCents);
  // Staff pay half.
  if (member?.tier === "staff") return fine * policy.staffFineDiscount;
  return fine;
}

export function outstandingFines(loans, now = new Date()) {
  return loans.reduce((sum, loan) => sum + fineFor(loan, now), 0);
}
