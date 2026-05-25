import React, { useState, useRef, useEffect } from "react";
import { X, Plus, ChevronDown, Check, Flag, User, Calendar, Layers } from "lucide-react";
import { DropdownPortal } from "@/components/ui/DropdownPortal";
import InviteMemberButton from "@/components/ui/InviteMemberButton";
import TaskTypeIcon from "@/components/ui/TaskTypeIcon";
import { TASK_TYPE_OPTIONS } from "@/constants/taskConstants";
import { getMemberFullName, getMemberInitials } from "@/utils/memberUtils";

// ── Custom Select (portal-based) ─────────────────────────────────────────────
const CustomSelect = ({ value, options, onChange, placeholder = "Select..." }) => {
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
        <div className="flex items-center gap-2 min-w-0">
          {current?.typeIcon != null && (
            <TaskTypeIcon type={current.typeIcon} size={12} showTooltip={false} />
          )}
          {current?.dot && <span className="w-2 h-2 rounded-full shrink-0" style={{ background: current.dot }} />}
          {current?.avatar && (
            <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0" style={{ background: current.avatarColor || "var(--accent)" }}>
              {current.avatar}
            </div>
          )}
          <span className="truncate">{current?.label || placeholder}</span>
        </div>
        <ChevronDown size={13} className={`transition-transform shrink-0 ml-1 ${open ? "rotate-180" : ""}`} style={{ color: "var(--text-muted)" }} />
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
              <div className="flex items-center gap-2 min-w-0">
                {opt.typeIcon != null && (
                  <TaskTypeIcon type={opt.typeIcon} size={12} showTooltip={false} />
                )}
                {opt.dot && <span className="w-2 h-2 rounded-full shrink-0" style={{ background: opt.dot }} />}
                {opt.avatar && (
                  <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0" style={{ background: opt.avatarColor || "var(--accent)" }}>
                    {opt.avatar}
                  </div>
                )}
                <span className="truncate">{opt.label}</span>
              </div>
              {value === opt.value && <Check size={12} style={{ color: "var(--accent)" }} />}
            </button>
          ))}
        </div>
      </DropdownPortal>
    </div>
  );
};

// ── Options ──────────────────────────────────────────────────────────────────
const priorityOptions = [
  { value: "low",      label: "Low",      dot: "#22c55e" },
  { value: "medium",   label: "Medium",   dot: "#eab308" },
  { value: "high",     label: "High",     dot: "#f97316" },
  { value: "critical", label: "Critical", dot: "#ef4444" },
];

const stageOptions = [
  { value: "todo",    label: "To Do"   },
  { value: "backlog", label: "Backlog" },
];

const typeOptions = TASK_TYPE_OPTIONS.map((t) => ({
  value: t.value,
  label: t.label,
  typeIcon: t.value,
}));

const avatarColors = ["#6366f1","#8b5cf6","#06b6d4","#10b981","#f59e0b","#ef4444","#ec4899"];
const getAvatarColor = (id) => avatarColors[(id || 0) % avatarColors.length];

// ── Modal ────────────────────────────────────────────────────────────────────
const CreateTaskModal = ({ isOpen, onClose, onSubmit, members = [], projectId }) => {
  const [formData, setFormData] = useState({
    name: "", description: "", type: "task", priority: "medium",
    due_date: "", assigned_to: "", stage: "todo",
  });

  if (!isOpen) return null;

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    onSubmit(formData);
    onClose();
    setFormData({ name: "", description: "", type: "task", priority: "medium", due_date: "", assigned_to: "", stage: "todo" });
  };

  const assigneeOptions = [
    { value: "", label: "Unassigned" },
    ...members.map((m) => ({
      value: String(m.id),
      label: getMemberFullName(m),
      avatar: getMemberInitials(m),
      avatarColor: getAvatarColor(m.id),
    })),
  ];
  const hasMembers = members.length > 0;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: "rgba(9,30,66,0.54)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-[520px] rounded-lg overflow-hidden fade-in"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border)", boxShadow: "var(--shadow-xl)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-3.5"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "var(--accent-light)" }}>
              <Plus size={14} style={{ color: "var(--accent)" }} />
            </div>
            <h2 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>Create issue</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded transition-all"
            style={{ color: "var(--text-muted)" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "var(--bg-hover)"; e.currentTarget.style.color = "var(--text-primary)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = ""; e.currentTarget.style.color = "var(--text-muted)"; }}
          >
            <X size={15} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
          {/* Summary */}
          <div>
            <label className="pm-label block mb-1.5">
              Summary <span style={{ color: "var(--red)" }}>*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="What needs to be done?"
              className="pm-input"
              autoFocus
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="pm-label block mb-1.5">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Add more details..."
              className="pm-input resize-none"
            />
          </div>

          {/* 2x2 grid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="pm-label block mb-1.5">Issue type</label>
              <CustomSelect
                value={formData.type}
                options={typeOptions}
                onChange={(val) => setFormData({ ...formData, type: val })}
              />
            </div>

            <div>
              <label className="pm-label flex items-center gap-1 mb-1.5">
                <Flag size={10} /> Priority
              </label>
              <CustomSelect
                value={formData.priority}
                options={priorityOptions}
                onChange={(val) => setFormData({ ...formData, priority: val })}
              />
            </div>

            <div>
              <label className="pm-label flex items-center gap-1 mb-1.5">
                <Calendar size={10} /> Due date
              </label>
              <input
                type="date"
                name="due_date"
                value={formData.due_date}
                onChange={handleChange}
                className="pm-input"
              />
            </div>

            <div>
              <label className="pm-label flex items-center gap-1 mb-1.5">
                <Layers size={10} /> Status
              </label>
              <CustomSelect
                value={formData.stage}
                options={stageOptions}
                onChange={(val) => setFormData({ ...formData, stage: val })}
              />
            </div>

            <div>
              <label className="pm-label flex items-center gap-1 mb-1.5">
                <User size={10} /> Assignee
              </label>
              {hasMembers ? (
                <CustomSelect
                  value={formData.assigned_to}
                  options={assigneeOptions}
                  onChange={(val) => setFormData({ ...formData, assigned_to: val })}
                  placeholder="Unassigned"
                />
              ) : (
                <div
                  className="rounded-lg p-3 space-y-2"
                  style={{ background: "var(--bg-subtle)", border: "1px solid var(--border)" }}
                >
                  <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                    No team members yet. Invite someone to assign this issue.
                  </p>
                  {projectId && (
                    <InviteMemberButton projectId={projectId} label="Invite team member" className="w-full" />
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-2 pt-2" style={{ borderTop: "1px solid var(--border)" }}>
            <button
              type="button"
              onClick={onClose}
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
              Create issue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskModal;
