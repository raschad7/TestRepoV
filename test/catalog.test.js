import assert from "node:assert/strict";
import { test } from "node:test";

import { searchBooks } from "../src/services/catalog.js";
import { seededStore } from "./helpers.js";

test("matches title case-insensitively", () => {
  const { store } = seededStore();
  assert.deepEqual(searchBooks(store, "dUnE").map((b) => b.id), ["b1"]);
});

test("matches author", () => {
  const { store } = seededStore();
  assert.deepEqual(searchBooks(store, "austen").map((b) => b.id), ["b2"]);
});

test("blank query returns everything", () => {
  const { store } = seededStore();
  assert.equal(searchBooks(store, "   ").length, 2);
});
