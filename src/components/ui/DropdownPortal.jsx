/**
 * DropdownPortal — renders dropdown content directly into document.body
 * so it's never clipped by parent overflow:hidden or low z-index stacking contexts.
 *
 * Usage:
 *   <DropdownPortal anchorRef={buttonRef} open={open} onClose={() => setOpen(false)}>
 *     <div>...dropdown content...</div>
 *   </DropdownPortal>
 */
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const DROPDOWN_Z = 9999;

export const DropdownPortal = ({
  anchorRef,
  open,
  onClose,
  children,
  align = "left",   // "left" | "right"
  minWidth,
}) => {
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });
  const contentRef = useRef(null);

  // Recalculate position whenever open changes or on scroll/resize
  useLayoutEffect(() => {
    if (!open || !anchorRef?.current) return;

    const calc = () => {
      const rect = anchorRef.current.getBoundingClientRect();
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const scrollX = window.scrollX || document.documentElement.scrollLeft;

      setPos({
        top:   rect.bottom + scrollY + 4,
        left:  align === "right"
          ? rect.right  + scrollX
          : rect.left   + scrollX,
        width: rect.width,
      });
    };

    calc();
    window.addEventListener("scroll", calc, true);
    window.addEventListener("resize", calc);
    return () => {
      window.removeEventListener("scroll", calc, true);
      window.removeEventListener("resize", calc);
    };
  }, [open, anchorRef, align]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (anchorRef?.current?.contains(e.target)) return;
      if (contentRef?.current?.contains(e.target)) return;
      onClose?.();
    };
    // slight delay so the trigger button click doesn't immediately close
    const id = setTimeout(() => document.addEventListener("mousedown", handler), 0);
    return () => {
      clearTimeout(id);
      document.removeEventListener("mousedown", handler);
    };
  }, [open, onClose, anchorRef]);

  if (!open) return null;

  const style = {
    position: "absolute",
    top:      pos.top,
    zIndex:   DROPDOWN_Z,
    minWidth: minWidth || pos.width,
    ...(align === "right"
      ? { right: `calc(100vw - ${pos.left}px)` }
      : { left: pos.left }),
  };

  return createPortal(
    <div ref={contentRef} style={style} className="fade-in">
      {children}
    </div>,
    document.body,
  );
};
