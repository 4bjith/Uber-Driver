import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  FiSun,
  FiMoon,
  FiUser,
  FiLogOut,
  FiCheckCircle,
  FiAlertCircle,
  FiShield,
  FiActivity,
  FiMapPin,
  FiMenu,
  FiX,
  FiClock,
} from "react-icons/fi";
import { FaCarSide } from "react-icons/fa";
import api from "../api/axiosClient";
import useDriverStore from "../Zustand/DriverAuth";
import { useTheme } from "../context/ThemeContext";

export default function Navbar() {
  const token = useDriverStore((state) => state.token);
  const logout = useDriverStore((state) => state.logout);
  const setDriver = useDriverStore((state) => state.setDriver);
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const { data: driverData, refetch } = useQuery({
    queryKey: ["driverProfileNav", token],
    queryFn: async () => {
      if (!token) return null;
      const res = await api.get("/driver", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data?.driver;
    },
    enabled: !!token,
  });

  useEffect(() => {
    if (driverData) {
      setDriver(driverData);
    }
  }, [driverData, setDriver]);

  const isOnline = driverData?.status === "online";
  const isKycVerified = driverData?.kycStatus === "verified";

  const handleToggleOnline = async () => {
    if (!token) {
      toast.info("Please sign in as a driver.");
      return;
    }

    if (!isOnline && !isKycVerified) {
      toast.warn("KYC verification is pending approval before going online.");
      return;
    }

    setIsUpdatingStatus(true);
    const newStatus = isOnline ? "offline" : "online";

    try {
      await api.put(
        "/currentlocation",
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`You are now ${newStatus.toUpperCase()}`);
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update driver status");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const navLinks = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Trips", path: "/trips" },
    { name: "Profile", path: "/account" },
  ];

  return (
    <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <nav className="relative z-50 glass-card dark:glass-card rounded-full px-4 sm:px-6 py-3 flex items-center justify-between shadow-lg shadow-black/5 dark:shadow-black/40 transition-all duration-300">
        
        {/* Brand */}
        <Link to="/dashboard" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-black text-white dark:bg-white dark:text-black flex items-center justify-center font-black text-lg tracking-tighter shadow-sm transition-transform duration-300 group-hover:scale-105">
            V
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base tracking-tight font-display text-black dark:text-white leading-none">
              VOYAGO
            </span>
            <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider font-display">
              Driver Wing
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-1 bg-neutral-100 dark:bg-zinc-900 p-1 rounded-full border border-neutral-200 dark:border-zinc-800 text-xs font-semibold">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`px-4 py-1.5 rounded-full transition-all duration-200 ${
                  isActive
                    ? "bg-black text-white dark:bg-white dark:text-black shadow-sm"
                    : "text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Right Section: Status Switch, Dark Mode, Profile */}
        <div className="flex items-center gap-2.5">
          
          {/* Live Online / Offline Toggle */}
          {token && (
            <button
              onClick={handleToggleOnline}
              disabled={isUpdatingStatus}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider transition-all border ${
                isOnline
                  ? "bg-black text-white dark:bg-white dark:text-black border-black dark:border-white shadow-sm"
                  : "bg-neutral-100 dark:bg-zinc-900 text-neutral-500 dark:text-neutral-400 border-neutral-200 dark:border-zinc-800"
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  isOnline ? "bg-emerald-400 animate-ping" : "bg-neutral-400"
                }`}
              />
              <span>{isOnline ? "Online" : "Offline"}</span>
            </button>
          )}

          {/* KYC Status Pill */}
          {token && (
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-neutral-100 dark:bg-zinc-900 text-black dark:text-white border border-neutral-200 dark:border-zinc-800">
              <FiShield className={isKycVerified ? "text-black dark:text-white" : "text-amber-500"} />
              <span>{isKycVerified ? "KYC Verified" : "KYC Pending"}</span>
            </div>
          )}

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="w-9 h-9 rounded-full bg-neutral-100 dark:bg-zinc-900 text-neutral-800 dark:text-neutral-200 flex items-center justify-center hover:bg-neutral-200 dark:hover:bg-zinc-800 transition-colors border border-neutral-200 dark:border-zinc-800"
          >
            {isDark ? <FiSun className="text-base" /> : <FiMoon className="text-base" />}
          </button>

          {/* Profile Dropdown */}
          {token ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-neutral-100 dark:bg-zinc-900 hover:bg-neutral-200 dark:hover:bg-zinc-800 border border-neutral-200 dark:border-zinc-800 transition-all text-xs font-bold text-black dark:text-white"
              >
                <div className="w-7 h-7 rounded-full bg-black text-white dark:bg-white dark:text-black flex items-center justify-center text-xs font-bold uppercase overflow-hidden">
                  {driverData?.profileImg ? (
                    <img
                      src={
                        driverData.profileImg.startsWith("http")
                          ? driverData.profileImg
                          : `http://localhost:8080${driverData.profileImg}`
                      }
                      alt="Driver avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    driverData?.name?.charAt(0) || "D"
                  )}
                </div>
                <span className="hidden sm:inline-block max-w-[90px] truncate">
                  {driverData?.name?.split(" ")[0] || "Driver"}
                </span>
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-800 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in">
                  <div className="px-4 py-2.5 border-b border-neutral-100 dark:border-zinc-900">
                    <p className="text-xs font-bold text-black dark:text-white truncate">
                      {driverData?.name || "Driver Account"}
                    </p>
                    <p className="text-[11px] text-neutral-500 truncate">
                      {driverData?.email}
                    </p>
                    <span className="mt-1.5 inline-block text-[10px] font-black uppercase px-2 py-0.5 rounded bg-neutral-100 dark:bg-zinc-900 text-neutral-600 dark:text-neutral-400">
                      Tier: {driverData?.vehicleType || "Sedan"}
                    </span>
                  </div>

                  <Link
                    to="/dashboard"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-zinc-900 transition-colors"
                  >
                    <FiActivity />
                    <span>Driver Dashboard</span>
                  </Link>
                  <Link
                    to="/trips"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-zinc-900 transition-colors"
                  >
                    <FaCarSide />
                    <span>Trip History</span>
                  </Link>
                  <Link
                    to="/account"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-zinc-900 transition-colors"
                  >
                    <FiUser />
                    <span>Vehicle & Profile</span>
                  </Link>

                  <div className="border-t border-neutral-100 dark:border-zinc-900 my-1"></div>

                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setDropdownOpen(false);
                      toast.success("Signed out successfully");
                      navigate("/login");
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors text-left"
                  >
                    <FiLogOut />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="px-4 py-1.5 rounded-full bg-black text-white dark:bg-white dark:text-black text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
            >
              Sign In
            </Link>
          )}

          {/* Mobile Hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-9 h-9 rounded-full bg-neutral-100 dark:bg-zinc-900 text-black dark:text-white flex items-center justify-center border border-neutral-200 dark:border-zinc-800"
          >
            {mobileMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 p-4 glass-card dark:glass-card rounded-3xl space-y-2 text-xs font-bold border border-neutral-200 dark:border-zinc-800 animate-in fade-in">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-zinc-900 text-black dark:text-white"
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
