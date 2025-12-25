import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-toastify";
import api from "../api/axiosClint";
import { useNavigate, Link } from "react-router-dom";
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
    <div className="w-full h-screen grid md:grid-cols-2 overflow-hidden bg-white text-black font-sans">
      {/* Left Section: Brand (Hidden on mobile, Black bg) */}
      <div className="hidden md:flex flex-col justify-between bg-black text-white p-12 lg:p-16 relative">
        <div className="z-10">
          <h1 className="text-3xl font-bold tracking-tighter">VOYAGO/DRIVER</h1>
        </div>
        <div className="z-10 gap-6 flex flex-col">
          <h2 className="text-5xl lg:text-7xl font-medium tracking-tight leading-[1.1]">
            Drive when you want,<br />
            make what you need.
          </h2>
          <p className="text-gray-400 text-lg max-w-md">
            Set your own schedule and earn money on your terms. Join the largest network of active riders.
          </p>
        </div>
        <div className="z-10 text-sm text-gray-500">
          &copy; 2025 Uber/Voyago Clone. All rights reserved.
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-transparent opacity-40 pointer-events-none" />
      </div>

      {/* Right Section: Form (White bg) */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12 md:p-16 w-full max-w-xl mx-auto md:max-w-none">
        {/* Mobile Header for context */}
        <div className="md:hidden w-full mb-8">
          <h1 className="text-2xl font-bold tracking-tighter">VOYAGO/DRIVER</h1>
        </div>

        <div className="w-full max-w-sm space-y-8">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Driver Sign in</h2>
            <p className="mt-2 text-sm text-gray-500">
              Welcome back! Please enter your details.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                      <path fillRule="evenodd" d="M3.28 2.22a.75.75 0 00-1.06 1.06l14.5 14.5a.75.75 0 101.06-1.06l-1.745-1.745A10.02 10.02 0 0021 12c0-5.523-4.477-10-10-10a10.012 10.012 0 00-4.406 1.025L3.28 2.22zm-2.028 11.23a.75.75 0 111.496-.346C4.018 16.29 7.669 18.5 12 18.5c2.324 0 4.414-.64 6.182-1.76l-1.096-1.096A7.95 7.95 0 0112 17c-4.418 0-8-3.582-8-8 0-.493.064-.972.186-1.432L1.252 13.45z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                      <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
                      <path fillRule="evenodd" d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={SignInMutation.isPending}
              className={`w-full py-3.5 rounded-lg bg-black text-white font-semibold text-sm transition-all shadow-lg hover:shadow-xl hover:bg-gray-900 active:scale-[0.99] flex items-center justify-center ${SignInMutation.isPending ? "opacity-75 cursor-not-allowed" : ""
                }`}
            >
              {SignInMutation.isPending ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <Link to="/register" className="font-semibold text-black hover:underline">
              Sign up for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
