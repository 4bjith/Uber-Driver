import { useEffect, useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import api from "../api/axiosClint";
import useDriverStore from "../Zustand/DriverAuth";
import moment from 'moment'

// Sub-component for individual trip item
const TripItem = ({ start, end, duration, requestedAt, status, earnings, compltedAt }) => {
  const [currentStatus, setCurrentStatus] = useState(status || "Running");

  const handleStatusChange = (e) => {
    setCurrentStatus(e.target.value);
  };

  const getStatusColor = () => {
    switch (currentStatus) {
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
      <p className="w-[14%] truncate capitalize text-[0.8rem] sm:text-sm lg:text-base xl:text-lg">
        {start}
      </p>
      <div className="w-[14%] flex items-center justify-center gap-1 text-[0.7rem] sm:text-sm lg:text-base">
        <p>--</p>
        <p className="px-2 py-0.5 flex justify-center rounded-full bg-blue-200 text-blue-700">
          {duration ? `${duration} Km` : "N/A"}
        </p>
        <p>--</p>
      </div>
      <p className="w-[14%] truncate capitalize text-[0.8rem] sm:text-sm lg:text-base xl:text-lg">
        {end}
      </p>
      <span className="w-[14%] truncate text-gray-400 text-[0.7rem] sm:text-sm lg:text-base">
        {requestedAt}
      </span>

      <span className="w-[10%] truncate text-green-500 text-[0.7rem] sm:text-sm lg:text-base">
       Rs. {earnings.toFixed(2) || ""}
      </span>
      <span className="w-[14%] truncate text-gray-400 text-[0.7rem] sm:text-sm lg:text-base">
        {compltedAt}
      </span>
      <div className="w-[10%] text-[0.7rem] sm:text-sm lg:text-base">
        {
          status === "completed" && (<p className="text-green-600 font-bold">{status}</p>)
        }
        {
          status === "Canceled" && (<p className="text-red-600">{status}</p>)
        }
        {
          status === "requested" && (<p className="text-yellow-600">{status}</p>)
        }
        {
          status === "in_progress" && (<p className="text-green-600">{status}</p>)
        }
      </div>
    </div>
  );
};

function Trips() {
  const [rides, setRides] = useState([]);
  const token = useDriverStore((state) => state.token);

  // Helper to decode token and get driver ID (if needed) or just rely on backend filtering
  // Assuming backend filters by driverId passed in query or body.
  // Since we don't have driverId in store explicitly (only token), we might need to decode it or fetch profile first.
  // However, the previous DashBoard code decoded the token to get email.
  // Let's try to get the driver ID from the token if possible, or use the email if the backend supports it.
  // The backend `getAllRides` expects `driverId`.
  // Let's decode the token here to get the ID

  useEffect(() => {
    const fetchRides = async () => {
      if (!token) return
      try {
        const response = await api.get('/allrides?limit=6', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data?.data
        setRides(data)
      } catch (error) {
        console.error("Error fetching rides:", error);
      }
    };

    fetchRides();
  }, [token]);

  if (rides.length === 0) {
    return <div className="p-4 text-center text-gray-500">No recent trips found.</div>;
  }

  return (
    <div className="w-full flex flex-col-reverse gap-3">
      {rides.map((ride, index) => (
        <TripItem
          key={ride._id || index}
          start={ride.pickup || "Unknown"}
          end={ride.dropoff || "Unknown"}
          duration={ride.distance}
          requestedAt={moment(ride.requestedAt).format('MMMM Do YYYY, h:mm:ss a')}
          status={ride.status || "Completed"}
          earnings={ride.earnings}
          compltedAt={moment(ride.compltedAt).format('MMMM Do YYYY, h:mm:ss a')}
        />
      ))}
    </div>
  );
}

export default Trips;
