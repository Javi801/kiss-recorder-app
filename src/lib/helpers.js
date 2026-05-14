import { hasScore } from "@/lib/format";

// Generates a short unique id for entities
export function uid() {
  return Math.random().toString(36).slice(2, 10);
}

// Normalizes people data ensuring events array and valid scores
export function normalizePeople(rawPeople) {
  return Array.isArray(rawPeople)
    ? rawPeople.map((person) => ({
        ...person,
        events: Array.isArray(person.events)
          ? person.events.map((event) => ({
              ...event,
              score: hasScore(event.score) ? event.score : null,
            }))
          : [],
      }))
    : [];
}


// Converts hex color to RGB object
export function hexToRgb(hex) {
  const normalized = hex.replace("#", "");
  const bigint = parseInt(normalized, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}