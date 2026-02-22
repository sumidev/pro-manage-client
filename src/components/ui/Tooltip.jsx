import React from "react";

const Tooltip = ({ text, children, position = "top" }) => {
  // Position ke hisaab se CSS classes
  const positions = {
    top: "bottom-full mb-2",
    bottom: "top-full mt-2",
    left: "right-full mr-2",
    right: "left-full ml-2",
  };

  const arrowPositions = {
    top: "top-full -mt-1 border-t-gray-800 border-l-transparent border-r-transparent border-b-transparent",
    bottom: "bottom-full -mb-1 border-b-gray-800 border-l-transparent border-r-transparent border-t-transparent",
    left: "left-full -ml-1 border-l-gray-800 border-t-transparent border-b-transparent border-r-transparent",
    right: "right-full -mr-1 border-r-gray-800 border-t-transparent border-b-transparent border-l-transparent",
  };

  return (
    <div className="relative group inline-flex justify-center items-center">
      {/* Asli Element (Button, Icon, etc.) */}
      {children}

      {/* Tooltip Box (By default chupa hua, hover pe dikhega) */}
      <div
        className={`absolute z-50 hidden group-hover:flex flex-col items-center whitespace-nowrap ${positions[position]}`}
      >
        <span className="bg-gray-800 text-white text-xs font-medium px-2.5 py-1.5 rounded-md shadow-lg">
          {text}
        </span>
        
        {/* Chhota sa Arrow */}
        <div className={`absolute border-[5px] ${arrowPositions[position]}`}></div>
      </div>
    </div>
  );
};

export default Tooltip;