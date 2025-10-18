import React from "react";

function Register() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      {/* Background card container */}
      
      <div
        className="relative w-full max-w-md md:max-w-xl h-[700px] bg-cover bg-center rounded-3xl shadow-2xl overflow-hidden"
        style={{
          backgroundImage:
            'url("https://w0.peakpx.com/wallpaper/481/11/HD-wallpaper-jade-on-purple-aesthetic-in-2022-jdm-best-jdm-cars-car.jpg")', // Replace with your actual background
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Blur + overlay */}
        <div className="absolute inset-0 bg-transparent bg-opacity-50 backdrop-blur-xl flex justify-center items-center px-6">
          {/* Glassmorphism card */}
          <div className="w-full">
            <div className="bg-transparent bg-opacity-10 rounded-2xl border border-white border-opacity-30 px-6 py-8 shadow-md">
              <h2 className="text-white text-3xl font-bold text-center mb-2">
                Sign Up
              </h2>
              <p className="text-white text-center text-sm mb-6">
                Join us and start your journey!
              </p>

              <form className="space-y-5">
                {/* Full Name */}
                <div>
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full px-4 py-2 rounded-lg bg-transparent border border-white border-opacity-30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-purple-300"
                  />
                </div>

                {/* Email */}
                <div>
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="w-full px-4 py-2 rounded-lg bg-transparent border border-white border-opacity-30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-purple-300"
                  />
                </div>

                {/* Password */}
                <div>
                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full px-4 py-2 rounded-lg bg-transparent border border-white border-opacity-30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-purple-300"
                  />
                </div>

                {/* Vehicle Number */}
                <div>
                  <input
                    type="text"
                    placeholder="Vehicle Number"
                    className="w-full px-4 py-2 rounded-lg bg-transparent border border-white border-opacity-30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-purple-300"
                  />
                </div>

                {/* Driving License */}
                <div>
                  <input
                    type="text"
                    placeholder="Driving License Number"
                    className="w-full px-4 py-2 rounded-lg bg-transparent border border-white border-opacity-30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-purple-300"
                  />
                </div>

                {/* Submit */}
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
