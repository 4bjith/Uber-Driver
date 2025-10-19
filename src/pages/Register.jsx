import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import api from "../api/axiosClint";

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
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div
        className="relative w-full max-w-md md:max-w-xl h-[700px] bg-cover bg-center rounded-3xl shadow-2xl overflow-hidden"
        style={{
          backgroundImage:
            'url("https://w0.peakpx.com/wallpaper/481/11/HD-wallpaper-jade-on-purple-aesthetic-in-2022-jdm-best-jdm-cars-car.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-transparent bg-opacity-50 backdrop-blur-xl flex justify-center items-center px-6">
          <div className="w-full">
            <div className="bg-transparent bg-opacity-10 rounded-2xl border border-white border-opacity-30 px-6 py-8 shadow-md">
              <h2 className="text-white text-3xl font-bold text-center mb-2">
                Sign Up
              </h2>
              <p className="text-white text-center text-sm mb-6">
                Join us and start your journey!
              </p>

              {/* Form Starts Here */}
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-transparent border border-white border-opacity-30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-purple-300"
                  />
                </div>

                <div>
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-transparent border border-white border-opacity-30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-purple-300"
                  />
                </div>

                <div>
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-transparent border border-white border-opacity-30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-purple-300"
                  />
                </div>

                <div>
                  <input
                    type="tel"
                    placeholder="Mobile No."
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-transparent border border-white border-opacity-30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-purple-300"
                  />
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Vehicle Name"
                    value={vehicleName}
                    onChange={(e) => setVehicleName(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-transparent border border-white border-opacity-30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-purple-300"
                  />
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Vehicle Number"
                    value={vehicle}
                    onChange={(e) => setVehicle(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-transparent border border-white border-opacity-30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-purple-300"
                  />
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Driving License Number"
                    value={licence}
                    onChange={(e) => setLicence(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-transparent border border-white border-opacity-30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-purple-300"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-transparent bg-opacity-20 hover:bg-opacity-40 text-white font-semibold py-2 rounded-lg transition duration-200 border border-white border-opacity-30"
                >
                  Create Account
                </button>
              </form>

              <p className="text-white text-sm mt-6 text-center">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="text-purple-200 underline hover:text-purple-100"
                >
                  Sign in here
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
