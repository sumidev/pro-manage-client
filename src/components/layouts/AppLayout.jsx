import { Outlet, Navigate, Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { LogOut } from "lucide-react";
import { SIDEBAR_LINKS } from "../../utils/constants";
import { isAuthenticated, logoutUser } from "../../features/auth/authSlice";

export default function AppLayout() {
  const isAuth = useSelector(isAuthenticated);
  const location = useLocation();
  const dispatch = useDispatch();

  if (!isAuth) {
    return <Navigate to="/login" />;
  }

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col hidden md:flex border-r border-slate-800 shadow-xl">
        {/* 1. Logo Section */}
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <div className="flex items-center gap-2 text-white font-bold text-xl tracking-tight">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
              P
            </div>
            ProManage
          </div>
        </div>

        {/* 2. Navigation Links (Dynamic) */}
        <nav className="flex-1 px-3 py-6 space-y-1">
          {SIDEBAR_LINKS.map((link) => {
            const Icon = link.icon;
            // Check if active (exact match or starts with for nested routes)
            const isActive =
              location.pathname === link.path ||
              (link.path !== "/" && location.pathname.startsWith(link.path));

            return (
              <Link
                key={link.id}
                to={link.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group
                  ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20" // ✨ Active Style
                      : "hover:bg-slate-800 hover:text-white" // Inactive Hover
                  }
                `}
              >
                <Icon
                  size={20}
                  className={
                    isActive
                      ? "text-white"
                      : "text-slate-400 group-hover:text-white transition-colors"
                  }
                />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* 3. User Profile / Logout Section */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-slate-800 hover:text-red-300 transition-colors"
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Optional: Mobile Header yahan aa sakta hai */}

        <div className="flex-1 overflow-auto p-8">
          <Outlet /> {/* Yahan tumhare pages render honge */}
        </div>
      </main>
    </div>
  );
}
