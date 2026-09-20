import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import useDriverStore from "../Zustand/DriverAuth";
import api from "../api/axiosClient";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { RiCarLine, RiIdCardLine, RiArrowLeftLine, RiCheckLine, RiCloseLine } from "react-icons/ri";

function EditVehicleInfo() {
  const navigate = useNavigate();
  const [vehicleName, setVehicleName] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [licence, setLicence] = useState("");
  const token = useDriverStore((state) => state.token);
  const setDriver = useDriverStore((state) => state.setDriver);

  const { data } = useQuery({
    queryKey: ["driver", token],
    queryFn: async () => {
      const response = await api.get("/driver", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
    enabled: !!token,
  });

  const driverData = data?.driver || data;

  useEffect(() => {
    if (driverData) {
      if (!vehicleName) setVehicleName(driverData.vehicleName || "");
      if (!vehicleNumber) setVehicleNumber(driverData.vehicle || "");
      if (!licence) setLicence(driverData.licence || "");
    }
  }, [driverData]);

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
    onSuccess: (res) => {
      toast.success("Vehicle details updated successfully");
      if (res?.driver) setDriver(res.driver);
      navigate("/account");
    },
    onError: (error) => {
      console.error("Update failed:", error);
      toast.error(error.response?.data?.message || "Vehicle update failed, please try again");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!vehicleName || !vehicleNumber || !licence) {
      toast.warn("Please complete all vehicle fields");
      return;
    }
    updateDriverMutation.mutate({
      vehicleName,
      vehicle: vehicleNumber,
      licence,
    });
  };

  return (
    <div className="w-full min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans transition-colors duration-300">
      <Navbar />

      <main className="flex-1 w-full max-w-xl mx-auto p-4 sm:p-6 lg:p-8 flex flex-col justify-center">
        <button
          onClick={() => navigate("/account")}
          className="self-start mb-6 px-3.5 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white flex items-center gap-1.5 transition-all shadow-xs"
        >
          <RiArrowLeftLine size={16} />
          <span>Back to Account</span>
        </button>

        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-zinc-200/80 dark:border-zinc-800 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-zinc-100 dark:border-zinc-800">
            <div className="p-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-2xl text-zinc-950 dark:text-white">
              <RiCarLine size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-950 dark:text-white font-['Space_Grotesk']">
                Edit Vehicle Details
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Update model, registration plate number, and commercial license.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">
                Vehicle Model & Make
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={vehicleName}
                  onChange={(e) => setVehicleName(e.target.value)}
                  placeholder="e.g. Toyota Camry (White)"
                  className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-white transition-all pr-10"
                />
                {vehicleName && (
                  <button
                    type="button"
                    onClick={() => setVehicleName("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                  >
                    <RiCloseLine size={18} />
                  </button>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">
                License Plate / Registration No.
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value)}
                  placeholder="e.g. MH 02 AB 1234"
                  className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm font-mono uppercase text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-white transition-all pr-10"
                />
                {vehicleNumber && (
                  <button
                    type="button"
                    onClick={() => setVehicleNumber("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                  >
                    <RiCloseLine size={18} />
                  </button>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">
                Driver License Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={licence}
                  onChange={(e) => setLicence(e.target.value)}
                  placeholder="e.g. DL-1234567890"
                  className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm font-mono uppercase text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-white transition-all pr-10"
                />
                {licence && (
                  <button
                    type="button"
                    onClick={() => setLicence("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                  >
                    <RiCloseLine size={18} />
                  </button>
                )}
              </div>
            </div>

            <div className="pt-4 flex gap-3">
              <button
                type="button"
                onClick={() => navigate("/account")}
                className="flex-1 py-3 px-4 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-xl font-bold text-xs hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={updateDriverMutation.isPending}
                className="flex-[2] py-3 px-4 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 rounded-xl font-bold text-xs shadow-md hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {updateDriverMutation.isPending ? (
                  <span>Saving...</span>
                ) : (
                  <>
                    <RiCheckLine size={16} />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default EditVehicleInfo;
