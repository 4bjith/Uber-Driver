import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useDriverStore from "../Zustand/DriverAuth";
import api from "../api/axiosClient";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { 
  RiEditLine, 
  RiShieldCheckLine, 
  RiCarLine, 
  RiUserLine, 
  RiCameraLine, 
  RiBankCardLine,
  RiAlertLine,
  RiMailLine,
  RiPhoneLine,
  RiIdCardLine,
  RiSteeringLine
} from "react-icons/ri";

function AccountManager() {
  const token = useDriverStore((state) => state.token);
  const setDriver = useDriverStore((state) => state.setDriver);
  const navigate = useNavigate();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["driver", token],
    queryFn: async () => {
      const response = await api.get("/driver", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
    retry: false,
    enabled: !!token,
  });

  const driverInfo = data?.driver || data;

  useEffect(() => {
    if (driverInfo) {
      setDriver(driverInfo);
    }
  }, [driverInfo, setDriver]);

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-3 border-zinc-300 dark:border-zinc-700 border-t-zinc-950 dark:border-t-white rounded-full animate-spin mb-3" />
        <p className="text-xs font-semibold text-zinc-500">Loading driver credentials...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-4">
        <div className="p-6 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-2xl max-w-md text-center">
          <RiAlertLine className="text-red-500 text-3xl mx-auto mb-2" />
          <h3 className="text-base font-bold text-red-900 dark:text-red-200">Unable to load profile</h3>
          <p className="text-xs text-red-700 dark:text-red-400 mt-1">{error?.message || "Session expired."}</p>
          <button
            onClick={() => navigate("/login")}
            className="mt-4 px-4 py-2 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 rounded-xl text-xs font-bold"
          >
            Go to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans transition-colors duration-300">
      <Navbar />

      <main className="flex-1 w-full max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Header Title */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-white font-['Space_Grotesk']">
              Driver Account & Settings
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Manage personal identity, vehicle specifications, and Cashfree settlement account.
            </p>
          </div>
        </div>

        {/* Profile Card Header */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-zinc-200/80 dark:border-zinc-800 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar with Update Trigger */}
          <div className="relative group shrink-0">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-zinc-100 dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 overflow-hidden flex items-center justify-center text-zinc-950 dark:text-white font-extrabold text-3xl shadow-sm">
              {driverInfo?.profileImg ? (
                <img
                  src={
                    driverInfo.profileImg.startsWith("http")
                      ? driverInfo.profileImg
                      : `http://localhost:8080${driverInfo.profileImg}`
                  }
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                driverInfo?.name?.charAt(0) || "D"
              )}
            </div>

            <button
              onClick={() => navigate("/update/profileImage")}
              title="Change Profile Photo"
              className="absolute -bottom-2 -right-2 p-2.5 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 rounded-2xl shadow-lg hover:scale-110 active:scale-95 transition-all"
            >
              <RiCameraLine size={16} />
            </button>
          </div>

          {/* Profile Overview */}
          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2.5">
              <h2 className="text-xl font-bold text-zinc-950 dark:text-white font-['Space_Grotesk']">
                {driverInfo?.name || "Driver Partner"}
              </h2>

              {driverInfo?.kycStatus === "verified" ? (
                <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60 w-fit mx-auto sm:mx-0">
                  <RiShieldCheckLine size={13} />
                  KYC Verified
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/60 w-fit mx-auto sm:mx-0 animate-pulse">
                  <RiAlertLine size={13} />
                  Pending KYC Review
                </span>
              )}
            </div>

            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Voyago Certified Partner • Active Driver License #{driverInfo?.licence || "N/A"}
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2 text-xs text-zinc-600 dark:text-zinc-400">
              <span className="flex items-center gap-1.5">
                <RiMailLine className="text-zinc-400" />
                {driverInfo?.email}
              </span>
              <span className="flex items-center gap-1.5">
                <RiPhoneLine className="text-zinc-400" />
                +91 {driverInfo?.mobile || "Not specified"}
              </span>
            </div>
          </div>
        </div>

        {/* Split Cards: Personal Info & Vehicle Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200/80 dark:border-zinc-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800 mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-zinc-950 dark:text-white">
                    <RiUserLine size={18} />
                  </div>
                  <h3 className="text-sm font-bold text-zinc-950 dark:text-white uppercase tracking-wider">
                    Personal Details
                  </h3>
                </div>

                <button
                  onClick={() => navigate("/update/personalinfo")}
                  className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <RiEditLine size={13} />
                  <span>Edit</span>
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-zinc-400 block mb-0.5">Full Legal Name</span>
                  <p className="font-semibold text-zinc-900 dark:text-white text-sm">{driverInfo?.name || "N/A"}</p>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-zinc-400 block mb-0.5">Email Address</span>
                  <p className="font-semibold text-zinc-900 dark:text-white">{driverInfo?.email || "N/A"}</p>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-zinc-400 block mb-0.5">Mobile Phone</span>
                  <p className="font-semibold text-zinc-900 dark:text-white">+91 {driverInfo?.mobile || "N/A"}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 text-[11px] text-zinc-400">
              Identity verified for driver background check.
            </div>
          </div>

          {/* Vehicle Information */}
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200/80 dark:border-zinc-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800 mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-zinc-950 dark:text-white">
                    <RiCarLine size={18} />
                  </div>
                  <h3 className="text-sm font-bold text-zinc-950 dark:text-white uppercase tracking-wider">
                    Vehicle Specifications
                  </h3>
                </div>

                <button
                  onClick={() => navigate("/update/vehicleinfo")}
                  className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <RiEditLine size={13} />
                  <span>Edit</span>
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-zinc-400 block mb-0.5">Vehicle Model</span>
                  <p className="font-semibold text-zinc-900 dark:text-white text-sm">
                    {driverInfo?.vehicleName || "Sedan (Voyago Go)"}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-zinc-400 block mb-0.5">License Plate Registration</span>
                  <p className="font-mono font-bold text-zinc-900 dark:text-white text-sm">
                    {driverInfo?.vehicle || "N/A"}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-zinc-400 block mb-0.5">Driving License Number</span>
                  <p className="font-mono font-bold text-zinc-900 dark:text-white">
                    {driverInfo?.licence || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 text-[11px] text-zinc-400">
              Commercial transport registration active.
            </div>
          </div>
        </div>

        {/* Cashfree Payout & Banking Clearance Card */}
        <div className="bg-zinc-900 text-white dark:bg-zinc-900 dark:border dark:border-zinc-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-md">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-emerald-400">
              <RiBankCardLine size={20} />
              <span className="text-xs font-bold uppercase tracking-wider">Cashfree Escrow Payout Gateway</span>
            </div>
            <h3 className="text-lg font-bold font-['Space_Grotesk']">
              Direct Driver Settlement (80% Authoritative Net)
            </h3>
            <p className="text-xs text-zinc-400 max-w-xl">
              Fares paid by passengers via Cashfree Hosted Checkout are locked in sandbox escrow and automatically routed to your registered driver payout balance on ride completion.
            </p>
          </div>

          <div className="shrink-0 bg-white/10 dark:bg-zinc-800/80 px-4 py-3 rounded-2xl border border-white/10 text-center">
            <span className="text-[10px] font-bold text-zinc-400 block uppercase">Sandbox Settlement</span>
            <span className="text-sm font-extrabold text-emerald-400 font-mono">T+0 Instant</span>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default AccountManager;
