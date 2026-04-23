import React, { useState } from "react";
import { MessageSquare, MoreHorizontal, FileText, Download } from "lucide-react";

export const Comment = ({ comment }) => {
  const [isHovered, setIsHovered] = useState(false);

  // 1. Safe Date Formatting (Fallback to 'Just now' if parsing fails)
  const formattedDate = comment?.created_at
    ? new Date(comment.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Just now";

  // 2. Dynamic Avatar fallback
  const avatarUrl =
    comment?.user?.avatar ||
    `https://ui-avatars.com/api/?name=${comment?.user?.name?.replace(
      " ",
      "+"
    )}&background=F3F4F6&color=374151&bold=true`;

  return (
    <div
      className="relative pl-12 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Avatar on the timeline */}
      <img
        src={avatarUrl}
        className="absolute left-0 top-0 w-8 h-8 rounded-full border-2 border-white shadow-sm z-10 bg-white object-cover"
        alt={comment?.user?.name || "User"}
      />

      {/* Main Comment Body (Subtle hover background instead of heavy borders) */}
      <div className="bg-transparent group-hover:bg-gray-50/70 p-2.5 -ml-2.5 rounded-xl transition-colors duration-200">
        
        {/* Header: Name, Date, Options */}
        <div className="flex justify-between items-center mb-1.5">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-gray-900">
              {comment?.user?.name || "Unknown User"}
            </span>
            <span className="text-xs font-medium text-gray-400">
              {formattedDate}
            </span>
          </div>

          {/* Hover Options (Edit/Delete placeholder) */}
          <button
            className={`p-1 text-gray-400 hover:text-gray-800 hover:bg-gray-200 rounded transition-all duration-200 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            <MoreHorizontal size={16} />
          </button>
        </div>

        {/* Text Content (whitespace-pre-wrap handles multiline spacing properly) */}
        <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap mb-3">
          {comment?.description}
        </div>

        {/* ATTACHMENTS SECTION (Design Mockup) */}
        {/* Is condition ko baad me `comment?.attachments?.length > 0` kar denge */}
        <div className="flex flex-wrap gap-3 mb-3">
          {/* Example File Card */}
          <div className="flex items-center gap-3 p-2 pr-3 rounded-lg border border-gray-200 bg-white hover:border-gray-300 transition-colors cursor-pointer group/file shadow-sm">
            <div className="w-8 h-8 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <FileText size={16} />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-gray-700 truncate max-w-[150px]">
                api_response_log.txt
              </span>
              <span className="text-[10px] font-medium text-gray-400">
                12 KB
              </span>
            </div>
            <button className="opacity-0 group-hover/file:opacity-100 ml-2 p-1 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-all">
              <Download size={14} />
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center gap-4 mt-1">
          <button className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-gray-500 hover:text-indigo-600 transition-colors">
            <MessageSquare size={13} />
            Reply
          </button>
        </div>
        
      </div>
    </div>
  );
};