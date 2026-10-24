import { ValidationError } from "../util/errors.js";

/**
 * @typedef {object} Member
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {"standard" | "staff"} tier
 * @property {Date} joinedAt
 */

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TIERS = ["standard", "staff"];

export function createMember({ id, name, email, tier = "standard", joinedAt = new Date() }) {
  if (!name || !name.trim()) throw new ValidationError("name is required");
  if (!EMAIL.test(email ?? "")) throw new ValidationError("email is invalid");
  if (!TIERS.includes(tier)) throw new ValidationError(`tier must be one of ${TIERS.join(", ")}`);
  return { id, name: name.trim(), email: email.toLowerCase(), tier, joinedAt };
}
