import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "../../features/auth/authSlice";
import { useSelector } from "react-redux";

export default function GuestLayout() {
  const isAuth = useSelector(isAuthenticated);
  if (isAuth) return <Navigate to="/dashboard" />;

  return (
    <div
      className="h-dvh w-full max-w-[100vw] flex overflow-hidden"
      style={{ background: "var(--bg-app)" }}
    >
      {/* Left branding panel */}
      <div
        className="hidden lg:flex flex-col justify-between w-[400px] shrink-0 p-10"
        style={{ background: "var(--sidebar-bg)" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded flex items-center justify-center text-white font-black text-sm"
            style={{ background: "var(--accent)" }}
          >
            P
          </div>
          <span className="text-white font-bold text-lg tracking-tight">ProManage</span>
        </div>

        {/* Hero */}
        <div>
          <h1 className="text-3xl font-bold text-white leading-tight mb-3">
            Manage projects<br />like a pro team.
          </h1>
          <p className="text-sm leading-relaxed mb-8" style={{ color: "var(--sidebar-text)" }}>
            Plan, track, and ship work with your team using boards, backlogs, and real-time collaboration.
          </p>

          <div className="space-y-3">
            {[
              "Kanban boards with drag & drop",
              "Real-time team collaboration",
              "AI-powered project generation",
              "Role-based access control",
            ].map((feat) => (
              <div key={feat} className="flex items-center gap-2.5">
                <div
                  className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: "rgba(99,102,241,0.25)" }}
                >
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                    <path d="M1.5 4L3 5.5L6.5 2" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span className="text-sm" style={{ color: "var(--sidebar-text)" }}>{feat}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          © 2025 ProManage. All rights reserved.
        </p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
        <div
          className="w-full max-w-[400px] rounded-lg border p-8"
          style={{ background: "var(--bg-card)", borderColor: "var(--border)", boxShadow: "var(--shadow-md)" }}
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-6 lg:hidden">
            <div
              className="w-7 h-7 rounded flex items-center justify-center text-white font-black text-sm"
              style={{ background: "var(--accent)" }}
            >
              P
            </div>
            <span className="font-bold text-base" style={{ color: "var(--text-primary)" }}>ProManage</span>
          </div>

          <Outlet />
        </div>
      </div>
    </div>
  );
}
