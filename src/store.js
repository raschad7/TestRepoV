import { randomUUID } from "node:crypto";

import { NotFoundError } from "./util/errors.js";

/** In-memory repository. One instance per running app; tests create their own. */
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

  getBook(id) {
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

  getMember(id) {
    const member = this.members.get(id);
    if (!member) throw new NotFoundError("member", id);
    return member;
  }

  saveLoan(loan) {
    this.loans.set(loan.id, loan);
    return loan;
  }

  getLoan(id) {
    const loan = this.loans.get(id);
    if (!loan) throw new NotFoundError("loan", id);
    return loan;
  }

  activeLoansForBook(bookId) {
    return [...this.loans.values()].filter((l) => l.bookId === bookId && !l.returnedAt);
  }

  activeLoansForMember(memberId) {
    return [...this.loans.values()].filter((l) => l.memberId === memberId && !l.returnedAt);
  }
}
