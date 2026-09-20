import { useEffect, useState } from "react";
import api from "../api/axiosClient";
import useDriverStore from "../Zustand/DriverAuth";
import moment from "moment";
import { 
  RiMapPinLine, 
  RiNavigationLine, 
  RiArrowRightLine, 
  RiCheckDoubleLine,
  RiTimeLine,
  RiCloseLine
} from "react-icons/ri";

const TripItem = ({ start, end, distance, requestedAt, status, earnings, completedAt }) => {
  const getStatusBadge = () => {
    switch (status?.toLowerCase()) {
      case "completed":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60">
            <RiCheckDoubleLine size={12} />
            Completed
          </span>
        );
      case "in_progress":
      case "accepted":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60 animate-pulse">
            <RiTimeLine size={12} />
            In Progress
          </span>
        );
      case "cancelled":
      case "cancled":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
            <RiCloseLine size={12} />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-zinc-50/70 dark:bg-zinc-900/40 border border-zinc-200/70 dark:border-zinc-800/60 hover:bg-zinc-100/80 dark:hover:bg-zinc-900/80 transition-colors gap-3">
      {/* Route & Points */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="flex flex-col items-center gap-1 shrink-0">
          <div className="w-2.5 h-2.5 rounded-full border-2 border-zinc-950 dark:border-white bg-white dark:bg-zinc-950" />
          <div className="w-0.5 h-4 bg-zinc-300 dark:bg-zinc-700" />
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-950 dark:bg-white" />
        </div>
        <div className="min-w-0 flex-1 space-y-1">
          <p className="text-xs font-semibold text-zinc-900 dark:text-white truncate" title={start}>
            {start}
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate" title={end}>
            {end}
          </p>
        </div>
      </div>

      {/* Distance & Timestamp */}
      <div className="flex sm:flex-col items-start sm:items-end justify-between text-xs text-zinc-500 dark:text-zinc-400 shrink-0">
        <span className="font-mono font-medium">{distance ? `${distance} km` : "--"}</span>
        <span className="text-[11px]">
          {requestedAt ? moment(requestedAt).format("MMM D, h:mm A") : "--"}
        </span>
      </div>

      {/* Earnings & Status */}
      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-200/60 dark:border-zinc-800/60">
        <div className="text-right">
          <p className="text-xs font-bold text-zinc-950 dark:text-white font-['Space_Grotesk']">
            ₹{earnings ? Number(earnings).toFixed(2) : "0.00"}
          </p>
          <p className="text-[10px] text-zinc-400 dark:text-zinc-500">80% Share</p>
        </div>
        {getStatusBadge()}
      </div>
    </div>
  );
};

function Trips() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = useDriverStore((state) => state.token);

  useEffect(() => {
    const fetchRides = async () => {
      if (!token) return;
      try {
        setLoading(true);
        const response = await api.get("/allrides?limit=5", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data?.data;
        setRides(data || []);
      } catch (error) {
        console.error("Error fetching rides:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRides();
  }, [token]);

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((n) => (
          <div key={n} className="h-16 rounded-xl bg-zinc-100 dark:bg-zinc-900/60 animate-pulse" />
        ))}
      </div>
    );
  }

  if (rides.length === 0) {
    return (
      <div className="p-8 text-center rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-dashed border-zinc-200 dark:border-zinc-800">
        <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
          No recent ride activity logged yet.
        </p>
        <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-0.5">
          Incoming trips will appear here with live Cashfree payout calculations.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-2.5">
      {rides.map((ride, index) => (
        <TripItem
          key={ride._id || index}
          start={ride.pickup || "Origin"}
          end={ride.dropoff || "Destination"}
          distance={ride.distance}
          requestedAt={ride.requestedAt}
          status={ride.status || "completed"}
          earnings={ride.earnings}
          completedAt={ride.compltedAt || ride.completedAt}
        />
      ))}
    </div>
  );
}

export default Trips;
