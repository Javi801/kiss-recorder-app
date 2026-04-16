import { Languages } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { PALETTE } from "@/lib/constants";

/**
 * Renders the floating language switcher.
 * It lets the user toggle between English and Spanish.
 */
export default function LanguageSwitcher({ language, setLanguage }) {
  // Keep the button style centralized for consistency.
  const triggerStyle = {
    backgroundColor: "rgba(255,255,255,0.88)",
  };

  return (
    <div className="fixed bottom-20 right-4 z-20">
      <Select value={language} onValueChange={setLanguage}>
        <SelectTrigger
          className="h-11 w-11 rounded-full border-0 p-0 shadow-lg backdrop-blur"
          style={triggerStyle}
        >
          <Languages
            className="mx-auto h-4 w-4"
            style={{ color: PALETTE.rose }}
          />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="en">English</SelectItem>
          <SelectItem value="es">Español</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}