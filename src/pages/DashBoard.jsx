import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
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
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

function DashBoard({ socketRef, Msg, setIsMsg }) {
  // const [isMsg, setIsMsg] = useState(false);
  const [email, setEmail] = useState(null);
  const token = useDriverStore((state) => state.token);
  
  const navigate = useNavigate();
  const [rides, setRides] = useState([]);

  const { data } = useQuery({
    queryKey: ["driver", "allrides"],
    queryFn: async () => {
      const response = await api.get("/allrides", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    },
  });

  useEffect(() => {
    if (data) {
      setRides(data?.data);
    }
  }, [data]);
  

  const handleSubmit = async () => {
    localStorage.setItem("rideId", Msg.rideId)
    try {
      await api.post("/driver/acceptride", {
        rideId: Msg.rideId,
        driverEmail: email,
      });
      toast.success("Ride accepted");
      setIsMsg(null);
      navigate(`/currentride?id=${Msg.rideId}`);
    } catch (err) {
      console.error("Failed to accept ride", err);
      toast.error("Failed to accept ride");
    }
  };


  return (
    <div className="w-full h-screen flex flex-col bg-gray-100 relative overflow-hidden">
      {Msg && (
  <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/50 backdrop-blur-sm">

    {/* Popup Card */}
    <div className="bg-white w-[420px] max-w-[90%] p-6 rounded-2xl shadow-2xl animate-pop">

      <h1 className="text-2xl font-bold text-gray-900 mb-4">🚗 New Ride Request</h1>

      <div className="text-left space-y-2 mb-4">
        <div className="p-3 bg-gray-100 rounded-lg">
          <p className="text-gray-500 text-sm">Pickup</p>
          <p className="font-medium text-gray-900">{Msg.pickup}</p>
        </div>

        <div className="p-3 bg-gray-100 rounded-lg">
          <p className="text-gray-500 text-sm">Dropoff</p>
          <p className="font-medium text-gray-900">{Msg.dropoff}</p>
        </div>

        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-500 text-sm">Ride ID</p>
          <p className="text-gray-700">{Msg.rideId}</p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 mt-5">
        <button
          onClick={handleSubmit}
          className="flex-1 py-2.5 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition"
        >
          Accept
        </button>

        <button
          onClick={() => setIsMsg(null)}
          className="flex-1 py-2.5 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition"
        >
          Reject
        </button>
      </div>

    </div>
  </div>
)}


      {/* Top Navbar */}
      <div className="h-[12vh]">
        <Navbar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 h-[88vh] overflow-y-auto flex flex-col w-full">
        <div className="p-5 grid gap-5 flex-1">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <TotalTripsCard rides={rides} />
            <DistanceDrivenCard />
            <DrivingHoursCard />
          </div>

          {/* Current Trip + Map */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <CurrentTripCard Msg={Msg} handleSubmit={handleSubmit} setIsMsg={setIsMsg}/>
            <div className="h-[400px] bg-white p-4 rounded-2xl relative shadow-sm">
              <div className="w-full h-full rounded-2xl overflow-hidden">
                <CurrentLocationMap socketRef={socketRef} />
              </div>
              <h2 className="absolute top-2 left-2 bg-white px-3 py-1 rounded-br-2xl text-sm font-semibold shadow-sm">
                Live Map
              </h2>
            </div>
          </div>

          {/* Schedule Section */}
          <div className="bg-white p-6 rounded-xl shadow-sm h-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Trip Schedule</h2>
              <BsArrowUpRightCircle className="text-xl text-gray-500 cursor-pointer hover:text-black transition-colors" />
            </div>
            <div className="flex flex-col-reverse gap-3">
              <Trips />
            </div>
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}

export default DashBoard;
