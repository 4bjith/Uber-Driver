import React, { useEffect, useState } from "react";
import { RiSpeedUpLine, RiPinDistanceLine } from "react-icons/ri";

const DistanceDrivenCard = ({ rides }) => {
  const [distance, setDistance] = useState("0.00");

  useEffect(() => {
    if (!rides || rides.length === 0) return;

    const total = rides
      .filter((r) => r.status === "completed")
      .reduce((sum, r) => sum + Number(r.distance || 0), 0);

    setDistance(total.toFixed(1));
  }, [rides]);

  const bars = [
    { label: "W1", height: "50%" },
    { label: "W2", height: "75%" },
    { label: "W3", height: "40%" },
    { label: "W4", height: "90%" },
  ];

  return (
    <div className="w-full bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-5 flex flex-col justify-between shadow-xs transition-all hover:border-zinc-300 dark:hover:border-zinc-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-zinc-950 dark:text-white">
            <RiSpeedUpLine size={18} />
          </div>
          <div>
            <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Total Distance
            </p>
            <span className="text-[11px] text-zinc-400 dark:text-zinc-500 font-medium">
              Odometer telemetry
            </span>
          </div>
        </div>
        <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md font-semibold">
          KM
        </span>
      </div>

      {/* Stats Section */}
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="flex items-baseline gap-1.5">
            <h2 className="text-3xl font-extrabold text-zinc-950 dark:text-white tracking-tight font-['Space_Grotesk']">
              {distance}
            </h2>
            <span className="text-sm font-bold text-zinc-400 dark:text-zinc-500">
              km
            </span>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 font-medium">
            Avg {(Number(distance) / Math.max(1, (rides?.filter(r => r.status === "completed")?.length || 1))).toFixed(1)} km / trip
          </p>
        </div>

        {/* Minimalist Bar Chart */}
        <div className="flex items-end gap-2 h-12">
          {bars.map((bar, index) => (
            <div key={index} className="flex flex-col items-center gap-1">
              <div className="w-2 rounded-full bg-zinc-100 dark:bg-zinc-800 h-10 flex items-end justify-center overflow-hidden">
                <div
                  className="w-full rounded-full bg-zinc-900 dark:bg-white transition-all duration-500"
                  style={{ height: bar.height }}
                />
              </div>
              <span className="text-[9px] font-mono text-zinc-400 dark:text-zinc-500">
                {bar.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DistanceDrivenCard;
