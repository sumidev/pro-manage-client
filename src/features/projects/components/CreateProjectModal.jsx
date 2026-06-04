import { useState, useRef } from "react";
import { X, FolderPlus, ChevronDown, Check, Calendar, Tag } from "lucide-react";
import { DropdownPortal } from "@/components/ui/DropdownPortal";

// ── Custom Select (portal-based) ─────────────────────────────────────────────
const CustomSelect = ({ value, options, onChange, placeholder }) => {
  const [open, setOpen] = useState(false);
  const btnRef = useRef(null);
  const current = options.find((o) => o.value === value);

  return (
    <div>
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-3 py-2 rounded text-sm transition-all"
        style={{
          background: "var(--bg-subtle)",
          border: open ? "1.5px solid var(--border-focus)" : "1.5px solid var(--border)",
          color: current ? "var(--text-primary)" : "var(--text-muted)",
          boxShadow: open ? "0 0 0 2px rgba(56,139,255,0.18)" : "none",
        }}
      >
        <div className="flex items-center gap-2">
          {current?.dot && <span className="w-2 h-2 rounded-full shrink-0" style={{ background: current.dot }} />}
          <span>{current?.label || placeholder}</span>
        </div>
        <ChevronDown size={14} className={`transition-transform shrink-0 ${open ? "rotate-180" : ""}`} style={{ color: "var(--text-muted)" }} />
      </button>

      <DropdownPortal anchorRef={btnRef} open={open} onClose={() => setOpen(false)}>
        <div
          className="rounded border py-1"
          style={{ background: "var(--bg-card)", borderColor: "var(--border)", boxShadow: "var(--shadow-lg)" }}
        >
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className="w-full flex items-center justify-between px-3 py-2 text-sm transition-all text-left"
              style={{
                background: value === opt.value ? "var(--accent-light)" : "transparent",
                color: value === opt.value ? "var(--accent-text)" : "var(--text-primary)",
              }}
              onMouseEnter={(e) => { if (value !== opt.value) e.currentTarget.style.background = "var(--bg-hover)"; }}
              onMouseLeave={(e) => { if (value !== opt.value) e.currentTarget.style.background = "transparent"; }}
            >
              <div className="flex items-center gap-2">
                {opt.dot && <span className="w-2 h-2 rounded-full" style={{ background: opt.dot }} />}
                <span className="capitalize">{opt.label}</span>
              </div>
              {value === opt.value && <Check size={13} style={{ color: "var(--accent)" }} />}
            </button>
          ))}
        </div>
      </DropdownPortal>
    </div>
  );
};

// ── Options ──────────────────────────────────────────────────────────────────
const typeOptions = [
  { value: "software",   label: "Software"   },
  { value: "mobile_app", label: "Mobile App" },
  { value: "website",    label: "Website"    },
  { value: "design",     label: "Design"     },
  { value: "marketing",  label: "Marketing"  },
];

// ── Modal ────────────────────────────────────────────────────────────────────
export const CreateProjectModal = ({ onSubmit, showCreateProjectModal }) => {
  const [newProject, setNewProject] = useState({
    name: "", description: "", type: "software", deadline: "",
  });

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newProject.name.trim()) return;
    onSubmit(newProject);
  };

  const set = (key) => (e) => setNewProject({ ...newProject, [key]: e.target.value });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(9,30,66,0.54)" }}
      onClick={() => showCreateProjectModal(false)}
    >
      <div
        className="w-full max-w-[480px] rounded-lg overflow-hidden fade-in"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border)", boxShadow: "var(--shadow-xl)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--accent-light)" }}>
              <FolderPlus size={16} style={{ color: "var(--accent)" }} />
            </div>
            <div>
              <h2 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>Create project</h2>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>Set up a new project for your team</p>
            </div>
          </div>
          <button
            onClick={() => showCreateProjectModal(false)}
            className="p-1.5 rounded transition-all"
            style={{ color: "var(--text-muted)" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "var(--bg-hover)"; e.currentTarget.style.color = "var(--text-primary)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = ""; e.currentTarget.style.color = "var(--text-muted)"; }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleCreate} className="px-5 py-5 space-y-4">
          {/* Name */}
          <div>
            <label className="pm-label block mb-1.5">
              Project name <span style={{ color: "var(--red)" }}>*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Website Redesign"
              className="pm-input"
              value={newProject.name}
              onChange={set("name")}
              required
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label className="pm-label block mb-1.5">Description</label>
            <textarea
              placeholder="What is this project about?"
              rows={3}
              className="pm-input resize-none"
              value={newProject.description}
              onChange={set("description")}
            />
          </div>

          {/* Type + Deadline */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="pm-label flex items-center gap-1 mb-1.5">
                <Tag size={10} /> Project type
              </label>
              <CustomSelect
                value={newProject.type}
                options={typeOptions}
                onChange={(val) => setNewProject({ ...newProject, type: val })}
                placeholder="Select type"
              />
            </div>
            <div>
              <label className="pm-label flex items-center gap-1 mb-1.5">
                <Calendar size={10} /> Deadline <span style={{ color: "var(--red)" }}>*</span>
              </label>
              <input
                type="date"
                className="pm-input"
                value={newProject.deadline}
                min={new Date().toISOString().split("T")[0]}
                onChange={set("deadline")}
                required
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-2 pt-2" style={{ borderTop: "1px solid var(--border)" }}>
            <button
              type="button"
              onClick={() => showCreateProjectModal(false)}
              className="px-4 py-2 rounded text-sm font-medium transition-all"
              style={{ background: "var(--bg-hover)", color: "var(--text-primary)", border: "1px solid var(--border)" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--bg-active)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "var(--bg-hover)"; }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded text-sm font-semibold text-white transition-all"
              style={{ background: "var(--accent)" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--accent-hover)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "var(--accent)"; }}
            >
              Create project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
