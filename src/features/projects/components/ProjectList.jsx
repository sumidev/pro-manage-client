import {
  FolderOpen,
  ChevronLeft,
  ChevronRight,
  Clock,
  Users,
  ArrowUpRight,
  Plus,
} from "lucide-react";
import { Link } from "react-router-dom";
import { formatDate } from "../../../utils/dateUtils";

const statusConfig = {
  active:    { bg: "#e3fcef", color: "#006644", dot: "#36b37e" },
  completed: { bg: "#e8f0fe", color: "#0052cc", dot: "#0052cc" },
  on_hold:   { bg: "#fff0e6", color: "#974f0c", dot: "#ff991f" },
};

const typeColors = [
  "#0052cc", "#6554c0", "#00875a", "#ff5630", "#ff991f",
  "#00b8d9", "#36b37e", "#172b4d",
];

const getTypeColor = (type) => {
  const str = type ?? "";
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return typeColors[Math.abs(hash) % typeColors.length];
};

const ProjectCard = ({ project }) => {
  const sc = statusConfig[project.status] || statusConfig.active;
  const typeColor = getTypeColor(project.type);

  return (
    <div
      className="rounded border flex flex-col transition-all duration-150 overflow-hidden"
      style={{ background: "#fff", borderColor: "#dfe1e6" }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(9,30,66,0.15)";
        e.currentTarget.style.borderColor = "#c1c7d0";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "";
        e.currentTarget.style.borderColor = "#dfe1e6";
      }}
    >
      {/* Color bar */}
      <div className="h-1" style={{ background: typeColor }} />

      <div className="p-4 flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className="w-8 h-8 rounded flex items-center justify-center text-white text-sm font-bold shrink-0"
              style={{ background: typeColor }}
            >
              {project.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <h3
                className="text-sm font-semibold truncate"
                style={{ color: "#172b4d" }}
              >
                {project.name}
              </h3>
              {project.type && (
                <span className="text-[10px] font-medium uppercase tracking-wide" style={{ color: "#97a0af" }}>
                  {project.type.replace("_", " ")}
                </span>
              )}
            </div>
          </div>

          <span
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase shrink-0"
            style={{ background: sc.bg, color: sc.color }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: sc.dot }} />
            {project.status?.replace("_", " ")}
          </span>
        </div>

        {/* Description */}
        {project.description && (
          <p
            className="text-xs leading-relaxed mb-3 line-clamp-2"
            style={{ color: "#6b778c" }}
          >
            {project.description}
          </p>
        )}

        {/* Footer */}
        <div className="mt-auto pt-3 flex items-center justify-between" style={{ borderTop: "1px solid #f4f5f7" }}>
          <div className="flex items-center gap-3">
            {project.deadline && (
              <span className="flex items-center gap-1 text-[11px]" style={{ color: "#97a0af" }}>
                <Clock size={11} />
                {formatDate(project.deadline)}
              </span>
            )}
            {project.members?.length > 0 && (
              <span className="flex items-center gap-1 text-[11px]" style={{ color: "#97a0af" }}>
                <Users size={11} />
                {project.members.length}
              </span>
            )}
          </div>

          <Link
            to={`/projects/${project.id}`}
            className="flex items-center gap-1 text-xs font-semibold transition-all"
            style={{ color: "#0052cc" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#0065ff"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "#0052cc"; }}
          >
            Open board
            <ArrowUpRight size={12} />
          </Link>
        </div>
      </div>
    </div>
  );
};

const ProjectRow = ({ project }) => {
  const sc = statusConfig[project.status] || statusConfig.active;
  const typeColor = getTypeColor(project.type);

  return (
    <div
      className="grid items-center px-4 py-3 transition-all"
      style={{
        gridTemplateColumns: "32px 1fr 120px 120px 80px",
        borderBottom: "1px solid var(--bg-hover)",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = "var(--bg-hover)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = ""; }}
    >
      {/* Avatar */}
      <div
        className="w-7 h-7 rounded flex items-center justify-center text-white text-xs font-bold"
        style={{ background: typeColor }}
      >
        {project.name.charAt(0).toUpperCase()}
      </div>

      {/* Name + type */}
      <div className="min-w-0 pl-3">
        <p className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>
          {project.name}
        </p>
        <p className="text-[11px] capitalize" style={{ color: "var(--text-muted)" }}>
          {project.type?.replace("_", " ")}
        </p>
      </div>

      {/* Status */}
      <div>
        <span
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase"
          style={{ background: sc.bg, color: sc.color }}
        >
          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: sc.dot }} />
          {project.status?.replace("_", " ")}
        </span>
      </div>

      {/* Deadline */}
      <div>
        {project.deadline ? (
          <span className="flex items-center gap-1 text-xs" style={{ color: "var(--text-muted)" }}>
            <Clock size={11} />
            {formatDate(project.deadline)}
          </span>
        ) : (
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>—</span>
        )}
      </div>

      {/* Action */}
      <div className="flex justify-end">
        <Link
          to={`/projects/${project.id}`}
          className="flex items-center gap-1 text-xs font-semibold transition-all"
          style={{ color: "var(--accent)" }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "var(--accent-hover)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "var(--accent)"; }}
        >
          Open <ArrowUpRight size={12} />
        </Link>
      </div>
    </div>
  );
};

export const ProjectList = ({
  projects,
  showCreateProjectModal,
  pagination,
  handlePagination,
  viewMode = "grid",
}) => {
  if (!projects || projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
          style={{ background: "#f4f5f7" }}
        >
          <FolderOpen size={28} style={{ color: "#97a0af" }} />
        </div>
        <h3 className="text-base font-semibold mb-1" style={{ color: "#172b4d" }}>
          No projects found
        </h3>
        <p className="text-sm mb-5" style={{ color: "#6b778c" }}>
          Create your first project to get started
        </p>
        <button
          onClick={() => showCreateProjectModal(true)}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded text-sm font-semibold text-white transition-all"
          style={{ background: "#0052cc" }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#0065ff"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "#0052cc"; }}
        >
          <Plus size={15} />
          Create project
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <div
          className="rounded border overflow-hidden"
          style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
        >
          {/* List header */}
          <div
            className="grid items-center px-4 py-2 text-[10px] font-bold uppercase tracking-wide"
            style={{
              gridTemplateColumns: "32px 1fr 120px 120px 80px",
              background: "var(--bg-subtle)",
              borderBottom: "1px solid var(--border)",
              color: "var(--text-muted)",
            }}
          >
            <span />
            <span className="pl-3">Project</span>
            <span>Status</span>
            <span>Deadline</span>
            <span />
          </div>
          {projects.map((project) => (
            <ProjectRow key={project.id} project={project} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            disabled={pagination.currentPage < 2}
            onClick={() => handlePagination("prev")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded border text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: "#fff", borderColor: "#dfe1e6", color: "#172b4d" }}
            onMouseEnter={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.background = "#f4f5f7"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; }}
          >
            <ChevronLeft size={14} />
            Previous
          </button>

          <span
            className="px-3 py-1.5 rounded text-sm font-medium"
            style={{ background: "#e8f0fe", color: "#0052cc" }}
          >
            {pagination.currentPage} / {pagination.totalPages}
          </span>

          <button
            disabled={pagination.currentPage === pagination.totalPages}
            onClick={() => handlePagination("next")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded border text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: "#fff", borderColor: "#dfe1e6", color: "#172b4d" }}
            onMouseEnter={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.background = "#f4f5f7"; }}
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
