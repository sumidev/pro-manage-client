import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Plus, AlertTriangle } from "lucide-react";
import TaskDetailPanel from "../../features/projects/components/TaskDetailPanel";
import { TaskFilters } from "../../features/projects/components/TaskFilters";
import SearchDropdown from "../../features/projects/components/SearchDropdown";
import CreateTaskModal from "../../features/projects/components/CreateTaskModal";
import { ProjectDetails } from "../../features/projects/components/ProjectDetails";
import { KanbanBoard } from "../../features/projects/components/KanbanBoard";
import { useProjectBoard } from "../../features/projects/hooks/useProjectBoard";
import ProjectBoardSkeleton from "../../components/skeletons/ProjectBoardSkeleton";

const BoardError = ({ message }) => (
  <div className="flex items-center justify-center flex-1">
    <div className="flex flex-col items-center gap-3 text-center">
      <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "var(--red-light)" }}>
        <AlertTriangle size={22} style={{ color: "var(--red-text)" }} />
      </div>
      <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Failed to load project</p>
      <p className="text-xs" style={{ color: "var(--text-muted)" }}>{message || "Something went wrong."}</p>
    </div>
  </div>
);

const ProjectBoardPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const taskFromUrl = searchParams.get("task");

  const {
    projectDetails,
    filteredTasks,
    allTasks,
    projectLoading,
    error,
    handleDragEnd,
    handleCreateTask,
    filters,
    handleFilterChange,
    clearAllFilters,
  } = useProjectBoard();

  useEffect(() => {
    if (!taskFromUrl || !allTasks.length) return;
    const match = allTasks.find((t) => String(t.id) === String(taskFromUrl));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (match) setSelectedTask(match);
  }, [taskFromUrl, allTasks]);

  const closeTaskPanel = () => {
    setSelectedTask(null);
    if (taskFromUrl) {
      const next = new URLSearchParams(searchParams);
      next.delete("task");
      setSearchParams(next, { replace: true });
    }
  };

  if (projectLoading && !projectDetails) {
    return <ProjectBoardSkeleton />;
  }

  return (
    <div className="flex flex-col flex-1 min-h-0 h-full">
      {/* ===== PROJECT HEADER — fixed height ===== */}
      {projectDetails && (
        <div
          className="shrink-0 px-6 pt-4 pb-0"
          style={{ background: "var(--bg-card)", borderBottom: "1px solid var(--border)" }}
        >
          <ProjectDetails projectDetails={projectDetails} />
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-2">
              <SearchDropdown tasks={allTasks} onSelectedTask={setSelectedTask} />
              <TaskFilters
                members={projectDetails.members || []}
                filters={filters}
                handleFilterChange={handleFilterChange}
                clearAllFilters={clearAllFilters}
              />
            </div>
            <button
              onClick={() => setIsOpenModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-semibold text-white transition-all"
              style={{ background: "var(--accent)" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--accent-hover)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "var(--accent)"; }}
            >
              <Plus size={14} /> Create issue
            </button>
          </div>
        </div>
      )}

      {/* ===== BOARD AREA — takes all remaining height ===== */}
      {!projectLoading && error && !projectDetails && <BoardError message={error} />}
      {!projectLoading && projectDetails && (
        <KanbanBoard
          onDragEnd={handleDragEnd}
          stages={projectDetails.stages || []}
          tasks={filteredTasks}
          onTaskClick={setSelectedTask}
        />
      )}

      {/* ===== TASK DETAIL PANEL ===== */}
      {selectedTask && (
        <TaskDetailPanel
          task={selectedTask}
          stages={projectDetails?.stages || []}
          onClose={closeTaskPanel}
          members={projectDetails?.members || []}
          projectId={projectDetails?.id}
        />
      )}

      {/* ===== CREATE TASK MODAL ===== */}
      {projectDetails && (
        <CreateTaskModal
          isOpen={isOpenModal}
          onClose={() => setIsOpenModal(false)}
          onSubmit={handleCreateTask}
          members={projectDetails.members || []}
          projectId={projectDetails.id}
        />
      )}
    </div>
  );
};

export default ProjectBoardPage;
