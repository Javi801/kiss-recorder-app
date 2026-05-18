import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { Input } from "@/components/ui/input";
import { TEXT } from "@/lib/constants";
import { usePalette } from "@/lib/theme";

export default function TagInput({
  value,
  onChange,
  tags,
  onAddTag,
  placeholder,
  maxLength,
  style,
  addTagLabel,
}) {
  const PALETTE = usePalette();
  const [open, setOpen] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState({});
  const containerRef = useRef(null);

  const trimmed = value.trim();
  const filtered = tags.filter(
    (tag) => !trimmed || tag.toLowerCase().includes(trimmed.toLowerCase()),
  );
  const showAddOption =
    trimmed && !tags.some((t) => t.toLowerCase() === trimmed.toLowerCase());

  const showDropdown = open && (filtered.length > 0 || showAddOption);

  // Position the dropdown via fixed coords to escape Dialog overflow clipping.
  useLayoutEffect(() => {
    if (!open || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setDropdownStyle({
      position: "fixed",
      top: rect.bottom + 4,
      left: rect.left,
      width: rect.width,
      zIndex: 9999,
    });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function close(e) {
      if (!containerRef.current?.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  function selectTag(tag) {
    onChange(tag);
    setOpen(false);
  }

  function handleAddTag() {
    if (!trimmed) return;
    onAddTag?.(trimmed);
    setOpen(false);
  }

  return (
    <div ref={containerRef}>
      <Input
        value={value}
        onChange={(e) => { onChange(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => { if (e.key === "Escape") setOpen(false); }}
        placeholder={placeholder}
        maxLength={maxLength}
        className="rounded-2xl"
        style={style}
      />
      {showDropdown && (
        <div
          style={{
            ...dropdownStyle,
            borderRadius: "0.75rem",
            border: `1px solid ${PALETTE.inputBorder}`,
            backgroundColor: PALETTE.card,
            boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
            overflow: "hidden",
          }}
        >
          {filtered.map((tag, i) => {
            const selected = value === tag;
            return (
              <button
                key={tag}
                type="button"
                onMouseDown={(e) => { e.preventDefault(); selectTag(tag); }}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  padding: "0.5rem 0.75rem",
                  ...TEXT.body,
                  color: selected ? PALETTE.accent : PALETTE.text,
                  backgroundColor: selected ? PALETTE.accentMuted : "transparent",
                  fontWeight: selected ? "600" : "400",
                  cursor: "pointer",
                  borderTop: i > 0 ? `1px solid ${PALETTE.inputBorder}` : "none",
                }}
              >
                {tag}
              </button>
            );
          })}
          {showAddOption && (
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); handleAddTag(); }}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                padding: "0.5rem 0.75rem",
                ...TEXT.body,
                color: PALETTE.accent,
                fontWeight: "500",
                cursor: "pointer",
                borderTop: filtered.length > 0 ? `1px solid ${PALETTE.inputBorder}` : "none",
              }}
            >
              {`+ ${addTagLabel} "${trimmed}"`}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
