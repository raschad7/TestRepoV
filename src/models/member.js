import { ValidationError } from "../util/errors.js";

/**
 * @typedef {object} Member
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {Date} joinedAt
 */

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function createMember({ id, name, email, joinedAt = new Date() }) {
  if (!name || !name.trim()) throw new ValidationError("name is required");
  if (!EMAIL.test(email ?? "")) throw new ValidationError("email is invalid");
  return { id, name: name.trim(), email: email.toLowerCase(), joinedAt };
}
