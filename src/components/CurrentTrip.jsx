import React from "react";
import { FiArrowUpRight } from "react-icons/fi";
import { FaClock } from "react-icons/fa";
import { PiMapPinFill } from "react-icons/pi";

const CurrentTripCard = () => {
  return (
    <div className="w-full h-[400px]  mx-auto bg-white rounded-xl shadow-md p-4 text-gray-800">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-lg font-semibold">Current trip</h2>
        <FiArrowUpRight className="text-gray-400 mt-1" />
      </div>

      {/* Trip timeline */}
      <div className="pl-4 border-l-2 border-blue-500 space-y-5 mb-5">
        {/* Departure */}
        <div className="relative">
          <div className="absolute -left-4 top-0 w-3 h-3 bg-blue-500 rounded-full"></div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Departure</span>
            <span className="text-sm text-gray-500">12:45 AM</span>
          </div>
          <p className="text-base font-medium">Poznan, Bus Station</p>
        </div>

        {/* Stop */}
        <div className="relative">
          <div className="absolute -left-4 top-1 text-black">
            <PiMapPinFill className="text-black text-lg" />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Stop</span>
            <span className="text-sm text-gray-500">4:05 AM</span>
          </div>
          <p className="text-base font-medium">Berlin Airport BER, T 1/2</p>
        </div>

        {/* Arrival */}
        <div className="relative">
          <div className="absolute -left-4 top-1 text-black">
            <PiMapPinFill className="text-black text-lg" />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Arrival</span>
            <span className="text-sm text-gray-500">4:30 AM</span>
          </div>
          <p className="text-base font-medium">Berlin Südkreuz</p>
        </div>
      </div>

      {/* Duration */}
      <div className="flex items-center justify-center bg-blue-50 text-blue-700 text-sm font-medium py-2 rounded-md">
        <FaClock className="mr-2" />
        Duration: 3 hours 45 min
      </div>
    </div>
  );
};

export default CurrentTripCard;
