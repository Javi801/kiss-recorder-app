import {
  AreaChart,
  Area,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { PALETTE } from "@/lib/constants";

/**
 * Renders a reusable area chart card.
 * It is used for time-based distributions or continuous data.
 */
export default function AreaChartCard({
  title,
  subtitle,
  data,
  emptyText,
}) {
  // Shared card style for consistency.
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
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                {/* Grid lines */}
                <CartesianGrid vertical={false} strokeDasharray="3 3" />

                {/* X axis */}
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                />

                {/* Y axis */}
                <YAxis
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                />

                <Tooltip />

                {/* Area */}
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={PALETTE.sky2}
                  fill={PALETTE.sky}
                />
              </AreaChart>
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