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
import { useEffect, useState, useMemo } from "react";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../api/axiosClient";
import useDriverStore from "../Zustand/DriverAuth";
import { useTheme } from "../context/ThemeContext";
import { 
  RiMapPinRangeFill, 
  RiNavigationFill, 
  RiFlagLine, 
  RiShieldCheckLine, 
  RiWallet3Line, 
  RiArrowLeftLine,
  RiCheckDoubleLine,
  RiDeleteBinLine,
  RiAlertLine
} from "react-icons/ri";

const createDriverIcon = (isDark) =>
  L.divIcon({
    className: "custom-driver-marker-transit",
    html: `
      <div style="position: relative; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;">
        <div style="position: absolute; width: 44px; height: 44px; border-radius: 9999px; background: ${
          isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)"
        }; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
        <div style="width: 34px; height: 34px; border-radius: 9999px; background: ${
          isDark ? "#ffffff" : "#09090b"
        }; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 14px rgba(0,0,0,0.3); border: 2px solid ${
      isDark ? "#09090b" : "#ffffff"
    };">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${
            isDark ? "#09090b" : "#ffffff"
          }" stroke-width="2.5">
            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/>
            <circle cx="7" cy="17" r="2"/>
            <path d="M9 17h6"/>
            <circle cx="17" cy="17" r="2"/>
          </svg>
        </div>
      </div>
    `,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
  });

