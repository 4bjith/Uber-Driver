import React, { useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io";

function Trips(props) {
  const [status, setStatus] = useState(props.status || "Running");

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
    // Optional: call a function to update status in parent or backend
    // props.onStatusChange?.(e.target.value);
  };

  // Dynamic background color based on status
  const getStatusColor = () => {
    switch (status) {
      case "Completed":
        return "bg-green-300 text-green-800";
      case "Cancled":
        return "bg-red-300 text-red-800";
      case "Running":
        return "bg-blue-200 text-blue-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  return (
    <div className="w-full h-auto min-h-[3rem] flex flex-wrap items-center justify-between px-2 py-1 border-b border-gray-200">
      {/* Start Location */}
      <p className="w-[14%] truncate capitalize text-[0.8rem] sm:text-sm lg:text-base xl:text-lg">
        {props.start}
      </p>

      {/* Duration */}
      <div className="w-[18%] flex items-center justify-center gap-1 text-[0.7rem] sm:text-sm lg:text-base">
        <p>--</p>
        <p className="px-2 py-0.5 flex justify-center rounded-full bg-blue-200 text-blue-700">
          {props.duration}
        </p>
        <p>--</p>
      </div>

      {/* End Location */}
      <p className="w-[14%] truncate capitalize text-[0.8rem] sm:text-sm lg:text-base xl:text-lg">
        {props.end}
      </p>

      {/* Date */}
      <span className="w-[14%] truncate text-gray-400 text-[0.7rem] sm:text-sm lg:text-base">
        {props.date}
      </span>

      {/* Time */}
      <span className="w-[14%] truncate text-gray-400 text-[0.7rem] sm:text-sm lg:text-base">
        {props.time}
      </span>

      {/* Status Dropdown */}
      <div className="w-[16%]">
        <div className={`w-full rounded-full px-2 py-1 flex items-center justify-between ${getStatusColor()}`}>
          <select
            value={status}
            onChange={handleStatusChange}
            className={`bg-transparent outline-none w-full text-[0.6rem] sm:text-sm lg:text-base appearance-none cursor-pointer`}
          >
            <option value="Completed">Completed</option>
            <option value="Running">Running</option>
            <option value="Cancled">Cancled</option>
          </select>
          <IoMdArrowDropdown className="ml-1 text-[1rem]" />
        </div>
      </div>
    </div>
  );
}

export default Trips;
