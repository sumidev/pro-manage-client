import React from "react";
import { ArrowLeft, Clock } from "lucide-react";
import { formatDate } from "../../../utils/dateUtils";
import TeamDropdownStatic from "./TeamDropdownStatic";
import { Link } from "react-router-dom";
import ProjectHeader from "./ProjectHeader";
import { useDispatch } from "react-redux";
import { updateProject } from "../projectsSlice";

export const ProjectDetails = ({ projectDetails }) => {
  const dispatch = useDispatch();

  const updateProjectField = async (key, value) => {
    try {
      const payload = { id: projectDetails.id, data: { [key]: value } };
      dispatch(updateProject(payload));
    } catch (error) {
      console.error("Failed to update", error);
    }
  };

  return (
    <div className="flex justify-between items-start mb-6 gap-8">
      {/* Left Side: flex-1 aur w-full lagaya hai taaki ye maximum space le */}
      <div className="flex gap-4 flex-1 w-full">
        <Link
          to="/"
          className="mt-1.5 p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition h-fit shrink-0"
        >
          <ArrowLeft size={20} />
        </Link>

        {/* ProjectHeader ke parent wrapper mein w-full hona zaroori hai agar component ke andar nahi laga */}
        <div className="w-full">
          <ProjectHeader
            projectDetails={projectDetails}
            onUpdate={updateProjectField}
          />
        </div>
      </div>

      {/* Right Side: Team & Due Date (shrink-0 ensures ye apni fix size rakhe) */}
      <div className="flex flex-col items-end gap-3 shrink-0">
        <div className="flex items-center -space-x-2">
          <TeamDropdownStatic
            members={projectDetails.members}
            projectId={projectDetails.id}
          />
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
          <Clock size={14} className="text-gray-400" />
          <span>Due {formatDate(projectDetails.deadline)}</span>
        </div>
      </div>
    </div>
  );
};
