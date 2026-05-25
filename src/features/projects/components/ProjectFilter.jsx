import React, { useMemo, useState, useRef } from "react";
import { Filter, X, Search, Calendar } from "lucide-react";
import { dueDates } from "../../../constants/filterConstants";
import { PROJECT_TYPES } from "@/constants/projectConstants";
import { ProjectTypesList } from "./filterComponents/ProjectTypesList";
import { DropdownPortal } from "@/components/ui/DropdownPortal";

export const ProjectFilter = ({ filters, handleFilterChange, clearAllFilters }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchProjectType, setSearchProjectType] = useState("");
  const btnRef = useRef(null);

  const filteredProjectTypes = useMemo(() => {
    if (!searchProjectType) return PROJECT_TYPES;
    return PROJECT_TYPES.filter((type) =>
      type.toLowerCase().includes(searchProjectType.toLowerCase())
    );
  }, [searchProjectType]);

  const activeCount =
    (filters.dueDate ? 1 : 0) +
    filters.type.length +
    (filters.search ? 1 : 0);

  return (
    <div className="relative">
      <button
        ref={btnRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded border text-sm font-medium transition-all"
        style={{
          background: isOpen || activeCount > 0 ? "#e8f0fe" : "#fff",
          borderColor: isOpen || activeCount > 0 ? "#4c9aff" : "#dfe1e6",
          color: isOpen || activeCount > 0 ? "#0052cc" : "#6b778c",
        }}
      >
        <Filter size={13} />
        Filter
        {activeCount > 0 && (
          <span
            className="text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white"
            style={{ background: "#0052cc" }}
          >
            {activeCount}
          </span>
        )}
      </button>

      {/* Dropdown using Portal */}
      <DropdownPortal
        anchorRef={btnRef}
        open={isOpen}
        onClose={() => setIsOpen(false)}
        align="right"
        minWidth={288}
      >
        <div
          className="w-72 rounded shadow-xl border fade-in overflow-hidden"
          style={{ background: "#fff", borderColor: "#dfe1e6" }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-2.5"
            style={{ borderBottom: "1px solid #dfe1e6", background: "#f4f5f7" }}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#6b778c" }}>
              Filter projects
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded transition-all"
              style={{ color: "#97a0af" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#ebecf0"; e.currentTarget.style.color = "#172b4d"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = ""; e.currentTarget.style.color = "#97a0af"; }}
            >
              <X size={13} />
            </button>
          </div>

          <div className="p-4 space-y-5 max-h-[360px] overflow-y-auto custom-scrollbar">
            {/* Due Date */}
            <div>
              <h4 className="pm-label flex items-center gap-1.5 mb-2">
                <Calendar size={11} /> Deadline
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
                        background: isActive ? "#e8f0fe" : "#fff",
                        borderColor: isActive ? "#4c9aff" : "#dfe1e6",
                        color: isActive ? "#0052cc" : "#6b778c",
                      }}
                    >
                      <item.icon size={12} />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Project Type */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="pm-label">Project type</h4>
                <span
                  className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                  style={{ background: "#f4f5f7", color: "#6b778c" }}
                >
                  {filteredProjectTypes.length}
                </span>
              </div>

              <div
                className="flex items-center gap-2 px-2.5 py-1.5 rounded border mb-2"
                style={{ background: "#fafbfc", borderColor: "#dfe1e6" }}
                onFocusCapture={(e) => { e.currentTarget.style.borderColor = "#4c9aff"; }}
                onBlurCapture={(e) => { e.currentTarget.style.borderColor = "#dfe1e6"; }}
              >
                <Search size={12} style={{ color: "#97a0af" }} className="shrink-0" />
                <input
                  type="text"
                  placeholder="Find type..."
                  className="flex-1 text-xs outline-none bg-transparent"
                  style={{ color: "#172b4d" }}
                  value={searchProjectType}
                  onChange={(e) => setSearchProjectType(e.target.value)}
                />
              </div>

              <div className="space-y-0.5 max-h-36 overflow-y-auto custom-scrollbar">
                {filteredProjectTypes.length > 0 ? (
                  filteredProjectTypes.map((type, index) => (
                    <ProjectTypesList
                      key={index}
                      type={type}
                      typeId={index}
                      filters={filters}
                      handleFilterChange={handleFilterChange}
                    />
                  ))
                ) : (
                  <div className="py-4 text-center">
                    <p className="text-xs" style={{ color: "#97a0af" }}>No types found</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            className="flex items-center justify-between px-4 py-2.5"
            style={{ borderTop: "1px solid #dfe1e6", background: "#f4f5f7" }}
          >
            <span className="text-xs" style={{ color: "#97a0af" }}>
              {activeCount > 0 ? `${activeCount} active` : "No filters"}
            </span>
            <button
              onClick={clearAllFilters}
              disabled={activeCount === 0}
              className="text-xs font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ color: "#de350b" }}
            >
              Clear all
            </button>
          </div>
        </div>
      </DropdownPortal>
    </div>
  );
};
