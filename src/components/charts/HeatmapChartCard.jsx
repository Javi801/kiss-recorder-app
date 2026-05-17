import { useRef, useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TEXT } from "@/lib/constants";
import { usePalette } from "@/lib/theme";

const MARGIN_TOP = 40;
const MARGIN_RIGHT = 8;
const MARGIN_BOTTOM = 8;
const APPROX_CHAR_PX = 6;
const NAMES_W = 80;
const MAX_NAME_CHARS = Math.floor((NAMES_W - 14) / APPROX_CHAR_PX);
const MIN_COL_W = 36;
const ROW_H = 36;
const GAP = 3;
const MAX_VISIBLE_ROWS = 10;

function cellColor(count, maxCount, cardSoft, heatmapRgb, alphaBase = 0.15, exponent = 1) {
  if (!count || !maxCount) return cardSoft;
  const t = count / maxCount;
  const alpha = alphaBase + Math.pow(t, exponent) * (1 - alphaBase);
  return `rgba(${heatmapRgb}, ${alpha})`;
}

export default function HeatmapChartCard({ title, subtitle, data, allYears, emptyText }) {
  const PALETTE = usePalette();
  const containerRef = useRef(null);
  const scrollRef = useRef(null);
  const scrolledRef = useRef(false);
  const [containerWidth, setContainerWidth] = useState(300);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setContainerWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Scroll to the rightmost (most recent) data once the container is sized.
  useEffect(() => {
    if (scrolledRef.current) return;
    const el = scrollRef.current;
    if (!el || el.scrollWidth <= el.clientWidth) return;
    el.scrollLeft = el.scrollWidth;
    scrolledRef.current = true;
  }, [containerWidth]);

  const marginLeft = NAMES_W;

  const numYears = allYears.length;
  const availableW = Math.max(containerWidth - marginLeft, 0);
  const dataW = numYears > 0 ? Math.max(availableW, numYears * MIN_COL_W) : availableW;
  const colW = numYears > 0 ? dataW / numYears : 0;

  const chartH = data.length * ROW_H;
  // Cap visible rows so vertical scroll activates inside the card instead of the page.
  const maxHeight = MARGIN_TOP + Math.min(data.length, MAX_VISIBLE_ROWS) * ROW_H + MARGIN_BOTTOM;

  const maxCount = useMemo(() => {
    let max = 0;
    for (const person of data) {
      for (const count of Object.values(person.yearCounts)) {
        if (count > max) max = count;
      }
    }
    return max;
  }, [data]);

  const cardStyle = { borderColor: PALETTE.cardBorder, backgroundColor: PALETTE.cardBg };
  const emptyStyle = { borderColor: PALETTE.inputBorder, color: PALETTE.textSoft };

  const totalW = marginLeft + dataW + MARGIN_RIGHT;
  const totalH = MARGIN_TOP + chartH + MARGIN_BOTTOM;

  return (
    <Card
      className="rounded-3xl"
      style={{ overflow: "hidden", boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)", backdropFilter: "blur(8px)", ...cardStyle }}
    >
      <CardHeader style={{ paddingBottom: "0.5rem" }}>
        <CardTitle style={{ ...TEXT.title, color: PALETTE.text }}>{title}</CardTitle>
        <CardDescription style={{ color: PALETTE.textSoft }}>{subtitle}</CardDescription>
      </CardHeader>

      <CardContent>
        {data.length && allYears.length ? (
          <div ref={containerRef}>
            {/*
              Single scroll container for both axes.
              Year labels (sticky top) and name labels (sticky left) are CSS-sticky
              within this container, so they stay visible while scrolling the chart
              without floating over the rest of the page.
            */}
            <div
              ref={scrollRef}
              style={{
                overflow: "auto",
                maxHeight,
                WebkitOverflowScrolling: "touch",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: `${marginLeft}px ${dataW + MARGIN_RIGHT}px`,
                  gridTemplateRows: `${MARGIN_TOP}px ${chartH + MARGIN_BOTTOM}px`,
                  width: totalW,
                  height: totalH,
                }}
              >
                {/* Top-left corner: sticky in both directions */}
                <div
                  style={{
                    position: "sticky",
                    top: 0,
                    left: 0,
                    zIndex: 3,
                    backgroundColor: PALETTE.cardSoft,
                  }}
                />

                {/* Year labels row: sticky to top, scrolls horizontally with data */}
                <div
                  style={{
                    position: "sticky",
                    top: 0,
                    zIndex: 2,
                    backgroundColor: PALETTE.cardSoft,
                  }}
                >
                  <svg
                    width={dataW + MARGIN_RIGHT}
                    height={MARGIN_TOP}
                    aria-hidden="true"
                    style={{ display: "block" }}
                  >
                    {allYears.map((year, j) => {
                      const cx = j * colW + colW / 2;
                      const cy = MARGIN_TOP - 6;
                      return (
                        <text
                          key={year}
                          x={cx}
                          y={cy}
                          textAnchor="end"
                          fontSize={11}
                          fill={PALETTE.textSoft}
                          transform={`rotate(45, ${cx}, ${cy})`}
                        >
                          {year}
                        </text>
                      );
                    })}
                  </svg>
                </div>

                {/* Person name labels: sticky to left, scrolls vertically with rows */}
                <div
                  style={{
                    position: "sticky",
                    left: 0,
                    zIndex: 1,
                    backgroundColor: PALETTE.cardSoft,
                  }}
                >
                  <svg
                    width={marginLeft}
                    height={chartH + MARGIN_BOTTOM}
                    aria-hidden="true"
                    style={{ display: "block" }}
                  >
                    {data.map((person, i) => {
                      const label = person.label.length > MAX_NAME_CHARS
                        ? person.label.slice(0, MAX_NAME_CHARS - 1) + "…"
                        : person.label;
                      return (
                        <text
                          key={person.label}
                          x={marginLeft - 8}
                          y={i * ROW_H + ROW_H / 2 + 4}
                          textAnchor="end"
                          fontSize={12}
                          fill={PALETTE.text}
                        >
                          {label}
                        </text>
                      );
                    })}
                  </svg>
                </div>

                {/* Data cells */}
                <svg
                  width={dataW + MARGIN_RIGHT}
                  height={chartH + MARGIN_BOTTOM}
                  aria-hidden="true"
                  style={{ display: "block" }}
                >
                  {data.map((person, i) => {
                    const rowY = i * ROW_H;
                    return (
                      <g key={person.label}>
                        {allYears.map((year, j) => {
                          const count = person.yearCounts[year] || 0;
                          const cellX = j * colW + GAP / 2;
                          const cellW = colW - GAP;
                          const cellH = ROW_H - GAP;
                          const useDarkText = maxCount > 0 && count / maxCount > 0.55;

                          return (
                            <g key={year}>
                              <rect
                                x={cellX}
                                y={rowY + GAP / 2}
                                width={cellW}
                                height={cellH}
                                rx={4}
                                fill={cellColor(
                                  count,
                                  maxCount,
                                  PALETTE.cardSoft,
                                  PALETTE.chartHeatmapRgb ?? "226, 115, 150",
                                  PALETTE.chartHeatmapAlphaBase,
                                  PALETTE.chartHeatmapExponent,
                                )}
                              />
                              {count > 0 && cellW > 20 && (
                                <text
                                  x={cellX + cellW / 2}
                                  y={rowY + ROW_H / 2 + 4}
                                  textAnchor="middle"
                                  fontSize={11}
                                  fontWeight="600"
                                  fill={useDarkText ? "white" : PALETTE.accent}
                                >
                                  {count}
                                </text>
                              )}
                            </g>
                          );
                        })}
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>
          </div>
        ) : (
          <div
            className="rounded-2xl"
            style={{
              border: "1px dashed",
              padding: "2rem",
              textAlign: "center",
              ...TEXT.body,
              ...emptyStyle,
            }}
          >
            {emptyText}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
