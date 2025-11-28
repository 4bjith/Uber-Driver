import React from "react";
import { FiArrowUpRight } from "react-icons/fi";
import { FaClock } from "react-icons/fa";
import { PiMapPinFill } from "react-icons/pi";

const CurrentTripCard = ({Msg, handleSubmit, setIsMsg}) => {
  return (
    <div className="w-full h-[400px]  mx-auto bg-white rounded-xl shadow-md p-4 text-gray-800">
     <h1 className="text-[1.1rem] font-bold tracking-wider">Messages</h1>
     <div className="w-full ">
      {
        Msg && (<div className="w-full">
          <h3 className="text-[1rem] italic">You have a new ride request</h3>
           <p className="text-gray-800">Pickup: {Msg.pickup}</p>
            <p className="text-gray-800">Dropoff: {Msg.dropoff}</p>
            <p className="text-gray-600 mb-4">Ride ID: {Msg.rideId}</p>
            <button
              onClick={handleSubmit}
              className="mt-2 px-5 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all"
            >
              Accept
            </button>
            <button onClick={() => setIsMsg(null)} className="mt-2 px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all">
              Reject
            </button>
        </div>)
      }
     </div>
    </div>
  );
};

export default CurrentTripCard;
