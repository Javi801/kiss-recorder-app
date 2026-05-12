import { useState } from "react";
import { motion } from "framer-motion";
import { PALETTE } from "@/lib/constants";
import mainBackground from "@/assets/main-background.png";

/**
 * Displays the main circular hero visual.
 * Falls back gracefully if the image fails to load.
 */
export default function HeroVisualPlaceholder() {
  // Track if the image loads correctly.
  const [hasImage, setHasImage] = useState(true);

  return (
    <div
      className="relative flex h-72 w-72 items-center justify-center rounded-full backdrop-blur-sm"
      style={{ backgroundColor: "rgba(255,255,255,0.55)" }}
    >
      {/* Background gradient layer */}
      <div
        className="absolute inset-6 rounded-full"
        style={{
          background: `linear-gradient(135deg, ${PALETTE.blush}, #fff7fb, ${PALETTE.sky})`,
        }}
      />

      {/* Floating animated container */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 4.2, ease: "easeInOut" }}
        className="relative z-10 flex h-48 w-48 items-center justify-center overflow-hidden rounded-[32px] text-center"
      >
        {hasImage ? (
          <img
            src={mainBackground}
            alt="KissRecorder visual"
            className="h-full w-full object-contain"
            onError={() => setHasImage(false)}
          />
        ) : (
          // Fallback when image is missing.
          <div className="px-5" />
        )}
      </motion.div>
    </div>
  );
}