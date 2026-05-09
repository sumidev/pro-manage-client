import { Check, UserX } from "lucide-react";
import { getUserColor } from "../../../../utils/helpers";

export const ProjectTypesList = ({ type, typeId, filters, handleFilterChange }) => {
  const isSelected = false;
  return (
    <label
      className={`flex items-center gap-3 p-1.5 rounded-md cursor-pointer transition-all border border-transparent group
             ${
               isSelected
                 ? "bg-blue-50 border-blue-100 shadow-sm"
                 : "hover:bg-gray-50 hover:border-gray-100"
             }
          `}
    >
      <div className="relative flex items-center">
        <input
          type="checkbox"
          checked={filters.type.includes(type)}
          className="peer appearance-none w-3.5 h-3.5 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:ring-1 focus:ring-blue-200 transition cursor-pointer"
          onChange={() => handleFilterChange("type", type)}
        />
        <Check
          size={10}
          strokeWidth={3}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 pointer-events-none"
        />
      </div>

      <div
        className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 text-white ${getUserColor(typeId)}`}
        title={type}
      >
        {type.charAt(0).toUpperCase()}
      </div>

      <span
        className={`text-xs truncate select-none ${
          isSelected
            ? "text-blue-700 font-medium"
            : "text-gray-600 group-hover:text-gray-900"
        }`}
      >
        {type.charAt(0).toUpperCase() + type.slice(1).replaceAll('_',' ')}
      </span>
    </label>
  );
};
