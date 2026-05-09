import React, { useMemo, useState } from "react";
import {
  Filter,
  X,
  Search,
  Calendar,
} from "lucide-react";
import {
  dueDates,
} from "../../../constants/filterConstants";
import { PROJECT_TYPES } from "@/constants/projectConstants";
import { ProjectTypesList } from "./filterComponents/ProjectTypesList";

export const ProjectFilter = ({
  filters,
  handleFilterChange,
  clearAllFilters,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchProjectType, setSearchProjectType] = useState("");

  const projectypes = PROJECT_TYPES;

  const filteredProjectTypes = useMemo(() => {
    if (!searchProjectType) return projectypes;
    return projectypes.filter((type) =>
      type.includes(searchProjectType.toLowerCase()),
    );
  }, [searchProjectType, projectypes]);

  const activeCount =
    (filters.dueDate ? 1 : 0) +
    filters.type.length +
    (filters.search ? 1 : 0);

  return (
    <div className="relative">
      {/* FILTER BUTTON */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 border px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm ${
          isOpen || activeCount > 0
            ? "bg-blue-50 border-blue-200 text-blue-700"
            : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        }`}
      >
        <Filter size={16} />
        Filter
        {activeCount > 0 && (
          <span className="ml-1 bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
            {activeCount}
          </span>
        )}
      </button>

      {/* BACKDROP */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* DROPDOWN MENU */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Filters
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-200 transition"
            >
              <X size={14} />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 space-y-6 max-h-[400px] overflow-y-auto custom-scrollbar">
            {/* 2. ✨ NEW: Due Date Grid */}
            <div>
              <h4 className="text-xs font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Calendar size={12} className="text-gray-400" /> Due Date
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {dueDates.map((item) => {
                  const isActive = filters.dueDate === item.value;
                  return (
                    <button
                      key={item.value}
                      onClick={() => handleFilterChange("dueDate", item.value)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-all
                         ${
                           isActive
                             ? `bg-blue-50 border-blue-500 ring-1 ring-blue-500 text-blue-700` // Active State
                             : `${item.color.replace("bg-", "hover:bg-")} border-gray-100 bg-white text-gray-600 hover:border-gray-300` // Normal State
                         }
                       `}
                    >
                      <item.icon
                        size={14}
                        className={isActive ? "text-blue-500" : "opacity-70"}
                      />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* <div>
              <h4 className="text-xs font-semibold text-gray-900 mb-3">
                Priority
              </h4>
              <div className="flex flex-wrap gap-2">
                {priorities.map((p) => {
                  const isSelected = filters.priorities.includes(p.label);
                  return (
                    <button
                      key={p.label}
                      onClick={() => handleFilterChange("priorities", p.label)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all flex items-center gap-1.5 
                        ${
                          isSelected
                            ? "bg-gray-800 text-white border-gray-800 shadow-sm"
                            : `${p.color} border-transparent`
                        }`}
                    >
                      {isSelected && <Check size={12} />}
                      {p.label}
                    </button>
                  );
                })}
              </div>
            </div> */}

            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-semibold text-gray-900">
                  Categories
                </h4>
                <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full font-medium">
                  {filteredProjectTypes.length}
                </span>
              </div>
              <div className="relative mb-2">
                <Search
                  className="absolute left-2.5 top-2 text-gray-400 pointer-events-none"
                  size={13}
                />
                <input
                  type="text"
                  placeholder="Find Project Type..."
                  className="w-full bg-white border border-gray-200 rounded-md pl-8 pr-3 py-1.5 text-xs text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition placeholder:text-gray-400"
                  value={searchProjectType}
                  onChange={(e) => setSearchProjectType(e.target.value)}
                />
              </div>
              <div className="space-y-0.5 max-h-[160px] overflow-y-auto pr-1 custom-scrollbar">
                {filteredProjectTypes.length > 0 ? (
                  filteredProjectTypes.map((type,index) => (
                    <ProjectTypesList
                      key={index}
                      type={type}
                      typeId={index}
                      filters={filters}
                      handleFilterChange={handleFilterChange}
                    />
                  ))
                ) : (
                  /* Yahan se 'hidden' hata diya aur padding badha di */
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="bg-gray-50 p-2.5 rounded-full mb-2">
                      <Search size={16} className="text-gray-300" />
                    </div>
                    <p className="text-[11px] font-medium text-gray-400">
                      No Category found
                    </p>
                    <p className="text-[10px] text-gray-300">
                      Try a different search
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-gray-100 bg-gray-50/30 flex justify-between items-center">
            <span className="text-xs text-gray-500">
              {activeCount > 0
                ? `${activeCount} filters active`
                : "No filters active"}
            </span>
            <button
              onClick={clearAllFilters}
              disabled={activeCount === 0}
              className="text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Clear all
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
