import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Plus, Trash2, Calendar, ChevronDown, ChevronUp } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { PALETTE } from "@/lib/constants";
import { formatDisplayDate } from "@/lib/date";
import {
  translateActivity,
  translateGender,
  hasScore,
  renderKisses,
  personHasIncompleteEvent,
} from "@/lib/format";

import PersonForm from "@/components/forms/PersonForm";
import EventForm from "@/components/forms/EventForm";

/**
 * Displays a person card with expandable event history.
 * Handles editing, deleting, and event management.
 */
export default function PersonCard({
  person,
  onUpdatePerson,
  onDeletePerson,
  onAddEvent,
  onUpdateEvent,
  onDeleteEvent,
  onDeleteAllEvents,
  t,
  language,
}) {
  // Expand/collapse state.
  const [expanded, setExpanded] = useState(false);

  // Modal states.
  const [editingPerson, setEditingPerson] = useState(false);
  const [eventModal, setEventModal] = useState({
    open: false,
    mode: "add",
    event: null,
  });

  // Check if any event lacks details.
  const hasIncompleteEvent = personHasIncompleteEvent(person);

  /**
   * Sort events descending by date.
   */
  const sortedEvents = useMemo(
    () =>
      [...(person.events || [])].sort((a, b) =>
        a.date < b.date ? 1 : -1,
      ),
    [person.events],
  );

  return (
    <>
      <motion.div layout>
        <Card
          className={`overflow-hidden rounded-3xl shadow-md ${
            hasIncompleteEvent ? "ring-2" : ""
          }`}
          style={{
            borderColor: hasIncompleteEvent ? "#f9d58a" : "#efd8e4",
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.97), rgba(255,248,252,0.95))",
          }}
        >
          <CardContent className="p-0">
            {/* Header */}
            <button
              className="flex w-full items-start justify-between gap-3 p-5 text-left"
              onClick={() => setExpanded((v) => !v)}
            >
              <div className="min-w-0 flex-1">
                {/* Name + badges */}
                <div className="flex flex-wrap items-center gap-2">
                  <h3
                    className="truncate text-base font-semibold"
                    style={{ color: PALETTE.text }}
                  >
                    {person.name}
                  </h3>

                  <Badge
                    className="rounded-full border-0 px-3 py-1 text-[11px] font-semibold"
                    style={{ backgroundColor: "#ffe2ec", color: PALETTE.deep }}
                  >
                    {translateActivity(person.activity, t)}
                  </Badge>

                  {hasIncompleteEvent && (
                    <Badge className="rounded-full border-0 bg-amber-100 text-amber-700">
                      {t.missingEventDetailsBadge}
                    </Badge>
                  )}
                </div>

                {/* Basic info */}
                <div
                  className="mt-2 flex flex-wrap gap-2 text-xs"
                  style={{ color: PALETTE.textSoft }}
                >
                  <span>{person.age} {t.years}</span>
                  <span>•</span>
                  <span>{translateGender(person.gender, t)}</span>
                  <span>•</span>
                  <span>{person.zodiacSign}</span>
                </div>

                {/* Extra info */}
                {person.howWeMet && (
                  <p className="mt-2 text-sm" style={{ color: PALETTE.text }}>
                    {t.met}: {person.howWeMet}
                  </p>
                )}

                {person.detail && (
                  <p className="mt-1 text-sm" style={{ color: PALETTE.textSoft }}>
                    {person.detail}
                  </p>
                )}
              </div>

              {/* Toggle icon */}
              <div className="rounded-2xl p-2" style={{ backgroundColor: "#fff0f6" }}>
                {expanded ? (
                  <ChevronUp className="h-5 w-5" style={{ color: PALETTE.rose }} />
                ) : (
                  <ChevronDown className="h-5 w-5" style={{ color: PALETTE.rose }} />
                )}
              </div>
            </button>

            {/* Expandable content */}
            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-4 p-5">
                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      <Button onClick={() => setEditingPerson(true)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        {t.editPerson}
                      </Button>

                      <Button
                        onClick={() =>
                          setEventModal({ open: true, mode: "add", event: null })
                        }
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        {t.addEvent}
                      </Button>

                      <Button
                        variant="outline"
                        className="text-red-600"
                        onClick={() => onDeletePerson(person.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {t.delete}
                      </Button>
                    </div>

                    {/* Event list */}
                    {sortedEvents.length ? (
                      <div className="space-y-2">
                        {sortedEvents.map((event) => (
                          <button
                            key={event.id}
                            className="w-full rounded-2xl border bg-white p-3 text-left"
                            onClick={() =>
                              setEventModal({
                                open: true,
                                mode: "edit",
                                event,
                              })
                            }
                          >
                            <div className="flex justify-between">
                              <span>
                                <Calendar className="inline mr-2 h-4 w-4" />
                                {formatDisplayDate(event.date)}
                              </span>

                              {hasScore(event.score) && (
                                <Badge>{renderKisses(event.score, t)}</Badge>
                              )}
                            </div>

                            <p className="mt-2 text-sm text-slate-500">
                              {event.details || t.noDetailsAdded}
                            </p>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-center">{t.noEventsYet}</p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>

      {/* Edit person modal */}
      <Dialog open={editingPerson} onOpenChange={setEditingPerson}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.editPerson}</DialogTitle>
            <DialogDescription>{t.updateDetails}</DialogDescription>
          </DialogHeader>

          <PersonForm
            initialValues={person}
            onSave={(values) => {
              onUpdatePerson(person.id, values);
              setEditingPerson(false);
            }}
            onCancel={() => setEditingPerson(false)}
            t={t}
            language={language}
          />
        </DialogContent>
      </Dialog>

      {/* Event modal */}
      <Dialog
        open={eventModal.open}
        onOpenChange={(open) =>
          setEventModal((prev) => ({ ...prev, open }))
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {eventModal.mode === "add"
                ? t.addEventTitle
                : t.editEventTitle}
            </DialogTitle>
            <DialogDescription>
              {eventModal.mode === "add"
                ? t.addEventDesc
                : t.editEventDesc}
            </DialogDescription>
          </DialogHeader>

          <EventForm
            initialValues={eventModal.event}
            onSave={(values) => {
              if (eventModal.mode === "add")
                onAddEvent(person.id, values);
              else
                onUpdateEvent(person.id, eventModal.event.id, values);

              setEventModal({ open: false, mode: "add", event: null });
            }}
            onCancel={() =>
              setEventModal({ open: false, mode: "add", event: null })
            }
            t={t}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}