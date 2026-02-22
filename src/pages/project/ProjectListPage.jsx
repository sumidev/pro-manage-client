import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProjects,
  createProject,
} from "../../features/projects/projectsSlice";
import { Plus } from "lucide-react";
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
  const [pageNo, setPageNo] = useState(1);

  useEffect(() => {
    dispatch(fetchProjects(pageNo));
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
   const newPage = step === 'next' ? pageNo + 1 : pageNo - 1;
    setPageNo(newPage);
    dispatch(fetchProjects(newPage));
  };

  return (
    <div className="p-6">
      {/* --- Header Section --- */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Projects</h1>
          <p className="text-gray-500 mt-1">Manage your team work here</p>
        </div>
        <button
          onClick={() => setCreateProjectModal(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition shadow-lg shadow-blue-200"
        >
          <Plus size={20} /> Create New Project
        </button>
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
