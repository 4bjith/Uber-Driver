import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import api from "../api/axiosClient";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { 
  RiShieldCheckLine, 
  RiSunLine, 
  RiMoonLine, 
  RiArrowRightLine, 
  RiCarLine,
  RiCheckDoubleLine
} from "react-icons/ri";

function Register() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [licence, setLicence] = useState("");
  const [vehicleName, setVehicleName] = useState("");
  const [vehicleType, setVehicleType] = useState("Sedan");

  const SignUpMutation = useMutation({
    mutationFn: async (formData) => {
      return await api.post("/signup-driver", formData);
    },
    onSuccess: () => {
      toast.success("Driver application submitted! Please log in.");
      navigate("/login");
    },
    onError: (error) => {
      console.error("Error while registering:", error);
      toast.error(error.response?.data?.message || "Failed to submit driver application");
    },
  });

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
      toast.warn("Please complete all driver and vehicle fields.");
      return;
    }

    const formData = {
      name,
      email,
      password,
      mobile,
      vehicleName,
      vehicle,
      vehicleType,
      licence,
    };

    SignUpMutation.mutate(formData);
  };

  return (
    <div className="w-full min-h-screen grid md:grid-cols-2 bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-100 font-sans transition-colors duration-300">
      {/* Left Brand Showcase Section (Desktop) */}
      <div className="hidden md:flex flex-col justify-between bg-zinc-950 text-white p-10 lg:p-14 relative overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-zinc-800 rounded-full blur-3xl opacity-30 pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-zinc-700 rounded-full blur-3xl opacity-20 pointer-events-none" />

        <div className="z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-black font-extrabold text-xl shadow-lg">
              V
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight font-['Space_Grotesk']">
                VOYAGO
              </h1>
              <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                Partner Onboarding
              </span>
            </div>
          </div>

          <span className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-xs font-mono text-zinc-300">
            KYC Sandbox Ready
          </span>
        </div>

        <div className="z-10 space-y-6 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-zinc-900/80 border border-zinc-800 rounded-full text-xs font-semibold text-emerald-400">
            <RiShieldCheckLine size={15} />
            <span>Top Tier Earnings • Zero Hidden Commission</span>
          </div>

          <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.1] font-['Space_Grotesk']">
            Partner with the next generation.
          </h2>

          <p className="text-sm text-zinc-400 leading-relaxed font-medium">
            Register your vehicle, verify your commercial license, and start accepting rides with direct 80% automated settlements via Cashfree sandbox.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-900">
            <div className="p-3 bg-zinc-900/60 rounded-2xl border border-zinc-800">
              <span className="text-lg font-extrabold font-['Space_Grotesk'] text-white">80%</span>
              <p className="text-[11px] text-zinc-400">Guaranteed Driver Share</p>
            </div>
            <div className="p-3 bg-zinc-900/60 rounded-2xl border border-zinc-800">
              <span className="text-lg font-extrabold font-['Space_Grotesk'] text-emerald-400">Instant</span>
              <p className="text-[11px] text-zinc-400">Cashfree Settlement</p>
            </div>
          </div>
        </div>

        <div className="z-10 flex items-center justify-between text-xs text-zinc-500 pt-6 border-t border-zinc-900">
          <span>&copy; {new Date().getFullYear()} Voyago Technologies.</span>
          <span className="font-mono">Driver Verification Desk</span>
        </div>
      </div>

      {/* Right Registration Form Section */}
      <div className="flex flex-col justify-between p-6 sm:p-10 md:p-12 lg:p-16 w-full max-w-lg mx-auto md:max-w-none overflow-y-auto">
        {/* Header & Theme Switcher */}
        <div className="flex items-center justify-between w-full mb-6">
          <div className="md:hidden flex items-center gap-2">
            <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center text-white dark:text-black font-extrabold text-sm">
              V
            </div>
            <span className="font-bold text-base font-['Space_Grotesk']">Voyago Driver</span>
          </div>

          <div className="ml-auto">
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-all"
            >
              {theme === "dark" ? <RiSunLine size={18} /> : <RiMoonLine size={18} />}
            </button>
          </div>
        </div>

        {/* Center Form */}
        <div className="w-full max-w-md mx-auto space-y-5 my-auto">
          <div>
            <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-white font-['Space_Grotesk']">
              Become a Driver Partner
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Submit your vehicle and license details for automated verification.
            </p>
          </div>

          <form className="space-y-3.5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">
                Full Legal Name
              </label>
              <input
                type="text"
                required
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-white transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="driver@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-white transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">
                Mobile Number
              </label>
              <input
                type="tel"
                required
                placeholder="+91 98765 43210"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-white transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">
                  Vehicle Model
                </label>
                <input
                  type="text"
                  required
                  placeholder="Toyota Camry (White)"
                  value={vehicleName}
                  onChange={(e) => setVehicleName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">
                  Vehicle Number
                </label>
                <input
                  type="text"
                  required
                  placeholder="MH 02 AB 1234"
                  value={vehicle}
                  onChange={(e) => setVehicle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm font-mono uppercase text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-white transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">
                  Vehicle Category
                </label>
                <select
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-white transition-all"
                >
                  <option value="Sedan">Sedan (Voyago Go)</option>
                  <option value="SUV">SUV (Voyago Max)</option>
                  <option value="Bike">Bike (Voyago Moto)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">
                  License Number
                </label>
                <input
                  type="text"
                  required
                  placeholder="DL-1234567890"
                  value={licence}
                  onChange={(e) => setLicence(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm font-mono uppercase text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-white transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={SignUpMutation.isPending}
              className="w-full py-3.5 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-bold text-sm transition-all shadow-lg hover:opacity-90 active:scale-98 flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              {SignUpMutation.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white dark:border-zinc-950 border-t-transparent rounded-full animate-spin" />
                  <span>Submitting Application...</span>
                </>
              ) : (
                <>
                  <span>Create Driver Account</span>
                  <RiArrowRightLine size={18} />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-zinc-500 dark:text-zinc-400">
            Already have a driver partner account?{" "}
            <Link to="/login" className="font-bold text-zinc-950 dark:text-white underline underline-offset-4">
              Sign in here
            </Link>
          </p>
        </div>

        {/* Bottom Note */}
        <div className="text-center text-[11px] text-zinc-400 pt-6">
          By signing up, you agree to Voyago Driver Partner Terms & Safety Guidelines.
        </div>
      </div>
    </div>
  );
}

export default Register;
