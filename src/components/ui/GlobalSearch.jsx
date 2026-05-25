import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Search,
  X,
  Loader2,
  FolderKanban,
  CheckSquare,
  User,
  Clock,
  ArrowRight,
} from "lucide-react";
import api from "@/services/api";
import { DropdownPortal } from "@/components/ui/DropdownPortal";
import { AVAILABLE_STAGES } from "@/constants/projectConstants";

const RECENT_KEY = "promanage_global_search_recent";
const MAX_RECENT = 5;
const MIN_QUERY = 2;

const stageLabel = (stage) =>
  AVAILABLE_STAGES.find((s) => s.id === stage)?.label || stage?.replace(/_/g, " ") || "Task";

const loadRecent = () => {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveRecent = (item) => {
  const prev = loadRecent().filter((r) => !(r.type === item.type && r.id === item.id));
  const next = [item, ...prev].slice(0, MAX_RECENT);
  localStorage.setItem(RECENT_KEY, JSON.stringify(next));
};

export default function GlobalSearch() {
  const navigate = useNavigate();
  const userRole = useSelector((state) => state.auth.user?.system_role);
  const isAdmin = userRole === "admin";

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({ projects: [], tasks: [], users: [] });
  const [recent, setRecent] = useState(loadRecent);
  const anchorRef = useRef(null);
  const inputRef = useRef(null);

  const hasQuery = query.trim().length >= MIN_QUERY;
  const totalResults =
    results.projects.length + results.tasks.length + (isAdmin ? results.users.length : 0);

  const fetchResults = useCallback(async (q) => {
    setLoading(true);
    try {
      const { data } = await api.get("/search", { params: { q: q.trim() } });
      setResults(data.data || { projects: [], tasks: [], users: [] });
    } catch {
      setResults({ projects: [], tasks: [], users: [] });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!hasQuery) {
      setResults({ projects: [], tasks: [], users: [] });
      return;
    }
    const timer = setTimeout(() => fetchResults(query), 280);
    return () => clearTimeout(timer);
  }, [query, hasQuery, fetchResults]);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const close = () => {
    setOpen(false);
    setQuery("");
  };

  const goTo = (item) => {
    saveRecent(item);
    setRecent(loadRecent());
    close();
    navigate(item.path);
  };

  const handleProject = (project) => {
    goTo({
      type: "project",
      id: project.id,
      label: project.name,
      path: `/projects/${project.id}`,
    });
  };

  const handleTask = (task) => {
    goTo({
      type: "task",
      id: task.id,
      label: task.name,
      path: `/projects/${task.project_id}?task=${task.id}`,
    });
  };

  const handleUser = (user) => {
    goTo({
      type: "user",
      id: user.id,
      label: user.name || user.email,
      path: "/user-management",
    });
  };

  const handleRecent = (item) => {
    close();
    navigate(item.path);
  };

  const showDropdown = open && (hasQuery || recent.length > 0);

  return (
    <div className="relative hidden sm:block" ref={anchorRef}>
      <Search
        size={13}
        className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
        style={{ color: "rgba(255,255,255,0.35)" }}
      />
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setOpen(true)}
        placeholder="Search projects, tasks…"
        className="pl-8 pr-16 py-1.5 text-sm rounded border-0 outline-none transition-all"
        style={{
          background: open ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.08)",
          color: "#fff",
          width: open ? "280px" : "220px",
          caretColor: "#fff",
        }}
        aria-label="Global search"
        aria-expanded={showDropdown}
        aria-autocomplete="list"
      />
      <kbd
        className="absolute right-2 top-1/2 -translate-y-1/2 hidden md:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium pointer-events-none"
        style={{
          color: "rgba(255,255,255,0.45)",
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.12)",
        }}
      >
        Ctrl+K
      </kbd>
      {query && (
        <button
          type="button"
          onClick={() => {
            setQuery("");
            inputRef.current?.focus();
          }}
          className="absolute right-12 top-1/2 -translate-y-1/2 p-0.5 rounded"
          style={{ color: "rgba(255,255,255,0.5)" }}
          aria-label="Clear search"
        >
          <X size={14} />
        </button>
      )}

      <DropdownPortal anchorRef={anchorRef} open={showDropdown} onClose={close} align="left" minWidth={400}>
        <div
          className="rounded-lg border overflow-hidden pm-dropdown"
          style={{ boxShadow: "var(--shadow-lg)", maxHeight: "min(420px, 70vh)" }}
        >
          <div className="max-h-[min(400px,68vh)] overflow-y-auto custom-scrollbar">
            {hasQuery ? (
              <>
                {loading && (
                  <div className="flex items-center justify-center gap-2 py-8 text-sm" style={{ color: "var(--text-muted)" }}>
                    <Loader2 size={16} className="animate-spin" />
                    Searching…
                  </div>
                )}

                {!loading && totalResults === 0 && (
                  <div className="px-4 py-8 text-center text-sm" style={{ color: "var(--text-muted)" }}>
                    No results for &ldquo;{query.trim()}&rdquo;
                  </div>
                )}

                {!loading && results.projects.length > 0 && (
                  <section>
                    <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                      Projects
                    </p>
                    {results.projects.map((project) => (
                      <button
                        key={`p-${project.id}`}
                        type="button"
                        onClick={() => handleProject(project)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors pm-dropdown-item"
                      >
                        <div
                          className="w-8 h-8 rounded flex items-center justify-center shrink-0"
                          style={{ background: "var(--accent-light)", color: "var(--accent-text)" }}
                        >
                          <FolderKanban size={15} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>
                            {project.name}
                          </p>
                          {project.description && (
                            <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>
                              {project.description}
                            </p>
                          )}
                        </div>
                        <ArrowRight size={14} style={{ color: "var(--text-muted)" }} className="shrink-0 opacity-0 group-hover:opacity-100" />
                      </button>
                    ))}
                  </section>
                )}

                {!loading && results.tasks.length > 0 && (
                  <section style={{ borderTop: results.projects.length ? "1px solid var(--border)" : undefined }}>
                    <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                      Tasks
                    </p>
                    {results.tasks.map((task) => (
                      <button
                        key={`t-${task.id}`}
                        type="button"
                        onClick={() => handleTask(task)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors pm-dropdown-item"
                      >
                        <div
                          className="w-8 h-8 rounded flex items-center justify-center shrink-0"
                          style={{ background: "var(--bg-subtle)", color: "var(--text-secondary)" }}
                        >
                          <CheckSquare size={15} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>
                            {task.name}
                          </p>
                          <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>
                            {task.project_name} · {stageLabel(task.stage)}
                          </p>
                        </div>
                        <ArrowRight size={14} style={{ color: "var(--text-muted)" }} className="shrink-0" />
                      </button>
                    ))}
                  </section>
                )}

                {!loading && isAdmin && results.users.length > 0 && (
                  <section style={{ borderTop: "1px solid var(--border)" }}>
                    <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                      Users
                    </p>
                    {results.users.map((user) => (
                      <button
                        key={`u-${user.id}`}
                        type="button"
                        onClick={() => handleUser(user)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors pm-dropdown-item"
                      >
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold text-white"
                          style={{ background: "var(--accent)" }}
                        >
                          <User size={14} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>
                            {user.name || user.email}
                          </p>
                          <p className="text-xs truncate capitalize" style={{ color: "var(--text-muted)" }}>
                            {user.email} · {user.system_role}
                          </p>
                        </div>
                        <ArrowRight size={14} style={{ color: "var(--text-muted)" }} className="shrink-0" />
                      </button>
                    ))}
                  </section>
                )}
              </>
            ) : (
              <div className="p-2">
                <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                  Recent
                </p>
                {recent.length === 0 ? (
                  <p className="px-3 py-4 text-sm text-center" style={{ color: "var(--text-muted)" }}>
                    Type at least 2 characters to search
                  </p>
                ) : (
                  recent.map((item) => (
                    <button
                      key={`${item.type}-${item.id}`}
                      type="button"
                      onClick={() => handleRecent(item)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded text-left pm-dropdown-item"
                    >
                      <Clock size={14} style={{ color: "var(--text-muted)" }} />
                      <span className="text-sm truncate" style={{ color: "var(--text-primary)" }}>
                        {item.label}
                      </span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {hasQuery && !loading && totalResults > 0 && (
            <div
              className="px-3 py-2 text-[11px] text-center"
              style={{ borderTop: "1px solid var(--border)", color: "var(--text-muted)", background: "var(--bg-subtle)" }}
            >
              {totalResults} result{totalResults !== 1 ? "s" : ""} — click to open
            </div>
          )}
        </div>
      </DropdownPortal>
    </div>
  );
}
