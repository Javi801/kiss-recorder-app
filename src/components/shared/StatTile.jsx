import { Card, CardContent } from "@/components/ui/card";
import { PALETTE } from "@/lib/constants";

/**
 * Renders a compact metric card with optional accent styling.
 * It is used for summary numbers across the app.
 */
export default function StatTile({ label, value, helper, accent = false }) {
  // Switch colors depending on whether the tile is highlighted.
  const borderColor = accent ? "rgba(255,255,255,0.25)" : "#f1dde7";
  const background = accent
    ? "rgba(255,255,255,0.22)"
    : "rgba(255,255,255,0.92)";
  const labelColor = accent ? "rgba(255,255,255,0.88)" : PALETTE.textSoft;
  const valueColor = accent ? "#ffffff" : PALETTE.text;
  const helperColor = accent ? "rgba(255,255,255,0.82)" : PALETTE.textSoft;

  return (
    <Card
      className="rounded-3xl shadow-sm"
      style={{
        borderColor,
        background,
        backdropFilter: "blur(8px)",
      }}
    >
      <CardContent className="p-5">
        <p
          className="text-xs font-semibold uppercase tracking-[0.12em]"
          style={{ color: labelColor }}
        >
          {label}
        </p>

        <p
          className="mt-2 text-3xl font-bold tracking-tight"
          style={{ color: valueColor }}
        >
          {value}
        </p>

        {helper ? (
          <p className="mt-1 text-sm" style={{ color: helperColor }}>
            {helper}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}