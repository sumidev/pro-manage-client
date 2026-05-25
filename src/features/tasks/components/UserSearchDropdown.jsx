import React, { useState, useRef, useEffect, useMemo } from "react";
import { Search, Check, UserCircle2 } from "lucide-react";
import { DropdownPortal } from "@/components/ui/DropdownPortal";
import InviteMemberButton from "@/components/ui/InviteMemberButton";
import {
  normalizeMembersForDropdown,
  getMemberInitials,
} from "@/utils/memberUtils";

const UserSearchDropdown = ({
  users = [],
  selectedUserId,
  onSelect,
  label = "Assignee",
  placeholder = "Select member...",
  projectId,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  const normalizedUsers = useMemo(
    () => normalizeMembersForDropdown(users),
    [users],
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredUsers = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return normalizedUsers.filter((user) => {
      const name = `${user.firstName} ${user.lastName}`.toLowerCase();
      return name.includes(q) || (user.email || "").toLowerCase().includes(q);
    });
  }, [normalizedUsers, searchTerm]);

  const selectedUser = normalizedUsers.find((u) => u.id === selectedUserId);
  const hasMembers = normalizedUsers.length > 0;

  return (
    <div className="space-y-1.5 flex-1 min-w-0" ref={dropdownRef}>
      {label ? (
        <label className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
          {label}
        </label>
      ) : null}

      {!hasMembers && projectId ? (
        <div
          className="rounded-lg p-3 space-y-2"
          style={{ background: "var(--bg-subtle)", border: "1px solid var(--border)" }}
        >
          <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
            No team members yet. Invite someone to assign this issue.
          </p>
          <InviteMemberButton projectId={projectId} label="Invite team member" />
        </div>
      ) : (
        <div className="relative">
          <div
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 p-1.5 -ml-1.5 rounded-lg cursor-pointer transition-colors w-fit"
            style={{ color: "var(--text-primary)" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "var(--bg-hover)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = ""; }}
          >
            {selectedUser ? (
              <>
                {selectedUser.avatar ? (
                  <img
                    src={selectedUser.avatar}
                    alt=""
                    className="w-6 h-6 rounded-full object-cover"
                  />
                ) : (
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold"
                    style={{ background: "var(--accent-light)", color: "var(--accent-text)" }}
                  >
                    {getMemberInitials(selectedUser)}
                  </div>
                )}
                <span className="text-sm font-medium">
                  {selectedUser.firstName} {selectedUser.lastName}
                </span>
              </>
            ) : (
              <>
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ border: "1px dashed var(--border)", color: "var(--text-muted)" }}
                >
                  <UserCircle2 size={14} />
                </div>
                <span className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
                  {placeholder}
                </span>
              </>
            )}
          </div>

          <DropdownPortal
            anchorRef={dropdownRef}
            open={isOpen}
            onClose={() => { setIsOpen(false); setSearchTerm(""); }}
            align="left"
            minWidth={256}
          >
            <div
              className="rounded border overflow-hidden fade-in"
              style={{
                background: "var(--bg-card)",
                borderColor: "var(--border)",
                boxShadow: "var(--shadow-lg)",
              }}
            >
              <div className="p-2" style={{ borderBottom: "1px solid var(--border)", background: "var(--bg-subtle)" }}>
                <div className="relative flex items-center">
                  <Search size={14} className="absolute left-2.5" style={{ color: "var(--text-muted)" }} />
                  <input
                    type="text"
                    autoFocus
                    placeholder="Search members..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-sm rounded border outline-none pm-input"
                  />
                </div>
              </div>

              <div className="max-h-60 overflow-y-auto p-1 custom-scrollbar">
                <div
                  onClick={() => {
                    onSelect(null);
                    setIsOpen(false);
                    setSearchTerm("");
                  }}
                  className="flex items-center gap-2.5 p-2 rounded-md cursor-pointer transition-all"
                  style={{
                    background: !selectedUserId ? "var(--accent-light)" : "transparent",
                  }}
                  onMouseEnter={(e) => { if (selectedUserId) e.currentTarget.style.background = "var(--bg-hover)"; }}
                  onMouseLeave={(e) => { if (selectedUserId) e.currentTarget.style.background = "transparent"; }}
                >
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ border: "1px dashed var(--border)", color: "var(--text-muted)" }}
                  >
                    <UserCircle2 size={14} />
                  </div>
                  <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                    Unassigned
                  </span>
                  {!selectedUserId && <Check size={16} style={{ color: "var(--accent)", marginLeft: "auto" }} />}
                </div>

                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      onClick={() => {
                        onSelect(user);
                        setIsOpen(false);
                        setSearchTerm("");
                      }}
                      className="flex items-center justify-between p-2 rounded-md cursor-pointer transition-all"
                      style={{
                        background: selectedUserId === user.id ? "var(--accent-light)" : "transparent",
                      }}
                      onMouseEnter={(e) => {
                        if (selectedUserId !== user.id) e.currentTarget.style.background = "var(--bg-hover)";
                      }}
                      onMouseLeave={(e) => {
                        if (selectedUserId !== user.id) e.currentTarget.style.background = "transparent";
                      }}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {user.avatar ? (
                          <img src={user.avatar} alt="" className="w-7 h-7 rounded-full object-cover shrink-0" />
                        ) : (
                          <div
                            className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                            style={{ background: "var(--bg-hover)", color: "var(--text-primary)" }}
                          >
                            {getMemberInitials(user)}
                          </div>
                        )}
                        <div className="flex flex-col min-w-0">
                          <span
                            className="text-sm font-medium truncate"
                            style={{
                              color: selectedUserId === user.id ? "var(--accent-text)" : "var(--text-primary)",
                            }}
                          >
                            {user.firstName} {user.lastName}
                          </span>
                          {user.email && (
                            <span className="text-[10px] truncate" style={{ color: "var(--text-muted)" }}>
                              {user.email}
                            </span>
                          )}
                        </div>
                      </div>
                      {selectedUserId === user.id && (
                        <Check size={16} style={{ color: "var(--accent)" }} />
                      )}
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-center text-xs" style={{ color: "var(--text-muted)" }}>
                    No members match your search
                  </div>
                )}
              </div>

              {projectId && (
                <div className="p-2" style={{ borderTop: "1px solid var(--border)" }}>
                  <InviteMemberButton
                    projectId={projectId}
                    label="Invite member"
                    className="w-full"
                  />
                </div>
              )}
            </div>
          </DropdownPortal>
        </div>
      )}
    </div>
  );
};

export default UserSearchDropdown;
