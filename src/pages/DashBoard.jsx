import { useEffect, useState } from "react";
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
import DashMenu from "../components/DashMenu";

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
    <div className="w-full h-screen flex bg-gray-50 text-black font-sans overflow-hidden">

      {/* Sidebar */}
      <div className="hidden md:block w-20 lg:w-64 h-full flex-shrink-0">
        <DashMenu />
      </div>

      {/* Ride Request Modal Overlay */}
      {Msg && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/60 backdrop-blur-md transition-all duration-300 animate-in fade-in">
          {/* Popup Card */}
          <div className="bg-white w-[90%] max-w-md p-0 rounded-3xl shadow-2xl animate-pop overflow-hidden relative">
            <div className="h-2 bg-black w-full absolute top-0 left-0"></div>

            <div className="p-8 pb-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-14 w-14 rounded-2xl bg-black flex items-center justify-center text-white shadow-lg shadow-gray-300">
                  <span className="text-2xl">🚖</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 tracking-tight">New Request</h1>
                  <p className="text-gray-500 text-sm font-medium">Earnings: $15.50 (Est.)</p>
                </div>
                <div className="ml-auto flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold">
                  <span>2.4 km away</span>
                </div>
              </div>

              <div className="relative pl-8 space-y-8 before:absolute before:left-[11px] before:top-3 before:bottom-3 before:w-[2px] before:bg-gray-200">
                <div className="relative">
                  <div className="absolute -left-[29px] top-1 h-5 w-5 rounded-full bg-white border-[5px] border-black box-border z-10"></div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Pickup From</p>
                  <p className="font-semibold text-lg text-gray-900 leading-snug">{Msg.pickup}</p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[29px] top-1 h-5 w-5 rounded-full bg-black z-10 shadow-sm border border-white"></div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Dropoff To</p>
                  <p className="font-semibold text-lg text-gray-900 leading-snug">{Msg.dropoff}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 flex gap-4 border-t border-gray-100">
              <button
                onClick={() => setIsMsg(null)}
                className="flex-1 py-3.5 bg-white text-gray-700 border border-gray-300 rounded-xl font-bold hover:bg-gray-50 transition-colors active:scale-95"
              >
                Decline
              </button>
              <button
                onClick={handleSubmit}
                className="flex-[2] py-3.5 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-colors shadow-lg active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Accept Ride</span>
                <BsArrowUpRightCircle size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 h-full overflow-y-auto w-full relative">
        {/* Mobile Header (replaces Navbar on mobile if using sidebar) */}
        <div className="md:hidden h-16 bg-white border-b border-gray-100 flex items-center px-4 justify-between sticky top-0 z-30">
          <h1 className="text-xl font-bold">Voyago Driver</h1>
          <div className="h-8 w-8 bg-black rounded-full text-white flex items-center justify-center font-bold">V</div>
        </div>

        <div className="p-4 md:p-8 lg:p-10 max-w-7xl mx-auto w-full grid gap-8 pb-20">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
              <p className="text-gray-500 mt-1">Welcome back, get ready for your trips.</p>
            </div>

            <button className="bg-black text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-gray-300 hover:bg-gray-800 transition-all flex items-center gap-2" onClick={() => navigate('/trips')}>
              <span>View All Trips</span>
              <BsArrowUpRightCircle />
            </button>
          </div>

          {/* Stats Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="transform transition-all hover:-translate-y-1 hover:shadow-lg duration-300">
              <TotalTripsCard rides={rides} />
            </div>
            <div className="transform transition-all hover:-translate-y-1 hover:shadow-lg duration-300">
              <DistanceDrivenCard rides={rides} />
            </div>
            <div className="transform transition-all hover:-translate-y-1 hover:shadow-lg duration-300">
              <DrivingHoursCard />
            </div>
          </div>

          {/* Current Trip & Map Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Status Panel */}
            <div className="lg:col-span-1 flex flex-col gap-6">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 h-full">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Current Status</h3>
                  <span className="flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-100">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    Online
                  </span>
                </div>
                <CurrentTripCard Msg={Msg} handleSubmit={handleSubmit} setIsMsg={setIsMsg} />
              </div>
            </div>

            {/* Live Map */}
            <div className="lg:col-span-2 h-[450px] bg-white p-1.5 rounded-3xl shadow-sm border border-gray-100 flex flex-col relative group">
              <div className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm text-xs font-bold text-gray-500 pointer-events-none">
                Live Updates
              </div>
              <div className="flex-1 w-full rounded-[20px] overflow-hidden relative">
                <CurrentLocationMap socketRef={socketRef} />
              </div>
            </div>
          </div>

          {/* Recent Trips Section */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
            </div>

            {/* Use a wrapper to constrain Height if needed, or let it scroll */}
            <div className="flex flex-col gap-4">
              <Trips />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashBoard;
