import { Shield, User, Plus, X, Search, UserPlus } from "lucide-react";
import { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { getUserColor } from "../../../utils/helpers";
import InviteMemberModal from "./InviteMemberModal";
import { DropdownPortal } from "@/components/ui/DropdownPortal";
import { getMemberAvatarUrl } from "@/utils/memberUtils";

// Helper — API returns snake_case, some places use camelCase
const getFirstName = (m) => m.first_name || m.firstName || "";
const getLastName  = (m) => m.last_name  || m.lastName  || "";
const getInitials  = (m) => `${getFirstName(m).charAt(0)}${getLastName(m).charAt(0)}`.toUpperCase();

const TeamDropdownStatic = ({ members = [], projectId }) => {
  const [searchTerm, setSearchTerm]           = useState("");
  const [isOpen, setIsOpen]                   = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const anchorRef = useRef(null);

  const { user } = useSelector((state) => state.auth);
  const currentUserId = user?.id;

  const visibleMembers  = members.slice(0, 3);
  const extraCount      = members.length - 3;

  const displayedMembers = members
    .filter((m) => {
      const name = `${getFirstName(m)} ${getLastName(m)}`.toLowerCase();
      return (
        name.includes(searchTerm.toLowerCase()) ||
        (m.email || "").toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
    .sort((a, b) => {
      if (a.id === currentUserId) return -1;
      if (b.id === currentUserId) return 1;
      return 0;
    });

  return (
    <>
      <div className="relative" ref={anchorRef}>
        {/* Avatar stack trigger */}
        <div
          className="flex items-center -space-x-2 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          {visibleMembers.map((member) => (
            <div
              key={member.id}
              className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white ring-2 ring-white overflow-hidden ${getUserColor(member.id)}`}
              title={`${getFirstName(member)} ${getLastName(member)}`}
            >
              {getMemberAvatarUrl(member) ? (
                <img
                  src={getMemberAvatarUrl(member)}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                getInitials(member)
              )}
            </div>
          ))}
          {extraCount > 0 && (
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold ring-2 ring-white"
              style={{ background: "var(--bg-hover)", color: "var(--text-secondary)" }}
            >
              +{extraCount}
            </div>
          )}
          {members.length === 0 && (
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center ring-2 ring-white"
              style={{ background: "var(--bg-hover)", color: "var(--text-muted)" }}
            >
              <User size={13} />
            </div>
          )}
        </div>

        {/* Dropdown via Portal */}
        <DropdownPortal
          anchorRef={anchorRef}
          open={isOpen}
          onClose={() => setIsOpen(false)}
          align="right"
          minWidth={288}
        >
          <div
            className="w-72 rounded border overflow-hidden fade-in"
            style={{
              background: "var(--bg-card)",
              borderColor: "var(--border)",
              boxShadow: "var(--shadow-xl)",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3"
              style={{ borderBottom: "1px solid var(--border)", background: "var(--bg-subtle)" }}
            >
              <div>
                <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                  Project team
                </p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {members.length} member{members.length !== 1 ? "s" : ""}
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded transition-all"
                style={{ color: "var(--text-muted)" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "var(--bg-hover)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = ""; }}
              >
                <X size={14} />
              </button>
            </div>

            {/* Search */}
            <div className="px-3 py-2" style={{ borderBottom: "1px solid var(--border)" }}>
              <div
                className="flex items-center gap-2 px-2.5 py-1.5 rounded"
                style={{ background: "var(--bg-hover)" }}
              >
                <Search size={12} style={{ color: "var(--text-muted)" }} />
                <input
                  type="text"
                  placeholder="Find member..."
                  className="flex-1 text-xs outline-none bg-transparent"
                  style={{ color: "var(--text-primary)" }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Member list */}
            <div className="max-h-56 overflow-y-auto custom-scrollbar p-2 space-y-0.5">
              {displayedMembers.length > 0 ? (
                displayedMembers.map((member) => {
                  const isMe = member.id === currentUserId;
                  return (
                    <div
                      key={member.id}
                      className="flex items-center gap-2.5 px-2 py-2 rounded transition-all cursor-default"
                      style={{
                        background: isMe ? "var(--accent-light)" : "transparent",
                        border: isMe ? "1px solid rgba(99,102,241,0.2)" : "1px solid transparent",
                      }}
                      onMouseEnter={(e) => { if (!isMe) e.currentTarget.style.background = "var(--bg-hover)"; }}
                      onMouseLeave={(e) => { if (!isMe) e.currentTarget.style.background = "transparent"; }}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 overflow-hidden ${getUserColor(member.id)}`}
                      >
                        {getMemberAvatarUrl(member) ? (
                          <img
                            src={getMemberAvatarUrl(member)}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          getInitials(member)
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>
                            {getFirstName(member)} {getLastName(member)}
                          </p>
                          {isMe && (
                            <span
                              className="text-[9px] font-bold px-1 py-0.5 rounded uppercase"
                              style={{ background: "var(--accent-light)", color: "var(--accent-text)" }}
                            >
                              You
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] truncate" style={{ color: "var(--text-muted)" }}>
                          {member.email}
                        </p>
                      </div>
                      <div style={{ color: member.role === "admin" ? "#f59e0b" : "var(--text-muted)" }}>
                        {member.role === "admin" ? <Shield size={13} /> : <User size={13} />}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-6 text-center text-xs" style={{ color: "var(--text-muted)" }}>
                  No members found
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-2" style={{ borderTop: "1px solid var(--border)" }}>
              <button
                onClick={() => { setIsOpen(false); setIsInviteModalOpen(true); }}
                className="w-full flex items-center justify-center gap-1.5 py-2 rounded text-xs font-semibold transition-all"
                style={{ background: "var(--bg-hover)", color: "var(--text-primary)", border: "1px solid var(--border)" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "var(--bg-active)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "var(--bg-hover)"; }}
              >
                <UserPlus size={13} />
                Invite member
              </button>
            </div>
          </div>
        </DropdownPortal>
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
