import React, { useState, useRef, useMemo } from "react";
import {
  MessageSquare,
  MoreHorizontal,
  FileText,
  Download,
  Send,
  Paperclip,
  X,
} from "lucide-react";

const flattenReplies = (replies) => {
  let flat = [];
  if (!replies) return flat;
  for (const r of replies) {
    flat.push(r);
    if (r.replies && r.replies.length > 0) {
      flat = flat.concat(flattenReplies(r.replies));
    }
  }
  return flat;
};

// ✨ NEW PROP: isReply = false (Default main comment rahega)
export const Comment = ({ comment, onSubmitReply, isReply = false, parentCommentUser = null }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replyFile, setReplyFile] = useState(null);
  const fileInputRef = useRef(null);

  const flattenedReplies = useMemo(() => {
    if (isReply || !comment?.replies) return [];
    const list = flattenReplies(comment.replies);
    return list.sort((a, b) => new Date(a.created_at || 0) - new Date(b.created_at || 0));
  }, [comment?.replies, isReply]);

  const commentUserMap = useMemo(() => {
    if (isReply) return {};
    const map = {};
    if (comment?.id) {
      map[comment.id] = comment.user;
    }
    flattenedReplies.forEach((r) => {
      if (r.id) {
        map[r.id] = r.user;
      }
    });
    return map;
  }, [comment, flattenedReplies, isReply]);

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

  const isImage = (url) => {
    if (!url || typeof url !== 'string') return false;
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(url.split('?')[0]);
  };

  const handleSendReply = () => {
    // Ye hamesha jis comment pe click kiya hai, uski id parent_id banakar bhejega
    onSubmitReply(comment.id, replyText, replyFile);
    setIsReplying(false);
    setReplyText("");
    setReplyFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleScrollToParent = (parentId) => {
    if (!parentId) return;
    const parentEl = document.getElementById(`comment-${parentId}`);
    if (parentEl) {
      parentEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const innerDiv = parentEl.querySelector('.comment-inner');
      if (innerDiv) {
        innerDiv.classList.add('bg-indigo-50', 'ring-2', 'ring-indigo-200');
        setTimeout(() => {
          innerDiv.classList.remove('bg-indigo-50', 'ring-2', 'ring-indigo-200');
        }, 1500);
      }
    }
  };

  return (
    <div id={`comment-${comment.id}`} className="w-full">
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

        <div className="comment-inner bg-transparent group-hover:bg-gray-50/70 p-2.5 -ml-2.5 rounded-xl transition-all duration-500">
          <div className="flex justify-between items-center mb-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-bold text-gray-900">
                {comment?.user?.name || "Unknown User"}
              </span>
              {parentCommentUser && (
                <span 
                  onClick={() => handleScrollToParent(comment.parent_id)}
                  className="text-xs font-semibold text-indigo-600 bg-indigo-50/80 hover:bg-indigo-100 px-2 py-0.5 rounded flex items-center gap-1 border border-indigo-100/50 cursor-pointer transition-colors"
                >
                  Replying to {parentCommentUser.name}
                </span>
              )}
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

          {comment?.description && (
            <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap mb-3">
              {comment.description}
            </div>
          )}

          {comment?.attachments && comment.attachments.length > 0 && (
            <div className="mt-2 mb-3 flex flex-wrap gap-2">
              {comment.attachments.map((attach) => {
                const url = attach.url;
                const name = attach.name || "Attachment";
                return isImage(url) ? (
                  <a key={attach.id || url} href={url} target="_blank" rel="noopener noreferrer" className="block max-w-sm">
                    <img
                      src={url}
                      alt={name}
                      className="max-h-48 max-w-full rounded-md border border-gray-200 shadow-sm object-contain"
                    />
                  </a>
                ) : (
                  <a
                    key={attach.id || url}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    <FileText size={16} className="text-gray-500" />
                    <span className="text-xs font-medium text-gray-700 truncate max-w-[200px]" title={name}>
                      {name}
                    </span>
                    <Download size={14} className="text-gray-400 ml-2" />
                  </a>
                );
              })}
            </div>
          )}

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
              
              {replyFile && (
                <div className="px-3 py-2 flex items-center gap-2 text-xs bg-gray-50 border-t border-gray-100">
                  <Paperclip size={12} className="text-gray-500" />
                  <span className="truncate flex-1 font-medium text-gray-800">{replyFile.name}</span>
                  <button onClick={() => { setReplyFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }} className="p-1 hover:bg-gray-200 rounded">
                    <X size={12} />
                  </button>
                </div>
              )}

              <div className="flex justify-between items-center p-2 bg-gray-50 border-t border-gray-100">
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setReplyFile(e.target.files[0]);
                    }
                  }}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-1.5 text-gray-400 hover:text-gray-800 hover:bg-gray-200 rounded transition-all duration-200"
                >
                  <Paperclip size={14} />
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setIsReplying(false);
                      setReplyText("");
                      setReplyFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="px-3 py-1.5 text-xs font-semibold text-gray-500 hover:bg-gray-200 rounded-md transition"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={!replyText.trim() && !replyFile}
                    onClick={handleSendReply}
                    className="bg-indigo-600 text-white px-3 py-1.5 rounded-md text-xs font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition flex items-center gap-1.5 shadow-sm"
                  >
                    Reply <Send size={12} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* === NESTED REPLIES RENDERER (FLATTENED) === */}
      {/* Agar main comment hai (isReply false) aur uske andar replies hain, tabhi ye block chalega */}
      {!isReply && flattenedReplies && flattenedReplies.length > 0 && (
        <div className="mt-1 mb-4 ml-12 relative space-y-2">
          {/* Thread Line (Visual Connection) */}
          <div className="absolute left-[-24px] top-[-10px] bottom-4 w-0.5 bg-gray-200 rounded-full z-0"></div>

          {/* Map through flattened replies array */}
          {flattenedReplies.map((replyItem) => {
            const parentUser = commentUserMap[replyItem.parent_id];
            return (
              <Comment
                key={replyItem.id}
                comment={replyItem}
                onSubmitReply={onSubmitReply}
                isReply={true} // ✨ Ye prop bhej diya taaki wo as a reply style ho, aur uske andar further nesting na ho!
                parentCommentUser={parentUser}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};