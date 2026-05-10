import React from 'react';

const Loader = () => {
  return (
   <div className="animate-pulse grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3,4,5,6].map((i) => (
        <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 h-48">
          {/* Header Line */}
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          {/* Title Block */}
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
          {/* Description Lines */}
          <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          
          {/* Footer */}
          <div className="mt-8 flex justify-between items-center">
             <div className="h-4 bg-gray-200 rounded w-16"></div>
             <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Loader;