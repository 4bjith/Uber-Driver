import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-toastify";
import api from "../api/axiosClient";
import { useNavigate, Link } from "react-router-dom";
import useDriverStore from "../Zustand/DriverAuth";
import { useTheme } from "../context/ThemeContext";
import { 
  RiEyeLine, 
  RiEyeOffLine, 
  RiSteering2Line, 
  RiShieldCheckLine, 
  RiSunLine, 
  RiMoonLine,
  RiArrowRightLine,
  RiMapPinLine
} from "react-icons/ri";

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { theme, toggleTheme } = useTheme();

  const { setToken, setDriver } = useDriverStore();

  const SignInMutation = useMutation({
    mutationFn: async (formData) => {
      return await api.post("/driverlogin", formData);
    },
    onSuccess: (response) => {
      const data = response.data;
      setToken(data.token);
      if (data.driver) {
        setDriver(data.driver);
      }
      toast.success("Welcome back! Driver portal connected.");
      navigate("/dashboard");
    },
    onError: (error) => {
      console.error("Sign in error:", error);
      toast.error(error.response?.data?.message || "Invalid driver credentials");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.warn("Please enter both email and password.");
      return;
    }

    if (!navigator.geolocation) {
      // Fallback if browser doesn't support geolocation
      SignInMutation.mutate({
        email,
        password,
        location: { type: "Point", coordinates: [72.8777, 19.076] },
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          type: "Point",
          coordinates: [position.coords.longitude, position.coords.latitude],
        };
        SignInMutation.mutate({ email, password, location });
      },
      (error) => {
        console.warn("Location permission not granted, proceeding with default coords:", error);
        SignInMutation.mutate({
          email,
          password,
          location: { type: "Point", coordinates: [72.8777, 19.076] },
        });
      },
      { enableHighAccuracy: true, timeout: 5000 }
    );
  };

  return (
    <div className="w-full h-screen grid md:grid-cols-2 overflow-hidden bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-100 font-sans transition-colors duration-300">
      {/* Left Brand Showcase Section (Desktop) */}
      <div className="hidden md:flex flex-col justify-between bg-zinc-950 text-white p-10 lg:p-14 relative overflow-hidden">
        {/* Background Geometric Glow */}
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
                Driver Command
              </span>
            </div>
          </div>

          <span className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-xs font-mono text-zinc-300">
            v2.4 Telemetry
          </span>
        </div>

        <div className="z-10 space-y-6 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-zinc-900/80 border border-zinc-800 rounded-full text-xs font-semibold text-emerald-400">
            <RiShieldCheckLine size={15} />
            <span>80% Driver Payout Guarantee • Cashfree Escrow</span>
          </div>

          <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.1] font-['Space_Grotesk']">
            Drive with precision. <br />
            Earn on your schedule.
          </h2>

          <p className="text-sm text-zinc-400 leading-relaxed font-medium">
            Next-gen urban mobility driver platform. Receive instant dispatches, live turn-by-turn routing, and direct T+0 automated bank settlements.
          </p>
        </div>

        <div className="z-10 flex items-center justify-between text-xs text-zinc-500 pt-6 border-t border-zinc-900">
          <span>&copy; {new Date().getFullYear()} Voyago Technologies. All rights reserved.</span>
          <span className="font-mono">Cashfree Sandbox Enabled</span>
        </div>
      </div>

      {/* Right Login Form Section */}
      <div className="flex flex-col justify-between p-6 sm:p-10 md:p-12 lg:p-16 w-full max-w-md mx-auto md:max-w-none overflow-y-auto">
        {/* Top Header & Theme Switcher */}
        <div className="flex items-center justify-between w-full mb-8">
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
        <div className="w-full max-w-sm mx-auto space-y-6 my-auto">
          <div>
            <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-white font-['Space_Grotesk']">
              Driver Partner Login
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Enter your registered driver email and password to connect your shift.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">
                Driver Email
              </label>
              <input
                id="email"
                type="email"
                required
                placeholder="driver@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-white transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-white transition-all pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                >
                  {showPassword ? <RiEyeOffLine size={18} /> : <RiEyeLine size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={SignInMutation.isPending}
              className="w-full py-3.5 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-bold text-sm transition-all shadow-lg hover:opacity-90 active:scale-98 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {SignInMutation.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white dark:border-zinc-950 border-t-transparent rounded-full animate-spin" />
                  <span>Connecting Telemetry...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Shift</span>
                  <RiArrowRightLine size={18} />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-zinc-500 dark:text-zinc-400">
            Want to partner with us?{" "}
            <Link to="/register" className="font-bold text-zinc-950 dark:text-white underline underline-offset-4">
              Apply as a Driver Partner
            </Link>
          </p>
        </div>

        {/* Bottom Footer note */}
        <div className="text-center text-[11px] text-zinc-400 pt-6">
          Encrypted TLS Telemetry & Cashfree Escrow Protected.
        </div>
      </div>
    </div>
  );
}
