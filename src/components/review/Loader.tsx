"use client";

import React from "react";

interface LoaderProps {
  message?: string;
  progress?: number;
}

export const Loader: React.FC<LoaderProps> = ({ 
  message = "Loading...", 
  progress 
}) => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white bg-opacity-90 z-50">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600 mb-4"></div>
      
      <p className="text-gray-800 font-medium mb-2">{message}</p>
      
      {progress !== undefined && (
        <div className="w-64">
          <div className="h-2 bg-gray-200 rounded-full">
            <div 
              className="h-2 bg-blue-600 rounded-full transition-all duration-300 ease-out" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 text-center mt-1">{progress}%</p>
        </div>
      )}
    </div>
  );
};
