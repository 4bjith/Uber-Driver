import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { toast } from "react-toastify";
import api from "../api/axiosClint";
import { useNavigate } from "react-router-dom";
import usedriverStore from "../Zustand/DriverAuth";

export default function Login() {
  const Navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { setToken } = usedriverStore();

  const SignInMutation = useMutation({
    mutationFn: async (FormData) => {
      return await api.post("/driverlogin", FormData);
    },
    onSuccess: (response) => {
      console.log("Login successful:", response.data);
      setToken(response.data.token);
      toast.success("Login successfully");
      Navigate("/dashboard");
    },
    onError: (error) => {
      console.error("Error while Sign in");
      toast.error("Sign in failed");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.warn("Please fill in all fields.");
      return;
    }
    // Step 1️⃣: Set current location
    if (!navigator.geolocation) {
      toast.warn("Geolocation is not supported by your browser,");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          type: "Point",
          coordinates: [position.coords.longitude, position.coords.latitude],
        };
        const formData = {
          email,
          password,
          location,
        };
        SignInMutation.mutate(formData);
      },
      (error) => {
        toast.error("Failed to get location.");
        console.error("Geolocation error:", error);
      }
    );
  };

  return (
    <div className="w-full h-screen bg-gray-300 flex p-5">
      {/* Left Side Panel */}
      <div className="w-full md:w-[60%] h-full p-5 hidden md:flex">
        <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-xl">
          {/* Background Image + Blur */}
          <div
            className="absolute inset-0 bg-cover bg-center blur-sm scale-110"
            style={{
              backgroundImage:
                'url("https://images7.alphacoders.com/106/1062125.jpg")',
            }}
          ></div>

          {/* Semi-transparent overlay for contrast */}
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>

          {/* Foreground Content */}
          <div className="relative z-10 flex flex-col justify-center items-center h-full text-center px-10 py-8">
            <h1 className="text-white text-4xl md:text-5xl font-semibold leading-snug tracking-wide drop-shadow-lg">
              “In the driver’s seat, you are the captain of your own destiny.
              <br />
              Set sail towards your aspirations.”
            </h1>
          </div>
        </div>
      </div>

      {/* Right Side Panel - Login Form */}
      <div className="w-full md:w-[40%] h-full p-5">
        <div
          style={{
            backgroundImage:
              'url("https://imagedelivery.net/c2SKP8Bk0ZKw6UDgeeIlbw/7962a78e-2c7f-422d-8795-4f816063b400/public")',
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          className="w-full h-full bg-opacity-80  backdrop-blur-md rounded-2xl flex justify-center items-center shadow-lg"
        >
          <div className="w-[80%] md:w-[70%] h-auto py-8 flex flex-col items-center border-2 rounded-2xl border-gray-200 bg-transparent backdrop-blur-xl bg-opacity-90">
            {/* Heading */}
            <h1 className="text-xl font-bold mb-1">Welcome back</h1>
            <p className="text-sm text-gray-100 mb-6">
              Please enter your details to sign in.
            </p>

            {/* Email Input */}
            <div className="relative w-full mt-3 px-5">
              <input
                id="email"
                type="email"
                placeholder=" "
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                className="
                  peer block w-full px-4 pt-4 pb-2 
                  border-2 border-gray-300 rounded-md 
                  text-gray-900 focus:ring-0 focus:border-blue-600 
                  appearance-none
                "
              />
              <label
                htmlFor="email"
                className="
                  absolute text-sm text-gray-100 duration-300 
                  transform -translate-y-4 scale-75 top-1 z-10 
                  origin-[0] left-8 bottom-[28px] px-2
                  bg-white
                  peer-focus:text-gray-800
                  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-1/2 peer-placeholder-shown:top-1/2
                  peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4
                "
              >
                Your Email Address
              </label>
            </div>

            {/* Password Input */}
            <div className="relative w-full mt-6 px-5">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder=" "
                onChange={(e) => setPassword(e.target.value)}
                className="
                  peer block w-full px-4 pt-4 pb-2 
                  border-2 border-gray-300 rounded-md 
                  text-gray-900 focus:ring-0 focus:border-blue-600 
                  appearance-none
                "
              />
              <label
                htmlFor="password"
                className="
                  absolute text-sm text-gray-100 duration-300 
                  transform -translate-y-4 scale-75 top-1 z-10 
                  origin-[0] left-8 bottom-[28px] px-2
                  bg-white
                  peer-focus:text-gray-800
                  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-1/2 peer-placeholder-shown:top-1/2
                  peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4
                "
              >
                Password
              </label>

              {/* Eye Icon */}
              <div
                className="absolute right-7 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible size={20} />
                ) : (
                  <AiOutlineEye size={20} />
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="w-full h-auto mt-8 flex justify-center items-center">
              <button
                onClick={handleSubmit}
                disabled={SignInMutation.isLoading}
                className={`px-[40px] py-2 rounded-xl cursor-pointer border-2 text-white font-semibold transition ${
                  SignInMutation.isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-transparent hover:scale-110"
                }`}
              >
                {SignInMutation.isLoading ? "Signing in..." : "Sign in"}
              </button>
            </div>
            <p className="text-[0.7rem] mt-[10px] text-gray-50">
              Don't have an account,{" "}
              <a
                href="/register"
                className="text-black text-[0.7rem] cursor-pointer hover:scale-110 font-semibold"
              >
                Sign up for free
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
