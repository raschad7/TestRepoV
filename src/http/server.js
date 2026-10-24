import { randomUUID } from "node:crypto";
import { createServer } from "node:http";

import { createBook } from "../models/book.js";
import { createMember } from "../models/member.js";
import { outstandingFines } from "../services/fines.js";
import { availableCopies, checkout, returnBook } from "../services/loans.js";
import { Router } from "./router.js";

async function readJson(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  if (chunks.length === 0) return {};
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

function send(res, status, body) {
  res.writeHead(status, { "content-type": "application/json" });
  res.end(JSON.stringify(body));
}

export function buildRouter(store) {
  const router = new Router();

  router.add("GET", "/health", () => [200, { ok: true }]);

  router.add("GET", "/books", () => [200, store.listBooks()]);
  router.add("POST", "/books", ({ body }) => [201, store.saveBook(createBook({ ...body, id: store.newId() }))]);
  router.add("GET", "/books/:id", ({ params }) => {
    const book = store.requireBook(params.id);
    return [200, { ...book, available: availableCopies(store, book.id) }];
  });

  router.add("POST", "/members", ({ body }) => [201, store.saveMember(createMember({ ...body, id: store.newId() }))]);
  router.add("GET", "/members/:id/fines", ({ params }) => {
    store.requireMember(params.id);
    const loans = [...store.loans.values()].filter((l) => l.memberId === params.id);
    return [200, { memberId: params.id, totalCents: outstandingFines(loans) }];
  });

  router.add("POST", "/loans", ({ body }) => [201, checkout(store, body)]);
  router.add("POST", "/loans/:id/return", ({ params }) => [200, returnBook(store, { loanId: params.id })]);

  return router;
}

export function createApp(store) {
  const router = buildRouter(store);

  return createServer(async (req, res) => {
    const url = new URL(req.url, "http://localhost");
    const match = router.match(req.method, url.pathname);
    if (!match) return send(res, 404, { error: "route not found" });

    try {
      const body = req.method === "POST" ? await readJson(req) : {};
      const [status, payload] = await match.handler({ params: match.params, query: url.searchParams, body });
      send(res, status, payload);
    } catch (err) {
      const requestId = req.headers["x-request-id"] ?? randomUUID();
      send(res, err.status ?? 500, { error: err.message, requestId });
    }
  });
}
