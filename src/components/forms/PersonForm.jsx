import { useState } from "react";
import { Save } from "lucide-react";

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

import { GENDERS, ZODIAC_OPTIONS, PALETTE } from "@/lib/constants";
import { translateGender } from "@/lib/format";

/**
 * Form used for creating or editing a person.
 * Handles validation and normalization before submit.
 */
export default function PersonForm({
  initialValues,
  onSave,
  onCancel,
  t,
  language,
  includeHowWeMet = true,
  mode = "edit",
  saveLabel,
}) {
  // Local form state initialization.
  const [form, setForm] = useState(
    initialValues || {
      name: "",
      age: "",
      gender: "",
      howWeMet: "",
      zodiacSign: "",
      activity: "",
      detail: "",
    },
  );

  // Validation errors.
  const [errors, setErrors] = useState({});

  /**
   * Update a specific field in the form state.
   */
  function update(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  /**
   * Validate required fields and data types.
   */
  function validate() {
    const next = {};

    if (!form.name.trim()) next.name = t.requiredName;

    if (!String(form.age).trim()) next.age = t.requiredAge;
    else if (!Number.isInteger(Number(form.age)) || Number(form.age) <= 0)
      next.age = t.validAge;

    if (!form.gender) next.gender = t.requiredGender;

    if (includeHowWeMet && !form.howWeMet.trim())
      next.howWeMet = t.requiredHowWeMet;

    if (!form.zodiacSign) next.zodiacSign = t.requiredZodiac;

    if (!form.activity) next.activity = t.requiredActivity;

    setErrors(next);

    return Object.keys(next).length === 0;
  }

  /**
   * Submit handler that normalizes values before sending.
   */
  function submit(e) {
    e.preventDefault();

    if (!validate()) return;

    onSave({
      ...form,
      age: Number(form.age),
      detail: form.detail.trim(),
      howWeMet: includeHowWeMet
        ? form.howWeMet.trim()
        : initialValues?.howWeMet || "",
      name: form.name.trim(),
    });
  }

  // Shared input styling.
  const inputStyle = {
    borderColor: "#ecd6e0",
    backgroundColor: "rgba(255,255,255,0.88)",
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-4">
        {/* Name */}
        <div className="space-y-2">
          <Label>{t.name} *</Label>
          <Input
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            className="rounded-2xl"
            style={inputStyle}
          />
          {errors.name && (
            <p className="text-xs text-red-500">{errors.name}</p>
          )}
        </div>

        {/* Age + Gender */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>{t.age} *</Label>
            <Input
              type="number"
              value={form.age}
              onChange={(e) => update("age", e.target.value)}
              className="rounded-2xl"
              style={inputStyle}
            />
            {errors.age && (
              <p className="text-xs text-red-500">{errors.age}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>{t.gender} *</Label>
            <Select
              value={form.gender}
              onValueChange={(value) => update("gender", value)}
            >
              <SelectTrigger className="rounded-2xl" style={inputStyle}>
                <SelectValue placeholder={t.select} />
              </SelectTrigger>

              <SelectContent>
                {GENDERS.map((item) => (
                  <SelectItem key={item} value={item}>
                    {translateGender(item, t)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {errors.gender && (
              <p className="text-xs text-red-500">{errors.gender}</p>
            )}
          </div>
        </div>

        {/* How we met */}
        {includeHowWeMet && (
          <div className="space-y-2">
            <Label>{t.howWeMet} *</Label>
            <Input
              value={form.howWeMet}
              onChange={(e) => update("howWeMet", e.target.value)}
              className="rounded-2xl"
              style={inputStyle}
            />
            {errors.howWeMet && (
              <p className="text-xs text-red-500">{errors.howWeMet}</p>
            )}
          </div>
        )}

        {/* Zodiac */}
        <div className="space-y-2">
          <Label>{t.zodiacSign} *</Label>
          <Select
            value={form.zodiacSign}
            onValueChange={(value) => update("zodiacSign", value)}
          >
            <SelectTrigger className="rounded-2xl" style={inputStyle}>
              <SelectValue placeholder={t.select} />
            </SelectTrigger>

            <SelectContent>
              {ZODIAC_OPTIONS[language].map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {errors.zodiacSign && (
            <p className="text-xs text-red-500">{errors.zodiacSign}</p>
          )}
        </div>

        {/* Activity */}
        <div className="space-y-2">
          <Label>{t.activity} *</Label>
          <Select
            value={form.activity}
            onValueChange={(value) => update("activity", value)}
          >
            <SelectTrigger className="rounded-2xl" style={inputStyle}>
              <SelectValue placeholder={t.select} />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="studies">{t.studies}</SelectItem>
              <SelectItem value="works">{t.works}</SelectItem>
              <SelectItem value="studies and works">
                {t.studiesWorks}
              </SelectItem>
              <SelectItem value="other">{t.other}</SelectItem>
            </SelectContent>
          </Select>

          {errors.activity && (
            <p className="text-xs text-red-500">{errors.activity}</p>
          )}
        </div>

        {/* Detail */}
        <div className="space-y-2">
          <Label>{t.detail}</Label>
          <Textarea
            value={form.detail}
            onChange={(e) => update("detail", e.target.value)}
            placeholder={mode === "add" ? "" : t.optionalActivityDetails}
            className="rounded-2xl"
            style={inputStyle}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-2">
        <Button
          type="submit"
          className="flex-1 rounded-2xl text-white shadow-sm"
          style={{
            background: `linear-gradient(90deg, ${PALETTE.rose}, ${PALETTE.roseSoft})`,
          }}
        >
          <Save className="mr-2 h-4 w-4" />
          {saveLabel || t.savePerson}
        </Button>

        {onCancel && (
          <Button
            type="button"
            variant="outline"
            className="rounded-2xl"
            style={inputStyle}
            onClick={onCancel}
          >
            {t.cancel}
          </Button>
        )}
      </div>
    </form>
  );
}