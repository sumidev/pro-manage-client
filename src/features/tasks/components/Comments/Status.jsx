import React from "react";

export const Status = () => {
  return (
    <div className="relative pl-12">
      <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-white border-2 border-gray-100 flex items-center justify-center z-10">
        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
      </div>
      <div className="pt-1">
        <p className="text-sm text-gray-800">
          <span className="font-semibold">Rahul</span> changed status from
          <span className="mx-1 px-1.5 py-0.5 bg-gray-100 rounded text-xs font-medium text-gray-600">
            Todo
          </span>
          to
          <span className="mx-1 px-1.5 py-0.5 bg-blue-50 rounded text-xs font-medium text-blue-600">
            In Progress
          </span>
        </p>
        <span className="text-xs text-gray-400 mt-1 block">2 hours ago</span>
      </div>
    </div>
  );
};
