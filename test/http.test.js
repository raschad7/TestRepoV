import assert from "node:assert/strict";
import { after, before, test } from "node:test";

import { createApp } from "../src/http/server.js";
import { Store } from "../src/store.js";

let server;
let base;

before(async () => {
  server = createApp(new Store());
  await new Promise((resolve) => server.listen(0, resolve));
  base = `http://localhost:${server.address().port}`;
});

after(() => server.close());

const post = (path, body) =>
  fetch(base + path, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });

test("health check", async () => {
  const res = await fetch(`${base}/health`);
  assert.equal(res.status, 200);
});

test("create a book, a member, and borrow it", async () => {
  const book = await (await post("/books", { title: "Dune", author: "Frank Herbert", copies: 1 })).json();
  const member = await (await post("/members", { name: "Ada", email: "ada@example.com" })).json();
  const res = await post("/loans", { bookId: book.id, memberId: member.id });
  assert.equal(res.status, 201);
  const detail = await (await fetch(`${base}/books/${book.id}`)).json();
  assert.equal(detail.available, 0);
});

test("validation errors are 400", async () => {
  const res = await post("/books", { title: "", author: "x" });
  assert.equal(res.status, 400);
});
