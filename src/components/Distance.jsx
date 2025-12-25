import React, { useEffect, useState } from "react";
import { MdOutlineSpeed } from "react-icons/md";

const DistanceDrivenCard = ({rides}) => {
  const bars = [
    { month: "Dec", height: "45%", color: "bg-blue-500" },
    { month: "Jan", height: "60%", color: "bg-blue-400" },
    { month: "Feb", height: "50%", color: "bg-blue-300" },
    { month: "Mar", height: "75%", color: "bg-green-400" },
    { month: "Apr", height: "55%", color: "bg-blue-200" },
  ];
  const [distance, setDistance] = useState(0)
 // 📌 Calculate total completed ride distance
   useEffect(() => {
    if (!rides || rides.length === 0) return;

    const total = rides
      .filter((r) => r.status === "completed")
      .reduce((sum, r) => sum + Number(r.distance || 0), 0);

    setDistance(total.toFixed(2));
  }, [rides]);
  return (
    <div className="w-full  h-[150px] md:h-[160px] bg-white rounded-2xl shadow-sm p-4 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="p-2 bg-blue-100 rounded-full">
          <MdOutlineSpeed className="text-blue-500 text-lg" />
        </div>
        <p className="text-gray-600 font-medium">Distance driven</p>
      </div>

      {/* Stats and Chart */}
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-semibold text-gray-800">{distance}</h2>
          <span className="text-xs text-gray-400 ml-1">km</span>
        </div>

        {/* Bar + Dot Chart */}
        <div className="flex items-end gap-3 h-[70px]">
          {bars.map((bar, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="relative flex items-end justify-center h-[60px] w-2 rounded-full bg-gray-100">
                <div
                  className={`${bar.color} w-2 rounded-full`}
                  style={{ height: bar.height }}
                ></div>
                {/* Dot at top */}
                <div
                  className="absolute w-3 h-3 bg-white border-2 border-blue-400 rounded-full"
                  style={{
                    bottom: `calc(${bar.height} - 0.4rem)`,
                    borderColor:
                      bar.color === "bg-green-400" ? "#4ade80" : "#60a5fa",
                  }}
                ></div>
              </div>
              <span className="text-[10px] text-gray-400 mt-1">
                {bar.month}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DistanceDrivenCard;
