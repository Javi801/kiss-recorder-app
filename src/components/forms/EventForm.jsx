import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { PALETTE, SCORE_OPTIONS } from "@/lib/constants";
import { todayString, isValidDateString } from "@/lib/date";
import { hasScore, renderKisses } from "@/lib/format";

/**
 * Form used to create or edit an event.
 * Handles validation and normalization of date and score.
 */
export default function EventForm({ initialValues, onSave, onCancel, t }) {
  // Initialize form state with defaults or existing values.
  const [date, setDate] = useState(
    initialValues?.date || todayString(),
  );
  const [details, setDetails] = useState(
    initialValues?.details || "",
  );
  const [score, setScore] = useState(
    hasScore(initialValues?.score)
      ? String(initialValues.score)
      : "none",
  );

  // Validation error state.
  const [error, setError] = useState("");

  /**
   * Validate and submit event data.
   */
  function submit(e) {
    e.preventDefault();

    // Validate date format.
    if (!isValidDateString(date)) {
      setError(t.validDateMsg);
      return;
    }

    setError("");

    // Normalize values before sending.
    onSave({
      date,
      details: details.trim(),
      score: score === "none" ? null : Number(score),
    });
  }

  // Shared input styling.
  const inputStyle = {
    borderColor: "#ecd6e0",
    backgroundColor: "rgba(255,255,255,0.88)",
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      {/* Date */}
      <div className="space-y-2">
        <Label>{t.eventDate} *</Label>
        <Input
          value={date}
          onChange={(e) => setDate(e.target.value)}
          placeholder="2026.03.08"
          className="rounded-2xl"
          style={inputStyle}
        />

        {/* Helper text */}
        <p className="text-xs" style={{ color: PALETTE.textSoft }}>
          {t.dateFormatHelper}
        </p>

        {/* Error message */}
        {error && (
          <p className="text-xs text-red-500">{error}</p>
        )}
      </div>

      {/* Score */}
      <div className="space-y-2">
        <Label>{t.eventScore}</Label>
        <Select value={score} onValueChange={setScore}>
          <SelectTrigger className="rounded-2xl" style={inputStyle}>
            <SelectValue placeholder={t.none} />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="none">{t.none}</SelectItem>

            {SCORE_OPTIONS.map((value) => (
              <SelectItem key={value} value={String(value)}>
                {renderKisses(value, t)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Details */}
      <div className="space-y-2">
        <Label>{t.eventDetails}</Label>
        <Textarea
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder={t.eventDetailsPlaceholder}
          className="rounded-2xl"
          style={inputStyle}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          type="submit"
          className="flex-1 rounded-2xl text-white shadow-sm"
          style={{
            background: `linear-gradient(90deg, ${PALETTE.rose}, ${PALETTE.roseSoft})`,
          }}
        >
          {t.saveEvent}
        </Button>

        <Button
          type="button"
          variant="outline"
          className="rounded-2xl"
          style={inputStyle}
          onClick={onCancel}
        >
          {t.cancel}
        </Button>
      </div>
    </form>
  );
}