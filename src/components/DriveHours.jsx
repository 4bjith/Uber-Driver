import React from "react";
import { MdOutlineAccessTime } from "react-icons/md";

const DrivingHoursCard = () => {
  return (
    <div className="w-full  h-[130px] md:h-[160px] bg-white rounded-2xl shadow-sm p-4 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="p-2 bg-blue-100 rounded-full">
          <MdOutlineAccessTime className="text-blue-500 text-lg" />
        </div>
        <p className="text-gray-600 font-medium">Driving hours</p>
      </div>

      {/* Stats Section */}
      <div className="flex items-center justify-between">
        {/* Time Display */}
        <div>
          <div className="flex items-end gap-1">
            <h2 className="text-3xl font-semibold text-gray-800">16</h2>
            <span className="text-sm text-gray-500 mb-1">hr</span>
            <h2 className="text-3xl font-semibold text-gray-800 ml-2">12</h2>
            <span className="text-sm text-gray-500 mb-1">m</span>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              <span className="text-xs text-gray-500">Day time</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span className="text-xs text-gray-500">Night time</span>
            </div>
          </div>
        </div>

        {/* Circular Chart */}
        <div className="relative w-16 h-16">
          <svg className="w-full h-full -rotate-90">
            {/* Background circle */}
            <circle
              cx="32"
              cy="32"
              r="25"
              stroke="#f1f5f9"
              strokeWidth="6"
              fill="none"
            />
            {/* Day time (green arc) */}
            <circle
              cx="32"
              cy="32"
              r="25"
              stroke="#4ade80"
              strokeWidth="6"
              fill="none"
              strokeDasharray="157"
              strokeDashoffset="40"
              strokeLinecap="round"
            />
            {/* Night time (blue arc) */}
            <circle
              cx="32"
              cy="32"
              r="25"
              stroke="#3b82f6"
              strokeWidth="6"
              fill="none"
              strokeDasharray="50"
              strokeDashoffset="190"
              strokeLinecap="round"
            />
          </svg>

          {/* Small icons in circle */}
          <div className="absolute top-1 right-2 w-4 h-4 bg-white border-2 border-green-400 rounded-full flex items-center justify-center">
            <MdOutlineAccessTime className="text-green-400 text-[10px]" />
          </div>
          <div className="absolute bottom-2 left-0 w-4 h-4 bg-white border-2 border-blue-400 rounded-full flex items-center justify-center">
            <MdOutlineAccessTime className="text-blue-400 text-[10px]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrivingHoursCard;
