import React, { useState, useRef, useEffect } from "react";
import { Outlet, Navigate, Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { LogOut, Settings, ChevronDown, HelpCircle, Grid3x3 } from "lucide-react";
import GlobalSearch from "../ui/GlobalSearch";
import { SIDEBAR_LINKS } from "../../utils/constants";
import { isAuthenticated, logoutUser } from "../../features/auth/authSlice";
import NotificationBell from "../ui/NotificationBell";
import AIAssistant from "../ui/AIAssistant";

export default function AppLayout() {
  const isAuth = useSelector(isAuthenticated);
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const userRole = user?.system_role || "client";

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsProfileOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isAuth) return <Navigate to="/login" />;

  const handleLogout = () => dispatch(logoutUser());

  const getInitials = (name) =>
    name ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : "U";

  const avatarColors = ["bg-violet-600", "bg-indigo-600", "bg-emerald-600", "bg-orange-500", "bg-pink-600", "bg-teal-600"];
  const avatarColor = avatarColors[(user?.id || 0) % avatarColors.length];

  const isBoardRoute = /^\/projects\/[^/]+$/.test(location.pathname);

  return (
    <div className="app-shell flex font-sans" style={{ background: "var(--bg-app)" }}>

      {/* ===== SIDEBAR ===== */}
      <aside
        className="w-[220px] h-full flex flex-col shrink-0 hidden md:flex min-h-0"
        style={{ background: "var(--sidebar-bg)", borderRight: "1px solid var(--sidebar-border)" }}
      >
        {/* Logo */}
        <div className="h-12 flex items-center px-4 gap-2.5 shrink-0" style={{ borderBottom: "1px solid var(--sidebar-border)" }}>
          <div className="w-7 h-7 rounded flex items-center justify-center text-white font-black text-sm" style={{ background: "var(--accent)" }}>
            P
          </div>
          <span className="text-white font-bold text-[15px] tracking-tight">ProManage</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto custom-scrollbar">
          <p className="px-3 pt-1 pb-2 text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--sidebar-accent)" }}>
            Navigation
          </p>
          {SIDEBAR_LINKS.filter((link) => !link.roles || link.roles.includes(userRole)).map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path || (link.path !== "/" && location.pathname.startsWith(link.path));
            return (
              <Link
                key={link.id}
                to={link.path}
                className="flex items-center gap-2.5 px-3 py-2 rounded text-sm font-medium transition-all duration-150 relative"
                style={{
                  background: isActive ? "var(--sidebar-active)" : "transparent",
                  color: isActive ? "#fff" : "var(--sidebar-text)",
                }}
                onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.background = "var(--sidebar-hover)"; e.currentTarget.style.color = "#fff"; } }}
                onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--sidebar-text)"; } }}
              >
                {isActive && <span className="absolute left-0 w-0.5 h-5 rounded-r" style={{ background: "var(--sidebar-accent)" }} />}
                <Icon size={16} className="shrink-0" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User + Logout */}
        <div className="p-3 shrink-0" style={{ borderTop: "1px solid var(--sidebar-border)" }}>
          <div className="flex items-center gap-2.5 px-2 py-2 rounded mb-1" style={{ background: "rgba(255,255,255,0.05)" }}>
            <div className={`w-7 h-7 rounded-full ${avatarColor} flex items-center justify-center text-white text-xs font-bold shrink-0 overflow-hidden`}>
              {user?.profile_pic ? (
                <img src={user.profile_pic.startsWith("http") ? user.profile_pic : `http://localhost:8000/storage/${user.profile_pic}`} alt="" className="w-full h-full object-cover" />
              ) : getInitials(user?.first_name)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-semibold truncate">{user?.first_name} {user?.last_name}</p>
              <p className="text-[10px] truncate capitalize" style={{ color: "var(--sidebar-accent)" }}>{userRole}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 rounded text-sm font-medium transition-all"
            style={{ color: "#f87171" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.1)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = ""; }}
          >
            <LogOut size={15} /> Sign Out
          </button>
        </div>
      </aside>

      {/* ===== MAIN WRAPPER ===== */}
      <div className="flex-1 flex flex-col min-h-0 min-w-0 overflow-hidden">

        {/* ===== TOPBAR ===== */}
        <header
          className="h-12 flex items-center justify-between px-4 shrink-0 z-10"
          style={{ background: "var(--topbar-bg)", borderBottom: "1px solid var(--topbar-border)" }}
        >
          <div className="flex items-center gap-2">
            <button
              className="p-1.5 rounded transition-all"
              style={{ color: "var(--sidebar-text)" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--sidebar-hover)"; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = ""; e.currentTarget.style.color = "var(--sidebar-text)"; }}
            >
              <Grid3x3 size={17} />
            </button>
            <GlobalSearch />
          </div>

          <div className="flex items-center gap-1">
            <button
              className="p-1.5 rounded transition-all"
              style={{ color: "var(--sidebar-text)" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--sidebar-hover)"; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = ""; e.currentTarget.style.color = "var(--sidebar-text)"; }}
            >
              <HelpCircle size={17} />
            </button>

            <NotificationBell />

            {/* Profile */}
            <div ref={dropdownRef} className="relative ml-1">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-1.5 px-2 py-1 rounded transition-all"
                style={{ color: "var(--sidebar-text)" }}
                onMouseEnter={(e) => { if (!isProfileOpen) { e.currentTarget.style.background = "var(--sidebar-hover)"; e.currentTarget.style.color = "#fff"; } }}
                onMouseLeave={(e) => { if (!isProfileOpen) { e.currentTarget.style.background = ""; e.currentTarget.style.color = "var(--sidebar-text)"; } }}
              >
                <div className={`w-7 h-7 rounded-full ${avatarColor} flex items-center justify-center text-white text-xs font-bold overflow-hidden`}>
                  {user?.profile_pic ? (
                    <img src={user.profile_pic.startsWith("http") ? user.profile_pic : `/storage/${user.profile_pic}`} alt="" className="w-full h-full object-cover" />
                  ) : getInitials(user?.first_name)}
                </div>
                <ChevronDown size={11} className={`transition-transform ${isProfileOpen ? "rotate-180" : ""}`} />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-1 w-52 rounded border py-1 z-50 fade-in pm-dropdown" style={{ top: "calc(100% + 4px)" }}>
                  <div className="px-3 py-2.5" style={{ borderBottom: "1px solid var(--border)" }}>
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-full ${avatarColor} flex items-center justify-center text-white text-xs font-bold overflow-hidden shrink-0`}>
                        {user?.profile_pic ? (
                          <img src={user.profile_pic.startsWith("http") ? user.profile_pic : `/storage/${user.profile_pic}`} alt="" className="w-full h-full object-cover" />
                        ) : getInitials(user?.first_name)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>{user?.first_name} {user?.last_name}</p>
                        <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>{user?.email}</p>
                      </div>
                    </div>
                  </div>
                  <Link to="/settings" onClick={() => setIsProfileOpen(false)} className="pm-dropdown-item">
                    <Settings size={14} style={{ color: "var(--text-muted)" }} /> Account Settings
                  </Link>
                  <div className="pm-divider" />
                  <button
                    onClick={() => { setIsProfileOpen(false); handleLogout(); }}
                    className="pm-dropdown-item w-full text-left font-semibold"
                    style={{ color: "var(--red-text)" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "var(--red-light)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = ""; }}
                  >
                    <LogOut size={14} /> Log Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ===== CONTENT ===== */}
        <main
          className={`flex-1 min-h-0 ${isBoardRoute ? "overflow-hidden flex flex-col" : "overflow-y-auto overflow-x-hidden"}`}
          style={{ background: "var(--bg-app)" }}
        >
          <Outlet />
        </main>
      </div>

      <AIAssistant />
    </div>
  );
}
