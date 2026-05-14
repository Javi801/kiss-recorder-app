import { describe, it, expect } from "vitest";
import { COPY, GENDER_COLORS } from "@/lib/constants";
import {
  translateActivity,
  translateGender,
  personHasIncompleteEvent,
  hasScore,
  renderKisses,
  getShortZodiacLabel,
  getColorForCategory,
} from "@/lib/format";

const t = COPY.en;

describe("renderKisses", () => {
  it("returns one 💋 for score 1", () => {
    expect(renderKisses(1, t)).toBe("💋");
  });
  it("returns three 💋 for score 3", () => {
    expect(renderKisses(3, t)).toBe("💋💋💋");
  });
  it("returns five 💋 for max score 5", () => {
    expect(renderKisses(5, t)).toBe("💋💋💋💋💋");
  });
  it("returns noScore text for score 0 (no kisses)", () => {
    expect(renderKisses(0, t)).toBe(t.noScore);
  });
  it("returns noScore text for null", () => {
    expect(renderKisses(null, t)).toBe(t.noScore);
  });
  it("returns noScore text for an invalid score", () => {
    expect(renderKisses(99, t)).toBe(t.noScore);
  });
});
