const DAY_MS = 24 * 60 * 60 * 1000;

/** Returns a new Date that is `days` whole days after `date`. */
export function addDays(date, days) {
  return new Date(date.getTime() + days * DAY_MS);
}

/** Whole days from `from` to `to`, rounded down. Negative when `to` is earlier. */
export function daysBetween(from, to) {
  return Math.floor((to.getTime() - from.getTime()) / DAY_MS);
}

export function isPast(date, now = new Date()) {
  return date.getTime() < now.getTime();
}
