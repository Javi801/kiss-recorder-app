import { useMemo, useState } from "react";
import { Search, Filter, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { PALETTE } from "@/lib/constants";
import { formatDisplayDate } from "@/lib/date";
import { getFirstEventDate, getLastEventDate } from "@/lib/stats";

import EmptyState from "@/components/people/EmptyState";
import PersonCard from "@/components/person/PersonCard";
import FiltersPanel from "@/components/forms/FiltersPanel";

/**
 * Displays the full people list with search, filters, sorting, and grouping.
 * It keeps all list-specific UI state isolated from the app root.
 */
export default function PeopleScreen({
  people,
  onUpdatePerson,
  onDeletePerson,
  onAddEvent,
  onUpdateEvent,
  onDeleteEvent,
  onDeleteAllEvents,
  t,
  language,
}) {
  // Search query entered by the user.
  const [query, setQuery] = useState("");

  // Active filter values for the list.
  const [filters, setFilters] = useState({
    minAge: "",
    maxAge: "",
    activity: "",
    zodiacSign: "",
  });

  // Current grouping mode.
  const [groupBy, setGroupBy] = useState("name");

  // Current sorting mode.
  const [sortBy, setSortBy] = useState("name");

  /**
   * Filters and sorts the people list.
   * Search checks name, detail, howWeMet, and event details.
   */
  const filteredPeople = useMemo(() => {
    const q = query.trim().toLowerCase();

    const result = people.filter((person) => {
      // Build one searchable text block for simple matching.
      const searchable = [
        person.name,
        person.detail || "",
        person.howWeMet || "",
        ...(person.events || []).map((event) => event.details || ""),
      ]
        .join(" ")
        .toLowerCase();

      const matchesQuery = !q || searchable.includes(q);
      const matchesMinAge =
        !filters.minAge || person.age >= Number(filters.minAge);
      const matchesMaxAge =
        !filters.maxAge || person.age <= Number(filters.maxAge);
      const matchesActivity =
        !filters.activity || person.activity === filters.activity;
      const matchesZodiac =
        !filters.zodiacSign || person.zodiacSign === filters.zodiacSign;

      return (
        matchesQuery &&
        matchesMinAge &&
        matchesMaxAge &&
        matchesActivity &&
        matchesZodiac
      );
    });

    // Apply the selected ordering after filtering.
    return [...result].sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }

      if (sortBy === "firstEventDate") {
        const aDate = getFirstEventDate(a) || "9999.99.99";
        const bDate = getFirstEventDate(b) || "9999.99.99";
        return aDate.localeCompare(bDate);
      }

      const aDate = getLastEventDate(a) || "0000.00.00";
      const bDate = getLastEventDate(b) || "0000.00.00";
      return bDate.localeCompare(aDate);
    });
  }, [people, query, filters, sortBy]);

  /**
   * Groups already filtered people based on the selected grouping mode.
   * The output is normalized into sorted [groupName, members] tuples.
   */
  const grouped = useMemo(() => {
    const groups = {};

    for (const person of filteredPeople) {
      let key = t.ungrouped;

      if (groupBy === "name") {
        key = person.name[0]?.toUpperCase() || "#";
      }

      if (groupBy === "lastEventDate") {
        key = getLastEventDate(person) || t.noEvents;
      }

      if (!groups[key]) {
        groups[key] = [];
      }

      groups[key].push(person);
    }

    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  }, [filteredPeople, groupBy, t]);

  return (
    <div className="space-y-4">
      <div>
        <h2
          className="text-2xl font-bold tracking-tight"
          style={{ color: PALETTE.text }}
        >
          {t.personListTitle}
        </h2>
      </div>

      <div className="flex items-center gap-2">
        {/* Search input */}
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
            style={{ color: PALETTE.rose }}
          />
          <Input
            className="rounded-2xl pl-9"
            style={{
              borderColor: "#ecd6e0",
              backgroundColor: "rgba(255,255,255,0.86)",
            }}
            placeholder={t.searchPlaceholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {/* Filters drawer */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              className="rounded-2xl"
              style={{
                borderColor: "#ecd6e0",
                backgroundColor: "rgba(255,255,255,0.86)",
              }}
            >
              <Filter className="mr-2 h-4 w-4" />
              {t.filters}
            </Button>
          </SheetTrigger>

          <SheetContent
            side="right"
            className="w-[92%] max-w-sm overflow-y-auto"
            style={{
              borderLeftColor: "#f1dde7",
              backgroundColor: "rgba(255,255,255,0.97)",
            }}
          >
            <SheetHeader>
              <SheetTitle>{t.refineList}</SheetTitle>
            </SheetHeader>

            <div className="mt-6">
              <FiltersPanel
                filters={filters}
                setFilters={setFilters}
                groupBy={groupBy}
                setGroupBy={setGroupBy}
                sortBy={sortBy}
                setSortBy={setSortBy}
                peopleCount={filteredPeople.length}
                t={t}
                language={language}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {filteredPeople.length ? (
        <div className="space-y-5">
          {grouped.map(([group, members]) => (
            <div key={group} className="space-y-3">
              {/* Group header */}
              <div
                className="sticky top-0 z-10 rounded-2xl px-3 py-2 backdrop-blur"
                style={{ backgroundColor: "rgba(255,255,255,0.78)" }}
              >
                <p
                  className="text-xs font-semibold uppercase tracking-[0.16em]"
                  style={{ color: PALETTE.rose }}
                >
                  {groupBy === "lastEventDate" && group !== t.noEvents
                    ? formatDisplayDate(group)
                    : group}
                </p>
              </div>

              {/* Group members */}
              <div className="space-y-3">
                {members.map((person) => (
                  <PersonCard
                    key={person.id}
                    person={person}
                    onUpdatePerson={onUpdatePerson}
                    onDeletePerson={onDeletePerson}
                    onAddEvent={onAddEvent}
                    onUpdateEvent={onUpdateEvent}
                    onDeleteEvent={onDeleteEvent}
                    onDeleteAllEvents={onDeleteAllEvents}
                    t={t}
                    language={language}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Users}
          title={t.noPeopleFound}
          description={t.tryDifferent}
          action={
            <Button
              variant="outline"
              className="rounded-2xl"
              style={{ borderColor: "#ecd6e0", backgroundColor: "white" }}
              onClick={() => {
                setQuery("");
                setFilters({
                  minAge: "",
                  maxAge: "",
                  activity: "",
                  zodiacSign: "",
                });
              }}
            >
              {t.clearSearch}
            </Button>
          }
        />
      )}
    </div>
  );
}