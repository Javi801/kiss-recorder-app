const ZODIAC_MONTH_NAMES = {
  january: 1, february: 2, march: 3, april: 4, may: 5, june: 6,
  july: 7, august: 8, september: 9, october: 10, november: 11, december: 12,
  enero: 1, febrero: 2, marzo: 3, abril: 4, mayo: 5, junio: 6,
  julio: 7, agosto: 8, septiembre: 9, octubre: 10, noviembre: 11, diciembre: 12,
};

// Parses {month, day} from either the start or end portion of a zodiac sign string.
// pos="start" → before the "-", pos="end" → after the "-" (default).
function parseZodiacDate(zodiacSign, pos = "end") {
  if (!zodiacSign) return null;
  const inner = zodiacSign.match(/\((.+?)\)/)?.[1];
  if (!inner) return null;
  const parts = inner.split("-");
  if (parts.length < 2) return null;
  const raw = (pos === "start" ? parts[0] : parts[parts.length - 1]).trim();

  const enMatch = raw.match(/^([A-Za-z]+)\s+(\d+)$/);
  if (enMatch) {
    const month = ZODIAC_MONTH_NAMES[enMatch[1].toLowerCase()];
    const day = parseInt(enMatch[2]);
    if (month && day) return { month, day };
  }

  const esMatch = raw.match(/^(\d+)\s+([A-Za-záéíóúüñ]+)$/i);
  if (esMatch) {
    const month = ZODIAC_MONTH_NAMES[esMatch[2].toLowerCase()];
    const day = parseInt(esMatch[1]);
    if (month && day) return { month, day };
  }

  return null;
}

// Parses {month, day} from the end portion of a zodiac sign string.
// Handles EN ("April 19") and ES ("19 abril") formats.
export function getZodiacEndDate(zodiacSign) {
  return parseZodiacDate(zodiacSign, "end");
}

export function getZodiacStartDate(zodiacSign) {
  return parseZodiacDate(zodiacSign, "start");
}

// Returns true if today falls within the zodiac sign's active period.
// Handles Capricorn (Dec 22 – Jan 19) which spans two calendar years.
export function isWithinZodiacPeriod(zodiacSign) {
  const startDate = getZodiacStartDate(zodiacSign);
  const endDate = getZodiacEndDate(zodiacSign);
  if (!startDate || !endDate) return false;
  const today = new Date();
  const y = today.getFullYear();
  const startThisYear = new Date(y, startDate.month - 1, startDate.day);
  const endThisYear   = new Date(y, endDate.month   - 1, endDate.day);
  // Year-spanning sign (e.g. Capricorn Dec 22 – Jan 19)
  if (startDate.month > endDate.month) {
    return today >= startThisYear || today <= endThisYear;
  }
  return today >= startThisYear && today <= endThisYear;
}

// Calculates dynamic age: increments when the zodiac sign period ends each year.
export function calculateAge(birthYear, zodiacSign) {
  if (!birthYear || !zodiacSign) return null;
  const endDate = getZodiacEndDate(zodiacSign);
  if (!endDate) return null;
  const today = new Date();
  const currentYear = today.getFullYear();
  const endThisYear = new Date(currentYear, endDate.month - 1, endDate.day);
  return today >= endThisYear ? currentYear - birthYear : currentYear - birthYear - 1;
}

// Derives birth year from a known current age and zodiac sign.
// `birthdayAlreadyHappened` resolves the edge case when today falls inside
// the zodiac period: true means the user's calendar birthday has already
// occurred this year (so the zodiac end is still ahead for them), which maps
// their entered age to the upcoming zodiac turn → birthYear = currentYear - age.
// When false (default) the entered age is their current zodiac age →
// birthYear = currentYear - age - 1 (while before the zodiac end).
export function deriveBirthYear(age, zodiacSign, birthdayAlreadyHappened = false) {
  const endDate = getZodiacEndDate(zodiacSign);
  const today = new Date();
  const currentYear = today.getFullYear();
  if (!endDate) return currentYear - age;
  const endThisYear = new Date(currentYear, endDate.month - 1, endDate.day);
  const birthdayPassed = today >= endThisYear || birthdayAlreadyHappened;
  return birthdayPassed ? currentYear - age : currentYear - age - 1;
}

// Returns true if the date string (yyyy.MM.dd) is strictly after today
export function isFutureDate(value) {
  if (!isValidDateString(value)) return false;
  return value > todayString();
}

// Validates date string format yyyy.MM.dd and checks if it is a real date
export function isValidDateString(value) {
  if (!/^\d{4}\.\d{2}\.\d{2}$/.test(value)) return false;

  const [y, m, d] = value.split(".").map(Number);
  const date = new Date(y, m - 1, d);

  return (
    date.getFullYear() === y &&
    date.getMonth() === m - 1 &&
    date.getDate() === d
  );
}

// Returns today's date formatted as yyyy.MM.dd
export function todayString() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  
  return `${y}.${m}.${day}`;
}

// Converts yyyy.MM.dd to dd/MM/yyyy for display
export function formatDisplayDate(value) {
  if (!isValidDateString(value)) return value || "—";

  const [y, m, d] = value.split(".");

  return `${d}/${m}/${y}`;
}

// Converts yyyy.MM.dd to a short human date with abbreviated month, e.g. "15 Jan 2024"
export function formatShortDate(value, language = "en") {
  if (!isValidDateString(value)) return value || "—";
  const [y, mo, d] = value.split(".").map(Number);
  return new Intl.DateTimeFormat(language === "es" ? "es-ES" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(y, mo - 1, d));
}

// Extracts month key in format yyyy-MM from valid date
export function getMonthKey(dateStr) {
  if (!isValidDateString(dateStr)) return null;
  return dateStr.slice(0, 7).replace(".", "-");
}

// Extracts year key in format yyyy from valid date
export function getYearKey(dateStr) {
  if (!isValidDateString(dateStr)) return null;
  return dateStr.slice(0, 4);
}