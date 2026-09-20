import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/axiosClient";
import useDriverStore from "../Zustand/DriverAuth";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { RiCameraLine, RiUploadCloudLine, RiArrowLeftLine, RiDeleteBinLine, RiCheckLine } from "react-icons/ri";

export default function ProfileImgUpdateForm() {
  const [image, setImage] = useState(null);
  const token = useDriverStore((state) => state.token);
  const navigate = useNavigate();
  const { driver, setDriver } = useDriverStore();

  const clearImage = () => setImage(null);

  const updateProfileImgMutation = useMutation({
    mutationFn: async (formData) => {
      return await api.put("/driver/update", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onSuccess: (response) => {
      const updatedDriver = response.data.driver;
      if (updatedDriver) {
        setDriver({ ...driver, profileImg: updatedDriver.profileImg });
      }
      toast.success("Profile photo updated successfully!");
      navigate("/account");
    },
    onError: (error) => {
      console.error("Error updating profile image:", error);
      toast.error(error.response?.data?.message || "Failed to update profile photo.");
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setImage(file);
  };

  const handleUpdate = () => {
    if (!image) {
      toast.warn("Please select an image file first.");
      return;
    }

    const formData = new FormData();
    formData.append("profileImg", image);
    updateProfileImgMutation.mutate(formData);
  };

  return (
    <div className="w-full min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans transition-colors duration-300">
      <Navbar />

      <main className="flex-1 w-full max-w-md mx-auto p-4 sm:p-6 lg:p-8 flex flex-col justify-center">
        <button
          onClick={() => navigate("/account")}
          className="self-start mb-6 px-3.5 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white flex items-center gap-1.5 transition-all shadow-xs"
        >
          <RiArrowLeftLine size={16} />
          <span>Back to Account</span>
        </button>

        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-zinc-200/80 dark:border-zinc-800 shadow-sm space-y-6">
          <div className="text-center space-y-1">
            <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-950 dark:text-white mx-auto flex items-center justify-center mb-3">
              <RiCameraLine size={24} />
            </div>
            <h2 className="text-xl font-bold text-zinc-950 dark:text-white font-['Space_Grotesk']">
              Update Profile Picture
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Clear photo of your face for passenger ride verification.
            </p>
          </div>

          {/* Upload Dropzone */}
          <div className="relative border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-zinc-500 dark:hover:border-zinc-500 rounded-2xl p-6 text-center transition-all bg-zinc-50/50 dark:bg-zinc-950/50">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <RiUploadCloudLine size={32} className="mx-auto text-zinc-400 mb-2" />
            <p className="text-xs font-bold text-zinc-900 dark:text-white">
              {image ? image.name : "Click or drag photo here to upload"}
            </p>
            <p className="text-[11px] text-zinc-400 mt-1">PNG, JPG, WEBP up to 5MB</p>
          </div>

          {/* Image Preview */}
          {image && (
            <div className="flex flex-col items-center gap-3 p-4 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-200/80 dark:border-zinc-800">
              <img
                src={URL.createObjectURL(image)}
                alt="Preview"
                className="w-28 h-28 object-cover rounded-2xl border-2 border-zinc-200 dark:border-zinc-700 shadow-sm"
              />
              <button
                type="button"
                onClick={clearImage}
                className="text-xs font-semibold text-red-500 hover:text-red-700 flex items-center gap-1"
              >
                <RiDeleteBinLine size={14} />
                <span>Remove Selection</span>
              </button>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate("/account")}
              className="flex-1 py-3 px-4 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-xl font-bold text-xs hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleUpdate}
              disabled={!image || updateProfileImgMutation.isPending}
              className="flex-[2] py-3 px-4 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 rounded-xl font-bold text-xs shadow-md hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {updateProfileImgMutation.isPending ? (
                <span>Uploading...</span>
              ) : (
                <>
                  <RiCheckLine size={16} />
                  <span>Upload & Save</span>
                </>
              )}
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
