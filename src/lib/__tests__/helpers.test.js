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

describe("hexToRgb", () => {
  it("converts #ffffff to white", () => {
    expect(hexToRgb("#ffffff")).toEqual({ r: 255, g: 255, b: 255 });
  });
  it("converts #000000 to black", () => {
    expect(hexToRgb("#000000")).toEqual({ r: 0, g: 0, b: 0 });
  });
  it("converts a mixed hex color correctly", () => {
    expect(hexToRgb("#e27396")).toEqual({ r: 226, g: 115, b: 150 });
  });
  it("accepts hex without # prefix", () => {
    expect(hexToRgb("ffffff")).toEqual({ r: 255, g: 255, b: 255 });
  });
});
