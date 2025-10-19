import React, { useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoClose } from "react-icons/io5";
import { useMutation, useQuery } from "@tanstack/react-query";
import useDriverStore from "../Zustand/DriverAuth";
import api from "../api/axiosClint";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function EditVehicleInfo() {
  const Navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [vehicleName, setVehicleName] = useState("");
  const [VehicleNumber, setVehicleNumber] = useState("");
  const [licence, setLicence] = useState("");
  const token = useDriverStore((state) => state.token);

  const { data, isLoading } = useQuery({
    queryKey: ["driver"],
    queryFn: async () => {
      const response = await api.get("/driver", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
    enabled: !!token,
  });

  const updateDriverMutation = useMutation({
    mutationFn: async ({ vehicleName, vehicle, licence }) => {
      const res = await api.put(
        "/driver/update",
        { vehicleName, vehicle, licence },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success("Updated driver vehicle info");
      Navigate("/account");
    },
    onError: (error) => {
      console.error("Updation failed:", error);
      toast.error("Updation failed, Please try again");
    },
  });

  const handleUpdate = () => {
    updateDriverMutation.mutate({
      vehicleName,
      vehicle: VehicleNumber,
      licence,
    });
  };

  if (isLoading) return <h1>Loading...</h1>;

  return (
    <div className="w-full min-h-screen bg-gray-100 p-5">
      {/* ✅ Navbar */}
      <div className="w-full bg-white rounded-xl shadow-xl">
        <div className="w-full py-3 px-5 flex justify-between items-center">
          <h1 className="text-green-700 font-bold text-[1.1rem]">
            Vehicle info edit form
          </h1>

          <div className="hidden md:flex items-center gap-6">
            <button className="text-gray-500 hover:text-black">
              Dashboard
            </button>
            <button className="text-gray-500 hover:text-black">
              Account Home
            </button>
            <button className="text-gray-500 hover:text-black">Logout</button>
          </div>

          <div className="md:hidden">
            {isOpen ? (
              <IoClose
                onClick={() => setIsOpen(false)}
                className="text-green-800 cursor-pointer text-2xl"
              />
            ) : (
              <RxHamburgerMenu
                onClick={() => setIsOpen(true)}
                className="text-green-800 cursor-pointer text-2xl"
              />
            )}
          </div>
        </div>

        {isOpen && (
          <div className="w-full flex flex-col items-start px-5 pb-4 md:hidden">
            <button className="text-gray-500 hover:text-black py-2 w-full text-left">
              Dashboard
            </button>
            <button className="text-gray-500 hover:text-black py-2 w-full text-left">
              Account Home
            </button>
            <button className="text-gray-500 hover:text-black py-2 w-full text-left">
              Logout
            </button>
          </div>
        )}
      </div>

      {/* ✅ Form Section */}
      <div className="w-full md:w-[70%] lg:w-[40%] mt-5 bg-white rounded-xl shadow-xl px-5 py-4">
        <p className="text-green-900 font-semibold mt-4">
          Fill the corresponding fields to Update
        </p>
        <div className="w-full h-0.5 bg-gray-300 my-4"></div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdate();
          }}
        >
          <p className="text-[0.8rem] text-gray-600 mb-2">Vehicle Name</p>
          <div className="w-full h-[40px] border rounded-md flex">
            <input
              type="text"
              value={vehicleName}
              onChange={(e) => setVehicleName(e.target.value)}
              placeholder={data?.vehicleName || "Loading..."}
              className="w-[85%] h-full px-3 focus:outline-0"
            />
            <div
              onClick={() => setVehicleName("")}
              className="w-[15%] flex justify-center items-center cursor-pointer"
            >
              <IoClose className="text-gray-500" />
            </div>
          </div>

          <p className="text-[0.8rem] text-gray-600 mb-2">Vehicle Number</p>
          <div className="w-full h-[40px] border rounded-md flex">
            <input
              type="text"
              value={VehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value)}
              placeholder={data?.vehicle || "Loading..."}
              className="w-[85%] h-full px-3 focus:outline-0"
            />
            <div
              onClick={() => setVehicleNumber("")}
              className="w-[15%] flex justify-center items-center cursor-pointer"
            >
              <IoClose className="text-gray-500" />
            </div>
          </div>

          <p className="text-[0.8rem] text-gray-600 mb-2 mt-4">
            Driving Licence
          </p>
          <div className="w-full h-[40px] border rounded-md flex">
            <input
              type="text"
              value={licence}
              placeholder={data?.licence || "Loading..."}
              onChange={(e) => setLicence(e.target.value)}
              className="w-[85%] h-full px-3 focus:outline-0"
            />
            <div
              onClick={() => setLicence("")}
              className="w-[15%] flex justify-center items-center cursor-pointer"
            >
              <IoClose className="text-gray-500" />
            </div>
          </div>

          <div className="w-full p-[20px] flex justify-center">
            <button
              type="submit"
              className="px-[30px] py-[10px] bg-green-500 text-white font-bold tracking-wider rounded-2xl hover:scale-110"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditVehicleInfo;
