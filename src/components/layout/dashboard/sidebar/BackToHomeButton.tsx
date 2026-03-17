import React from "react";
import { BACK_TO_HOME_ICON } from "./Constant";

interface BackToHomeButtonProps {
  onClick: () => void;
}

const BackToHomeButton: React.FC<BackToHomeButtonProps> = ({ onClick }) => {
  return (
    <div className="mb-8 pb-6 border-b border-gray-100">
      <button
        onClick={onClick}
        className="flex items-center space-x-2 text-gray-700 hover:text-red-700 hover:bg-red-50 px-4 py-3 rounded-lg transition-all duration-300 w-full text-left group border border-gray-200 hover:border-red-200"
      >
        {BACK_TO_HOME_ICON}
        <span className="font-medium">Back to Home</span>
      </button>
    </div>
  );
};

export default BackToHomeButton;