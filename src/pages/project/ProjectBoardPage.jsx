import { useState } from "react";
import { Plus, X } from "lucide-react";
import TaskDetailPanel from "../../features/projects/components/TaskDetailPanel";
import { TaskFilters } from "../../features/projects/components/TaskFilters";
import SearchDropdown from "../../features/projects/components/SearchDropdown";
import CreateTaskModal from "../../features/projects/components/CreateTaskModal";
import { ProjectDetails } from "../../features/projects/components/ProjectDetails";
import { KanbanBoard } from "../../features/projects/components/KanbanBoard";
import { useProjectBoard } from "../../features/projects/hooks/useProjectBoard";

const ProjectBoardPage = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const {
    projectDetails,
    filteredTasks,
    allTasks,
    loading,
    handleDragEnd,
    handleCreateTask,
    filters,
    handleFilterChange,
    clearAllFilters,
  } = useProjectBoard();

  if (!projectDetails)
    return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-gray-50 text-gray-800">
      {/* ================= HEADER SECTION ================= */}
      <div className="bg-white border-b border-gray-200 px-6 py-5 shadow-sm z-1">
        {/* Top Row: Back Btn + Title + Meta */}
        {projectDetails && <ProjectDetails projectDetails={projectDetails} />}

        {/* Bottom Row: Controls (Search/Filter) */}
        <div className="flex items-center justify-between pt-2">
          <SearchDropdown tasks={allTasks} onSelectedTask={setSelectedTask} />

          <div className="flex items-center gap-3">
            <div className="relative">
              <TaskFilters
                tasks={allTasks}
                members={projectDetails.members}
                filters={filters}
                handleFilterChange={handleFilterChange}
                clearAllFilters={clearAllFilters}
              />
            </div>

            {/* ADD TASK BUTTON (Isse alag rakha hai taaki layout na toote) */}
            <button
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 shadow-md shadow-blue-200 transition"
              onClick={() => setIsOpenModal(true)}
            >
              <Plus size={18} /> Add Task
            </button>
          </div>
        </div>
      </div>

      {/* ================= BOARD AREA (Canvas) ================= */}
      {projectDetails && (
        <KanbanBoard
          onDragEnd={handleDragEnd}
          stages={projectDetails.stages}
          tasks={filteredTasks}
          onTaskClick={setSelectedTask}
        />
      )}

      {/* ================= SLIDE OVER ================= */}
      {selectedTask && (
        <TaskDetailPanel
          task={selectedTask}
          stages={projectDetails.stages} // ✅ Ye pass karna zaroori hai dropdown ke liye
          onClose={() => setSelectedTask(null)}
          members={projectDetails.members}
        />
      )}

      {projectDetails && (
        <CreateTaskModal
          isOpen={isOpenModal}
          onClose={() => setIsOpenModal(false)}
          onSubmit={handleCreateTask}
          members={projectDetails.members}
        />
      )}
    </div>
  );
};

export default ProjectBoardPage;
