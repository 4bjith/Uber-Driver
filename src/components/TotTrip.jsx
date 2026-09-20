import React from "react";
import { RiRouteLine, RiArrowRightUpLine } from "react-icons/ri";

const TotalTripsCard = ({ rides }) => {
  const bars = [
    { label: "M", height: "45%" },
    { label: "T", height: "60%" },
    { label: "W", height: "35%" },
    { label: "T", height: "80%" },
    { label: "F", height: "95%" },
    { label: "S", height: "70%" },
    { label: "S", height: "50%" },
  ];

  const totalTrips = rides?.filter((i) => i.status === "completed").length || 0;
  const inProgress = rides?.filter((i) => i.status === "in_progress" || i.status === "accepted").length || 0;

  return (
    <div className="w-full bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-5 flex flex-col justify-between shadow-xs transition-all hover:border-zinc-300 dark:hover:border-zinc-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-zinc-950 dark:text-white">
            <RiRouteLine size={18} />
          </div>
          <div>
            <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Completed Trips
            </p>
            <span className="text-[11px] text-zinc-400 dark:text-zinc-500 font-medium">
              Lifetime verified
            </span>
          </div>
        </div>
        <span className="flex items-center gap-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60 px-2 py-0.5 rounded-full">
          <RiArrowRightUpLine size={12} />
          +12%
        </span>
      </div>

      {/* Stats and Sparkline */}
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-zinc-950 dark:text-white tracking-tight font-['Space_Grotesk']">
            {totalTrips}
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 font-medium">
            {inProgress > 0 ? (
              <span className="text-amber-600 dark:text-amber-400 font-semibold">
                ● {inProgress} active now
              </span>
            ) : (
              "All trips logged"
            )}
          </p>
        </div>

        {/* Minimalist Bar Chart */}
        <div className="flex items-end gap-1.5 h-12">
          {bars.map((bar, index) => (
            <div key={index} className="flex flex-col items-center gap-1">
              <div className="w-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 h-10 flex items-end justify-center overflow-hidden">
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

export default TotalTripsCard;
