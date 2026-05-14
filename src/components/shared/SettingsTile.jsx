import TileCard from "./TileCard";
import { tileColors } from "./tileColors";

export default function SettingsTile({ label, children, accent = false, contentStyle }) {
  const colors = tileColors(accent);

  return (
    <TileCard accent={accent} contentStyle={contentStyle}>
      {label ? (
        <p
          style={{ marginBottom: "0.75rem", fontSize: "0.75rem", lineHeight: "1rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.12em", color: colors.label }}
        >
          {label}
        </p>
      ) : null}

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>{children}</div>
    </TileCard>
  );
}
