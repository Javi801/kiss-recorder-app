import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TEXT } from "@/lib/constants";
import { usePalette } from "@/lib/theme";

const GRANS = ["week", "month", "year"];

function dateToKey(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function TooltipContent({ active, payload, label, tooltipUnit }) {
  const P = usePalette();
  if (!active || !payload?.length) return null;
  const v = payload[0].value;
  const unit = v === 1 ? tooltipUnit.one : tooltipUnit.many;
  return (
    <div
      style={{
        background: P.cardBg,
        border: `1px solid ${P.cardBorder}`,
        color: P.text,
        borderRadius: "0.5rem",
        padding: "0.5rem 0.75rem",
        fontSize: 13,
      }}
    >
      {label && (
        <p style={{ marginBottom: "0.2rem", fontWeight: 500 }}>{label}</p>
      )}
      <p>
        {v} {unit}
      </p>
    </div>
  );
}

export default function EventsTimelineChartCard({ allEvents, t }) {
  const P = usePalette();
  const [gran, setGran] = useState("week");
  const [offset, setOffset] = useState(0);

  const locale = t.langCode === "es" ? "es-ES" : "en-GB";

  const countByDate = useMemo(() => {
    const map = new Map();
    for (const ev of allEvents) {
      if (ev.date) map.set(ev.date, (map.get(ev.date) || 0) + 1);
    }
    return map;
  }, [allEvents]);

  const { data, title, avg, canNext } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (gran === "week") {
      const dow = today.getDay();
      const toMon = dow === 0 ? 6 : dow - 1;
      const mon = new Date(today);
      mon.setDate(today.getDate() - toMon + offset * 7);

      const items = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(mon);
        d.setDate(mon.getDate() + i);
        const raw = new Intl.DateTimeFormat(locale, { weekday: "short" })
          .format(d)
          .replace(/\.$/, "");
        return { label: capitalize(raw), value: countByDate.get(dateToKey(d)) || 0 };
      });

      const sun = new Date(mon);
      sun.setDate(mon.getDate() + 6);
      const fmt = (d, opts) => new Intl.DateTimeFormat(locale, opts).format(d);
      const ttl = `${fmt(mon, { day: "numeric", month: "short" })} – ${fmt(sun, { day: "numeric", month: "short", year: "numeric" })}`;

      const total = items.reduce((s, d) => s + d.value, 0);
      return { data: items, title: ttl, avg: total / 7, canNext: offset < 0 };
    }

    if (gran === "month") {
      const ref = new Date(today.getFullYear(), today.getMonth() + offset, 1);
      const yr = ref.getFullYear();
      const mo = ref.getMonth();
      const mm = String(mo + 1).padStart(2, "0");
      const dim = new Date(yr, mo + 1, 0).getDate();

      // 4 evenly spaced label indices
      const lblSet = new Set([
        0,
        Math.round(dim / 3) - 1,
        Math.round((2 * dim) / 3) - 1,
        dim - 1,
      ]);

      const items = Array.from({ length: dim }, (_, i) => {
        const day = i + 1;
        const key = `${yr}.${mm}.${String(day).padStart(2, "0")}`;
        const lbl = lblSet.has(i) ? `${String(day).padStart(2, "0")}-${mm}` : "";
        return { label: lbl, value: countByDate.get(key) || 0 };
      });

      const raw = new Intl.DateTimeFormat(locale, {
        month: "long",
        year: "numeric",
      }).format(ref);

      const total = items.reduce((s, d) => s + d.value, 0);
      return { data: items, title: capitalize(raw), avg: total / dim, canNext: offset < 0 };
    }

    if (gran === "year") {
      const yr = today.getFullYear() + offset;
      const items = Array.from({ length: 12 }, (_, i) => {
        const mo = i + 1;
        const prefix = `${yr}.${String(mo).padStart(2, "0")}.`;
        let value = 0;
        for (const [k, c] of countByDate) {
          if (k.startsWith(prefix)) value += c;
        }
        return { label: String(mo), value };
      });
      const total = items.reduce((s, d) => s + d.value, 0);
      return { data: items, title: String(yr), avg: total / 12, canNext: offset < 0 };
    }

    return { data: [], title: "", avg: 0, canNext: false };
  }, [gran, offset, locale, countByDate]);

  const granLabels = { week: t.granWeek, month: t.granMonth, year: t.granYear };
  const tooltipUnit = { one: t.chartEvent, many: t.chartEvents };

  const navBtn = (enabled) => ({
    background: "none",
    border: "none",
    cursor: enabled ? "pointer" : "default",
    color: enabled ? P.textSoft : "transparent",
    padding: "0.25rem",
    display: "flex",
    alignItems: "center",
    borderRadius: "0.5rem",
    flexShrink: 0,
  });

  return (
    <Card
      className="rounded-3xl"
      style={{
        boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        backdropFilter: "blur(8px)",
        borderColor: P.cardBorder,
        backgroundColor: P.cardBg,
      }}
    >
      <CardHeader style={{ paddingBottom: "0.25rem" }}>
        <CardTitle style={{ ...TEXT.title, color: P.text }}>
          {t.timelineTitle}
        </CardTitle>

        {/* Granularity selector */}
        <div
          style={{
            display: "flex",
            gap: "0.25rem",
            padding: "0.25rem",
            background: P.accentMuted,
            borderRadius: "0.875rem",
          }}
        >
          {GRANS.map((g) => (
            <button
              key={g}
              onClick={() => {
                setGran(g);
                setOffset(0);
              }}
              style={{
                flex: 1,
                padding: "0.3rem 0",
                borderRadius: "0.625rem",
                border: "none",
                fontSize: "0.75rem",
                fontWeight: gran === g ? 600 : 400,
                background:
                  gran === g
                    ? `linear-gradient(90deg, ${P.accent}, ${P.accentSoft})`
                    : "transparent",
                color: gran === g ? "white" : P.textSoft,
                cursor: "pointer",
                transition: "all 150ms",
              }}
            >
              {granLabels[g]}
            </button>
          ))}
        </div>

        {/* Navigation arrows + period title */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "0.5rem",
            gap: "0.5rem",
          }}
        >
          <button onClick={() => setOffset((o) => o - 1)} style={navBtn(true)}>
            <ChevronLeft size={18} />
          </button>
          <span
            style={{
              ...TEXT.body,
              color: P.text,
              fontWeight: 500,
              textAlign: "center",
              flex: 1,
            }}
          >
            {title}
          </span>
          <button
            onClick={() => setOffset((o) => o + 1)}
            disabled={!canNext}
            style={navBtn(canNext)}
          >
            <ChevronRight size={18} />
          </button>
        </div>

        <p style={{ ...TEXT.body, color: P.textSoft, textAlign: "center", marginTop: "0.25rem" }}>
          {avg % 1 === 0 ? avg : avg.toFixed(1)}{" "}
          {avg === 1 ? t.chartEvent : t.chartEvents}{" "}
          {t.timelineAvg}
        </p>
      </CardHeader>

      <CardContent>
        <div style={{ height: "15rem", width: "100%" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid
                vertical={false}
                strokeDasharray="3 3"
                stroke={P.cardBorder}
              />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                fontSize={11}
                tick={{ fill: P.textSoft }}
                interval={0}
                padding={{ left: 10, right: 10 }}
              />
              <YAxis hide width={0} />
              <Tooltip
                cursor={{ fill: P.accentShadow }}
                content={<TooltipContent tooltipUnit={tooltipUnit} />}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} fill={P.accent} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
