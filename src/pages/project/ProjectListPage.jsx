import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createProject,
} from "../../features/projects/projectsSlice";
import { Plus, Search as SearchIcon, LayoutGrid, List } from "lucide-react";
import toast from "react-hot-toast";
import Loader from "../../components/Loader";
import { CreateProjectModal } from "../../features/projects/components/CreateProjectModal";
import { ProjectList } from "../../features/projects/components/ProjectList";
import { ProjectFilter } from "@/features/projects/components/ProjectFilter";
import { useProjectFilters } from "@/features/projects/hooks/useProjectFilters";

const ProjectListPage = () => {
  const dispatch = useDispatch();
  const { projects, loading, pagination } = useSelector((state) => state.projects);
  const [createProjectModal, setCreateProjectModal] = useState(false);
  const [viewMode, setViewMode] = useState("grid"); // grid | list

  const {
    filters,
    handleFilterChange,
    clearAllFilters,
    searchQuery,
    handlePagination,
    handleProjectSearch,
  } = useProjectFilters(projects);

  const handleCreate = async (payload) => {
    try {
      await toast.promise(dispatch(createProject(payload)).unwrap(), {
        loading: "Creating project...",
        success: "Project created!",
        error: (err) => `Error: ${err}`,
      });
      setCreateProjectModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">

      {/* ===== PAGE HEADER ===== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold" style={{ color: "#172b4d" }}>
            Projects
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "#6b778c" }}>
            {pagination.totalItems > 0
              ? `${pagination.totalItems} project${pagination.totalItems !== 1 ? "s" : ""}`
              : "Manage and track your team's work"}
          </p>
        </div>

        <button
          onClick={() => setCreateProjectModal(true)}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded text-sm font-semibold text-white transition-all shrink-0"
          style={{ background: "#0052cc" }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#0065ff"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "#0052cc"; }}
        >
          <Plus size={15} />
          Create project
        </button>
      </div>

      {/* ===== TOOLBAR ===== */}
      <div
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5 pb-4"
        style={{ borderBottom: "1px solid #dfe1e6" }}
      >
        {/* Left: Search + Filter */}
        <div className="flex items-center gap-2 flex-1 max-w-lg">
          {/* Search */}
          <div
            className="flex items-center gap-2 flex-1 px-3 py-1.5 rounded border text-sm transition-all"
            style={{ background: "#fff", borderColor: "#dfe1e6" }}
            onFocusCapture={(e) => { e.currentTarget.style.borderColor = "#4c9aff"; e.currentTarget.style.boxShadow = "0 0 0 2px #4c9aff40"; }}
            onBlurCapture={(e) => { e.currentTarget.style.borderColor = "#dfe1e6"; e.currentTarget.style.boxShadow = ""; }}
          >
            <SearchIcon size={14} style={{ color: "#97a0af" }} className="shrink-0" />
            <input
              type="text"
              placeholder="Search projects..."
              className="flex-1 outline-none bg-transparent text-sm"
              style={{ color: "#172b4d" }}
              value={searchQuery}
              onChange={(e) => handleProjectSearch(e.target.value)}
            />
          </div>

          {/* Filter */}
          <ProjectFilter
            filters={filters}
            handleFilterChange={handleFilterChange}
            clearAllFilters={clearAllFilters}
          />
        </div>

        {/* Right: View toggle */}
        <div
          className="flex items-center rounded border overflow-hidden"
          style={{ borderColor: "#dfe1e6" }}
        >
          <button
            onClick={() => setViewMode("grid")}
            className="p-2 transition-all"
            style={{
              background: viewMode === "grid" ? "#e8f0fe" : "#fff",
              color: viewMode === "grid" ? "#0052cc" : "#6b778c",
              borderRight: "1px solid #dfe1e6",
            }}
          >
            <LayoutGrid size={15} />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className="p-2 transition-all"
            style={{
              background: viewMode === "list" ? "#e8f0fe" : "#fff",
              color: viewMode === "list" ? "#0052cc" : "#6b778c",
            }}
          >
            <List size={15} />
          </button>
        </div>
      </div>

      {/* ===== CONTENT ===== */}
      {loading ? (
        <Loader />
      ) : (
        <ProjectList
          projects={projects}
          showCreateProjectModal={setCreateProjectModal}
          pagination={pagination}
          handlePagination={handlePagination}
          viewMode={viewMode}
        />
      )}

      {/* ===== CREATE MODAL ===== */}
      {createProjectModal && (
        <CreateProjectModal
          onSubmit={handleCreate}
          showCreateProjectModal={setCreateProjectModal}
        />
      )}
    </div>
  );
};

export default ProjectListPage;
