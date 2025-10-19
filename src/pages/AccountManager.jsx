import React from "react";
import { CiEdit } from "react-icons/ci";
import useDriverStore from "../Zustand/DriverAuth";
import { useQuery } from "@tanstack/react-query";
import api from "../api/axiosClint";
import { useNavigate } from "react-router-dom";
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
  console.log("Driver data is :", data);
  if (data?.driver) {
    setDriver(data.driver);
  }
  if (isLoading) return <h1>Loading...</h1>;
  if (isError)
    return (
      <div className="text-center mt-10 text-red-600">
        ❌ Error fetching user data: {error?.message || "Unauthorized"}
      </div>
    );

  return (
    <div className="w-full h-full bg-gray-50 min-h-[90vh] p-5">
      {/* Header */}
      <div className="w-full flex items-center">
        <h1 className="text-green-800 w-1/5 md:w-1/6 font-bold text-[1.1rem]">
          My Profile
        </h1>
        <span className="w-4/5 md:w-5/6 h-[1px] bg-gray-200"></span>
      </div>

      {/* Profile section */}
      <div className="w-full h-auto p-5 bg-white shadow-lg rounded-xl mt-5 flex">
        {/* Profile image */}
        <div className="w-2/5 md:w-1/5 flex justify-center items-center">
          <div className="w-[150px] h-[150px] rounded-full p-[5px] bg-green-700 overflow-hidden">
            <img
              src="https://i.pinimg.com/474x/bf/f0/1d/bff01dd0ae186d938f1af8ba127f12bd.jpg"
              alt="Profile"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
        </div>

        {/* Right side content (optional future info) */}
        <div className="flex flex-col justify-center p-5">
          {/* profile details here */}
          <h1 className="text-[1rem] text-green-800 font-semibold ">
            {data.driver?.name}
          </h1>
          <p className="text-[0.9rem]">Driver</p>
          <p className="text-[0.9rem] text-blue-500">{data.driver?.email}</p>
        </div>
      </div>

      {/* Personla information */}
      <div className="w-[100%] h-auto p-5 bg-white shadow-lg rounded-xl mt-5 ">
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
            <h2 className="text-[0.9rem] text-gray-950">{data.driver?.name}</h2>
          </div>
          <div className="w-[100%] md:w-[30%] h-auto flex md:flex-col justify-between px-2">
            <h2 className="text-[0.9rem] text-gray-500">Email Address</h2>
            <h2 className="text-[0.9rem] text-gray-950">
              {data.driver?.email}
            </h2>
          </div>
          <div className="w-[100%] md:w-[30%] h-auto flex md:flex-col justify-between px-2">
            <h2 className="text-[0.9rem] text-gray-500">Mobile No.</h2>
            <h2 className="text-[0.9rem] text-gray-950">
              +91 {data.driver?.mobile}
            </h2>
          </div>
        </div>
      </div>
      <div className="w-[100%] h-auto p-5 bg-white shadow-lg rounded-xl mt-5 ">
        <div className="w-full h-auto mb-5 flex justify-between">
          <h1 className="text-green-800 font-bold text-[1.1rem]">
            Vehicle Information
          </h1>
          <button onClick={()=>{Navigate("/update/vehicleinfo")}} className="w-[60px] h-auto flex justify-center gap-2 items-center bg-amber-600 text-white rounded-md text-[0.8rem]">
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
              {data.driver?.vehicleName}
            </h2>
          </div>
          <div className="w-[100%] md:w-[30%] h-auto flex md:flex-col justify-between px-2">
            <h2 className="text-[0.9rem] text-gray-500">Vehicle No.</h2>
            <h2 className="text-[0.9rem] text-gray-950">
              {data.driver?.vehicle}
            </h2>
          </div>
          <div className="w-[100%] md:w-[30%] h-auto flex md:flex-col justify-between px-2">
            <h2 className="text-[0.9rem] text-gray-500">Driving Licence</h2>
            <h2 className="text-[0.9rem] text-gray-950">
              {data.driver?.licence}
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountManager;
