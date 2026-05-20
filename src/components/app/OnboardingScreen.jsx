import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePalette } from "@/lib/theme";

const SLIDE_VARIANTS = {
  enter: (direction) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction) => ({
    x: direction < 0 ? "100%" : "-100%",
    opacity: 0,
  }),
};

const TRANSITION = {
  x: { type: "spring", stiffness: 300, damping: 30 },
  opacity: { duration: 0.2 },
};

/**
 * Full-screen onboarding carousel shown only on the first app launch.
 * Slides are driven by Framer Motion and support both tap (Next) and swipe.
 *
 * Props:
 *  - t             Active translation dictionary (must include onboardingSlides, onboardingNext,
 *                  onboardingDone, onboardingSkip keys)
 *  - onComplete    Called when the user finishes or skips the onboarding
 */
export default function OnboardingScreen({ t, onComplete }) {
  const PALETTE = usePalette();
  const slides = t.onboardingSlides;

  // [currentIndex, swipeDirection] — direction drives the enter/exit animation
  const [[index, direction], setPage] = useState([0, 1]);

  const isLast = index === slides.length - 1;

  function goTo(newIndex, dir) {
    if (newIndex < 0 || newIndex >= slides.length) return;
    setPage([newIndex, dir]);
  }

  function handleNext() {
    if (isLast) {
      onComplete();
    } else {
      goTo(index + 1, 1);
    }
  }

  // Swipe gesture: trigger page change when the drag exceeds a threshold
  function handleDragEnd(_, { offset, velocity }) {
    const swipePower = Math.abs(offset.x) * Math.abs(velocity.x);
    const THRESHOLD = 8000;
    if (offset.x < -50 && swipePower > THRESHOLD) {
      goTo(index + 1, 1);
    } else if (offset.x > 50 && swipePower > THRESHOLD) {
      goTo(index - 1, -1);
    }
  }

  const slide = slides[index];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        zIndex: 20,
        overflow: "hidden",
        background: `linear-gradient(160deg, ${PALETTE.accentMuted}, ${PALETTE.gradientMid}, ${PALETTE.gradientEnd})`,
        paddingTop: "env(safe-area-inset-top, 1.5rem)",
        paddingBottom: "env(safe-area-inset-bottom, 1.5rem)",
      }}
    >
      {/* Skip button — top right */}
      {!isLast && (
        <div style={{ width: "100%", display: "flex", justifyContent: "flex-end", padding: "1rem 1.25rem 0" }}>
          <button
            type="button"
            onClick={onComplete}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: PALETTE.textSoft,
              fontSize: "0.875rem",
              fontWeight: 500,
              padding: "0.25rem 0.5rem",
            }}
          >
            {t.onboardingSkip}
          </button>
        </div>
      )}

      {/* Slide area */}
      <div
        style={{
          flex: 1,
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={index}
            custom={direction}
            variants={SLIDE_VARIANTS}
            initial="enter"
            animate="center"
            exit="exit"
            transition={TRANSITION}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.1}
            onDragEnd={handleDragEnd}
            style={{
              position: "absolute",
              width: "100%",
              padding: "0 2rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: "1.25rem",
              userSelect: "none",
              cursor: "grab",
            }}
          >
            {/* Emoji icon */}
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 260, damping: 20 }}
              style={{
                fontSize: "4rem",
                lineHeight: 1,
                filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.12))",
              }}
            >
              {slide.emoji}
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.3 }}
              style={{
                margin: 0,
                fontSize: "1.625rem",
                fontWeight: 700,
                color: PALETTE.text,
                lineHeight: 1.2,
              }}
            >
              {slide.title}
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              style={{
                margin: 0,
                fontSize: "1rem",
                color: PALETTE.textSoft,
                lineHeight: 1.6,
                maxWidth: "22rem",
              }}
            >
              {slide.description}
            </motion.p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom controls */}
      <div
        style={{
          width: "100%",
          padding: "0 1.5rem 1.5rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1.25rem",
        }}
      >
        {/* Dot indicators */}
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Slide ${i + 1}`}
              onClick={() => goTo(i, i > index ? 1 : -1)}
              style={{
                width: i === index ? "1.5rem" : "0.5rem",
                height: "0.5rem",
                borderRadius: "9999px",
                border: "none",
                cursor: "pointer",
                padding: 0,
                transition: "width 250ms ease, background 250ms ease",
                background: i === index ? PALETTE.accent : PALETTE.accentSoft,
              }}
            />
          ))}
        </div>

        {/* Next / Get started button */}
        <button
          type="button"
          onClick={handleNext}
          style={{
            width: "100%",
            maxWidth: "20rem",
            padding: "0.875rem 1.5rem",
            borderRadius: "9999px",
            border: "none",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: 600,
            color: "#ffffff",
            background: `linear-gradient(90deg, ${PALETTE.accent}, ${PALETTE.accentSoft})`,
            boxShadow: `0 4px 16px ${PALETTE.accent}55`,
            transition: "opacity 150ms",
          }}
        >
          {isLast ? t.onboardingDone : t.onboardingNext}
        </button>
      </div>
    </div>
  );
}
