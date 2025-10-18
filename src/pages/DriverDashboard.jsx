import React from "react";
import { MdArrowOutward, MdAccessTime, MdLocalTaxi } from "react-icons/md";
import { FaMoneyBillWave } from "react-icons/fa";
import { RxHamburgerMenu } from "react-icons/rx";

// --- Dummy Data ---
const driverStats = [
  {
    title: "Earnings",
    value: "$450.75",
    icon: FaMoneyBillWave,
    color: "text-green-500 bg-green-100",
  },
  {
    title: "Total Rides",
    value: "32",
    icon: MdLocalTaxi,
    color: "text-blue-500 bg-blue-100",
  },
  {
    title: "Total Distance",
    value: "185 mi",
    icon: MdArrowOutward,
    color: "text-purple-500 bg-purple-100",
  },
];

const scheduledTrips = [
  {
    id: 1,
    time: "08:00 AM",
    pickup: "123 Main St",
    destination: "Airport Terminal A",
    status: "Confirmed",
  },
  {
    id: 2,
    time: "11:30 AM",
    pickup: "456 Oak Ave",
    destination: "City Central Mall",
    status: "Pending",
  },
  {
    id: 3,
    time: "03:00 PM",
    pickup: "789 Pine Ln",
    destination: "Client Office Park",
    status: "Confirmed",
  },
];

// --- Reusable Card Component ---
const DashboardStatCard = ({ title, value, icon: Icon, color }) => (
  <div className="relative overflow-hidden bg-white/70 backdrop-blur-md border border-gray-200 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-5">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <h2 className="text-3xl font-bold text-gray-800 mt-2">{value}</h2>
      </div>
      <div className={`p-3 rounded-full ${color}`}>
        <Icon className="text-xl" />
      </div>
    </div>
  </div>
);

// --- Main Dashboard Component ---
export default function DriverDashboard() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-100 via-gray-100 to-purple-100 p-4 md:p-6 flex flex-col md:flex-row gap-5">
      {/* Sidebar */}
      <div className="w-full md:w-[20%] bg-white/60 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200 p-6 flex flex-col">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-xl font-bold text-blue-600">
            DriverNav
          </h1>
        </div>

        <ul className="space-y-3 text-gray-700 font-medium">
          <li className="px-3 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition">
            Dashboard
          </li>
          <li className="px-3 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition">
            Trips
          </li>
          <li className="px-3 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition">
            Profile
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col gap-6">
        {/* --- Statistics Cards --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {driverStats.map((stat, index) => (
            <DashboardStatCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
            />
          ))}
        </div>

        {/* --- Schedule + Map --- */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Schedule Table */}
          <div className="w-full lg:w-[60%] bg-white/70 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-4">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <MdAccessTime className="text-blue-500 mr-2 text-xl" />
                Scheduled Trips
              </h2>
              <button className="text-sm text-blue-600 hover:text-blue-700 flex items-center">
                View All <MdArrowOutward className="ml-1" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-gray-700">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left font-semibold uppercase text-gray-500">
                      Time
                    </th>
                    <th className="px-4 py-3 text-left font-semibold uppercase text-gray-500">
                      Pickup
                    </th>
                    <th className="px-4 py-3 text-left font-semibold uppercase text-gray-500">
                      Destination
                    </th>
                    <th className="px-4 py-3 text-left font-semibold uppercase text-gray-500">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {scheduledTrips.map((trip) => (
                    <tr
                      key={trip.id}
                      className="border-t border-gray-100 hover:bg-gray-50 transition"
                    >
                      <td className="px-4 py-3 font-medium">{trip.time}</td>
                      <td className="px-4 py-3">{trip.pickup}</td>
                      <td className="px-4 py-3">{trip.destination}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            trip.status === "Confirmed"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {trip.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Map / Analytics Placeholder */}
          <div className="w-full lg:w-[40%] bg-white/70 backdrop-blur-md border border-dashed border-gray-300 rounded-2xl shadow-lg flex items-center justify-center p-6">
            <p className="text-gray-500 text-center">
              Map / Analytics Chart <br /> (Coming Soon)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
