import React from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { FaCar } from "react-icons/fa";
import { LuLayoutDashboard } from "react-icons/lu";
import { BsCalendar2Event } from "react-icons/bs";
import { MdInsertChartOutlined } from "react-icons/md";
import { FaUserCog } from "react-icons/fa";
import { CgLogOut } from "react-icons/cg";
import useDriverStore from "../Zustand/DriverAuth";
import { useNavigate } from "react-router-dom";
function DashMenu() {
  const { logout } = useDriverStore();
  const Navigate = useNavigate()
  return (
    <div className="w-[100%] h-[100%] py-[20px] px-[20px] md:px-[30px] rounded-lg shadow-xl flex items-center md:items-start flex-col gap-[30px] relative bg-white">
      <div className="">
        <h1 className="text-[1.1rem] font-bold text-blue-800 hidden md:block">
          UberDriver
        </h1>
      </div>
      <div className="w-auto flex gap-[20px] items-center cursor-pointer ">
        <RxHamburgerMenu />
        <h2 className="text-[1rem] font-semibold hidden md:block">Menu</h2>
      </div>
      <div className="w-auto flex gap-[20px] items-center cursor-pointer ">
        <LuLayoutDashboard />
        <h2 className="text-[1rem] font-semibold hidden md:block">Dashboard</h2>
      </div>
      <div className="w-auto flex gap-[20px]  items-center cursor-pointer">
        <FaCar />
        <h2 className="text-[1rem] font-semibold hidden md:block">Rides</h2>
      </div>
      <div className="w-auto flex gap-[20px] items-center cursor-pointer">
        <BsCalendar2Event />
        <h2 className="text-[1rem] font-semibold hidden md:block">Shedule</h2>
      </div>
      <div className="w-auto flex gap-[20px] items-center cursor-pointer">
        <MdInsertChartOutlined />
        <h2 className="text-[1rem] font-semibold hidden md:block ">
          Analytics
        </h2>
      </div>
      <div 
        onClick={()=>{
          Navigate("/account")
        }}
      className="w-auto flex gap-[20px] items-center cursor-pointer absolute bottom-[55px]">
        <FaUserCog />
        <h2 className="text-[1rem] font-semibold hidden md:block">Profile</h2>
      </div>
      <div
        onClick={() => {logout()
          Navigate("/login")
        }}
        className="w-auto flex gap-[20px] items-center cursor-pointer absolute bottom-5"
      >
        <CgLogOut />
        <h2 className="text-[1rem] font-semibold hidden md:block">Log Out</h2>
      </div>
    </div>
  );
}

export default DashMenu;
