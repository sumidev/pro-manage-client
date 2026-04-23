import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProjects,
  createProject,
  searchProject,
} from "../../features/projects/projectsSlice";
import { Plus, SearchIcon } from "lucide-react";
import toast from "react-hot-toast";
import Loader from "../../components/Loader";
import { CreateProjectModal } from "../../features/projects/components/CreateProjectModal";
import { ProjectList } from "../../features/projects/components/ProjectList";

const ProjectListPage = () => {
  const dispatch = useDispatch();

  const { projects, loading, pagination } = useSelector(
    (state) => state.projects,
  );

  const [createProjectModal, setCreateProjectModal] = useState(false);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(fetchProjects({page, searchQuery}));
  }, [dispatch]);

  // 2. Naya Project Create karne ka logic
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

  const handlePagination = async (step) => {
    const newPage = step === "next" ? page + 1 : page - 1;
    setPage(newPage);
    dispatch(fetchProjects(newPage));
  };

  const handleProjectSearch = (value) => {
    setSearchQuery(value);
    dispatch(fetchProjects({page: 1, searchQuery}));
  }

  return (
    <div className="p-6">
      {/* --- Header Section --- */}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        {/* Left Section: Titles */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Projects</h1>
          <p className="text-gray-500 mt-1">Manage your team work here</p>
        </div>

        {/* Right Section: Search Bar & Action Button */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search projects..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
              value={searchQuery}
              onChange={(e) => handleProjectSearch(e.target.value)}
            />
          </div>

          {/* Create Button */}
          <button
            onClick={() => setCreateProjectModal(true)}
            className="flex justify-center items-center gap-2 w-full sm:w-auto bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 whitespace-nowrap"
          >
            <Plus size={20} /> Create New Project
          </button>
        </div>
      </div>

      {/* --- Loading State --- */}
      {loading && <Loader />}

      {/* --- Projects Grid List --- */}
      {!loading && (
        <ProjectList
          projects={projects}
          showCreateProjectModal={setCreateProjectModal}
          pagination={pagination}
          handlePagination={handlePagination}
        />
      )}

      {/* --- Create Project Modal (Popup) --- */}
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