const createDestIcon = () =>
  L.divIcon({
    className: "custom-dest-marker",
    html: `
      <div style="position: relative; width: 38px; height: 38px; display: flex; align-items: center; justify-content: center;">
        <div style="width: 30px; height: 30px; border-radius: 9999px; background: #ef4444; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4); border: 2px solid #ffffff;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#ffffff">
            <path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z"/>
          </svg>
        </div>
      </div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
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

export default function FinalRide({ socketRef }) {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [destination, setDestination] = useState(null);
  const [route, setRoute] = useState([]);
  const [isPaid, setIsPaid] = useState(false);
  const [isEnding, setIsEnding] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const location = useLocation();
  const rideId = new URLSearchParams(location.search).get("id") || localStorage.getItem("rideId");
  const navigate = useNavigate();
  const token = useDriverStore((state) => state.token);
  const driver = useDriverStore((state) => state.driver);
  const queryClient = useQueryClient();

  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Watch Driver GPS position
  useEffect(() => {
    if (!navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setCurrentLocation(coords);

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

  // Fetch ride info
  const { data: rideInfo } = useQuery({
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

  // Extract destination coordinates
  useEffect(() => {
    if (rideInfo?.dropoffCoordinates?.coordinates) {
      const [lng, lat] = rideInfo.dropoffCoordinates.coordinates;
      if (lng && lat) {
        setDestination({ lat, lng });
      }
    }
  }, [rideInfo]);

  // Emit ride start to passenger
  useEffect(() => {
    if (!rideId || !destination || !currentLocation) return;
    socketRef.current?.emit("driver:ridestart", { rideId, destination, currentLocation });
  }, [rideId, socketRef, destination, currentLocation]);

  // Listen for real-time Cashfree payment confirmation from socket
  useEffect(() => {
    const socketInstance = socketRef.current;
    if (!socketInstance) return;

    const handleRidePaid = (data) => {
      if (data?.rideId === rideId || data?.id === rideId) {
        setIsPaid(true);
        toast.success("💳 Cashfree Payment Confirmed! ₹" + (data.amount || rideInfo?.fare) + " settled.");
      }
    };

    socketInstance.on("ride:paid", handleRidePaid);
    return () => {
      socketInstance.off("ride:paid", handleRidePaid);
    };
  }, [socketRef, rideId, rideInfo]);

  // Route drawing
  useEffect(() => {
    const getRoute = async () => {
      if (!currentLocation || !destination) return;
      try {
        const res = await api.get(`/ride/route`, {
          params: {
            startLng: currentLocation.lng,
            startLat: currentLocation.lat,
            endLng: destination.lng,
            endLat: destination.lat,
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
        console.error("Route fetch failed:", e);
      }
    };

    getRoute();
  }, [currentLocation, destination, token]);

  const handleEndRide = async () => {
    setIsEnding(true);
    try {
      await api.put(
        "/ride/end",
        { rideId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("🏁 Ride completed successfully! Payout credited.");
      localStorage.removeItem("rideId");
      queryClient.invalidateQueries({ queryKey: ["driverActiveRide"] });
      navigate("/dashboard");
    } catch (err) {
      console.error("Failed to end ride:", err);
      toast.error(err.response?.data?.message || "Failed to complete ride");
    } finally {
      setIsEnding(false);
    }
  };

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

  const driverIcon = useMemo(() => createDriverIcon(isDark), [isDark]);
  const destIcon = useMemo(() => createDestIcon(), []);

  const center = currentLocation
    ? [currentLocation.lat, currentLocation.lng]
    : destination
    ? [destination.lat, destination.lng]
    : [20.5937, 78.9629];

  const estimatedEarnings = rideInfo?.earnings || (rideInfo?.fare ? rideInfo.fare * 0.8 : 0);

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
            title="Emergency Cancel Ride"
            className="p-3 bg-red-600/90 hover:bg-red-700 text-white backdrop-blur-md rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 text-xs font-bold"
          >
            <RiDeleteBinLine size={16} />
            <span className="hidden sm:inline">Cancel Ride</span>
          </button>
        </div>

        <div className="pointer-events-auto bg-zinc-950/90 dark:bg-white/90 backdrop-blur-md text-white dark:text-zinc-950 px-4 py-2 rounded-2xl text-xs font-bold shadow-lg flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span>In Transit to Destination</span>
        </div>
      </div>

      {/* Fullscreen Map with Clean OpenStreetMap Tiles */}
      <div className={`absolute inset-0 z-0 ${isDark ? "map-dark-filter" : ""}`}>
        <MapContainer
          center={center}
          zoom={14}
          zoomControl={false}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            maxZoom={19}
          />
          <FitBounds points={[currentLocation, destination].filter(Boolean)} />

          {currentLocation && (
            <Marker position={[currentLocation.lat, currentLocation.lng]} icon={driverIcon}>
              <Popup>Your Vehicle</Popup>
            </Marker>
          )}

          {destination && (
            <Marker position={[destination.lat, destination.lng]} icon={destIcon}>
              <Popup>Dropoff Destination</Popup>
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

      {/* Floating Bottom Card: Ride Transit & Complete Action */}
      <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-8 md:bottom-8 md:w-[420px] z-20 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-zinc-200/80 dark:border-zinc-800 animate-in slide-in-from-bottom-6 duration-300">
        <div className="w-10 h-1 bg-zinc-200 dark:bg-zinc-700 rounded-full mx-auto mb-4" />

        {/* Destination Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
              <RiNavigationFill size={13} />
              <span>Dropping Off Passenger</span>
            </div>
            <h2 className="text-base font-bold text-zinc-950 dark:text-white font-['Space_Grotesk'] line-clamp-1">
              {rideInfo?.dropoff || "Dropoff Destination"}
            </h2>
          </div>

          <div className="text-right shrink-0">
            <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">Distance</span>
            <p className="text-sm font-bold text-zinc-950 dark:text-white">
              {rideInfo?.distance ? `${rideInfo.distance} km` : "--"}
            </p>
          </div>
        </div>

        {/* Cashfree Settlement & Net Payout Banner */}
        <div className="p-3.5 bg-zinc-50 dark:bg-zinc-950/60 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 rounded-xl">
              <RiWallet3Line size={16} />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Driver Payout (80%)</p>
              <p className="text-sm font-extrabold text-zinc-950 dark:text-white font-['Space_Grotesk']">
                ₹{Number(estimatedEarnings).toFixed(2)}
              </p>
            </div>
          </div>

          {isPaid ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60 px-2.5 py-1 rounded-full">
              <RiCheckDoubleLine size={13} />
              Cashfree Paid
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 px-2.5 py-1 rounded-full">
              <RiShieldCheckLine size={13} />
              Escrow Locked
            </span>
          )}
        </div>

        {/* Complete Ride Trigger */}
        <div className="space-y-2.5">
          <button
            onClick={handleEndRide}
            disabled={isEnding}
            className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold text-sm shadow-xl active:scale-98 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <RiFlagLine size={18} />
            <span>{isEnding ? "Concluding Ride..." : "Arrived at Destination • Complete Ride"}</span>
          </button>

          <button
            onClick={() => setIsCancelModalOpen(true)}
            className="w-full py-2 text-xs font-semibold text-zinc-500 hover:text-red-500 text-center transition-colors"
          >
            Cancel / Abort Ride
          </button>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 w-full max-w-sm shadow-2xl relative animate-in zoom-in-95">
            <div className="text-center mb-5">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-950/50 text-red-600 rounded-2xl mx-auto flex items-center justify-center mb-3">
                <RiAlertLine size={24} />
              </div>
              <h3 className="text-lg font-bold text-zinc-950 dark:text-white font-['Space_Grotesk']">
                Abort Active Ride?
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Are you sure you want to cancel this ride? This will reset your active trip status and return to the Command Center.
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
                <span>{isCancelling ? "Aborting..." : "Confirm Abort"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
