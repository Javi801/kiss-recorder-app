import {
  BarChart,
  Bar,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PALETTE, CHART_COLORS } from "@/lib/constants";

/**
 * Renders a reusable bar chart card.
 * Supports optional label rotation and custom color mapping.
 */
export default function BarChartCard({
  title,
  subtitle,
  data,
  emptyText,
  rotateXLabels = false,
  customColors = null,
}) {
  // Shared container style for consistency across charts.
  const cardStyle = {
    borderColor: "#f1dde7",
    backgroundColor: "rgba(255,255,255,0.82)",
  };

  // Empty state fallback when no data is available.
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
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                {/* Background grid */}
                <CartesianGrid vertical={false} strokeDasharray="3 3" />

                {/* X axis with optional rotation */}
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  fontSize={11}
                  angle={rotateXLabels ? -24 : 0}
                  textAnchor={rotateXLabels ? "end" : "middle"}
                  height={rotateXLabels ? 62 : 30}
                  interval={0}
                />

                {/* Y axis */}
                <YAxis
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                />

                <Tooltip />

                {/* Bars */}
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {data.map((entry, index) => {
                    // Use custom color if provided, otherwise fallback to palette.
                    const fill =
                      (customColors && customColors[entry.label]) ||
                      CHART_COLORS[index % CHART_COLORS.length];

                    return (
                      <Cell key={`${entry.label}-${index}`} fill={fill} />
                    );
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
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