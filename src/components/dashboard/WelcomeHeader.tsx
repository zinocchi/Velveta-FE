import React from "react";
import { User } from "../../types/user";

interface WelcomeHeaderProps {
  user: User | null;
}

const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({ user }) => {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-1">
        Welcome back,{" "}
        <span className="text-red-700">
          {user?.username?.split(" ")[0] || "Coffee Lover"}
        </span>
      </h1>
      <p className="text-gray-500">Here's your activity overview</p>
    </div>
  );
};

export default WelcomeHeader;