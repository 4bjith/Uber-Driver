import React from "react";
import { 
  RiRadarLine, 
  RiMapPinLine, 
  RiNavigationLine, 
  RiCheckLine, 
  RiCloseLine, 
  RiShieldFlashLine,
  RiWallet3Line
} from "react-icons/ri";

const CurrentTripCard = ({ Msg, handleSubmit, setIsMsg, isOnline }) => {
  return (
    <div className="w-full flex flex-col justify-between h-full">
      {Msg ? (
        <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                Incoming Dispatch Request
              </span>
            </div>
            <span className="text-xs font-mono font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-2 py-0.5 rounded">
              #{Msg.rideId?.slice(-4) || "LIVE"}
            </span>
          </div>

          {/* Route Summary */}
          <div className="space-y-3 bg-zinc-50 dark:bg-zinc-900/70 p-3.5 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60">
            <div className="flex items-start gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full border-2 border-zinc-950 dark:border-white bg-white dark:bg-zinc-950 mt-1 shrink-0" />
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase text-zinc-400 dark:text-zinc-500">Pickup Location</p>
                <p className="text-xs font-bold text-zinc-900 dark:text-white truncate">{Msg.pickup || "Passenger Location"}</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-950 dark:bg-white mt-1 shrink-0" />
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase text-zinc-400 dark:text-zinc-500">Destination</p>
                <p className="text-xs font-bold text-zinc-900 dark:text-white truncate">{Msg.dropoff || "Dropoff Destination"}</p>
              </div>
            </div>
          </div>

          {/* Fare & Escrow Guarantee */}
          <div className="flex items-center justify-between p-3 bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 rounded-xl">
            <div className="flex items-center gap-2">
              <RiShieldFlashLine className="text-emerald-400 dark:text-emerald-600" size={18} />
              <div>
                <p className="text-[10px] opacity-80 uppercase tracking-wider font-semibold">Net Payout (80%)</p>
                <p className="text-sm font-extrabold font-['Space_Grotesk']">
                  ₹{Msg.earnings ? Number(Msg.earnings).toFixed(2) : "185.00"}
                </p>
              </div>
            </div>
            <span className="text-[10px] bg-white/20 dark:bg-black/10 px-2 py-0.5 rounded font-mono font-bold">
              Cashfree Escrow
            </span>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => setIsMsg(null)}
              className="py-2.5 px-3 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold text-xs hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center justify-center gap-1.5"
            >
              <RiCloseLine size={16} />
              Pass
            </button>
            <button
              onClick={handleSubmit}
              className="py-2.5 px-3 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-bold text-xs shadow-md hover:opacity-90 active:scale-98 transition-all flex items-center justify-center gap-1.5"
            >
              <RiCheckLine size={16} />
              Accept Ride
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center py-6 gap-3">
          <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800">
            {isOnline ? (
              <>
                <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />
                <RiRadarLine size={28} className="text-emerald-600 dark:text-emerald-400 relative z-10" />
              </>
            ) : (
              <RiRadarLine size={28} className="text-zinc-400 dark:text-zinc-600" />
            )}
          </div>

          <div>
            <h4 className="text-sm font-bold text-zinc-900 dark:text-white">
              {isOnline ? "Scanning for Passenger Requests" : "Driver Shift Offline"}
            </h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-[220px] mt-1">
              {isOnline
                ? "You are in high-demand queue. Incoming rides will pop up with auto-routing."
                : "Toggle your shift status to Online in the navbar to begin receiving rides."}
            </p>
          </div>

          <div className="flex items-center gap-2 mt-2 px-3 py-1 bg-zinc-50 dark:bg-zinc-900 rounded-full border border-zinc-200/60 dark:border-zinc-800/60 text-[11px] font-medium text-zinc-600 dark:text-zinc-400">
            <span className={`w-2 h-2 rounded-full ${isOnline ? "bg-emerald-500 animate-pulse" : "bg-zinc-400"}`} />
            <span>{isOnline ? "GPS Telemetry Broadcasting" : "Telemetry Inactive"}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrentTripCard;
