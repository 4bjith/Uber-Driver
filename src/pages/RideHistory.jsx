import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import useDriverStore from "../Zustand/DriverAuth";
import api from "../api/axiosClint";


export default function RideHistory() {
  const [rides, setRides] = useState([]);
  const token = useDriverStore((state) => state.token);
  

  // Track which row is open
  const [openRow, setOpenRow] = useState(null);

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
      setRides(data?.data || []);
    }
  }, [data]);

  return (
    <div className="w-full min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-6xl mx-auto p-6 mt-4">
        <h1 className="text-2xl font-bold mb-6">Ride History</h1>

        {/* Table Container */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <table className="w-full border-collapse">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="p-3 text-left">Ride ID</th>
                <th className="p-3 text-left">Pickup</th>
                <th className="p-3 text-left">Destination</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-center">View</th>
              </tr>
            </thead>

            <tbody>
              {rides.map((i) => (
                <>
                  {/* Table Row */}
                  <tr
                    key={i._id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="p-3">{i._id}</td>
                    <td className="p-3">{i.pickup}</td>
                    <td className="p-3">{i.dropoff}</td>
                    <td className="p-3 capitalize">{i.status}</td>

                    <td
                      className="p-3 text-center cursor-pointer text-blue-600 font-bold"
                      onClick={() =>
                        setOpenRow(openRow === i._id ? null : i._id)
                      }
                    >
                      {openRow === i._id ? "▲" : "▼"}
                    </td>
                  </tr>

                  {/* Expanded details */}
                  {openRow === i._id && (
                    <tr className="bg-gray-50">
                      <td colSpan={5} className="p-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
                          <p><span className="font-semibold">Passenger:</span> {i.passenger?.name}</p>
                          <p><span className="font-semibold">Distance:</span> {i.distance} km</p>
                          <p><span className="font-semibold">Earnings:</span> ₹{i.earnings.toFixed(2)}</p>
                          <p><span className="font-semibold">Requested At:</span> {i.requestedAt}</p>
                          <p><span className="font-semibold">Completed At:</span> {i.completedAt}</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
          <div className="w-full flex justify-center">

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
