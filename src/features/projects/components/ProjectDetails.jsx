import React from "react";
import {
  ArrowLeft,
  Clock,
} from "lucide-react";
import { formatDate } from "../../../utils/dateUtils";
import TeamDropdownStatic from "./TeamDropdownStatic";
import { Link } from "react-router-dom";

export const ProjectDetails = ({projectDetails}) => {
  return (
    <div className="flex justify-between items-start mb-6">
      <div className="flex gap-4 max-w-4xl">
        <Link
          to="/"
          className="mt-1.5 p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition h-fit"
        >
          <ArrowLeft size={20} />
        </Link>

        <div>
          {/* Badges */}
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2 py-0.5 rounded border border-blue-100 uppercase tracking-wide">
              {projectDetails.type}
            </span>
            <span className="flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-bold px-2 py-0.5 rounded border border-green-200 uppercase tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse"></span>
              {projectDetails.status}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 leading-tight">
            {projectDetails.name}
          </h1>

          {/* Description */}
          <p className="text-gray-500 mt-2 text-sm leading-relaxed max-w-2xl">
            {projectDetails.description}
          </p>
        </div>
      </div>

      {/* Right Side: Team & Due Date */}
      <div className="flex flex-col items-end gap-3">
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
