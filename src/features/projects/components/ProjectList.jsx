import { Folder, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { capitalize, formatDate } from "../../../utils/dateUtils";

export const ProjectList = ({ projects, showCreateProjectModal, pagination, handlePagination }) => {

  const handlePage = (step) =>{


  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects &&
        projects.map((project) => (
          <div
            key={project.id}
            className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col justify-between h-48"
          >
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-indigo-50 text-blue-600 rounded-lg">
                  <Folder size={24} />
                </div>
                <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-700 rounded-full">
                  {capitalize(project.status)}
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 truncate">
                {project.name}
              </h3>
              <p className="text-gray-400 text-sm mt-1">
                {formatDate(project.created_at)}
              </p>
            </div>

            <Link
              to={`/projects/${project.id}`}
              className="mt-4 flex items-center justify-between text-indigo-600 font-medium hover:text-indigo-800 group"
            >
              <span>View Board</span>
              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>
        ))}

      {projects?.length === 0 && (
        <div className="col-span-full flex flex-col items-center justify-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
          <Folder size={48} className="text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No projects yet</h3>
          <p className="text-gray-500 mb-6">
            Create your first project to get started
          </p>
          <button
            onClick={() => showCreateProjectModal(true)}
            className="text-indigo-600 hover:underline"
          >
            Create one now
          </button>
        </div>
      )}
      {/* --- Pagination Section --- */}
      <div className="col-span-full flex items-center justify-center mt-10 gap-2">
        
        {/* Previous Button */}
        <button 
          disabled={pagination.currentPage < 2} // Logic yahan laga lena
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-700"
          onClick={() => handlePagination('prev')}
        >
          <ChevronLeft size={16} />
          <span>Previous</span>
        </button>

        {/* Page Info */}
        <div className="px-4 py-2 text-sm text-gray-600 font-medium bg-gray-50 rounded-lg border border-transparent">
          Page <span className="text-gray-900 font-bold">{pagination.currentPage}</span> of <span className="text-gray-900 font-bold">{pagination.totalPages}</span>
        </div>

        {/* Next Button */}
        <button 
          disabled={pagination.currentPage == pagination.totalPages} 
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-700"
          onClick={() => handlePagination('next')}
        >
          <span>Next</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};
