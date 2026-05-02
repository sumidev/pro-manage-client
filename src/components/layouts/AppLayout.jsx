import { Outlet, Navigate, Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { LogOut, Search, Menu } from "lucide-react"; // Search aur Menu icons add kiye
import { SIDEBAR_LINKS } from "../../utils/constants";
import { isAuthenticated, logoutUser } from "../../features/auth/authSlice";
import NotificationBell from "../ui/NotificationBell";

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
      {/* ================= SIDEBAR (Same as before) ================= */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col hidden md:flex border-r border-slate-800 shadow-xl z-20">
        {/* 1. Logo Section */}
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <div className="flex items-center gap-2 text-white font-bold text-xl tracking-tight">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
              P
            </div>
            ProManage
          </div>
        </div>

        {/* 2. Navigation Links */}
        <nav className="flex-1 px-3 py-6 space-y-1">
          {SIDEBAR_LINKS.map((link) => {
            const Icon = link.icon;
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
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                      : "hover:bg-slate-800 hover:text-white"
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

      {/* ================= MAIN WRAPPER ================= */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* ================= TOP NAVBAR ================= */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 shadow-sm z-10">
          {/* Left Side: Mobile Menu Button (Hidden on Desktop) & Search */}
          <div className="flex items-center flex-1">
            <button className="md:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md mr-2">
              <Menu size={24} />
            </button>

            {/* Optional Global Search */}
            <div className="max-w-md w-full hidden sm:block relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search projects, tasks..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-gray-50 hover:bg-white transition-colors"
              />
            </div>
          </div>

          {/* Right Side: Notification Bell & Profile Dropdown */}
          <div className="flex items-center gap-4 ml-4">
            {/* ✨ Ye raha tumhara Bell Component ✨ */}
            <NotificationBell />

            {/* User Avatar Placeholder */}
            <div className="h-8 w-8 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-sm cursor-pointer hover:ring-2 hover:ring-indigo-500 hover:ring-offset-2 transition-all">
              SC{" "}
              {/* Sumit Choudhary initials ya api se dynamic initials daal sakte ho */}
            </div>
          </div>
        </header>

        {/* ================= MAIN CONTENT AREA ================= */}
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 bg-gray-50/50">
          <div className="max-w-8xl mx-auto">
            <Outlet /> {/* Yahan pages render honge */}
          </div>
        </main>
      </div>
    </div>
  );
}
