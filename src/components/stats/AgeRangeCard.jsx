import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PALETTE } from "@/lib/constants";
import AgeRangeBox from "@/components/stats/AgeRangeBox";
import { getYearKey } from "@/lib/date";

/**
 * Displays age distribution with optional split by year.
 * It groups people based on event years when enabled.
 */
export default function AgeRangeCard({ title, people, emptyText, t }) {
  // Toggle between combined view and per-year view.
  const [splitByYear, setSplitByYear] = useState(false);

  /**
   * Build grouped data by year.
   * Each year contains a unique list of people.
   */
  const yearsData = useMemo(() => {
    const yearsMap = new Map();

    for (const person of people) {
      // Extract unique years from person's events.
      const years = [
        ...new Set(
          (person.events || [])
            .map((event) => getYearKey(event.date))
            .filter(Boolean),
        ),
      ];

      // Assign person to each year they appear in.
      for (const year of years) {
        if (!yearsMap.has(year)) yearsMap.set(year, []);
        yearsMap.get(year).push(person);
      }
    }

    // Convert map to sorted array and remove duplicate persons per year.
    return [...yearsMap.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([year, yearPeople]) => ({
        year,
        people: Array.from(
          new Map(yearPeople.map((p) => [p.id, p])).values(),
        ),
      }));
  }, [people]);

  return (
    <Card
      className="rounded-3xl shadow-sm backdrop-blur"
      style={{
        borderColor: "#f1dde7",
        backgroundColor: "rgba(255,255,255,0.82)",
      }}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-base">{title}</CardTitle>
            <CardDescription>
              {splitByYear ? t.divideByYear : t.allYears}
            </CardDescription>
          </div>

          {/* Toggle view mode */}
          <Button
            type="button"
            variant="outline"
            className="rounded-2xl bg-white/70"
            style={{ borderColor: "#ecd6e0" }}
            onClick={() => setSplitByYear((prev) => !prev)}
          >
            {splitByYear ? t.showAllTogether : t.divideByYear}
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {!splitByYear ? (
          // Single combined view.
          <AgeRangeBox
            title={title}
            subtitle={t.allYears}
            people={people}
            emptyText={emptyText}
          />
        ) : yearsData.length ? (
          // Per-year breakdown.
          <div className="space-y-4">
            {yearsData.map((item) => (
              <AgeRangeBox
                key={item.year}
                title={item.year}
                subtitle={`${item.people.length} ${
                  item.people.length === 1 ? t.result : t.results
                }`}
                people={item.people}
                emptyText={emptyText}
              />
            ))}
          </div>
        ) : (
          // Empty fallback.
          <div
            className="rounded-2xl border border-dashed p-8 text-center text-sm"
            style={{ borderColor: "#ecd6e0", color: PALETTE.textSoft }}
          >
            {emptyText}
          </div>
        )}
      </CardContent>
    </Card>
  );
}