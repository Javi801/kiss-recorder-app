import TileCard from "./TileCard";
import { tileColors } from "./tileColors";

export default function StatTile({ label, value, helper, accent = false }) {
  const colors = tileColors(accent);

  return (
    <TileCard accent={accent}>
      <p
        className="text-xs font-semibold uppercase tracking-[0.12em]"
        style={{ color: colors.label }}
      >
        {label}
      </p>

      <p
        className="mt-2 text-3xl font-bold tracking-tight"
        style={{ color: colors.value }}
      >
        {value}
      </p>

      {helper ? (
        <p className="mt-1 text-sm" style={{ color: colors.helper }}>
          {helper}
        </p>
      ) : null}
    </TileCard>
  );
}
