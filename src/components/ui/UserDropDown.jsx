import { Search, User } from "lucide-react";
import React from "react";

export const UserDropDown = () => {
  return (
    <>
      <div className="px-3 py-2 border-b border-gray-50">
        <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-lg">
          <Search size={14} className="text-gray-400" />
          <input
            type="text"
            placeholder="Find member..."
            className="bg-transparent border-none outline-none text-xs w-full text-gray-600 placeholder:text-gray-400"
            value=""
            onChange=""
          />
        </div>
      </div>

      {/* --- C. MEMBER LIST (Scrollable) --- */}
      <div className="max-h-[280px] overflow-y-auto custom-scrollbar p-2 space-y-1">
        <div
          className={`flex items-center gap-3 p-2 rounded-lg transition-colors group cursor-pointer 
                    hover:bg-gray-50 border border-transparent`}
        >
          {/* Avatar */}
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shadow-sm `}
          >
            SC
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className={`text-sm font-semibold truncate text-gray-800`}>
                Sumit
              </p>

              {/* ✨ "YOU" TAG
                    {isMe && (
                      <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded font-bold tracking-wide border border-indigo-200">
                        YOU
                      </span>
                    )} */}
            </div>
            <p className="text-[11px] text-gray-400 truncate">test@gmail.com</p>
          </div>

          {/* Role Icon */}
          <div className={`p-1.5 rounded-full text-gray-300`}>
            <User size={14} />
          </div>
        </div>
      </div>
    </>
  );
};
