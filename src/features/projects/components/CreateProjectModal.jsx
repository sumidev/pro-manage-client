import { useState } from "react";

export const CreateProjectModal = ({ onSubmit, showCreateProjectModal }) => {
  const newProjectInitialData = {
    name: "",
    description: "",
    type: "software",
    deadline: "",
  };

  const [newProject, setNewProject] = useState(newProjectInitialData);

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newProject) return;
    onSubmit(newProject);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">New Project</h2>
          <p className="text-gray-500 mb-6">Enter project details below.</p>

          <form onSubmit={handleCreate}>
            {/* --- Name --- */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Name
              </label>
              <input
                type="text"
                placeholder="e.g. Website Redesign"
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                value={newProject.name}
                onChange={(e) =>
                  setNewProject({ ...newProject, name: e.target.value })
                }
                required // HTML validation
                autoFocus
              />
            </div>

            {/* --- Description --- */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                placeholder="Brief details about the project..."
                rows="3"
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition resize-none"
                value={newProject.description}
                onChange={(e) =>
                  setNewProject({
                    ...newProject,
                    description: e.target.value,
                  })
                }
              ></textarea>
            </div>

            {/* --- Type & Deadline (Side by Side) --- */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* Type Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Type
                </label>
                <select
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition bg-white"
                  value={newProject.type}
                  onChange={(e) =>
                    setNewProject({ ...newProject, type: e.target.value })
                  }
                >
                  <option value="software">Software</option>
                  <option value="mobile_app">Mobile App</option>
                  <option value="website">Website</option>
                  <option value="design">Design</option>
                  <option value="marketing">Marketing</option>
                </select>
              </div>

              {/* Deadline Date Picker */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deadline
                </label>
                <input
                  type="date"
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                  value={newProject.deadline}
                  // Min date aaj ki rakh sakte hain taaki purani date select na ho
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) =>
                    setNewProject({
                      ...newProject,
                      deadline: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>

            {/* --- Actions --- */}
            <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => showCreateProjectModal(false)}
                className="px-5 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-md shadow-blue-200 transition flex items-center gap-2"
              >
                Create Project
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
