import React from "react";
import { Search, ChevronLeft, ChevronRight, Shield, Users } from "lucide-react";
import UsersTableSkeleton from "@/components/skeletons/UsersTableSkeleton";
import { getMemberAvatarUrl } from "@/utils/memberUtils";

const roleConfig = {
  admin:    { bg: "#ffebe6", color: "#bf2600", label: "Admin" },
  employee: { bg: "#e8f0fe", color: "#0052cc", label: "Employee" },
  client:   { bg: "#e3fcef", color: "#006644", label: "Client" },
};

const getInitials = (firstName, lastName) =>
  `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();

const avatarColors = [
  "#0052cc", "#6554c0", "#00875a", "#ff5630", "#ff991f", "#00b8d9",
];
const getAvatarColor = (id) => avatarColors[(id || 0) % avatarColors.length];

const SystemRoleManagerUI = ({
  users,
  loading,
  searchTerm,
  onSearchChange,
  onRoleChange,
  page,
  totalPages,
  onPageChange,
}) => {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold" style={{ color: "#172b4d" }}>
            User management
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "#6b778c" }}>
            Manage system roles and permissions
          </p>
        </div>
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wide"
          style={{ background: "#ffebe6", color: "#bf2600", border: "1px solid #ff8f73" }}
        >
          <Shield size={12} />
          Admin only
        </div>
      </div>

      {/* Toolbar */}
      <div
        className="flex items-center gap-3 mb-4 pb-4"
        style={{ borderBottom: "1px solid #dfe1e6" }}
      >
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded border flex-1 max-w-xs"
          style={{ background: "#fff", borderColor: "#dfe1e6" }}
          onFocusCapture={(e) => { e.currentTarget.style.borderColor = "#4c9aff"; e.currentTarget.style.boxShadow = "0 0 0 2px #4c9aff40"; }}
          onBlurCapture={(e) => { e.currentTarget.style.borderColor = "#dfe1e6"; e.currentTarget.style.boxShadow = ""; }}
        >
          <Search size={13} style={{ color: "#97a0af" }} className="shrink-0" />
          <input
            type="text"
            placeholder="Search users..."
            className="flex-1 text-sm outline-none bg-transparent"
            style={{ color: "#172b4d" }}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div
          className="flex items-center gap-1.5 text-xs font-medium"
          style={{ color: "#6b778c" }}
        >
          <Users size={13} />
          {users.length} user{users.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Table */}
      <div
        className="rounded border overflow-hidden mb-4"
        style={{ background: "#fff", borderColor: "#dfe1e6" }}
      >
        {/* Table header */}
        <div
          className="grid grid-cols-12 px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider"
          style={{ background: "#f4f5f7", borderBottom: "1px solid #dfe1e6", color: "#6b778c" }}
        >
          <span className="col-span-4">User</span>
          <span className="col-span-5">Email</span>
          <span className="col-span-3">Role</span>
        </div>

        {loading && users.length === 0 ? (
          <UsersTableSkeleton rows={8} />
        ) : users.length === 0 ? (
          <div className="py-12 text-center">
            <Users size={28} className="mx-auto mb-2" style={{ color: "#dfe1e6" }} />
            <p className="text-sm" style={{ color: "#6b778c" }}>No users found</p>
          </div>
        ) : (
          users.map((user, i) => {
            const rc = roleConfig[user.system_role] || roleConfig.client;
            return (
              <div
                key={user.id}
                className="grid grid-cols-12 px-4 py-3 items-center transition-all"
                style={{ borderBottom: i < users.length - 1 ? "1px solid #f4f5f7" : "none" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#f4f5f7"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = ""; }}
              >
                {/* Name */}
                <div className="col-span-4 flex items-center gap-2.5 min-w-0">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                    style={{ background: getAvatarColor(user.id) }}
                  >
                    {getMemberAvatarUrl(user) ? (
                      <img
                        src={getMemberAvatarUrl(user)}
                        alt=""
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      getInitials(user.first_name, user.last_name)
                    )}
                  </div>
                  <span className="text-sm font-medium truncate" style={{ color: "#172b4d" }}>
                    {user.first_name} {user.last_name}
                  </span>
                </div>

                {/* Email */}
                <div className="col-span-5 min-w-0">
                  <span className="text-sm truncate block" style={{ color: "#6b778c" }}>
                    {user.email}
                  </span>
                </div>

                {/* Role selector */}
                <div className="col-span-3">
                  <div className="relative inline-flex items-center">
                    <span
                      className="absolute left-2 w-1.5 h-1.5 rounded-full pointer-events-none"
                      style={{ background: rc.color }}
                    />
                    <select
                      value={user.system_role}
                      onChange={(e) => onRoleChange(user.id, e.target.value)}
                      className="pl-5 pr-3 py-1 text-xs font-semibold rounded border-0 outline-none cursor-pointer appearance-none"
                      style={{ background: rc.bg, color: rc.color }}
                    >
                      <option value="client">Client</option>
                      <option value="employee">Employee</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded border text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: "#fff", borderColor: "#dfe1e6", color: "#172b4d" }}
            onMouseEnter={(e) => { if (page !== 1) e.currentTarget.style.background = "#f4f5f7"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; }}
          >
            <ChevronLeft size={14} />
            Previous
          </button>

          <span
            className="px-3 py-1.5 rounded text-sm font-medium"
            style={{ background: "#e8f0fe", color: "#0052cc" }}
          >
            {page} / {totalPages}
          </span>

          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded border text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: "#fff", borderColor: "#dfe1e6", color: "#172b4d" }}
            onMouseEnter={(e) => { if (page !== totalPages) e.currentTarget.style.background = "#f4f5f7"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; }}
          >
            Next
            <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

export default SystemRoleManagerUI;
