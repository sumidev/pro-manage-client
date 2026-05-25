import { PROJECT_TYPES } from "@/constants/projectConstants";
import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { DropdownPortal } from "@/components/ui/DropdownPortal";

// ── Reusable badge-dropdown (portal-based, never clipped) ───────────────────
const BadgeDropdown = ({ value, options, onChange, style }) => {
  const [open, setOpen] = useState(false);
  const btnRef = useRef(null);
  const current = options.find((o) => o.value === value) || options[0];

  return (
    <div className="relative">
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wide transition-all"
        style={{
          background: style.bg,
          color: style.color,
          border: `1px solid ${style.border || style.bg}`,
        }}
      >
        {style.dot && (
          <span
            className="w-1.5 h-1.5 rounded-full shrink-0"
            style={{ background: style.dot }}
          />
        )}
        {current.label}
        <ChevronDown
          size={10}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      <DropdownPortal
        anchorRef={btnRef}
        open={open}
        onClose={() => setOpen(false)}
        minWidth={150}
      >
        <div
          className="rounded border py-1"
          style={{
            background: "var(--bg-card)",
            borderColor: "var(--border)",
            boxShadow: "var(--shadow-lg)",
          }}
        >
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium transition-all text-left"
              style={{ color: "var(--text-primary)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--bg-hover)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "";
              }}
            >
              <div className="flex items-center gap-2">
                {opt.dot && (
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ background: opt.dot }}
                  />
                )}
                <span className="capitalize">{opt.label}</span>
              </div>
              {value === opt.value && (
                <Check size={12} style={{ color: "var(--accent)" }} />
              )}
            </button>
          ))}
        </div>
      </DropdownPortal>
    </div>
  );
};

// ── Config ───────────────────────────────────────────────────────────────────
const statusOptions = [
  { value: "active", label: "Active", dot: "#22c55e" },
  { value: "completed", label: "Completed", dot: "#6366f1" },
  { value: "on_hold", label: "On Hold", dot: "#f97316" },
];

const statusStyle = {
  active: {
    bg: "var(--green-light)",
    color: "var(--green-text)",
    dot: "#22c55e",
  },
  completed: {
    bg: "var(--accent-light)",
    color: "var(--accent-text)",
    dot: "#6366f1",
  },
  on_hold: {
    bg: "var(--orange-light)",
    color: "var(--orange-text)",
    dot: "#f97316",
  },
};

// ── ProjectHeader ────────────────────────────────────────────────────────────
const ProjectHeader = ({ projectDetails, onUpdate }) => {
  const [localData, setLocalData] = useState({
    name: projectDetails.name,
    description: projectDetails.description,
    type: projectDetails.type,
    status: projectDetails.status,
  });

  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [localData.description]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (value !== projectDetails[name]) onUpdate(name, value);
  };

  const typeOptions = PROJECT_TYPES.map((t) => ({
    value: t,
    label: t.replace("_", " "),
  }));
  const currentStatus = statusStyle[localData.status] || statusStyle.active;

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
        <BadgeDropdown
          value={localData.type}
          options={typeOptions}
          onChange={(val) => {
            setLocalData((p) => ({ ...p, type: val }));
            onUpdate("type", val);
          }}
          style={{
            bg: "var(--accent-light)",
            color: "var(--accent-text)",
            border: "rgba(99,102,241,0.2)",
          }}
        />
        <BadgeDropdown
          value={localData.status}
          options={statusOptions}
          onChange={(val) => {
            setLocalData((p) => ({ ...p, status: val }));
            onUpdate("status", val);
          }}
          style={currentStatus}
        />
      </div>

      <input
        type="text"
        name="name"
        value={localData.name}
        onChange={handleChange}
        onBlur={handleBlur}
        className="inline-edit w-full text-lg font-bold leading-tight"
        style={{ color: "var(--text-primary)" }}
        placeholder="Project name"
      />

      <textarea
        ref={textareaRef}
        name="description"
        value={localData.description || ""}
        onChange={handleChange}
        onBlur={handleBlur}
        className="inline-edit w-full mt-0.5 text-sm leading-relaxed resize-none overflow-hidden"
        style={{ color: "var(--text-secondary)" }}
        placeholder="Add a description..."
      />
    </div>
  );
};

export default ProjectHeader;
