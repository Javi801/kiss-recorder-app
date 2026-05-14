import { useState } from "react";
import { UserPlus, Users, BarChart3, Trash2, TriangleAlert } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import { PALETTE } from "@/lib/constants";
import StatTile from "@/components/shared/StatTile";
import SettingsTile from "@/components/shared/SettingsTile";
import LanguageSelector from "@/components/app/LanguageSelector";

/**
 * Renders the main dashboard screen.
 * It shows summary metrics, primary actions, and app-level settings.
 */
export default function MainScreen({
  onNavigate,
  onClearData,
  people,
  t,
  language,
  setLanguage,
}) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Count all events across every saved person.
  const totalEvents = people.reduce(
    (sum, person) => sum + (person.events?.length || 0),
    0,
  );

  const outlineActionStyle = {
    height: "3.5rem",
    justifyContent: "flex-start",
    borderRadius: "1.5rem",
    fontSize: "1rem",
    lineHeight: "1.5rem",
    boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    borderColor: "#ecd6e0",
    backgroundColor: "rgba(255,255,255,0.86)",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* App icon preview */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <SparkleIcon palette={iconColor} size={120} />
      </div>

      {/* Hero summary card */}
      <Card
        style={{
          overflow: "hidden",
          borderRadius: "30px",
          border: "none",
          color: "white",
          boxShadow:
            "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
          background: `linear-gradient(135deg, ${PALETTE.rose}, ${PALETTE.roseSoft}, ${PALETTE.sky})`,
        }}
      >
        <CardContent style={{ position: "relative", padding: "1.5rem" }}>
          {/* Decorative blurred circles */}
          <div
            style={{
              position: "absolute",
              right: "-2rem",
              top: "-2rem",
              height: "7rem",
              width: "7rem",
              borderRadius: "9999px",
              backgroundColor: "rgba(255,255,255,0.1)",
              filter: "blur(40px)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: "-2rem",
              bottom: "0",
              height: "6rem",
              width: "6rem",
              borderRadius: "9999px",
              backgroundColor: "rgba(255,255,255,0.1)",
              filter: "blur(40px)",
            }}
          />

          <h1
            style={{
              fontSize: "1.5rem",
              lineHeight: "2rem",
              fontWeight: "bold",
              letterSpacing: "-0.025em",
            }}
          >
            {t.heroTitle}
          </h1>

          <div
            style={{
              marginTop: "1.25rem",
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: "0.75rem",
            }}
          >
            <StatTile
              label={t.peopleSaved}
              value={people.length}
              accent={true}
            />
            <StatTile
              label={t.totalEvents}
              value={totalEvents}
              accent={true}
            />
          </div>

          {/* App settings */}
          <div className="mt-5">
            <SettingsTile accent={true}>
              <LanguageSelector
                language={language}
                setLanguage={setLanguage}
                t={t}
              />
            </SettingsTile>
          </div>

        </CardContent>
      </Card>

      {/* Main action buttons */}
      <div style={{ display: "grid", gap: "0.75rem" }}>
        <Button
          style={{
            height: "3.5rem",
            justifyContent: "flex-start",
            borderRadius: "1.5rem",
            fontSize: "1rem",
            lineHeight: "1.5rem",
            color: "white",
            boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
            background: `linear-gradient(90deg, ${PALETTE.rose}, ${PALETTE.roseSoft})`,
          }}
          onClick={() => onNavigate("add")}
        >
          <UserPlus style={{ marginRight: "0.75rem", height: "1.25rem", width: "1.25rem" }} />
          {t.addNewPerson}
        </Button>

        <Button
          variant="outline"
          style={outlineActionStyle}
          onClick={() => onNavigate("people")}
        >
          <Users
            style={{ marginRight: "0.75rem", height: "1.25rem", width: "1.25rem", color: PALETTE.rose }}
          />
          {t.viewEditPeople}
        </Button>

        <Button
          variant="outline"
          style={outlineActionStyle}
          onClick={() => onNavigate("stats")}
        >
          <BarChart3
            style={{ marginRight: "0.75rem", height: "1.25rem", width: "1.25rem", color: PALETTE.sky2 }}
          />
          {t.viewStatistics}
        </Button>

        <Button
          variant="outline"
          style={{ ...outlineActionStyle, color: "#dc2626" }}
          onClick={() => setConfirmOpen(true)}
        >
          <Trash2 style={{ marginRight: "0.75rem", height: "1.25rem", width: "1.25rem" }} />
          {t.clearLocalData}
        </Button>
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#dc2626" }}
            >
              <TriangleAlert style={{ height: "1.25rem", width: "1.25rem", flexShrink: 0 }} />
              <DialogTitle style={{ color: "#dc2626" }}>
                {t.clearDataConfirmTitle}
              </DialogTitle>
            </div>
            <DialogDescription>{t.clearDataConfirmDesc}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              {t.cancel}
            </Button>
            <Button
              className="hover:bg-red-700"
              style={{ backgroundColor: "#dc2626", color: "white" }}
              onClick={() => {
                setConfirmOpen(false);
                onClearData();
              }}
            >
              {t.clearDataConfirmAction}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}