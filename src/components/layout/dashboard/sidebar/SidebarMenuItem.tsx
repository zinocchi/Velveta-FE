import React from "react";
import { SidebarMenuItemProps } from "./types";
import { cn } from "../../../../libs/utils";

const SidebarMenuItem: React.FC<SidebarMenuItemProps> = ({
  item,
  isActive,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 w-full text-left",
        "hover:bg-gray-50 hover:text-red-700",
        isActive
          ? "bg-red-50 text-red-700 border-l-4 border-red-500"
          : "text-gray-700 border-l-4 border-transparent"
      )}
    >
      {/* Icon */}
      <div className={cn(isActive ? "text-red-600" : "text-gray-500")}>
        {item.icon}
      </div>

      {/* Label */}
      <span className="font-medium flex-1">{item.label}</span>

      {/* Badge */}
      {item.hasBadge && item.badgeCount && item.badgeCount > 0 && (
        <span
          className={cn(
            "text-xs font-medium px-2 py-1 rounded-full",
            isActive
              ? "bg-red-600 text-white"
              : "bg-red-100 text-red-800"
          )}
        >
          {item.badgeCount > 99 ? "99+" : item.badgeCount}
        </span>
      )}
    </button>
  );
};

export default SidebarMenuItem;