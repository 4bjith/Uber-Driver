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
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

// Default marker icons
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import api from "../api/axiosClint";
import useDriverStore from "../Zustand/DriverAuth";
const defaultIcon = L.icon({ iconUrl, shadowUrl: iconShadow });
L.Marker.prototype.options.icon = defaultIcon;

// Icons
const carIcon = new L.Icon({
  iconUrl:
    "https://images.vexels.com/media/users/3/127711/isolated/preview/384e0b3361d99d9c370b4037115324b9-flat-vintage-car-icon.png",
  iconSize: [35, 35],
  iconAnchor: [25, 55],
});

const userIcon = new L.Icon({
  iconUrl:
    "https://www.nicepng.com/png/full/128-1280406_view-user-icon-png-user-circle-icon-png.png",
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

// FitBounds
function FitBounds({ points }) {
  const map = useMap();

  useEffect(() => {
    const valid = points
      .filter((p) => p?.lat && p?.lng)
      .map((p) => [p.lat, p.lng]);

    if (valid.length >= 2) {
      map.fitBounds(L.latLngBounds(valid), { padding: [50, 50] });
    }
  }, [points]);

  return null;
}

export default function DriverCurrentRide({ socketRef, driverEmail }) {
  const [driverLocation, setDriverLocation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [route, setRoute] = useState([]);
  const [isOtp, setIsOtp] = useState(false);
  const location = useLocation();
  const rideId = new URLSearchParams(location.search).get("id");
  const otp = useRef();
  const navigate = useNavigate();
  const socket = useDriverStore((state) => state.socket)

  // Driver GPS
  useEffect(() => {
    if (!navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };

        setDriverLocation(coords);

        if (socketRef.current) {
          socketRef.current.emit("driver:location:update", {
            email: driverEmail,
            coordinates: coords,
            socketid: socketRef.current.id,
          });
        }
      },
      (err) => console.error(err),
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // Receive user location
  useEffect(() => {
    if (!socketRef.current || !socket) return;

    if (socketRef.current) {
      socketRef.current.on("user:location", (data) => {
        if (!data) return;
        setUserLocation({ lat: data.lat, lng: data.lng });
      });
    } else {
      socket.on("user:location", (data) => {
        if (!data) return;
        setUserLocation({ lat: data.lat, lng: data.lng });
      });
    }
  }, []);

  // Route drawing
  const getRoute = async () => {
    if (!driverLocation || !userLocation) return;

    try {
      const apiKey =
        "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6ImM2OTg1ZDk4ZjVkNTQxMWU5OTAzZjVmMGNjMjZlYWIxIiwiaCI6Im11cm11cjY0In0=";
      const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${driverLocation.lng},${driverLocation.lat}&end=${userLocation.lng},${userLocation.lat}&geometries=geojson`;

      const res = await fetch(url);
      const data = await res.json();

      if (!data.features) return;

      setRoute(
        data.features[0].geometry.coordinates.map((c) => ({
          lat: c[1],
          lng: c[0],
        }))
      );
    } catch (e) {
      console.error(e);
      toast.error("Route fetch failed");
    }
  };

  useEffect(() => {
    getRoute();
  }, [driverLocation, userLocation]);

  const center = driverLocation
    ? [driverLocation.lat, driverLocation.lng]
    : [20.5937, 78.9629];

  // 🔥 FETCH POPULATED RIDE DATA (driverId + userId)
  const { data: rideInfo } = useQuery({
    queryKey: ["rideinfo", rideId],
    queryFn: async () => {
      const res = await api.get("/ride/info", {
        params: { rideId },
      });
      return res.data.data; // { message, data: ride }
    },
    enabled: !!rideId,
  });

  // Log populated data
  console.log("Ride Info:", rideInfo);
  console.log("User:", rideInfo?.userId);
  console.log("Driver:", rideInfo?.driverId);

  return (
    <div className="w-full h-screen flex flex-col relative overflow-hidden bg-gray-100">
      {/* Map takes full height */}
      <div className="absolute inset-0 z-0">
        <MapContainer
          center={center}
          zoom={15}
          style={{ height: "100%", width: "100%" }}
          zoomControl={false}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <FitBounds points={[driverLocation, userLocation].filter(Boolean)} />

          {driverLocation && (
            <Marker position={[driverLocation.lat, driverLocation.lng]} icon={carIcon}>
              <Popup>You (Driver)</Popup>
            </Marker>
          )}

          {userLocation && (
            <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
              <Popup>Passenger</Popup>
            </Marker>
          )}

          {route.length > 0 && (
            <Polyline positions={route} color="black" weight={4} opacity={0.8} />
          )}
        </MapContainer>
      </div>

      {/* Floating Bottom Panel */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-white rounded-t-3xl shadow-[0_-5px_20px_rgba(0,0,0,0.1)] p-6 animate-slide-up">
        {/* Drag handle visual */}
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6"></div>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{rideInfo?.passenger?.name || "Passenger"}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
                Running
              </span>
              <span className="text-gray-500 text-sm">{rideInfo?.distance ? `${rideInfo.distance} km total` : "Calculating..."}</span>
            </div>
          </div>

          {/* Call Button (Mock) */}
          <button className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-200">
            📞
          </button>
        </div>

        <hr className="border-gray-100 mb-6" />

        {/* Action Section */}
        <div className="space-y-4">
          {!isOtp ? (
            <button
              onClick={() => setIsOtp(true)}
              className="w-full py-4 bg-black text-white rounded-xl text-lg font-semibold shadow-lg hover:bg-gray-800 transition-transform active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Arrived at Pickup</span>
              <span>📍</span>
            </button>
          ) : (
            <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4">
              <label className="text-sm font-medium text-gray-600 ml-1">Enter Passenger OTP</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength="4"
                  placeholder="0 0 0 0"
                  ref={otp}
                  className="flex-1 bg-gray-100 border-2 border-transparent focus:border-black rounded-xl text-center text-2xl font-bold tracking-widest py-3 outline-none transition-colors"
                  inputMode="numeric"
                />
                <button
                  onClick={() => {
                    if (rideInfo?.otp === otp.current.value) {
                      toast.success("OTP Verified. Starting Ride...");
                      navigate(`/finalride?id=${rideId}`);
                      setIsOtp(false);
                    } else {
                      toast.error("Invalid OTP. Ask passenger for code.");
                    }
                  }}
                  className="bg-black text-white px-6 rounded-xl font-bold text-xl hover:bg-gray-800 transition-colors"
                >
                  GO
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
