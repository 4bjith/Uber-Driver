import { useEffect, useState } from "react";
import TotalTripsCard from "../components/TotTrip";
import DistanceDrivenCard from "../components/Distance";
import DrivingHoursCard from "../components/DriveHours";
import CurrentTripCard from "../components/CurrentTrip";
import Trips from "../components/Trips";
import CurrentLocationMap from "../components/CurrentLocationMap";
import DashMenu from "../components/DashMenu";
import Navbar from "../components/Navbar";
import useDriverStore from "../Zustand/DriverAuth";
import { toast } from "react-toastify";
import api from "../api/axiosClient";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  RiArrowRightUpLine, 
  RiShieldCheckLine, 
  RiAlertLine, 
  RiCarLine, 
  RiCloseLine, 
  RiCheckLine,
  RiWallet3Line,
  RiNavigationFill,
  RiCompass3Line,
  RiDeleteBinLine
} from "react-icons/ri";

function DashBoard({ socketRef, Msg, setIsMsg }) {
  const token = useDriverStore((state) => state.token);
  const driver = useDriverStore((state) => state.driver);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [rides, setRides] = useState([]);
  const [countdown, setCountdown] = useState(15);
  const [isCancellingActive, setIsCancellingActive] = useState(false);

  // Fetch driver ride history for stats
  const { data: rideData } = useQuery({
    queryKey: ["driver", "allrides"],
    queryFn: async () => {
      if (!token) return null;
      const response = await api.get("/allrides", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
    enabled: !!token,
  });

  useEffect(() => {
    if (rideData?.data) {
      setRides(rideData.data);
    }
  }, [rideData]);

  // Fetch driver profile
  const { data: driverProfile } = useQuery({
    queryKey: ["driverProfile", token],
    queryFn: async () => {
      if (!token) return null;
      try {
        const res = await api.get("/driver", {
          headers: { Authorization: `Bearer ${token}` },
        });
        return res.data?.driver || res.data;
      } catch (err) {
        console.error("Error fetching driver profile", err);
        return null;
      }
    },
    enabled: !!token,
  });

  // Check for active ride (poll every 4s)
  const { data: activeRide, refetch: refetchActiveRide } = useQuery({
    queryKey: ["driverActiveRide", token],
    queryFn: async () => {
      if (!token) return null;
      try {
        const res = await api.get("/ride/active", {
          headers: { Authorization: `Bearer ${token}` },
        });
        return res.data?.data;
      } catch (err) {
        return null;
      }
    },
    enabled: !!token,
    refetchInterval: 4000,
  });

  // Cancel or reset stuck active ride from dashboard
  const handleCancelActiveRide = async (rideIdToCancel) => {
    if (!rideIdToCancel) return;
    setIsCancellingActive(true);
    try {
      await api.put(
        "/ride/cancel",
        { rideId: rideIdToCancel },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Active ride cancelled/reset successfully");
      localStorage.removeItem("rideId");
      queryClient.invalidateQueries({ queryKey: ["driverActiveRide"] });
      refetchActiveRide();
    } catch (err) {
      console.error("Error cancelling ride:", err);
      toast.error(err.response?.data?.message || "Failed to cancel ride");
    } finally {
      setIsCancellingActive(false);
    }
  };

  // Countdown timer for incoming ride alert
  useEffect(() => {
    if (!Msg) {
      setCountdown(15);
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsMsg(null);
          return 15;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [Msg, setIsMsg]);

  // Keyboard shortcut listener (Enter = Accept, Escape = Decline)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!Msg) return;
      if (e.key === "Enter") {
        handleSubmit();
      } else if (e.key === "Escape") {
        handleDecline();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [Msg]);

  const handleSubmit = async () => {
    if (!Msg?.rideId) return;
    localStorage.setItem("rideId", Msg.rideId);
    try {
      await api.post(
        "/driver/acceptride",
        { rideId: Msg.rideId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Ride accepted! Routing to passenger...");
      const rideIdToOpen = Msg.rideId;
      setIsMsg(null);
      navigate(`/currentride?id=${rideIdToOpen}`);
    } catch (err) {
      console.error("Failed to accept ride", err);
      toast.error(err.response?.data?.message || "Failed to accept ride");
    }
  };

  const handleDecline = async () => {
    if (!Msg?.rideId) {
      setIsMsg(null);
      return;
    }
    try {
      await api.put(
        "/ride/cancel",
        { rideId: Msg.rideId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.info("Ride declined");
    } catch (err) {
      console.error("Failed to decline ride", err);
    } finally {
      setIsMsg(null);
    }
  };

  const isOnline = driverProfile?.status === "online" || driver?.status === "online";
  const todayEarnings = rides
    ?.filter((r) => r.status === "completed")
    ?.reduce((sum, r) => sum + Number(r.earnings || 0), 0) || 0;

  return (
    <div className="w-full h-screen flex bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans overflow-hidden transition-colors duration-300">
      {/* Sidebar for Desktop */}
      <div className="hidden md:block w-20 lg:w-64 h-full shrink-0">
        <DashMenu />
      </div>

      {/* Ride Alert Modal Overlay (15s Countdown) */}
      {Msg && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/70 dark:bg-black/80 backdrop-blur-md transition-all duration-300 animate-in fade-in p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 w-full max-w-md p-0 rounded-3xl shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-200">
            {/* Top progress bar for 15s timer */}
            <div className="h-1.5 bg-zinc-100 dark:bg-zinc-800 w-full">
              <div
                className="h-full bg-zinc-950 dark:bg-white transition-all duration-1000 ease-linear"
                style={{ width: `${(countdown / 15) * 100}%` }}
              />
            </div>

            <div className="p-6">
              {/* Header with Countdown Ring */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-950 dark:bg-white flex items-center justify-center text-white dark:text-zinc-950 shadow-md">
                    <RiCarLine size={24} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-zinc-950 dark:text-white font-['Space_Grotesk']">
                      New Ride Request
                    </h2>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      Auto-declines in {countdown}s
                    </p>
                  </div>
                </div>

                <div className="w-10 h-10 rounded-full border-2 border-zinc-950 dark:border-white flex items-center justify-center font-mono font-bold text-xs">
                  {countdown}s
                </div>
              </div>

              {/* Earnings & Escrow Breakdown */}
              <div className="p-4 bg-zinc-900 text-white dark:bg-zinc-950 dark:border dark:border-zinc-800 rounded-2xl mb-5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                    Net Driver Payout (80%)
                  </span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <h3 className="text-2xl font-extrabold font-['Space_Grotesk']">
                      ₹{Msg.earnings ? Number(Msg.earnings).toFixed(2) : "185.00"}
                    </h3>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                    Cashfree Escrow
                  </span>
                  <p className="text-[11px] text-zinc-400 mt-1">Instant Settlement</p>
                </div>
              </div>

              {/* Pickup / Dropoff Timeline */}
              <div className="space-y-4 relative pl-7 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-zinc-200 dark:before:bg-zinc-800">
                <div className="relative">
                  <div className="absolute -left-[23px] top-1 w-3.5 h-3.5 rounded-full border-2 border-zinc-950 dark:border-white bg-white dark:bg-zinc-950 z-10" />
                  <p className="text-[10px] font-bold uppercase text-zinc-400 dark:text-zinc-500 tracking-wider">
                    Pickup Location
                  </p>
                  <p className="text-sm font-semibold text-zinc-900 dark:text-white line-clamp-1">
                    {Msg.pickup || "Passenger Pickup"}
                  </p>
                </div>

                <div className="relative">
                  <div className="absolute -left-[23px] top-1 w-3.5 h-3.5 rounded-full bg-zinc-950 dark:bg-white z-10" />
                  <p className="text-[10px] font-bold uppercase text-zinc-400 dark:text-zinc-500 tracking-wider">
                    Destination
                  </p>
                  <p className="text-sm font-semibold text-zinc-900 dark:text-white line-clamp-1">
                    {Msg.dropoff || "Dropoff Point"}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-4 bg-zinc-50 dark:bg-zinc-900/80 border-t border-zinc-200/80 dark:border-zinc-800 flex gap-3">
              <button
                onClick={handleDecline}
                className="flex-1 py-3 px-4 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 rounded-xl font-bold text-xs hover:bg-zinc-100 dark:hover:bg-zinc-700 active:scale-95 transition-all flex items-center justify-center gap-1.5"
              >
                <RiCloseLine size={16} />
                <span>Decline (Esc)</span>
              </button>

              <button
                onClick={handleSubmit}
                className="flex-[2] py-3 px-4 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 rounded-xl font-bold text-xs shadow-lg hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <RiCheckLine size={18} />
                <span>Accept Ride (Enter)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 h-full overflow-y-auto w-full relative flex flex-col">
        {/* Floating Monochromatic Navbar */}
        <Navbar />

        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6 pb-20">
          {/* Active Ride Banner (Visible if driver has an accepted or in-progress ride) */}
          {activeRide && (
            <div className="bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 p-4 sm:p-5 rounded-2xl shadow-xl border border-zinc-800 dark:border-zinc-200 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in slide-in-from-top-3">
              <div className="flex items-start sm:items-center gap-3">
                <div className="p-3 bg-white/10 dark:bg-black/10 rounded-xl text-emerald-400 dark:text-emerald-600 shrink-0">
                  <RiNavigationFill size={22} className="animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase font-extrabold tracking-wider bg-emerald-500/20 text-emerald-400 dark:text-emerald-600 px-2 py-0.5 rounded-full font-mono">
                      {activeRide.status === "accepted" ? "En Route to Pickup" : "Trip In Progress"}
                    </span>
                    <span className="text-xs font-mono text-zinc-400 dark:text-zinc-600">
                      #{activeRide._id.slice(-6)}
                    </span>
                  </div>
                  <p className="text-sm font-bold mt-1 line-clamp-1">
                    {activeRide.pickup} ➔ {activeRide.dropoff}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
                <button
                  onClick={() => handleCancelActiveRide(activeRide._id)}
                  disabled={isCancellingActive}
                  className="px-3.5 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 dark:text-red-600 border border-red-500/30 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <RiDeleteBinLine size={14} />
                  <span>{isCancellingActive ? "Resetting..." : "Cancel Ride"}</span>
                </button>

                <button
                  onClick={() => {
                    if (activeRide.status === "accepted") {
                      navigate(`/currentride?id=${activeRide._id}`);
                    } else {
                      navigate(`/finalride?id=${activeRide._id}`);
                    }
                  }}
                  className="px-4 py-2 bg-white text-zinc-950 dark:bg-zinc-950 dark:text-white rounded-xl text-xs font-bold shadow-md hover:opacity-90 active:scale-95 transition-all flex items-center gap-1.5"
                >
                  <span>Resume Ride Navigation</span>
                  <RiArrowRightUpLine size={14} />
                </button>
              </div>
            </div>
          )}

          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-white font-['Space_Grotesk']">
                  Driver Command Center
                </h1>
                {driverProfile?.kycStatus === "verified" ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 text-xs font-bold rounded-full border border-emerald-200/60 dark:border-emerald-800/60">
                    <RiShieldCheckLine size={13} />
                    Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 text-xs font-bold rounded-full border border-amber-200/60 dark:border-amber-800/60 animate-pulse">
                    <RiAlertLine size={13} />
                    KYC Pending
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 font-medium">
                Real-time telemetry, Cashfree payouts, and ride dispatch.
              </p>
            </div>

            <button
              onClick={() => navigate("/trips")}
              className="self-start sm:self-auto px-4 py-2.5 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 rounded-xl text-xs font-bold shadow-sm hover:opacity-90 active:scale-95 transition-all flex items-center gap-2"
            >
              <span>Trip Logs & Payouts</span>
              <RiArrowRightUpLine size={14} />
            </button>
          </div>

          {/* KYC Notification Alert if pending */}
          {driverProfile && driverProfile.kycStatus !== "verified" && (
            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 p-4 rounded-2xl flex items-start gap-3 text-xs">
              <RiAlertLine className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" size={18} />
              <div>
                <h4 className="font-bold text-amber-900 dark:text-amber-200">
                  Account Under Administrative KYC Review
                </h4>
                <p className="text-amber-800 dark:text-amber-300 mt-0.5 leading-relaxed">
                  Your driver documents and license ({driverProfile.licence || "Pending"}) are being processed. Once verified, you will be able to switch online and accept Cashfree escrow rides.
                </p>
              </div>
            </div>
          )}

          {/* Top KPI Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <TotalTripsCard rides={rides} />
            <DistanceDrivenCard rides={rides} />
            <DrivingHoursCard />
          </div>

          {/* Center Split: Dispatch Status + Live Map */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Dispatch Status Card */}
            <div className="lg:col-span-1 bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 flex flex-col justify-between shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
                <h3 className="text-sm font-bold text-zinc-950 dark:text-white uppercase tracking-wider">
                  Dispatch Status
                </h3>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  isOnline
                    ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border border-zinc-200 dark:border-zinc-700"
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? "bg-emerald-500 animate-pulse" : "bg-zinc-400"}`} />
                  {isOnline ? "Online" : "Offline"}
                </span>
              </div>

              <div className="flex-1 py-4">
                <CurrentTripCard
                  Msg={Msg}
                  handleSubmit={handleSubmit}
                  setIsMsg={setIsMsg}
                  isOnline={isOnline}
                />
              </div>

              {/* Quick Today's Payout Card at Bottom */}
              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                  <RiWallet3Line size={16} />
                  <span>Today's Net Payout</span>
                </div>
                <span className="text-sm font-extrabold text-zinc-950 dark:text-white font-['Space_Grotesk']">
                  ₹{todayEarnings.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Live GPS Telemetry Map */}
            <div className="lg:col-span-2 h-[440px] bg-white dark:bg-zinc-900 p-1.5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 flex flex-col relative shadow-xs">
              <div className="flex-1 w-full rounded-xl overflow-hidden relative">
                <CurrentLocationMap socketRef={socketRef} />
              </div>
            </div>
          </div>

          {/* Recent Ride Activity Section */}
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-zinc-950 dark:text-white uppercase tracking-wider">
                  Recent Trip Activity
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Latest completed and dispatched passenger rides.
                </p>
              </div>
              <button
                onClick={() => navigate("/trips")}
                className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white underline underline-offset-4"
              >
                Full History →
              </button>
            </div>

            <Trips />
          </div>
        </main>
      </div>
    </div>
  );
}

export default DashBoard;
