import React from "react";
import { 
  RiDashboardLine, 
  RiCarLine, 
  RiCalendarLine, 
  RiBarChartBoxLine, 
  RiUserSettingsLine, 
  RiLogoutBoxRLine,
  RiShieldCheckLine,
  RiTimeLine
} from "react-icons/ri";
import { useLocation, useNavigate } from "react-router-dom";
import useDriverStore from "../Zustand/DriverAuth";
import { useTheme } from "../context/ThemeContext";

function DashMenu() {
  const { logout, driver } = useDriverStore();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: "Command Center", icon: <RiDashboardLine size={20} />, path: "/dashboard" },
    { name: "Trips & Logs", icon: <RiCarLine size={20} />, path: "/trips" },
    { name: "My Schedule", icon: <RiCalendarLine size={20} />, path: "/dashboard" },
    { name: "Earnings Intel", icon: <RiBarChartBoxLine size={20} />, path: "/trips" },
    { name: "Driver Profile", icon: <RiUserSettingsLine size={20} />, path: "/account", bottom: true },
  ];

  return (
    <aside className="h-full w-full bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800/80 flex flex-col py-6 px-4 select-none transition-colors duration-300">
      {/* Brand Header */}
      <div 
        onClick={() => navigate("/dashboard")}
        className="flex items-center gap-3 px-2 mb-8 cursor-pointer group"
      >
        <div className="w-10 h-10 bg-black dark:bg-white rounded-xl flex items-center justify-center text-white dark:text-black font-extrabold text-xl shadow-md transition-transform group-hover:scale-105">
          V
        </div>
        <div className="hidden lg:block">
          <div className="flex items-center gap-1.5">
            <h1 className="text-lg font-extrabold tracking-tight text-zinc-950 dark:text-white font-['Space_Grotesk']">
              VOYAGO
            </h1>
            <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded border border-zinc-300 dark:border-zinc-700">
              Driver
            </span>
          </div>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">
            Partner Portal
          </p>
        </div>
      </div>

      {/* Driver Status Pill */}
      {driver && (
        <div className="hidden lg:flex items-center gap-3 p-3 mb-6 bg-zinc-50 dark:bg-zinc-900/60 rounded-xl border border-zinc-200/70 dark:border-zinc-800/60">
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-zinc-900 dark:text-white font-bold text-sm overflow-hidden">
              {driver.profileImg ? (
                <img 
                  src={driver.profileImg.startsWith("http") ? driver.profileImg : `http://localhost:8080${driver.profileImg}`} 
                  alt={driver.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                driver.name?.charAt(0) || "D"
              )}
            </div>
            <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-zinc-950 ${
              driver.status === "online" ? "bg-emerald-500 animate-pulse" : "bg-zinc-400"
            }`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-zinc-900 dark:text-white truncate">
              {driver.name || "Driver Partner"}
            </p>
            <div className="flex items-center gap-1 text-[11px] text-zinc-500 dark:text-zinc-400">
              <RiShieldCheckLine className="text-emerald-500" size={12} />
              <span className="capitalize">{driver.kycStatus === "verified" ? "KYC Verified" : "Pending KYC"}</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Navigation */}
      <nav className="flex-1 flex flex-col gap-1.5">
        <p className="hidden lg:block text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider px-3 mb-1">
          Menu
        </p>
        {menuItems
          .filter((i) => !i.bottom)
          .map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl cursor-pointer transition-all duration-200 text-left group
                  ${isActive
                    ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-semibold shadow-sm"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900/80 hover:text-zinc-950 dark:hover:text-white"
                  }`}
              >
                <div className={`transition-transform duration-200 ${isActive ? "scale-105" : "group-hover:scale-110"}`}>
                  {item.icon}
                </div>
                <span className="text-sm font-medium hidden lg:block tracking-tight">
                  {item.name}
                </span>
                {isActive && (
                  <span className="hidden lg:block ml-auto w-1.5 h-1.5 rounded-full bg-white dark:bg-zinc-950" />
                )}
              </button>
            );
          })}
      </nav>

      {/* Bottom Profile & Actions */}
      <div className="flex flex-col gap-1.5 pt-4 border-t border-zinc-200 dark:border-zinc-800/80">
        {menuItems
          .filter((i) => i.bottom)
          .map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl cursor-pointer transition-all duration-200 text-left group
                  ${isActive
                    ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-semibold"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900/80 hover:text-zinc-950 dark:hover:text-white"
                  }`}
              >
                <div className="transition-transform group-hover:scale-110">
                  {item.icon}
                </div>
                <span className="text-sm font-medium hidden lg:block tracking-tight">
                  {item.name}
                </span>
              </button>
            );
          })}

        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl cursor-pointer text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all duration-200 group mt-1"
        >
          <RiLogoutBoxRLine size={20} className="group-hover:-translate-x-0.5 transition-transform" />
          <span className="text-sm font-semibold hidden lg:block tracking-tight">Log Out</span>
        </button>
      </div>
    </aside>
  );
}

export default DashMenu;
