import { ValidationError } from "../util/errors.js";

/**
 * @typedef {object} Book
 * @property {string} id
 * @property {string} title
 * @property {string} author
 * @property {string} isbn
 * @property {number} copies   total copies the library owns
 */

export function createBook({ id, title, author, isbn, copies = 1 }) {
  if (!title || !title.trim()) throw new ValidationError("title is required");
  if (!author || !author.trim()) throw new ValidationError("author is required");
  if (!Number.isInteger(copies) || copies < 1) throw new ValidationError("copies must be a positive integer");
  return { id, title: title.trim(), author: author.trim(), isbn: isbn ?? "", copies };
}
