/** Lending policy. Changing these changes what members are charged — see research/lending-policy. */
export const policy = Object.freeze({
  loanPeriodDays: 14,
  maxActiveLoans: 10,
  finePerDayCents: 25,
  maxFineCents: 1000,
});
