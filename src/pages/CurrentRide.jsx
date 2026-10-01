import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState, useMemo } from "react";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../api/axiosClient";
import useDriverStore from "../Zustand/DriverAuth";
import { useTheme } from "../context/ThemeContext";
import { 
  RiPhoneLine, 
  RiMapPin2Fill, 
  RiNavigationFill, 
  RiKey2Line, 
  RiShieldCheckLine, 
  RiArrowLeftLine,
  RiCloseLine,
  RiCheckLine,
  RiDeleteBinLine,
  RiAlertLine
} from "react-icons/ri";

// Custom driver & passenger SVG icons
const createDriverIcon = (isDark) =>
  L.divIcon({
    className: "custom-driver-marker",
    html: `
      <div style="position: relative; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;">
        <div style="width: 32px; height: 32px; border-radius: 9999px; background: ${isDark ? "#ffffff" : "#09090b"}; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 14px rgba(0,0,0,0.3); border: 2px solid ${isDark ? "#09090b" : "#ffffff"};">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${isDark ? "#09090b" : "#ffffff"}" stroke-width="2.5">
            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/>
            <circle cx="7" cy="17" r="2"/>
            <path d="M9 17h6"/>
            <circle cx="17" cy="17" r="2"/>
          </svg>
        </div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });

const createPassengerIcon = () =>
  L.divIcon({
    className: "custom-passenger-marker",
    html: `
      <div style="position: relative; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;">
        <div style="width: 28px; height: 28px; border-radius: 9999px; background: #10b981; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(16, 185, 129, 0.4); border: 2px solid #ffffff;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#ffffff">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z"/>
          </svg>
        </div>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });

function FitBounds({ points }) {
  const map = useMap();

  useEffect(() => {
    const valid = points
      .filter((p) => p?.lat && p?.lng)
      .map((p) => [p.lat, p.lng]);

    if (valid.length >= 2) {
      map.fitBounds(L.latLngBounds(valid), { padding: [60, 60], maxZoom: 16 });
    }
  }, [points, map]);

  return null;
}

