import assert from "node:assert/strict";
import { test } from "node:test";

import { addDays, daysBetween, isPast } from "../src/util/dates.js";
import { T0 } from "./helpers.js";

test("addDays moves forward whole days", () => {
  assert.equal(addDays(T0, 14).toISOString(), "2026-01-15T10:00:00.000Z");
});

test("daysBetween rounds down partial days", () => {
  const later = new Date("2026-01-03T09:00:00Z");
  assert.equal(daysBetween(T0, later), 1);
});

test("isPast compares against now", () => {
  assert.equal(isPast(T0, addDays(T0, 1)), true);
  assert.equal(isPast(addDays(T0, 1), T0), false);
});
