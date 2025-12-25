import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import api from "../api/axiosClint";
import { Link } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [licence, setLicence] = useState("");
  const [vehicleName, setVehicleName] = useState("");

  // Mutation function for registration
  const SignUpMutation = useMutation({
    mutationFn: async (formData) => {
      return await api.post("/signup-driver", formData);
    },
    onSuccess: (response) => {
      console.log("You have registered");
      toast.success("Registration completed");
    },
    onError: (error) => {
      console.error("Error while registering:", error);
      toast.error("Failed to register");
    },
  });

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !name ||
      !email ||
      !password ||
      !mobile ||
      !vehicleName ||
      !vehicle ||
      !licence
    ) {
      toast.warn("Please fill in all fields.");
      return;
    }

    const formData = {
      name,
      email,
      password,
      mobile,
      vehicleName,
      vehicle,
      licence,
    };

    SignUpMutation.mutate(formData);
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
            Partner with<br />
            Voyago.
          </h2>
          <p className="text-gray-400 text-lg max-w-md">
            Join thousands of other drivers who are earning on their own terms.
          </p>
        </div>
        <div className="z-10 text-sm text-gray-500">
          &copy; 2025 Uber/Voyago Clone. All rights reserved.
        </div>
        <div className="absolute inset-0 bg-gradient-to-tr from-gray-900 to-transparent opacity-40 pointer-events-none" />
      </div>

      {/* Right Section: Form (White bg) */}
      <div className="flex flex-col items-center p-6 sm:p-12 md:p-16 w-full overflow-y-auto">
        {/* Mobile Header for context */}
        <div className="md:hidden w-full mb-8">
          <h1 className="text-2xl font-bold tracking-tighter">VOYAGO/DRIVER</h1>
        </div>

        <div className="w-full max-w-sm space-y-6">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Become a Driver</h2>
            <p className="mt-2 text-sm text-gray-500">
              Sign up today and start earning.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
              <input
                type="tel"
                placeholder="+1 555 000 0000"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Name</label>
                <input
                  type="text"
                  placeholder="Toyota Camry"
                  value={vehicleName}
                  onChange={(e) => setVehicleName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Number</label>
                <input
                  type="text"
                  placeholder="ABC-1234"
                  value={vehicle}
                  onChange={(e) => setVehicle(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Driving License Number</label>
              <input
                type="text"
                placeholder="DL-1234567890"
                value={licence}
                onChange={(e) => setLicence(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={SignUpMutation.isPending}
              className={`w-full py-3.5 rounded-lg bg-black text-white font-semibold text-sm transition-all shadow-lg hover:shadow-xl hover:bg-gray-900 active:scale-[0.99] flex items-center justify-center ${SignUpMutation.isPending
                  ? "opacity-75 cursor-not-allowed"
                  : ""
                }`}
            >
              {SignUpMutation.isPending
                ? "Creating Account..."
                : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-black font-semibold hover:underline"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