export default function CurrentRide({ socketRef }) {
  const driver = useDriverStore((state) => state.driver);
  const token = useDriverStore((state) => state.token);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const queryClient = useQueryClient();

  const [driverLocation, setDriverLocation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [route, setRoute] = useState([]);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [otpValue, setOtpValue] = useState(["", "", "", ""]);
  const otpInputRefs = [useRef(), useRef(), useRef(), useRef()];

  const location = useLocation();
  const rideId = new URLSearchParams(location.search).get("id") || localStorage.getItem("rideId");
  const navigate = useNavigate();

  // Watch Driver GPS position
  useEffect(() => {
    if (!navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };

        setDriverLocation(coords);

        if (socketRef?.current?.connected) {
          socketRef.current.emit("driver:location:update", {
            email: driver?.email,
            coordinates: coords,
            socketid: socketRef.current.id,
          });
        }
      },
      (err) => console.error("GPS Watch error:", err),
      { enableHighAccuracy: true, maximumAge: 3000, timeout: 10000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [driver, socketRef]);

  // Fetch ride details
  const { data: rideInfo, isError, error } = useQuery({
    queryKey: ["rideinfo", rideId],
    queryFn: async () => {
      if (!rideId || !token) return null;
      try {
        const res = await api.get("/ride/info", {
          params: { rideId },
          headers: { Authorization: `Bearer ${token}` },
        });
        return res.data?.data;
      } catch (err) {
        if (err.response?.status === 404) {
          localStorage.removeItem("rideId");
          return null;
        }
        throw err;
      }
    },
    enabled: !!rideId && !!token,
    refetchInterval: 5000,
  });

  // Extract passenger pickup coordinates
  useEffect(() => {
    if (rideInfo?.pickupCoordinates?.coordinates) {
      const [lng, lat] = rideInfo.pickupCoordinates.coordinates;
      if (lng && lat) {
        setUserLocation({ lat, lng });
      }
    }
  }, [rideInfo]);

  // Redirect if ride is already in progress or completed/cancelled
  useEffect(() => {
    if (rideInfo?.status === "in_progress") {
      navigate(`/finalride?id=${rideId}`);
    } else if (rideInfo?.status === "completed" || rideInfo?.status === "cancelled") {
      toast.info(`Ride status is ${rideInfo.status}.`);
      localStorage.removeItem("rideId");
      queryClient.invalidateQueries({ queryKey: ["driverActiveRide"] });
      navigate("/dashboard");
    }
  }, [rideInfo, rideId, navigate, queryClient]);

  // Fetch routing geometry
  useEffect(() => {
    const getRoute = async () => {
      if (!driverLocation || !userLocation) return;
      try {
        const res = await api.get(`/ride/route`, {
          params: {
            startLng: driverLocation.lng,
            startLat: driverLocation.lat,
            endLng: userLocation.lng,
            endLat: userLocation.lat,
          },
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data?.features?.[0]?.geometry?.coordinates) {
          setRoute(
            res.data.features[0].geometry.coordinates.map((c) => ({
              lat: c[1],
              lng: c[0],
            }))
          );
        }
      } catch (e) {
        console.error("Route calculation error:", e);
      }
    };

    getRoute();
  }, [driverLocation, userLocation, token]);

  // Handle Cancel Ride action
  const handleCancelRide = async () => {
    if (!rideId) {
      localStorage.removeItem("rideId");
      navigate("/dashboard");
      return;
    }

    setIsCancelling(true);
    try {
      await api.put(
        "/ride/cancel",
        { rideId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Ride cancelled. Returning to Command Center.");
      localStorage.removeItem("rideId");
      queryClient.invalidateQueries({ queryKey: ["driverActiveRide"] });
      navigate("/dashboard");
    } catch (err) {
      console.error("Error cancelling ride:", err);
      toast.error(err.response?.data?.message || "Failed to cancel ride");
    } finally {
      setIsCancelling(false);
      setIsCancelModalOpen(false);
    }
  };

  // Handle 4-digit OTP input change
  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otpValue];
    newOtp[index] = value.slice(-1);
    setOtpValue(newOtp);

    // Auto-focus next input
    if (value && index < 3) {
      otpInputRefs[index + 1].current?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpValue[index] && index > 0) {
      otpInputRefs[index - 1].current?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const enteredOtp = otpValue.join("");
    if (enteredOtp.length < 4) {
      toast.warn("Please enter complete 4-digit OTP");
      return;
    }

    try {
      await api.post(
        "/ride/verify-otp",
        { rideId, otp: enteredOtp },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("OTP Verified! Starting ride transit...");
      setIsOtpModalOpen(false);
      navigate(`/finalride?id=${rideId}`);
    } catch (err) {
      console.error("Error verifying OTP:", err);
      toast.error(err.response?.data?.message || "Invalid Passenger OTP. Please recheck with passenger.");
      setOtpValue(["", "", "", ""]);
      otpInputRefs[0].current?.focus();
    }
  };

  const driverIcon = useMemo(() => createDriverIcon(isDark), [isDark]);
  const passengerIcon = useMemo(() => createPassengerIcon(), []);

  const center = driverLocation
    ? [driverLocation.lat, driverLocation.lng]
    : userLocation
    ? [userLocation.lat, userLocation.lng]
    : [20.5937, 78.9629];

  return (
    <div className="w-full h-screen relative flex flex-col overflow-hidden bg-zinc-100 dark:bg-zinc-950 font-sans">
      {/* Top Floating Control Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={() => navigate("/dashboard")}
            title="Return to Dashboard"
            className="p-3 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-lg text-zinc-900 dark:text-white hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 text-xs font-bold"
          >
            <RiArrowLeftLine size={18} />
            <span className="hidden sm:inline">Dashboard</span>
          </button>

          <button
            onClick={() => setIsCancelModalOpen(true)}
            title="Cancel this ride"
            className="p-3 bg-red-600/90 hover:bg-red-700 text-white backdrop-blur-md rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 text-xs font-bold"
          >
            <RiDeleteBinLine size={16} />
            <span className="hidden sm:inline">Cancel Ride</span>
          </button>
        </div>

        <div className="pointer-events-auto bg-zinc-950/90 dark:bg-white/90 backdrop-blur-md text-white dark:text-zinc-950 px-4 py-2 rounded-2xl text-xs font-bold shadow-lg flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Navigating to Pickup</span>
        </div>
      </div>

      {/* Fullscreen Map with Clean OpenStreetMap Tiles (Zero API Key Watermark) */}
      <div className={`absolute inset-0 z-0 ${isDark ? "map-dark-filter" : ""}`}>
        <MapContainer
          center={center}
          zoom={15}
          zoomControl={false}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            maxZoom={19}
          />
          <FitBounds points={[driverLocation, userLocation].filter(Boolean)} />

          {driverLocation && (
            <Marker position={[driverLocation.lat, driverLocation.lng]} icon={driverIcon}>
              <Popup>You (Driver)</Popup>
            </Marker>
          )}

          {userLocation && (
            <Marker position={[userLocation.lat, userLocation.lng]} icon={passengerIcon}>
              <Popup>Passenger Pickup</Popup>
            </Marker>
          )}

          {route.length > 0 && (
            <Polyline
              positions={route}
              color={isDark ? "#ffffff" : "#09090b"}
              weight={5}
              opacity={0.9}
            />
          )}
        </MapContainer>
      </div>

      {/* Floating Bottom Card: Passenger Info & Pickup Verification */}
      <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-8 md:bottom-8 md:w-[420px] z-20 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-zinc-200/80 dark:border-zinc-800 animate-in slide-in-from-bottom-6 duration-300">
        <div className="w-10 h-1 bg-zinc-200 dark:bg-zinc-700 rounded-full mx-auto mb-4" />

        {/* Passenger Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-950 dark:text-white font-extrabold text-base">
              {rideInfo?.userId?.name?.charAt(0) || rideInfo?.passenger?.name?.charAt(0) || "P"}
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-950 dark:text-white font-['Space_Grotesk']">
                {rideInfo?.userId?.name || rideInfo?.passenger?.name || "Passenger"}
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {rideInfo?.distance ? `${rideInfo.distance} km total trip` : "Calculating route..."}
              </p>
            </div>
          </div>

          {(rideInfo?.userId?.mobile || rideInfo?.passenger?.mobile) && (
            <a
              href={`tel:${rideInfo?.userId?.mobile || rideInfo?.passenger?.mobile}`}
              className="p-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-950 dark:text-white rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xs"
            >
              <RiPhoneLine size={18} />
            </a>
          )}
        </div>

        {/* Pickup Location Box */}
        <div className="bg-zinc-50 dark:bg-zinc-950/60 p-3.5 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 mb-5 flex items-start gap-3">
          <RiMapPin2Fill className="text-emerald-500 shrink-0 mt-0.5" size={18} />
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase text-zinc-400 tracking-wider">Pickup Point</p>
            <p className="text-xs font-semibold text-zinc-900 dark:text-white line-clamp-2">
              {rideInfo?.pickup || "Passenger pickup point"}
            </p>
          </div>
        </div>

        {/* Action Triggers */}
        <div className="space-y-2.5">
          <button
            onClick={() => {
              setIsOtpModalOpen(true);
              setTimeout(() => otpInputRefs[0].current?.focus(), 100);
            }}
            className="w-full py-4 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 rounded-2xl font-bold text-sm shadow-xl hover:opacity-90 active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            <RiKey2Line size={18} />
            <span>Arrived • Enter Start OTP</span>
          </button>

          <button
            onClick={() => setIsCancelModalOpen(true)}
            className="w-full py-2 text-xs font-semibold text-red-500 hover:text-red-700 dark:hover:text-red-400 text-center transition-colors"
          >
            Passenger No-Show / Cancel Ride
          </button>
        </div>
      </div>

      {/* OTP Verification Modal */}
      {isOtpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 w-full max-w-sm shadow-2xl relative animate-in zoom-in-95">
            <button
              onClick={() => setIsOtpModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-white"
            >
              <RiCloseLine size={20} />
            </button>

            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-2xl mx-auto flex items-center justify-center text-zinc-950 dark:text-white mb-3">
                <RiKey2Line size={24} />
              </div>
              <h3 className="text-lg font-bold text-zinc-950 dark:text-white font-['Space_Grotesk']">
                Verify Passenger OTP
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Ask passenger for the 4-digit code shown on their Voyago screen.
              </p>
            </div>

            {/* 4 Digit Keypad Input */}
            <div className="flex justify-center gap-3 mb-6">
              {otpValue.map((digit, idx) => (
                <input
                  key={idx}
                  ref={otpInputRefs[idx]}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  className="w-14 h-14 text-center text-2xl font-extrabold bg-zinc-100 dark:bg-zinc-800 border-2 border-transparent focus:border-zinc-950 dark:focus:border-white rounded-2xl outline-none text-zinc-950 dark:text-white transition-all font-mono"
                />
              ))}
            </div>

            <button
              onClick={handleVerifyOtp}
              className="w-full py-3.5 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 rounded-2xl font-bold text-sm shadow-lg hover:opacity-90 active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <RiCheckLine size={18} />
              <span>Verify & Start Trip</span>
            </button>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 w-full max-w-sm shadow-2xl relative animate-in zoom-in-95">
            <div className="text-center mb-5">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-950/50 text-red-600 rounded-2xl mx-auto flex items-center justify-center mb-3">
                <RiAlertLine size={24} />
              </div>
              <h3 className="text-lg font-bold text-zinc-950 dark:text-white font-['Space_Grotesk']">
                Cancel Active Ride?
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Are you sure you want to cancel this ride? This will reset your shift and return you to the Command Center.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIsCancelModalOpen(false)}
                className="flex-1 py-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-xl font-bold text-xs"
              >
                Go Back
              </button>
              <button
                type="button"
                onClick={handleCancelRide}
                disabled={isCancelling}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5"
              >
                <RiDeleteBinLine size={16} />
                <span>{isCancelling ? "Cancelling..." : "Confirm Cancel"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
