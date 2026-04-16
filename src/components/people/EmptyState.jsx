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
    <Card className="shadow-sm backdrop-blur" style={cardStyle}>
      <CardContent className="flex flex-col items-center justify-center gap-3 p-8 text-center">
        <div className="rounded-2xl p-3" style={iconWrapperStyle}>
          <Icon className="h-6 w-6" style={{ color: PALETTE.rose }} />
        </div>

        <div>
          <h3
            className="text-base font-semibold"
            style={{ color: PALETTE.text }}
          >
            {title}
          </h3>

          <p className="mt-1 text-sm" style={{ color: PALETTE.textSoft }}>
            {description}
          </p>
        </div>

        {action}
      </CardContent>
    </Card>
  );
}