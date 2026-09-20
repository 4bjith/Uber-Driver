import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import useDriverStore from "../Zustand/DriverAuth";
import api from "../api/axiosClient";
import { 
  FiMapPin, 
  FiNavigation, 
  FiCalendar, 
  FiClock, 
  FiChevronDown, 
  FiChevronUp, 
  FiChevronLeft, 
  FiChevronRight,
  FiCheckCircle,
  FiXCircle,
  FiShield,
  FiSearch
} from "react-icons/fi";
import { RiWallet3Line, RiShieldCheckLine, RiExchangeDollarLine } from "react-icons/ri";

export default function RideHistory() {
  const [rides, setRides] = useState([]);
  const token = useDriverStore((state) => state.token);
  const [page, setPage] = useState(1);
  const [openRow, setOpenRow] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["driver", "allrides", page],
    queryFn: async () => {
      const response = await api.get(`/allrides?page=${page}&limit=8`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    },
    keepPreviousData: true,
  });

  useEffect(() => {
    if (data) {
      setRides(data?.data || []);
    }
  }, [data]);

  const filteredRides = rides
    .filter((r) => {
      if (filter === "completed") return r.status?.toLowerCase() === "completed";
      if (filter === "cancelled" || filter === "cancled") return r.status?.toLowerCase().includes("canc");
      if (filter === "in_progress") return r.status?.toLowerCase() === "in_progress" || r.status?.toLowerCase() === "accepted";
      return true;
    })
    .filter((r) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        r.pickup?.toLowerCase().includes(q) ||
        r.dropoff?.toLowerCase().includes(q) ||
        r._id?.toLowerCase().includes(q)
      );
    });

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-zinc-950 text-white dark:bg-white dark:text-zinc-950">
            <FiCheckCircle className="w-3.5 h-3.5" />
            <span>Completed</span>
          </span>
        );
      case "cancelled":
      case "cancled":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-300 dark:border-zinc-700">
            <FiXCircle className="w-3.5 h-3.5" />
            <span>Cancelled</span>
          </span>
        );
      case "in_progress":
      case "accepted":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-950 dark:text-white border border-zinc-950/20 dark:border-white/20 animate-pulse">
            <FiClock className="w-3.5 h-3.5" />
            <span>In Transit</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
            {status || "Pending"}
          </span>
        );
    }
  };

  return (
    <div className="w-full min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans transition-colors duration-300">
      <Navbar />

      <div className="flex-1 w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Page Title & Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-white font-['Space_Grotesk']">
              Trip History & Payouts
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Authoritative trip audit logs with 80% driver settlement breakdowns.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search by route or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-white transition-all shadow-xs"
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            { id: "all", label: "All Rides" },
            { id: "completed", label: "Completed" },
            { id: "in_progress", label: "Active" },
            { id: "cancelled", label: "Cancelled" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                filter === tab.id
                  ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-sm"
                  : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:text-zinc-950 dark:hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {isLoading && rides.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-3 border-zinc-300 dark:border-zinc-700 border-t-zinc-950 dark:border-t-white rounded-full animate-spin mb-3" />
            <p className="text-xs font-medium text-zinc-500">Retrieving driver ledger logs...</p>
          </div>
        ) : !isLoading && filteredRides.length === 0 ? (
          <div className="text-center py-16 px-4 bg-white dark:bg-zinc-900/50 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800">
            <div className="w-14 h-14 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white flex items-center justify-center mx-auto mb-3 text-2xl">
              <FiCalendar />
            </div>
            <h3 className="text-base font-bold text-zinc-950 dark:text-white font-['Space_Grotesk']">
              No Trips Found
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm mx-auto">
              {searchQuery
                ? "No rides match your search keyword. Try a different query."
                : "You haven't performed any rides under this category yet."}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block bg-white dark:bg-zinc-900 shadow-sm rounded-2xl overflow-hidden border border-zinc-200/80 dark:border-zinc-800">
              <table className="w-full border-collapse">
                <thead className="bg-zinc-50 dark:bg-zinc-950 text-zinc-500 dark:text-zinc-400 text-xs font-bold uppercase tracking-wider border-b border-zinc-200 dark:border-zinc-800">
                  <tr>
                    <th className="p-4 text-left">Trip ID</th>
                    <th className="p-4 text-left">Route Geometry</th>
                    <th className="p-4 text-left">Date & Time</th>
                    <th className="p-4 text-left">Net Payout (80%)</th>
                    <th className="p-4 text-left">Status</th>
                    <th className="p-4 text-center">Receipt</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                  {filteredRides.map((ride) => (
                    <tr
                      key={ride._id}
                      className="group hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition-colors"
                    >
                      <td className="p-4 text-xs font-mono font-bold text-zinc-500 dark:text-zinc-400">
                        #{ride._id.slice(-6)}
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col gap-1 text-xs">
                          <div className="flex items-center gap-2 text-zinc-900 dark:text-white font-semibold">
                            <div className="w-2 h-2 rounded-full border border-zinc-950 dark:border-white bg-white dark:bg-zinc-950 shrink-0" />
                            <span className="truncate max-w-[220px]" title={ride.pickup}>
                              {ride.pickup}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
                            <div className="w-2 h-2 rounded-full bg-zinc-950 dark:bg-white shrink-0" />
                            <span className="truncate max-w-[220px]" title={ride.dropoff}>
                              {ride.dropoff}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-xs font-medium text-zinc-600 dark:text-zinc-400">
                        {new Date(ride.requestedAt || Date.now()).toLocaleDateString()}{" "}
                        <span className="text-[11px] text-zinc-400">
                          {new Date(ride.requestedAt || Date.now()).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="text-xs">
                          <span className="font-extrabold text-zinc-950 dark:text-white font-['Space_Grotesk']">
                            ₹{Number(ride.earnings || (ride.fare ? ride.fare * 0.8 : 0)).toFixed(2)}
                          </span>
                          <span className="block text-[10px] text-zinc-400">Gross: ₹{ride.fare || "100.00"}</span>
                        </div>
                      </td>
                      <td className="p-4">{getStatusBadge(ride.status)}</td>

                      <td className="p-4 text-center">
                        <button
                          onClick={() => setOpenRow(openRow === ride._id ? null : ride._id)}
                          className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors text-zinc-500 dark:text-zinc-400"
                        >
                          {openRow === ride._id ? <FiChevronUp /> : <FiChevronDown />}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Expanded Details Drawer */}
            {openRow && filteredRides.find((r) => r._id === openRow) && (
              (() => {
                const ride = filteredRides.find((r) => r._id === openRow);
                const grossFare = ride.fare || 100;
                const netDriver = ride.earnings || grossFare * 0.8;
                const platformFee = grossFare - netDriver;

                return (
                  <div className="p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-lg grid grid-cols-2 md:grid-cols-4 gap-4 text-xs animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-3.5 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60">
                      <span className="text-[10px] uppercase font-bold text-zinc-400 block mb-1">
                        Passenger Details
                      </span>
                      <span className="font-bold text-zinc-900 dark:text-white">
                        {ride.userId?.name || ride.passenger?.name || "Verified Passenger"}
                      </span>
                    </div>

                    <div className="p-3.5 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60">
                      <span className="text-[10px] uppercase font-bold text-zinc-400 block mb-1">
                        Total Distance
                      </span>
                      <span className="font-bold text-zinc-900 dark:text-white">
                        {ride.distance || "4.5"} km
                      </span>
                    </div>

                    <div className="p-3.5 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60">
                      <span className="text-[10px] uppercase font-bold text-zinc-400 block mb-1">
                        Fare Split
                      </span>
                      <span className="font-bold text-zinc-900 dark:text-white">
                        Net: ₹{Number(netDriver).toFixed(2)}{" "}
                        <span className="text-[10px] font-normal text-zinc-400">
                          (Fee: ₹{Number(platformFee).toFixed(2)})
                        </span>
                      </span>
                    </div>

                    <div className="p-3.5 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60">
                      <span className="text-[10px] uppercase font-bold text-zinc-400 block mb-1">
                        Settlement Method
                      </span>
                      <span className="font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                        <RiShieldCheckLine className="text-emerald-500" size={14} />
                        Cashfree Escrow Direct
                      </span>
                    </div>
                  </div>
                );
              })()
            )}

            {/* Mobile Card List View */}
            <div className="md:hidden space-y-3">
              {filteredRides.map((ride) => (
                <div
                  key={ride._id}
                  className="p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-3"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-mono font-bold text-zinc-400">
                      #{ride._id.slice(-6)}
                    </span>
                    {getStatusBadge(ride.status)}
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-start gap-2.5">
                      <div className="w-2 h-2 rounded-full border border-zinc-950 dark:border-white bg-white dark:bg-zinc-950 shrink-0 mt-1" />
                      <span className="font-bold text-zinc-900 dark:text-white truncate">
                        {ride.pickup}
                      </span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <div className="w-2 h-2 rounded-full bg-zinc-950 dark:bg-white shrink-0 mt-1" />
                      <span className="text-zinc-600 dark:text-zinc-400 truncate">
                        {ride.dropoff}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-500">
                    <span>{new Date(ride.requestedAt || Date.now()).toLocaleDateString()}</span>
                    <span className="font-extrabold text-zinc-950 dark:text-white font-['Space_Grotesk']">
                      ₹{Number(ride.earnings || (ride.fare ? ride.fare * 0.8 : 0)).toFixed(2)} • {ride.distance || "4.5"} km
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="pt-4 flex justify-center items-center gap-3">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className={`p-2.5 rounded-xl border transition-all ${
                  page === 1
                    ? "bg-zinc-100 dark:bg-zinc-900 text-zinc-400 border-transparent cursor-not-allowed"
                    : "bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }`}
              >
                <FiChevronLeft size={16} />
              </button>
              <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400 font-mono">
                Page {page}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={rides.length < 8}
                className={`p-2.5 rounded-xl border transition-all ${
                  rides.length < 8
                    ? "bg-zinc-100 dark:bg-zinc-900 text-zinc-400 border-transparent cursor-not-allowed"
                    : "bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }`}
              >
                <FiChevronRight size={16} />
              </button>
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
