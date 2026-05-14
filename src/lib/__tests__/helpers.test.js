import { describe, it, expect } from "vitest";
import { uid, normalizePeople, hexToRgb } from "@/lib/helpers";

describe("uid", () => {
  it("returns a non-empty alphanumeric string", () => {
    expect(uid()).toMatch(/^[a-z0-9]+$/);
  });
  it("returns a different value on each call", () => {
    expect(uid()).not.toBe(uid());
  });
});
