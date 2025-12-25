import React from "react";
import { FaCar, FaUserCog } from "react-icons/fa";
import { LuLayoutDashboard } from "react-icons/lu";
import { BsCalendar2Event } from "react-icons/bs";
import { MdInsertChartOutlined } from "react-icons/md";
import { CgLogOut } from "react-icons/cg";
import useDriverStore from "../Zustand/DriverAuth";
import { useLocation, useNavigate } from "react-router-dom";

function DashMenu() {
  const { logout } = useDriverStore();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", icon: <LuLayoutDashboard size={20} />, path: "/dashboard" },
    { name: "Rides", icon: <FaCar size={20} />, path: "/trips" },
    { name: "Schedule", icon: <BsCalendar2Event size={20} />, path: "/schedule" },
    { name: "Analytics", icon: <MdInsertChartOutlined size={22} />, path: "/analytics" },
    { name: "Profile", icon: <FaUserCog size={20} />, path: "/account", bottom: true },
  ];

  return (
    <div className="h-full w-full bg-white border-r border-gray-100 flex flex-col py-6 px-4 shadow-sm">
      {/* Brand */}
      <div className="flex items-center gap-3 px-2 mb-10">
        <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold text-lg">
          V
        </div>
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-black to-gray-600 hidden md:block">
          Voyago<span className="font-normal text-black text-xs ml-1 bg-gray-100 px-1 rounded-sm">Driver</span>
        </h1>
      </div>

      {/* Navigation */}
      <div className="flex-1 flex flex-col gap-2">
        {menuItems.filter(i => !i.bottom).map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <div
              key={item.name}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 group
                ${isActive
                  ? "bg-black text-white shadow-md shadow-gray-200 scale-105"
                  : "text-gray-500 hover:bg-gray-50 hover:text-black"
                }`}
            >
              <div className={`${isActive ? "text-white" : "group-hover:scale-110 transition-transform"}`}>
                {item.icon}
              </div>
              <span className={`font-medium hidden md:block ${isActive ? "text-white" : ""}`}>
                {item.name}
              </span>
            </div>
          );
        })}
      </div>

      {/* Bottom Actions */}
      <div className="flex flex-col gap-2 pt-6 border-t border-gray-100">
        {menuItems.filter(i => i.bottom).map((item) => (
          <div
            key={item.name}
            onClick={() => navigate(item.path)}
            className={`flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 group
               ${location.pathname === item.path
                ? "bg-black text-white shadow-md shadow-gray-200 scale-105"
                : "text-gray-500 hover:bg-gray-50 hover:text-black"
              }`}
          >
            <div className="group-hover:rotate-90 transition-transform duration-500">
              {item.icon}
            </div>
            <span className="font-medium hidden md:block">{item.name}</span>
          </div>
        ))}

        <div
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer text-red-500 hover:bg-red-50 transition-all duration-200 group mt-1"
        >
          <CgLogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium hidden md:block">Log Out</span>
        </div>
      </div>
    </div>
  );
}

export default DashMenu;
