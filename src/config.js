/** Lending policy. Changing these changes what members are charged — see research/lending-policy. */
export const policy = Object.freeze({
  loanPeriodDays: 14,
  maxActiveLoans: 5,
  finePerDayCents: 25,
  maxFineCents: 1000,
  staffLoanPeriodDays: 28,
  staffFineDiscount: 0.5,
});
