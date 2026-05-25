import React, { useMemo, useRef, useState } from "react";
import { Filter, X, Check, Search, Calendar } from "lucide-react";
import { getUserColor } from "../../../utils/helpers";
import { dueDates, priorities, unAssignedMember } from "../../../constants/filterConstants";
import { MembersList } from "./filterComponents/MembersList";
import { DropdownPortal } from "@/components/ui/DropdownPortal";

export const TaskFilters = ({
  members,
  filters,
  handleFilterChange,
  clearAllFilters,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchMember, setSearchMember] = useState("");
  const btnRef = useRef(null);

  const allMembers = [unAssignedMember, ...members];

  const filteredMembers = useMemo(() => {
    if (!searchMember) return allMembers;
    return allMembers.filter((m) =>
      m.firstName?.toLowerCase().includes(searchMember.toLowerCase())
    );
  }, [searchMember, allMembers]);

  const activeCount =
    (filters.dueDate ? 1 : 0) +
    filters.priorities.length +
    filters.assignees.length +
    (filters.search ? 1 : 0);

  return (
    <div>
      {/* Filter button */}
      <button
        ref={btnRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded border text-sm font-medium transition-all"
        style={{
          background: isOpen || activeCount > 0 ? "var(--accent-light)" : "var(--bg-card)",
          borderColor: isOpen || activeCount > 0 ? "var(--accent)" : "var(--border)",
          color: isOpen || activeCount > 0 ? "var(--accent-text)" : "var(--text-secondary)",
        }}
      >
        <Filter size={13} />
        Filter
        {activeCount > 0 && (
          <span
            className="text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white"
            style={{ background: "var(--accent)" }}
          >
            {activeCount}
          </span>
        )}
      </button>

      <DropdownPortal anchorRef={btnRef} open={isOpen} onClose={() => setIsOpen(false)} align="right" minWidth={288}>
        <div
          className="rounded border overflow-hidden"
          style={{ background: "var(--bg-card)", borderColor: "var(--border)", boxShadow: "var(--shadow-lg)" }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-2.5"
            style={{ borderBottom: "1px solid var(--border)", background: "var(--bg-subtle)" }}
          >
            <span className="pm-label">Filter issues</span>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded transition-all"
              style={{ color: "var(--text-muted)" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--bg-hover)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = ""; }}
            >
              <X size={13} />
            </button>
          </div>

          <div className="p-4 space-y-5 max-h-[360px] overflow-y-auto custom-scrollbar">
            {/* Due Date */}
            <div>
              <h4 className="pm-label flex items-center gap-1.5 mb-2">
                <Calendar size={11} /> Due date
              </h4>
              <div className="grid grid-cols-2 gap-1.5">
                {dueDates.map((item) => {
                  const isActive = filters.dueDate === item.value;
                  return (
                    <button
                      key={item.value}
                      onClick={() => handleFilterChange("dueDate", item.value)}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded border text-xs font-medium transition-all"
                      style={{
                        background: isActive ? "var(--accent-light)" : "var(--bg-card)",
                        borderColor: isActive ? "var(--accent)" : "var(--border)",
                        color: isActive ? "var(--accent-text)" : "var(--text-secondary)",
                      }}
                    >
                      <item.icon size={12} />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Priority */}
            <div>
              <h4 className="pm-label mb-2">Priority</h4>
              <div className="flex flex-wrap gap-1.5">
                {priorities.map((p) => {
                  const isSelected = filters.priorities.includes(p.label);
                  return (
                    <button
                      key={p.label}
                      onClick={() => handleFilterChange("priorities", p.label)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all"
                      style={{
                        background: isSelected ? "var(--text-primary)" : "var(--bg-hover)",
                        borderColor: isSelected ? "var(--text-primary)" : "var(--border)",
                        color: isSelected ? "#fff" : "var(--text-secondary)",
                      }}
                    >
                      {isSelected && <Check size={10} />}
                      {p.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Assignees */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="pm-label">Assignee</h4>
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full" style={{ background: "var(--bg-hover)", color: "var(--text-muted)" }}>
                  {filteredMembers.length}
                </span>
              </div>
              <div
                className="flex items-center gap-2 px-2.5 py-1.5 rounded border mb-2"
                style={{ background: "var(--bg-subtle)", borderColor: "var(--border)" }}
                onFocusCapture={(e) => { e.currentTarget.style.borderColor = "var(--border-focus)"; }}
                onBlurCapture={(e) => { e.currentTarget.style.borderColor = "var(--border)"; }}
              >
                <Search size={12} style={{ color: "var(--text-muted)" }} className="shrink-0" />
                <input
                  type="text"
                  placeholder="Find member..."
                  className="flex-1 text-xs outline-none bg-transparent"
                  style={{ color: "var(--text-primary)" }}
                  value={searchMember}
                  onChange={(e) => setSearchMember(e.target.value)}
                />
              </div>
              <div className="space-y-0.5 max-h-36 overflow-y-auto custom-scrollbar">
                {filteredMembers.length > 0 ? (
                  filteredMembers.map((member) => (
                    <MembersList key={member.id} member={member} filters={filters} handleFilterChange={handleFilterChange} />
                  ))
                ) : (
                  <div className="py-4 text-center text-xs" style={{ color: "var(--text-muted)" }}>No members found</div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            className="flex items-center justify-between px-4 py-2.5"
            style={{ borderTop: "1px solid var(--border)", background: "var(--bg-subtle)" }}
          >
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              {activeCount > 0 ? `${activeCount} active` : "No filters"}
            </span>
            <button
              onClick={clearAllFilters}
              disabled={activeCount === 0}
              className="text-xs font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ color: "var(--red-text)" }}
            >
              Clear all
            </button>
          </div>
        </div>
      </DropdownPortal>
    </div>
  );
};


