import { RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { PALETTE, ZODIAC_OPTIONS } from "@/lib/constants";

/**
 * Renders the filters and organization controls for the people list.
 * It updates external state provided by the parent screen.
 */
export default function FiltersPanel({
  filters,
  setFilters,
  groupBy,
  setGroupBy,
  sortBy,
  setSortBy,
  peopleCount,
  t,
  language,
}) {
  // Reuse the same style across all form controls in the panel.
  const inputStyle = {
    borderColor: "#ecd6e0",
    backgroundColor: "rgba(255,255,255,0.9)",
  };

  return (
    <div className="space-y-5">
      {/* Panel heading */}
      <div>
        <h3 className="text-lg font-semibold" style={{ color: PALETTE.text }}>
          {t.filtersOrg}
        </h3>
        <p className="text-sm" style={{ color: PALETTE.textSoft }}>
          {t.refineResults}
        </p>
      </div>

      {/* Age range */}
      <div className="space-y-2">
        <Label>{t.ageRange}</Label>
        <div className="grid grid-cols-2 gap-3">
          <Input
            type="number"
            placeholder={t.min}
            value={filters.minAge}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, minAge: e.target.value }))
            }
            className="rounded-2xl"
            style={inputStyle}
          />
          <Input
            type="number"
            placeholder={t.max}
            value={filters.maxAge}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, maxAge: e.target.value }))
            }
            className="rounded-2xl"
            style={inputStyle}
          />
        </div>
      </div>

      {/* Activity filter */}
      <div className="space-y-2">
        <Label>{t.activity}</Label>
        <Select
          value={filters.activity}
          onValueChange={(value) =>
            setFilters((prev) => ({
              ...prev,
              activity: value === "all" ? "" : value,
            }))
          }
        >
          <SelectTrigger className="rounded-2xl" style={inputStyle}>
            <SelectValue placeholder={t.allActivities} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t.allActivities}</SelectItem>
            <SelectItem value="studies">{t.studies}</SelectItem>
            <SelectItem value="works">{t.works}</SelectItem>
            <SelectItem value="studies and works">{t.studiesWorks}</SelectItem>
            <SelectItem value="other">{t.other}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Zodiac filter */}
      <div className="space-y-2">
        <Label>{t.zodiacSign}</Label>
        <Select
          value={filters.zodiacSign}
          onValueChange={(value) =>
            setFilters((prev) => ({
              ...prev,
              zodiacSign: value === "all" ? "" : value,
            }))
          }
        >
          <SelectTrigger className="rounded-2xl" style={inputStyle}>
            <SelectValue placeholder={t.allSigns} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t.allSigns}</SelectItem>
            {ZODIAC_OPTIONS[language].map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Grouping mode */}
      <div className="space-y-2">
        <Label>{t.groupBy}</Label>
        <Select value={groupBy} onValueChange={setGroupBy}>
          <SelectTrigger className="rounded-2xl" style={inputStyle}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">{t.groupName}</SelectItem>
            <SelectItem value="lastEventDate">{t.groupLastEvent}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Sorting mode */}
      <div className="space-y-2">
        <Label>{t.sortBy}</Label>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="rounded-2xl" style={inputStyle}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">{t.sortName}</SelectItem>
            <SelectItem value="firstEventDate">{t.sortFirst}</SelectItem>
            <SelectItem value="lastEventDate">{t.sortLast}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Reset action */}
      <Button
        variant="outline"
        className="w-full rounded-2xl"
        style={inputStyle}
        onClick={() => {
          setFilters({
            minAge: "",
            maxAge: "",
            activity: "",
            zodiacSign: "",
          });
          setGroupBy("name");
          setSortBy("name");
        }}
      >
        <RotateCcw className="mr-2 h-4 w-4" />
        {t.resetFilters}
      </Button>

      {/* Results count */}
      <p className="text-xs" style={{ color: PALETTE.textSoft }}>
        {t.showingResults} {peopleCount}{" "}
        {peopleCount === 1 ? t.result : t.results}.
      </p>
    </div>
  );
}