import { PROJECT_TYPES } from "@/constants/projectConstants";
import React, { useState } from "react";

const ProjectHeader = ({ projectDetails, onUpdate }) => {
  const [localData, setLocalData] = useState({
    name: projectDetails.name,
    description: projectDetails.description,
    type: projectDetails.type,
    status: projectDetails.status,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (value !== projectDetails[name]) {
      onUpdate(name, value);
    }
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setLocalData((prev) => ({ ...prev, [name]: value }));
    onUpdate(name, value);
  };

  return (
    <div className="w-full">
      {/* Badges as Dropdowns */}
      <div className="flex items-center gap-3 mb-2">
        <select
          name="type"
          value={localData.type}
          onChange={handleSelectChange}
          className="bg-blue-50 text-blue-700 text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wide cursor-pointer border-none outline-none focus:ring-0 appearance-none text-center hover:bg-blue-100 transition-colors"
        >
        {PROJECT_TYPES.map((type,index) => {
           return  <option key={index} value={type}>{type}</option>
        })}
        </select>

        <div className="relative flex items-center">
          <span className="absolute left-2 w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse pointer-events-none"></span>
          <select
            name="status"
            value={localData.status}
            onChange={handleSelectChange}
            className="pl-5 pr-2 py-0.5 bg-green-50 text-green-700 text-xs font-bold rounded uppercase tracking-wide cursor-pointer border-none outline-none focus:ring-0 appearance-none text-left hover:bg-green-100 transition-colors"
          >
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="on_hold">On Hold</option>
          </select>
        </div>
      </div>

      {/* Title as Inline Input - Full Width, No Border */}
      <input
        type="text"
        name="name"
        value={localData.name}
        onChange={handleChange}
        onBlur={handleBlur}
        className="w-full text-2xl font-bold text-gray-900 leading-tight bg-transparent border-none outline-none focus:ring-0 hover:bg-gray-50 rounded px-2 -ml-2 py-1 transition-colors"
        placeholder="Project Title"
      />

      {/* Description as Inline Textarea - Full Width, No Border */}
      <textarea
        name="description"
        value={localData.description}
        onChange={handleChange}
        onBlur={handleBlur}
        rows={Math.max(3, localData.description?.split('\n').length || 3)}
        className="w-full mt-1 text-gray-500 text-sm leading-relaxed bg-transparent border-none outline-none focus:ring-0 hover:bg-gray-50 rounded px-2 -ml-2 py-1 resize-none transition-colors"
        placeholder="Add a project description..."
      />
    </div>
  );
};

export default ProjectHeader;