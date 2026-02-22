import React, { useState } from "react";
import { Search, X, ArrowRight, Layout, Clock } from "lucide-react";

const SearchDropdown = ({ tasks, onSelectedTask }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <div className="relative group z-50">
      {/* Icon */}
      <Search
        className={`absolute left-3 top-1/2 -translate-y-1/2 transition ${
          isSearchFocused ? "text-blue-500" : "text-gray-400"
        }`}
        size={16}
      />

      {/* Input Field */}
      <input
        type="text"
        placeholder="Search tasks..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={() => setIsSearchFocused(true)}
        // Blur par band mat karna, nahi to dropdown click hone se pehle hi gayab ho jayega
        className={`pl-9 pr-8 py-2 bg-gray-100 border-transparent focus:bg-white border focus:border-blue-500 rounded-lg text-sm transition-all w-64 outline-none ${
          isSearchFocused ? "w-80 shadow-md ring-4 ring-blue-50/50" : ""
        }`}
      />

      {/* Close Button (Optional: Jab typing shuru ho tab dikhe) */}
      {(searchQuery || isSearchFocused) && (
        <button
          onClick={() => {
            setSearchQuery("");
            setIsSearchFocused(false);
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-200 transition"
        >
          <X size={14} />
        </button>
      )}

      {/* --- THE DROPDOWN (Inside Relative Div) --- */}
      {isSearchFocused && (
        <>
          {/* Backdrop: Outside click handle karne ke liye */}
          <div
            className="fixed inset-0 z-[-1]"
            onClick={() => setIsSearchFocused(false)}
          ></div>

          <div className="absolute left-0 top-full mt-2 w-96 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-left">
            {/* Results List */}
            <div className="max-h-64 overflow-y-auto custom-scrollbar">
              {searchQuery ? (
                // Search Filtering Logic
                tasks
                  .filter((t) =>
                    t.name.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((task) => (
                    <div
                      key={task.id}
                      onClick={() => {
                        onSelectedTask(task)
                        setIsSearchFocused(false);
                      }}
                      className="px-4 py-3 border-b border-gray-50 hover:bg-blue-50 cursor-pointer flex items-center justify-between group transition"
                    >
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 group-hover:text-blue-700">
                          {task.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded font-medium uppercase ${task.color}`}
                          >
                            {task.stage}
                          </span>
                          <span className="text-[10px] text-gray-400">
                            #{task.id}
                          </span>
                        </div>
                      </div>
                      <ArrowRight
                        size={16}
                        className="text-blue-500 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
                      />
                    </div>
                  ))
              ) : (
                // Recent Views
                <div className="p-2">
                  <div className="px-3 py-2 text-xs font-bold text-gray-400 uppercase">
                    Recent
                  </div>
                  <div className="px-3 py-2 hover:bg-gray-50 rounded-lg cursor-pointer flex items-center gap-3 text-gray-600">
                    <Clock size={14} className="text-gray-400" />
                    <span className="text-sm">Server Migration</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SearchDropdown;
