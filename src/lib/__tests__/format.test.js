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
