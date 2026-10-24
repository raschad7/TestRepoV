import { createBook } from "../src/models/book.js";
import { createMember } from "../src/models/member.js";
import { Store } from "../src/store.js";

export const T0 = new Date("2026-01-01T10:00:00Z");

export function seededStore() {
  const store = new Store();
  const book = store.saveBook(createBook({ id: "b1", title: "Dune", author: "Frank Herbert", copies: 2 }));
  const other = store.saveBook(createBook({ id: "b2", title: "Emma", author: "Jane Austen", copies: 1 }));
  const member = store.saveMember(createMember({ id: "m1", name: "Ada", email: "ada@example.com" }));
  return { store, book, other, member };
}
