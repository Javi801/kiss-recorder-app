import { motion } from "framer-motion";

import { PALETTE } from "@/lib/constants";
import BubbleStarsBackground from "@/components/visuals/BubbleStarsBackground";
import HeroVisualPlaceholder from "@/components/visuals/HeroVisualPlaceholder";

/**
 * Initial splash-like screen with hidden entry.
 * Acts as a playful gate before entering the main app.
 */
export default function CatGiftScreen({ onOpenMain, t }) {
  return (
    <button
      type="button"
      onClick={onOpenMain}
      aria-label={t.hiddenAccess}
      className="relative flex min-h-[calc(100vh-2.5rem)] w-full items-center justify-center overflow-hidden rounded-[32px] text-left"
      style={{
        background: `linear-gradient(135deg, ${PALETTE.blush}, ${PALETTE.lilac}, ${PALETTE.sky})`,
      }}
    >
      {/* Floating animated background elements */}
      <BubbleStarsBackground />

      {/* Top radial overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.95),_transparent_45%)]" />

      {/* Center visual */}
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.35 }}
        className="relative flex flex-col items-center"
      >
        <HeroVisualPlaceholder t={t} />
      </motion.div>
    </button>
  );
}