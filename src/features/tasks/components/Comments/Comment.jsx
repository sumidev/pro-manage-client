import React, { useState } from "react";
import {
  MessageSquare,
  MoreHorizontal,
  FileText,
  Download,
  Send,
} from "lucide-react";

// ✨ NEW PROP: isReply = false (Default main comment rahega)
export const Comment = ({ comment, onSubmitReply, isReply = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");

  const formattedDate = comment?.created_at
    ? new Date(comment.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Just now";

  const avatarUrl =
    comment?.user?.avatar ||
    `https://ui-avatars.com/api/?name=${comment?.user?.name?.replace(
      " ",
      "+"
    )}&background=F3F4F6&color=374151&bold=true`;

  const handleSendReply = () => {
    // Ye hamesha jis comment pe click kiya hai, uski id parent_id banakar bhejega
    onSubmitReply(comment.id, replyText);
    setIsReplying(false);
    setReplyText("");
  };

  return (
    <div className="w-full">
      {/* === ACTUAL COMMENT UI === */}
      {/* Agar reply hai toh padding kam rakhi hai (pl-9), main hai toh (pl-12) */}
      <div
        className={`relative group ${isReply ? "pl-9" : "pl-12"}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* AVATAR: Reply ke case me thoda chota dikhega */}
        <img
          src={avatarUrl}
          className={`absolute left-0 top-0 rounded-full border-2 border-white shadow-sm z-10 bg-white object-cover ${
            isReply ? "w-6 h-6 mt-1" : "w-8 h-8"
          }`}
          alt={comment?.user?.name || "User"}
        />

        <div className="bg-transparent group-hover:bg-gray-50/70 p-2.5 -ml-2.5 rounded-xl transition-colors duration-200">
          <div className="flex justify-between items-center mb-1.5">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-gray-900">
                {comment?.user?.name || "Unknown User"}
              </span>
              <span className="text-xs font-medium text-gray-400">
                {formattedDate}
              </span>
            </div>

            <button
              className={`p-1 text-gray-400 hover:text-gray-800 hover:bg-gray-200 rounded transition-all duration-200 ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
            >
              <MoreHorizontal size={16} />
            </button>
          </div>

          <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap mb-3">
            {comment?.description}
          </div>

          <div className="flex items-center gap-4 mt-1">
            <button
              onClick={() => setIsReplying(!isReplying)}
              className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-gray-500 hover:text-indigo-600 transition-colors"
            >
              <MessageSquare size={13} />
              Reply
            </button>
          </div>

          {/* INLINE REPLY INPUT */}
          {isReplying && (
            <div className="mt-3 bg-white border border-gray-200 rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 overflow-hidden transition-all">
              <textarea
                autoFocus
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={`Replying to ${comment?.user?.name || "User"}...`}
                className="w-full p-3 text-sm focus:outline-none min-h-[60px] resize-none"
              />
              <div className="flex justify-end gap-2 p-2 bg-gray-50 border-t border-gray-100">
                <button
                  onClick={() => {
                    setIsReplying(false);
                    setReplyText("");
                  }}
                  className="px-3 py-1.5 text-xs font-semibold text-gray-500 hover:bg-gray-200 rounded-md transition"
                >
                  Cancel
                </button>
                <button
                  disabled={!replyText.trim()}
                  onClick={handleSendReply}
                  className="bg-indigo-600 text-white px-3 py-1.5 rounded-md text-xs font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition flex items-center gap-1.5 shadow-sm"
                >
                  Reply <Send size={12} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* === NESTED REPLIES RENDERER (DEPTH-1 ONLY) === */}
      {/* Agar main comment hai (isReply false) aur uske andar replies hain, tabhi ye block chalega */}
      {!isReply && comment?.replies && comment.replies.length > 0 && (
        <div className="mt-1 mb-4 ml-12 relative space-y-2">
          {/* Thread Line (Visual Connection) */}
          <div className="absolute left-[-24px] top-[-10px] bottom-4 w-0.5 bg-gray-200 rounded-full z-0"></div>

          {/* Map through flattened replies array */}
          {comment.replies.map((replyItem) => (
            <Comment
              key={replyItem.id}
              comment={replyItem}
              onSubmitReply={onSubmitReply}
              isReply={true} // ✨ Ye prop bhej diya taaki wo as a reply style ho, aur uske andar further nesting na ho!
            />
          ))}
        </div>
      )}
    </div>
  );
};