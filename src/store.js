import { randomUUID } from "node:crypto";

import { NotFoundError } from "./util/errors.js";

/**
 * In-memory repository. One instance per running app; tests create their own.
 * `require*` methods throw NotFoundError instead of returning undefined.
 */
export class Store {
  constructor() {
    this.books = new Map();
    this.members = new Map();
    this.loans = new Map();
  }

  newId() {
    return randomUUID();
  }

  saveBook(book) {
    this.books.set(book.id, book);
    return book;
  }

  requireBook(id) {
    const book = this.books.get(id);
    if (!book) throw new NotFoundError("book", id);
    return book;
  }

  listBooks() {
    return [...this.books.values()];
  }

  saveMember(member) {
    this.members.set(member.id, member);
    return member;
  }

  requireMember(id) {
    const member = this.members.get(id);
    if (!member) throw new NotFoundError("member", id);
    return member;
  }

  saveLoan(loan) {
    this.loans.set(loan.id, loan);
    return loan;
  }

  requireLoan(id) {
    const loan = this.loans.get(id);
    if (!loan) throw new NotFoundError("loan", id);
    return loan;
  }

  openLoansForBook(bookId) {
    return [...this.loans.values()].filter((l) => l.bookId === bookId && !l.returnedAt);
  }

  openLoansForMember(memberId) {
    return [...this.loans.values()].filter((l) => l.memberId === memberId && !l.returnedAt);
  }
}
