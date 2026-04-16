import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PALETTE } from "@/lib/constants";

/**
 * Displays a boxplot-like visualization for age distribution.
 * It shows min, Q1, median, Q3, and max values.
 */
export default function AgeRangeBox({ title, subtitle, people, emptyText }) {
  // Extract valid numeric ages and sort them.
  const ages = people
    .map((p) => p.age)
    .filter((age) => Number.isFinite(age))
    .sort((a, b) => a - b);

  // Handle empty state when no valid ages exist.
  if (!ages.length) {
    return (
      <Card
        className="rounded-3xl shadow-none"
        style={{ borderColor: "#efdee6", backgroundColor: "#fff7fb" }}
      >
        <CardHeader className="pb-2">
          <CardTitle className="text-base">{title}</CardTitle>
          {subtitle ? <CardDescription>{subtitle}</CardDescription> : null}
        </CardHeader>

        <CardContent>
          <div
            className="rounded-2xl border border-dashed p-6 text-center text-sm"
            style={{ borderColor: "#ecd6e0", color: PALETTE.textSoft }}
          >
            {emptyText}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Compute statistical values.
  const min = ages[0];
  const max = ages[ages.length - 1];
  const q1 = ages[Math.floor((ages.length - 1) * 0.25)];
  const median = ages[Math.floor((ages.length - 1) * 0.5)];
  const q3 = ages[Math.floor((ages.length - 1) * 0.75)];

  // Normalize positions for rendering.
  const scale = max - min || 1;
  const left = ((q1 - min) / scale) * 100;
  const width = ((q3 - q1) / scale) * 100;
  const medianPos = ((median - min) / scale) * 100;

  return (
    <Card
      className="rounded-3xl shadow-none"
      style={{ borderColor: "#efdee6", backgroundColor: "#fff7fb" }}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription>{subtitle || `${min} - ${max}`}</CardDescription>
      </CardHeader>

      <CardContent>
        <div
          className="rounded-3xl p-5"
          style={{ backgroundColor: "rgba(255,255,255,0.78)" }}
        >
          {/* Labels row */}
          <div
            className="mb-4 flex justify-between text-sm font-medium"
            style={{ color: PALETTE.deep }}
          >
            <span>{min}</span>
            <span>{q1}</span>
            <span>{median}</span>
            <span>{q3}</span>
            <span>{max}</span>
          </div>

          {/* Boxplot visualization */}
          <div className="relative h-14">
            {/* Base line */}
            <div
              className="absolute left-0 right-0 top-1/2 h-0.5 -translate-y-1/2"
              style={{ backgroundColor: "#e7d5de" }}
            />

            {/* Min marker */}
            <div
              className="absolute top-1/2 h-8 w-0.5 -translate-y-1/2"
              style={{ left: "0%", backgroundColor: PALETTE.rose }}
            />

            {/* Max marker */}
            <div
              className="absolute top-1/2 h-8 w-0.5 -translate-y-1/2"
              style={{ left: "100%", backgroundColor: PALETTE.rose }}
            />

            {/* IQR box */}
            <div
              className="absolute top-1/2 h-8 -translate-y-1/2 rounded-sm border-2"
              style={{
                left: `${left}%`,
                width: `${Math.max(width, 2)}%`,
                borderColor: PALETTE.rose,
                backgroundColor: PALETTE.roseSoft,
              }}
            />

            {/* Median line */}
            <div
              className="absolute top-1/2 h-10 w-0.5 -translate-y-1/2"
              style={{ left: `${medianPos}%`, backgroundColor: PALETTE.deep }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}