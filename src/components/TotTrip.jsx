import React from "react";
import { MdPercent } from "react-icons/md";

const TotalTripsCard = ({ rides }) => {
  const bars = [
    { month: "Dec", height: "40%", color: "bg-blue-500" },
    { month: "Jan", height: "55%", color: "bg-blue-400" },
    { month: "Feb", height: "45%", color: "bg-blue-300" },
    { month: "Mar", height: "70%", color: "bg-green-400" },
    { month: "Apr", height: "30%", color: "bg-blue-200" },
  ];
  // if (rides.request)
  const totalTrips = rides?.length

  return (
    <div className="w-full h-[130px] md:h-[160px] bg-white rounded-2xl shadow-sm p-4 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="p-2 bg-blue-100 rounded-full">
          <MdPercent className="text-blue-500 text-lg" />
        </div>
        <p className="text-gray-600 font-medium">Total trips</p>
      </div>

      {/* Stats */}
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-4xl font-semibold text-gray-800">{totalTrips ? totalTrips : 0}</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="bg-lime-200 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full">
              +2.1%
            </span>
            <span className="text-xs text-gray-400">this month</span>
          </div>
        </div>

        {/* Mini Bar Chart */}
        <div className="flex items-end gap-2 h-[60px]">
          {bars.map((bar, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="w-2 rounded-full bg-gray-100 h-[60px] flex items-end justify-center">
                <div
                  className={`${bar.color} w-2 rounded-full`}
                  style={{ height: bar.height }}
                ></div>
              </div>
              <span className="text-[10px] text-gray-400 mt-1">{bar.month}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TotalTripsCard;
