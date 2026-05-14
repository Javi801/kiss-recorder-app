// Parses "yyyy.MM.dd" → { year, month, day } or null if the string is invalid
// or represents an impossible date (e.g. Feb 30).
export function parseCalendarDate(str) {
  if (!str || !/^\d{4}\.\d{2}\.\d{2}$/.test(str)) return null;
  const [y, m, d] = str.split(".").map(Number);
  const dt = new Date(y, m - 1, d);
  if (dt.getFullYear() !== y || dt.getMonth() !== m - 1 || dt.getDate() !== d) return null;
  return { year: y, month: m, day: d };
}

// Formats { year, month, day } components back to the "yyyy.MM.dd" app format.
export function toCalendarDate(year, month, day) {
  return `${year}.${String(month).padStart(2, "0")}.${String(day).padStart(2, "0")}`;
}

// Builds the cell array for a month calendar with Monday as the first column.
// Cells are either a day number (1-based) or null for empty leading/trailing slots.
// The array length is always a multiple of 7.
export function buildDayGrid(year, month) {
  const totalDays = new Date(year, month, 0).getDate();
  const rawFirst = new Date(year, month - 1, 1).getDay(); // 0 = Sun
  const startOffset = (rawFirst + 6) % 7; // convert to Mon = 0

  const cells = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ];

  while (cells.length % 7 !== 0) cells.push(null);

  return cells;
}

// Returns the next calendar view in the cycle: days → months → years → days.
export function nextCalView(view) {
  if (view === "days") return "months";
  if (view === "months") return "years";
  return "days";
}
