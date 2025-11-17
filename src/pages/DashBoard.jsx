import React, { useEffect, useRef, useState } from "react";
import DashMenu from "../components/DashMenu";
import TotalTripsCard from "../components/TotTrip";
import DistanceDrivenCard from "../components/Distance";
import DrivingHoursCard from "../components/DriveHours";
import CurrentTripCard from "../components/CurrentTrip";
import { BsArrowUpRightCircle } from "react-icons/bs";
import Trips from "../components/Trips";
import CurrentLocationMap from "../components/CurrentLocationMap";
import useDriverStore from "../Zustand/DriverAuth";
import { toast } from "react-toastify";
import api from "../api/axiosClint";

function DashBoard({ socketRef, Msg, setIsMsg }) {
  // const [isMsg, setIsMsg] = useState(false);
  const [email, setEmail] = useState(null);
  const token = useDriverStore((state) => state.token);
  console.log("message :", Msg);
  const data = [
    {
      start: "kannur",
      end: "Thalassery",
      duration: "40 min",
      date: "13/10/2025",
      time: "10:30 AM",
      status: "Completed",
    },
    {
      start: "Thalassery",
      end: "Panoor",
      duration: "30 min",
      date: "13/10/2025",
      time: "11:30 AM",
      status: "Completed",
    },
    {
      start: "kuthuparamba",
      end: "Kannur",
      duration: "45 min",
      date: "13/10/2025",
      time: "01:30 PM",
      status: "Completed",
    },
    {
      start: "Kannur",
      end: "Mahi",
      duration: "01:00 Hr",
      date: "13/10/2025",
      time: "02:00 PM",
      status: "Cancled",
    },
    {
      start: "kannur",
      end: "Thalassery",
      duration: "40 min",
      date: "14/10/2025",
      time: "10:30 AM",
      status: "Running",
    },
  ];
  const decodeJWT = (token) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (err) {
      console.log("Error decoding JWT: ", err);
      return null;
    }
  };

  useEffect(() => {
    if (token) {
      const decoded = decodeJWT(token);
      if (decoded?.email) {
        setEmail(decoded.email);
        // console.log("👨‍✈️ Driver email:", decoded.email);
      } else {
        console.warn("No email found in token");
      }
    } else {
      console.warn("No token found");
    }
  }, [token]);

  // console.log("Email is :",email)

  const handleSubmit = async () => {
  try {
    await api.post("/driver/acceptride", {
      rideId: Msg.rideId,
      driverEmail: email,
    });
    toast.success("Ride accepted");
  } catch (err) {
    console.error("Failed to accept ride", err);
    toast.error("Failed to accept ride");
  }
};


  return (
    <div className="w-full min-h-screen bg-gray-100 p-5 grid grid-cols-[15%_1fr] relative">
      {Msg && (
        <div className="absolute inset-0 z-50 flex justify-center items-center bg-black/40">
          <div className="bg-white w-[400px] max-w-[90%] p-6 rounded-2xl shadow-xl text-center">
            <h1 className="text-xl font-semibold mb-4">Ride Request</h1>
            <p className="text-gray-800">Pickup: {Msg.pickup}</p>
            <p className="text-gray-800">Dropoff: {Msg.dropoff}</p>
            <p className="text-gray-600 mb-4">Ride ID: {Msg.rideId}</p>
            <button
              onClick={handleSubmit}
              className="mt-2 px-5 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all"
            >
              Accept
            </button>
            <button onClick={() => setIsMsg("")} className="mt-2 px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all">
              Reject
            </button>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div className="sticky top-0 h-screen">
        <DashMenu />
      </div>

      {/* Main Content */}
      <div className="w-full px-5 grid gap-5">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <TotalTripsCard />
          <DistanceDrivenCard />
          <DrivingHoursCard />
        </div>

        {/* Current Trip + Map */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <CurrentTripCard />
          <div className="h-[400px] bg-white p-4 rounded-2xl relative">
            <div className="w-full h-full rounded-2xl overflow-hidden">
              <CurrentLocationMap socketRef={socketRef} />
            </div>
            <h2 className="absolute top-2 left-2 bg-white px-2 py-1 rounded-br-2xl text-sm font-semibold">
              Map
            </h2>
          </div>
        </div>

        {/* Schedule Section */}
        <div className="bg-white p-4 rounded-xl h-auto">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-sm font-semibold">Schedule of trips</h2>
            <BsArrowUpRightCircle />
          </div>
          <div className="flex flex-col-reverse gap-3">
            {data.map((item, index) => (
              <Trips
                key={index}
                start={item.start}
                end={item.end}
                duration={item.duration}
                date={item.date}
                time={item.time}
                status={item.status}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashBoard;
