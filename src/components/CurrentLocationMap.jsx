import React, { useEffect, useState, useMemo } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import useDriverStore from "../Zustand/DriverAuth";
import { useTheme } from "../context/ThemeContext";
import { RiNavigationFill, RiCrosshair2Line, RiCompass3Line } from "react-icons/ri";

// Custom driver car SVG icon
const createCarIcon = (isDark) =>
  L.divIcon({
    className: "custom-driver-pin",
    html: `
      <div style="position: relative; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;">
        <div style="position: absolute; width: 44px; height: 44px; border-radius: 9999px; background: ${
          isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)"
        }; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
        <div style="width: 34px; height: 34px; border-radius: 9999px; background: ${
          isDark ? "#ffffff" : "#09090b"
        }; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 14px rgba(0,0,0,0.3); border: 2px solid ${
      isDark ? "#09090b" : "#ffffff"
    };">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${
            isDark ? "#09090b" : "#ffffff"
          }" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
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

const decodeJWT = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (err) {
    console.error("Error decoding JWT: ", err);
    return null;
  }
};

function RecenterMapOnCurrentLocation({ location, trigger }) {
  const map = useMap();

  useEffect(() => {
    if (location) {
      map.flyTo(location, 15, { duration: 1.2 });
    }
  }, [location, trigger, map]);

  return null;
}

function CurrentLocationMap({ socketRef }) {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [driverEmail, setDriverEmail] = useState(null);
  const [recenterCount, setRecenterCount] = useState(0);

  const { theme } = useTheme();
  const isDark = theme === "dark";
  const token = useDriverStore((state) => state.token);
  const driver = useDriverStore((state) => state.driver);

  useEffect(() => {
    if (token) {
      const decoded = decodeJWT(token);
      if (decoded?.email) {
        setDriverEmail(decoded.email);
      }
    }
  }, [token]);

  // Watch and send live location
  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    const watcher = navigator.geolocation.watchPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setLocation([coords.lat, coords.lng]);
        setError(null);

        // Emit driver email + location to socket
        if (socketRef?.current?.connected && (driverEmail || driver?.email)) {
          socketRef.current.emit("driver:location:update", {
            socketid: socketRef.current.id,
            email: driverEmail || driver?.email,
            coordinates: coords,
          });
        }
      },
      (err) => {
        console.error("Geolocation error:", err);
        setError("Unable to retrieve precise GPS location. Please allow location access.");
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 }
    );

    return () => navigator.geolocation.clearWatch(watcher);
  }, [driverEmail, driver, socketRef]);

  const carIcon = useMemo(() => createCarIcon(isDark), [isDark]);

  return (
    <div className={`w-full h-full relative rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 ${isDark ? "map-dark-filter" : ""}`}>
      {error && (
        <div className="absolute top-4 left-4 right-4 z-20 bg-red-500/90 backdrop-blur-md text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-lg text-center">
          {error}
        </div>
      )}

      {!location && !error && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-zinc-100/90 dark:bg-zinc-900/90 backdrop-blur-sm">
          <div className="w-10 h-10 border-2 border-zinc-300 dark:border-zinc-700 border-t-zinc-950 dark:border-t-white rounded-full animate-spin mb-3" />
          <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
            Acquiring high-accuracy GPS telemetry...
          </p>
        </div>
      )}

      {location && (
        <>
          <MapContainer
            center={location}
            zoom={15}
            scrollWheelZoom={true}
            zoomControl={false}
            style={{ width: "100%", height: "100%", zIndex: 5 }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              maxZoom={19}
            />
            <Marker position={location} icon={carIcon}>
              <Popup className="custom-popup">
                <div className="p-1 text-xs">
                  <p className="font-bold text-zinc-950">Your Vehicle Position</p>
                  <p className="text-zinc-500">Live GPS Broadcast Active</p>
                </div>
              </Popup>
            </Marker>
            <RecenterMapOnCurrentLocation location={location} trigger={recenterCount} />
          </MapContainer>

          {/* Floating Controls */}
          <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-2">
            <button
              onClick={() => setRecenterCount((c) => c + 1)}
              title="Recenter Map on Vehicle"
              className="p-3 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800 hover:scale-105 active:scale-95 transition-all"
            >
              <RiCrosshair2Line size={20} />
            </button>
          </div>

          {/* Coordinates HUD Badge */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-zinc-200/80 dark:border-zinc-800 shadow-sm text-[11px] font-mono font-medium text-zinc-700 dark:text-zinc-300 pointer-events-none">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>
              GPS: {location[0].toFixed(4)}, {location[1].toFixed(4)}
            </span>
          </div>
        </>
      )}
    </div>
  );
}

export default CurrentLocationMap;
