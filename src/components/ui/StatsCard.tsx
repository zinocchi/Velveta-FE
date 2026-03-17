import React, { ReactNode } from "react";
import { cn } from "../../libs/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  subtitleValue?: string | number;
  icon: ReactNode;
  iconBgColor?: string;
  iconColor?: string;
  className?: string;
  hoverColor?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  subtitleValue,
  icon,
  iconBgColor = "bg-red-50",
  iconColor = "text-red-700",
  className,
  hoverColor = "hover:border-red-200",
}) => {
  return (
    <div
      className={cn(
        "bg-white rounded-2xl p-6 border border-gray-100 transition-all duration-300 shadow-sm hover:shadow-md",
        hoverColor,
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
          {subtitle && subtitleValue !== undefined && (
            <div className="flex items-center gap-1 text-sm">
              <span className="text-gray-500">{subtitle}:</span>
              <span className="font-semibold text-gray-900">
                {subtitleValue}
              </span>
            </div>
          )}
        </div>
        <div className={cn("p-3 rounded-xl", iconBgColor)}>
          <div className={cn("w-6 h-6", iconColor)}>{icon}</div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;