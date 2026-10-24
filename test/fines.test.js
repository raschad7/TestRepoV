import assert from "node:assert/strict";
import { test } from "node:test";

import { fineFor } from "../src/services/fines.js";
import { addDays } from "../src/util/dates.js";
import { T0 } from "./helpers.js";

const loan = (returnedAt) => ({ dueAt: T0, returnedAt });

test("no fine when returned on the due date", () => {
  assert.equal(fineFor(loan(T0)), 0);
});

test("25 cents per whole day late", () => {
  assert.equal(fineFor(loan(addDays(T0, 3))), 75);
});

test("fine is capped", () => {
  assert.equal(fineFor(loan(addDays(T0, 365))), 1000);
});

test("staff pay half", () => {
  assert.equal(fineFor(loan(addDays(T0, 3)), T0, { tier: "staff" }), 37.5);
});
