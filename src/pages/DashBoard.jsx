import React, { useEffect } from "react";
import DashMenu from "../components/DashMenu";
import TotalTripsCard from "../components/TotTrip";
import DistanceDrivenCard from "../components/Distance";
import DrivingHoursCard from "../components/DriveHours";
import CurrentTripCard from "../components/CurrentTrip";
import { BsArrowUpRightCircle } from "react-icons/bs";
import Trips from "../components/Trips";
import CurrentLocationMap from "../components/CurrentLocationMap";
import { useMutation } from "@tanstack/react-query";
import api from "../api/axiosClint";
import useDriverStore from "../Zustand/DriverAuth";

function DashBoard() {
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

  const token = useDriverStore((state) => state.token);

  // api function to update location
  const LocationMutation = useMutation({
    mutationFn: async (formData) => {
      return await api.put("/currentlocation", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    onSuccess: () => {
      console.log("Location updated sucessfully");
    },
    onError: (error) => {
      console.error("Error updating location:", error.message);
    },
  });

  // function to get current location
  const updateLocation = () => {
    if (!navigator.geolocation) {
      console.warn("Geolocation is not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          type: "Point",
          coordinates: [position.coords.longitude, position.coords.latitude],
        };

        LocationMutation.mutate({ location });
      },
      (error) => {
        console.error("Failed to get location: ", error);
      }
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      updateLocation();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full min-h-screen bg-gray-100 p-5 grid grid-cols-[15%_1fr]">
      {/* Sidebar */}
      <div className="sticky top-0 h-screen">
        <DashMenu />
      </div>

      {/* Main Content */}
      <div className="w-full px-5 grid gap-5">
        {/* Stats Cards in Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <TotalTripsCard />
          <DistanceDrivenCard />
          <DrivingHoursCard />
        </div>

        {/* Current Trip and Map Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <CurrentTripCard />
          <div className="h-[400px] bg-white p-4 rounded-2xl relative">
            <div className="w-full h-full bg-blue-300 rounded-2xl">
              <CurrentLocationMap />
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
