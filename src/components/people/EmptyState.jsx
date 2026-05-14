import { Card, CardContent } from "@/components/ui/card";
import { PALETTE } from "@/lib/constants";

/**
 * Renders a reusable empty state block with icon, text, and optional action.
 * It is used when a section has no data to display.
 */
export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}) {
  // Keep card styles grouped so the component stays easy to scan.
  const cardStyle = {
    borderColor: "#f1dde7",
    backgroundColor: "rgba(255,255,255,0.78)",
  };

  // Reuse palette colors for the icon badge.
  const iconWrapperStyle = {
    backgroundColor: PALETTE.blush,
  };

  return (
    <Card style={{ boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)", backdropFilter: "blur(8px)", ...cardStyle }}>
      <CardContent style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "0.75rem", padding: "2rem", textAlign: "center" }}>
        <div className="rounded-2xl" style={{ padding: "0.75rem", ...iconWrapperStyle }}>
          <Icon style={{ height: "1.5rem", width: "1.5rem", color: PALETTE.rose }} />
        </div>

        <div>
          <h3
            style={{ fontSize: "1rem", lineHeight: "1.5rem", fontWeight: "600", color: PALETTE.text }}
          >
            {title}
          </h3>

          <p style={{ marginTop: "0.25rem", fontSize: "0.875rem", lineHeight: "1.25rem", color: PALETTE.textSoft }}>
            {description}
          </p>
        </div>

        {action}
      </CardContent>
    </Card>
  );
}