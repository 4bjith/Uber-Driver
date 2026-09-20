import React from "react";
import { RiTimeLine, RiSunLine, RiMoonLine } from "react-icons/ri";

const DrivingHoursCard = () => {
  return (
    <div className="w-full bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-5 flex flex-col justify-between shadow-xs transition-all hover:border-zinc-300 dark:hover:border-zinc-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-zinc-950 dark:text-white">
            <RiTimeLine size={18} />
          </div>
          <div>
            <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Online Shift Hours
            </p>
            <span className="text-[11px] text-zinc-400 dark:text-zinc-500 font-medium">
              Active duty log
            </span>
          </div>
        </div>
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
      </div>

      {/* Stats Section */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="flex items-baseline gap-1">
            <h2 className="text-3xl font-extrabold text-zinc-950 dark:text-white tracking-tight font-['Space_Grotesk']">
              6
            </h2>
            <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 mr-2">
              hrs
            </span>
            <h2 className="text-3xl font-extrabold text-zinc-950 dark:text-white tracking-tight font-['Space_Grotesk']">
              45
            </h2>
            <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500">
              mins
            </span>
          </div>

          {/* Day vs Night Breakdown */}
          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-400 font-medium">
              <RiSunLine size={13} className="text-amber-500" />
              <span>4h 30m</span>
            </div>
            <span className="text-zinc-300 dark:text-zinc-700">•</span>
            <div className="flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-400 font-medium">
              <RiMoonLine size={13} className="text-indigo-400" />
              <span>2h 15m</span>
            </div>
          </div>
        </div>

        {/* Circular Progress Gauge */}
        <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
            <circle
              cx="18"
              cy="18"
              r="14"
              className="text-zinc-100 dark:text-zinc-800 stroke-current"
              strokeWidth="3.5"
              fill="none"
            />
            <circle
              cx="18"
              cy="18"
              r="14"
              className="text-zinc-950 dark:text-white stroke-current transition-all duration-700"
              strokeWidth="3.5"
              strokeDasharray="88"
              strokeDashoffset="26"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
          <span className="absolute text-[11px] font-bold text-zinc-900 dark:text-white font-mono">
            70%
          </span>
        </div>
      </div>
    </div>
  );
};

export default DrivingHoursCard;
