import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Briefcase, CheckCircle2, Clock, Plus, ChevronRight } from "lucide-react";
import { fetchDashboardStats } from "../../features/dashboard/dashboardSlice";
import { STATS_CONFIG } from "../../features/dashboard/dashboardConstants";
import { formatDate } from "../../utils/dateUtils";
import DashboardSkeleton from "../../components/skeletons/DashboardSkeleton";

const priorityConfig = {
  critical: { bg: "var(--red-light)",    color: "var(--red-text)",    dot: "var(--red)" },
  high:     { bg: "var(--orange-light)", color: "var(--orange-text)", dot: "var(--orange)" },
  medium:   { bg: "var(--yellow-light)", color: "var(--yellow-text)", dot: "var(--yellow)" },
  low:      { bg: "var(--green-light)",  color: "var(--green-text)",  dot: "var(--green)" },
};

const statusConfig = {
  active:    { bg: "var(--green-light)",  color: "var(--green-text)" },
  completed: { bg: "var(--accent-light)", color: "var(--accent-text)" },
  on_hold:   { bg: "var(--orange-light)", color: "var(--orange-text)" },
};

const iconBgMap = [
  { bg: "var(--accent-light)", color: "var(--accent)" },
  { bg: "var(--green-light)",  color: "var(--green-text)" },
  { bg: "var(--orange-light)", color: "var(--orange-text)" },
  { bg: "var(--red-light)",    color: "var(--red-text)" },
];

const StatCard = ({ title, value, icon, index }) => {
  const Icon = icon;
  const { bg, color } = iconBgMap[index % iconBgMap.length];
  return (
    <div className="stat-card">
      <div>
        <p className="pm-label mb-1">{title}</p>
        <h3 className="text-2xl font-bold mt-1" style={{ color: "var(--text-primary)" }}>
          {value ?? 0}
        </h3>
      </div>
      <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: bg }}>
        <Icon size={20} style={{ color }} />
      </div>
    </div>
  );
};

const DashboardPage = () => {
  const { user } = useSelector((state) => state.auth);
  const { stats, recentProjects, myTasks, loading } = useSelector((state) => state.dashboard);
  const dispatch = useDispatch();

  useEffect(() => { dispatch(fetchDashboardStats()); }, [dispatch]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  if (loading && !stats) return <DashboardSkeleton />;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
            {greeting}, {user?.first_name || "there"} 👋
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>
            Here's what's happening across your projects today.
          </p>
        </div>
        <Link
          to="/projects"
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded text-sm font-semibold text-white transition-all shrink-0"
          style={{ background: "var(--accent)" }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "var(--accent-hover)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "var(--accent)"; }}
        >
          <Plus size={15} /> New Project
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS_CONFIG.map((stat, index) => (
          <StatCard key={index} {...stat} value={stats ? stats[stat.key] : 0} index={index} />
        ))}
      </div>

      {/* Split section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Recent Projects */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>Recent Projects</h2>
            <Link
              to="/projects"
              className="flex items-center gap-1 text-xs font-semibold"
              style={{ color: "var(--accent)" }}
            >
              View all <ChevronRight size={13} />
            </Link>
          </div>

          <div className="rounded border overflow-hidden" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
            {/* Table header */}
            <div
              className="grid grid-cols-12 px-4 py-2 text-[10px] font-bold uppercase tracking-wide"
              style={{ background: "var(--bg-subtle)", borderBottom: "1px solid var(--border)", color: "var(--text-muted)" }}
            >
              <span className="col-span-5">Project</span>
              <span className="col-span-3">Status</span>
              <span className="col-span-4">Updated</span>
            </div>

            {recentProjects.length > 0 ? (
              recentProjects.map((project, i) => {
                const sc = statusConfig[project.status] || statusConfig.active;
                return (
                  <Link
                    to={`/projects/${project.id}`}
                    key={project.id}
                    className="grid grid-cols-12 px-4 py-3 items-center transition-all"
                    style={{ borderBottom: i < recentProjects.length - 1 ? "1px solid var(--bg-subtle)" : "none", color: "inherit", textDecoration: "none" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "var(--bg-hover)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = ""; }}
                  >
                    <div className="col-span-5 flex items-center gap-2.5 min-w-0">
                      <div
                        className="w-7 h-7 rounded flex items-center justify-center text-white text-xs font-bold shrink-0"
                        style={{ background: "var(--accent)" }}
                      >
                        {project.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>
                        {project.name}
                      </span>
                    </div>
                    <div className="col-span-3">
                      <span className="pm-badge" style={{ background: sc.bg, color: sc.color }}>
                        {project.status?.replace("_", " ")}
                      </span>
                    </div>
                    <div className="col-span-4 text-xs" style={{ color: "var(--text-muted)" }}>
                      {formatDate(project.updated_at)}
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="py-12 text-center">
                <Briefcase size={28} className="mx-auto mb-2" style={{ color: "var(--border)" }} />
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>No projects yet</p>
                <Link to="/projects" className="text-xs mt-1 inline-block font-semibold" style={{ color: "var(--accent)" }}>
                  Create your first project
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* My Tasks */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>My Tasks</h2>
            <span className="pm-badge" style={{ background: "var(--accent-light)", color: "var(--accent-text)" }}>
              {myTasks.length}
            </span>
          </div>

          <div className="rounded border overflow-hidden" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
            {myTasks.length > 0 ? (
              <div>
                {myTasks.map((task, i) => {
                  const pc = priorityConfig[task.priority] || priorityConfig.medium;
                  return (
                    <div
                      key={task.id}
                      className="flex items-start gap-3 px-4 py-3 cursor-pointer transition-all"
                      style={{ borderBottom: i < myTasks.length - 1 ? "1px solid var(--bg-subtle)" : "none" }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "var(--bg-hover)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = ""; }}
                    >
                      <div
                        className="w-4 h-4 rounded-full border-2 shrink-0 mt-0.5 cursor-pointer transition-all"
                        style={{ borderColor: "var(--border)" }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>
                          {task.name}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="pm-badge" style={{ background: pc.bg, color: pc.color }}>
                            <span className="w-1.5 h-1.5 rounded-full inline-block mr-1" style={{ background: pc.dot }} />
                            {task.priority}
                          </span>
                          {task.due_date && (
                            <span className="flex items-center gap-1 text-[10px]" style={{ color: "var(--text-muted)" }}>
                              <Clock size={10} /> {formatDate(task.due_date)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-10 text-center">
                <CheckCircle2 size={24} className="mx-auto mb-2" style={{ color: "var(--border)" }} />
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>No tasks assigned</p>
              </div>
            )}

            {myTasks.length > 0 && (
              <div className="px-4 py-2.5 text-center" style={{ borderTop: "1px solid var(--bg-subtle)" }}>
                <button className="text-xs font-semibold" style={{ color: "var(--accent)" }}>
                  View all tasks
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
