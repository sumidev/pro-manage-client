import React, { useState, useRef, useEffect, useMemo } from "react";
import { Search, Check, ChevronDown, UserCircle2 } from "lucide-react";

const UserSearchDropdown = ({
  users = [],
  selectedUserId,
  onSelect,
  label = "Assignee",
  placeholder = "Select member...",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);
  // Click Outside to close logic
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm(""); // Bahar click karne pe search clear
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter logic based on search
  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.email &&
          user.email.toLowerCase().includes(searchTerm.toLowerCase())),
    );
  }, [users, searchTerm]);

  // Find currently selected user
  const selectedUser = users.find((u) => u.id === selectedUserId);

  return (
    <div className="space-y-1.5" ref={dropdownRef}>
      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
        {label}
      </label>

      <div className="relative">
        {/* ✨ THE INVISIBLE TRIGGER ✨ */}
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 p-1.5 -ml-1.5 rounded-lg cursor-pointer transition-colors duration-200 hover:bg-gray-100 group w-fit"
        >
          {selectedUser ? (
            <>
              {selectedUser.avatar ? (
                <img
                  src={selectedUser.avatar}
                  alt="avatar"
                  className="w-6 h-6 rounded-full object-cover"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold">
                  {selectedUser.firstName.substring(0, 2).toUpperCase()}
                </div>
              )}
              <span className="text-sm font-medium text-gray-700">
                {selectedUser.firstName}
              </span>
            </>
          ) : (
            <>
              <div className="w-6 h-6 rounded-full bg-gray-50 border border-dashed border-gray-300 flex items-center justify-center text-gray-400 group-hover:border-gray-400 transition-colors">
                <UserCircle2 size={14} />
              </div>
              <span className="text-sm font-medium text-gray-400 group-hover:text-gray-600 transition-colors">
                {placeholder}
              </span>
            </>
          )}
        </div>

        {/* ✨ THE DROPDOWN CARD (With Search) ✨ */}
        {isOpen && (
          <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 shadow-xl rounded-xl z-[100] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Search Input Area */}
            <div className="p-2 border-b border-gray-100 bg-gray-50/50">
              <div className="relative flex items-center">
                <Search size={14} className="absolute left-2.5 text-gray-400" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Search members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-white border border-gray-200 text-sm rounded-md outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Users List Area */}
            <div className="max-h-60 overflow-y-auto p-1 custom-scrollbar bg-white">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => {
                      onSelect(user);
                      setIsOpen(false);
                      setSearchTerm("");
                    }}
                    className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors
                      ${selectedUserId === user.id ? "bg-blue-50" : "hover:bg-gray-100"}`}
                  >
                    <div className="flex items-center gap-3">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt="avatar"
                          className="w-7 h-7 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-[10px] font-bold">
                          {user.firstName.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div className="flex flex-col">
                        <span
                          className={`text-sm ${selectedUserId === user.id ? "font-semibold text-blue-700" : "font-medium text-gray-700"}`}
                        >
                          {user.firstName}
                        </span>
                        {user.role && (
                          <span className="text-[10px] text-gray-400">
                            {user.role}
                          </span>
                        )}
                      </div>
                    </div>
                    {/* Tick Mark for Selected Item */}
                    {selectedUserId === user.id && (
                      <Check size={16} className="text-blue-600" />
                    )}
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-sm text-gray-500 flex flex-col items-center gap-2">
                  <UserCircle2 size={24} className="text-gray-300" />
                  No members found
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserSearchDropdown;
