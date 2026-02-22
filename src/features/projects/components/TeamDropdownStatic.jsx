import { Shield, User, Plus, X, Search } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { getUserColor } from "../../../utils/helpers";
import InviteMemberModal from "./InviteMemberModal";

const TeamDropdownStatic = ({ members, projectId }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const visibleMembers = members.slice(0, 2);
  const currentUserId = user?.id;
  const displayedMembers = members
    .filter(
      (member) =>
        member.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      if (a.id === currentUserId) return -1;
      if (b.id === currentUserId) return 1;
      return 0;
    });

  return (
    <>
      <div className="relative inline-block text-left">
        {/* 1. TRIGGER (Avatar Stack) - Ye wahi hai jo tere paas already hai */}
        <div
          className="flex items-center -space-x-2 cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => setIsOpen(!isOpen)}
        >
          {visibleMembers.map((member) => (
            <div
              key={member.id}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 border-white ring-1 ring-gray-100 text-white ${getUserColor(member.id)}`}
              title={member.firstName} // Hover pe naam dikhega
            >
              {member.firstName.charAt(0)} {member.lastName.charAt(0)}
            </div>
          ))}
          {members.length > 2 && (
            <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-xs font-bold border-2 border-white ring-1 ring-gray-100">
              +{members.length - 2}
            </div>
          )}
        </div>

        {/* 2. DROPDOWN CONTENT (Absolute Positioned) */}
        {/* Logic lagana: {isOpen && (...)} */}
        {isOpen && (
          <div className="absolute top-full right-0 mt-3 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
            {/* --- A. HEADER --- */}
            <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <div>
                <h4 className="text-sm font-bold text-gray-800">
                  Project Team
                </h4>
                <p className="text-[11px] text-gray-500 font-medium">
                  {members.length} active members
                </p>
              </div>
              <button
                className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-md transition"
                onClick={() => setIsOpen(false)}
              >
                <X size={16} />
              </button>
            </div>

            {/* --- B. SEARCH BAR (Optional - Good for UX) --- */}
            <div className="px-3 py-2 border-b border-gray-50">
              <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-lg">
                <Search size={14} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Find member..."
                  className="bg-transparent border-none outline-none text-xs w-full text-gray-600 placeholder:text-gray-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* --- C. MEMBER LIST (Scrollable) --- */}
            <div className="max-h-[280px] overflow-y-auto custom-scrollbar p-2 space-y-1">
              {displayedMembers.length > 0 ? (
                displayedMembers.map((member) => {
                  const isMe = member.id === currentUserId;

                  const avatarBg = isMe
                    ? "bg-indigo-600 text-white"
                    : `${getUserColor(member.id)} text-white`;

                  return (
                    <div
                      key={member.id}
                      className={`flex items-center gap-3 p-2 rounded-lg transition-colors group cursor-pointer ${
                        isMe
                          ? "bg-indigo-50/60 hover:bg-indigo-50 border border-indigo-100"
                          : "hover:bg-gray-50 border border-transparent"
                      }`}
                    >
                      {/* Avatar */}
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shadow-sm ${avatarBg}`}
                      >
                        {member.firstName.charAt(0)} {member.lastName.charAt(0)}
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p
                            className={`text-sm font-semibold truncate ${isMe ? "text-indigo-900" : "text-gray-800"}`}
                          >
                            {member.firstName}
                          </p>

                          {/* ✨ "YOU" TAG */}
                          {isMe && (
                            <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded font-bold tracking-wide border border-indigo-200">
                              YOU
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-gray-400 truncate">
                          {member.email}
                        </p>
                      </div>

                      {/* Role Icon */}
                      <div
                        className={`p-1.5 rounded-full ${member.role === "admin" ? "bg-amber-50 text-amber-600" : "text-gray-300"}`}
                      >
                        {member.role === "admin" ? (
                          <Shield size={14} />
                        ) : (
                          <User size={14} />
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-6 text-gray-400 text-xs">
                  No member found
                </div>
              )}
            </div>

            {/* --- D. FOOTER (Action) --- */}
            <div className="p-3 border-t border-gray-100 bg-gray-50">
              <button
                // ✨ HERE IS THE MAGIC
                onClick={() => {
                  setIsOpen(false); // Dropdown band karo
                  setIsInviteModalOpen(true); // Modal kholo
                }}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-white border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-900 shadow-sm transition-all"
              >
                <Plus size={14} />
                Manage Team / Invite
              </button>
            </div>
          </div>
        )}
      </div>

      <InviteMemberModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        projectId={projectId}
      />
    </>
  );
};

export default TeamDropdownStatic;
