export class NotFoundError extends Error {
  constructor(what, id) {
    super(`${what} ${id} not found`);
    this.name = "NotFoundError";
    this.status = 404;
  }
}

export class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.name = "ConflictError";
    this.status = 409;
  }
}

export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
    this.status = 400;
  }
}
