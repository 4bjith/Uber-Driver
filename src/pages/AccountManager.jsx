import React, { useEffect } from "react";
import { CiEdit } from "react-icons/ci";
import useDriverStore from "../Zustand/DriverAuth";
import { useQuery } from "@tanstack/react-query";
import api from "../api/axiosClint";
import { useNavigate } from "react-router-dom";
import { MdChangeCircle } from "react-icons/md";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function AccountManager() {
  const token = useDriverStore((state) => state.token);
  const setDriver = useDriverStore((state) => state.setDriver);
  const Navigate = useNavigate();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["driver"],
    queryFn: async () => {
      const response = await api.get("/driver", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
    retry: false,
    enabled: !!token,
  });

  // Calculate driverInfo dynamically based on data structure
  // Handles cases where data is { status: 'success', driver: {...} } or just the driver object
  const driverInfo = data?.driver || data;

  useEffect(() => {
    if (driverInfo) {
      setDriver(driverInfo);
    }
  }, [driverInfo, setDriver]);

  console.log("Driver data is :", data);
  console.log("Resolved driver info:", driverInfo);

  if (isLoading) return <h1>Loading...</h1>;
  if (isError)
    return (
      <div className="text-center mt-10 text-red-600">
        ❌ Error fetching user data: {error?.message || "Unauthorized"}
      </div>
    );

  return (
    <div className="w-full h-full bg-gray-50 min-h-[90vh] ">
      <Navbar />
      {/* Header */}
      <div className="w-full flex items-center p-5">
        <h1 className="text-green-800 w-1/5 md:w-1/6 font-bold text-[1.1rem]">
          My Profile
        </h1>
        <span className="w-4/5 md:w-5/6 h-[1px] bg-gray-200"></span>
      </div>

      {/* Profile section */}
      <div className="w-full h-auto p-5 bg-white shadow-lg rounded-xl mt-5 flex ">
        {/* Profile image */}
        <div className="w-2/5 md:w-1/5 flex justify-center items-center relative ">
          <div className="w-[150px] h-[150px] rounded-full p-[5px] bg-green-700 overflow-hidden relative">
            {!driverInfo?.profileImg ? (
              <img
                src="https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"
                alt="Profile"
                className="rounded-full w-20 h-20 object-cover"
              />
            ) : (
              <img
                src={
                  driverInfo?.profileImg?.startsWith("http")
                    ? driverInfo?.profileImg
                    : `http://localhost:8080${driverInfo.profileImg}`
                }
                alt="Profile"
                className="align-middle overflow-hidden rounded-full w-full h-full"
              />
            )}
          </div>
          <div
            onClick={() => {
              Navigate("/update/prfileImage");
            }}
            className="absolute bottom-2  right-5 bg-white rounded-full p-1 shadow-md cursor-pointer hover:scale-110 transition-transform"
          >
            <MdChangeCircle className="text-green-700 text-3xl" />
          </div>
        </div>

        {/* Right side content (optional future info) */}
        <div className="flex flex-col justify-center p-5">
          {/* profile details here */}
          <h1 className="text-[1rem] text-green-800 font-semibold ">
            {driverInfo?.name}
          </h1>
          <p className="text-[0.9rem]">Driver</p>
          <p className="text-[0.9rem] text-blue-500">{driverInfo?.email}</p>
        </div>
      </div>

      {/* Personla information */}
      <div className="w-[100%] h-[25vh] p-5 bg-white shadow-lg rounded-xl mt-5 ">
        <div className="w-full h-auto mb-5 flex justify-between">
          <h1 className="text-green-800 font-bold text-[1.1rem]">
            Personal Information
          </h1>
          <button
            onClick={() => {
              Navigate("/update/personalinfo");
            }}
            className="w-[60px] h-auto flex justify-center gap-2 items-center bg-amber-600 text-white rounded-md text-[0.8rem]"
          >
            Edit <CiEdit />
          </button>
        </div>
        {/* blank line */}
        <div className="w-[100%] h-[1px] bg-gray-200 mb-5"></div>
        {/* details */}
        <div className="w-full h-auto flex flex-col gap-3 md:flex-row md:flex-wrap">
          <div className="w-[100%] md:w-[30%] h-auto flex md:flex-col justify-between px-2">
            <h2 className="text-[0.9rem] text-gray-500">Full Name</h2>
            <h2 className="text-[0.9rem] text-gray-950">{driverInfo?.name}</h2>
          </div>
          <div className="w-[100%] md:w-[30%] h-auto flex md:flex-col justify-between px-2">
            <h2 className="text-[0.9rem] text-gray-500">Email Address</h2>
            <h2 className="text-[0.9rem] text-gray-950">
              {driverInfo?.email}
            </h2>
          </div>
          <div className="w-[100%] md:w-[30%] h-auto flex md:flex-col justify-between px-2">
            <h2 className="text-[0.9rem] text-gray-500">Mobile No.</h2>
            <h2 className="text-[0.9rem] text-gray-950">
              +91 {driverInfo?.mobile}
            </h2>
          </div>
        </div>
      </div>
      <div className="w-[100%] h-[25vh] p-5 bg-white shadow-lg rounded-xl mt-5 ">
        <div className="w-full h-auto mb-5 flex justify-between">
          <h1 className="text-green-800 font-bold text-[1.1rem]">
            Vehicle Information
          </h1>
          <button
            onClick={() => {
              Navigate("/update/vehicleinfo");
            }}
            className="w-[60px] h-auto flex justify-center gap-2 items-center bg-amber-600 text-white rounded-md text-[0.8rem]"
          >
            Edit <CiEdit />
          </button>
        </div>
        {/* blank line */}
        <div className="w-[100%] h-[1px] bg-gray-200 mb-5"></div>
        {/* details */}
        <div className="w-full h-auto flex flex-col gap-3 md:flex-row md:flex-wrap">
          <div className="w-[100%] md:w-[30%] h-auto flex md:flex-col justify-between px-2">
            <h2 className="text-[0.9rem] text-gray-500">Vehicle Model</h2>
            <h2 className="text-[0.9rem] text-gray-950">
              {driverInfo?.vehicleName}
            </h2>
          </div>
          <div className="w-[100%] md:w-[30%] h-auto flex md:flex-col justify-between px-2">
            <h2 className="text-[0.9rem] text-gray-500">Vehicle No.</h2>
            <h2 className="text-[0.9rem] text-gray-950">
              {driverInfo?.vehicle}
            </h2>
          </div>
          <div className="w-[100%] md:w-[30%] h-auto flex md:flex-col justify-between px-2">
            <h2 className="text-[0.9rem] text-gray-500">Driving Licence</h2>
            <h2 className="text-[0.9rem] text-gray-950">
              {driverInfo?.licence}
            </h2>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AccountManager;
