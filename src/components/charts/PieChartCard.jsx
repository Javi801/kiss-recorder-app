import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { PALETTE, CHART_COLORS } from "@/lib/constants";
import { getColorForCategory } from "@/lib/format";

/**
 * Renders a reusable pie chart with legend.
 * It supports automatic color assignment and category-based colors.
 */
export default function PieChartCard({
  title,
  subtitle,
  data,
  emptyText,
}) {
  // Resolve colors for each slice.
  const fills = data.map(
    (entry, index) =>
      getColorForCategory(entry.label) ||
      CHART_COLORS[index % CHART_COLORS.length],
  );

  // Shared card styling.
  const cardStyle = {
    borderColor: "#f1dde7",
    backgroundColor: "rgba(255,255,255,0.82)",
  };

  // Empty state styling.
  const emptyStyle = {
    borderColor: "#ecd6e0",
    color: PALETTE.textSoft,
  };

  return (
    <Card className="rounded-3xl shadow-sm backdrop-blur" style={cardStyle}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base" style={{ color: PALETTE.text }}>
          {title}
        </CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>

      <CardContent>
        {data.length ? (
          <div className="space-y-3 overflow-hidden">
            {/* Chart */}
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="value"
                    nameKey="label"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                  >
                    {data.map((entry, index) => (
                      <Cell key={entry.label} fill={fills[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-2 overflow-hidden">
              {data.map((entry, index) => (
                <div
                  key={entry.label}
                  className="max-w-full truncate rounded-full px-3 py-1 text-xs"
                  style={{
                    backgroundColor: "#f8f4f7",
                    color: PALETTE.textSoft,
                  }}
                >
                  <span className="inline-flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: fills[index] }}
                    />
                    <span className="truncate">
                      {entry.label}: {entry.value}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div
            className="rounded-2xl border border-dashed p-8 text-center text-sm"
            style={emptyStyle}
          >
            {emptyText}
          </div>
        )}
      </CardContent>
    </Card>
  );
}