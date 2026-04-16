import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { PALETTE } from "@/lib/constants";
import PersonForm from "@/components/forms/PersonForm";

/**
 * Renders the screen used to add a new person.
 * It wraps the shared person form with navigation controls.
 */
export default function AddPersonScreen({ onSave, onBack, t, language }) {
  return (
    <div className="space-y-4 pt-2">
      {/* Back action */}
      <div className="flex items-center justify-start">
        <Button
          variant="ghost"
          className="rounded-2xl hover:bg-rose-50"
          style={{ color: PALETTE.deep }}
          onClick={onBack}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t.back}
        </Button>
      </div>

      {/* Form container */}
      <Card
        className="rounded-3xl shadow-sm backdrop-blur"
        style={{
          borderColor: "#f1dde7",
          backgroundColor: "rgba(255,255,255,0.84)",
        }}
      >
        <CardContent className="p-5">
          <PersonForm
            onSave={onSave}
            onCancel={onBack}
            t={t}
            language={language}
            includeHowWeMet={false}
            mode="add"
            saveLabel={t.saveAndBack}
          />
        </CardContent>
      </Card>
    </div>
  );
}