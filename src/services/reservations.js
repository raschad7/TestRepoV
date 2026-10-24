import { policy } from "../config.js";
import { addDays, isPast } from "../util/dates.js";
import { ConflictError, NotFoundError } from "../util/errors.js";
import { availableCopies } from "./loans.js";

/**
 * @typedef {object} Reservation
 * @property {string} id
 * @property {string} bookId
 * @property {string} memberId
 * @property {Date} createdAt
 * @property {"waiting" | "ready" | "fulfilled" | "expired" | "cancelled"} state
 * @property {Date} [holdUntil]  set when the reservation becomes ready
 */

function reservationsOf(store) {
  store.reservations ??= new Map();
  return store.reservations;
}

/** Waiting reservations for a book, first come first served. */
export function queueFor(store, bookId) {
  return [...reservationsOf(store).values()]
    .filter((r) => r.bookId === bookId && r.state === "waiting")
    .sort((a, b) => a.createdAt - b.createdAt);
}

/** Joins the queue for a book. Only allowed when no copy is free. */
export function reserve(store, { bookId, memberId, now = new Date() }) {
  store.getMember(memberId);
  if (availableCopies(store, bookId) > 0) throw new ConflictError("a copy is available; borrow it instead");
  if (queueFor(store, bookId).some((r) => r.memberId === memberId)) {
    throw new ConflictError("member is already in the queue for this book");
  }

  const reservation = { id: store.newId(), bookId, memberId, createdAt: now, state: "waiting" };
  reservationsOf(store).set(reservation.id, reservation);
  return reservation;
}

export function cancelReservation(store, { reservationId }) {
  const reservation = reservationsOf(store).get(reservationId);
  if (!reservation) throw new NotFoundError("reservation", reservationId);
  if (reservation.state !== "waiting") throw new ConflictError(`reservation is ${reservation.state}`);
  const cancelled = { ...reservation, state: "cancelled" };
  reservationsOf(store).set(cancelled.id, cancelled);
  return cancelled;
}

/** 1-based place in the queue, or null when the member is not waiting for the book. */
export function positionInQueue(store, { bookId, memberId }) {
  const index = queueFor(store, bookId).findIndex((r) => r.memberId === memberId);
  return index === -1 ? null : index + 1;
}

/**
 * Call after a copy comes back. The first waiting member gets the copy held for
 * `pickupWindowDays`. Returns the reservation that became ready, or null.
 */
export function promoteNext(store, { bookId, now = new Date() }) {
  if (availableCopies(store, bookId) <= 0) return null;
  const [next] = queueFor(store, bookId);
  if (!next) return null;
  const ready = { ...next, state: "ready", holdUntil: addDays(now, policy.pickupWindowDays) };
  reservationsOf(store).set(ready.id, ready);
  return ready;
}

/** Expires holds nobody picked up and passes each copy to the next member in line. */
export function expireHolds(store, { now = new Date() } = {}) {
  const expired = [...reservationsOf(store).values()].filter((r) => r.state === "ready" && isPast(r.holdUntil, now));
  for (const hold of expired) {
    reservationsOf(store).set(hold.id, { ...hold, state: "expired" });
    promoteNext(store, { bookId: hold.bookId, now });
  }
  return expired.length;
}
