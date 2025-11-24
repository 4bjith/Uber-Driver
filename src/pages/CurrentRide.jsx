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
    if (!socketRef.current) return;

    socketRef.current.on("user:location", (data) => {
      if (!data) return;
      setUserLocation({ lat: data.lat, lng: data.lng });
    });
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
    <div className="w-screen h-80vh flex flex-col bg-gray-50">
      <MapContainer
        center={center}
        zoom={15}
        style={{ height: "80vh", width: "100vw" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <FitBounds points={[driverLocation, userLocation].filter(Boolean)} />

        {driverLocation && (
          <Marker
            position={[driverLocation.lat, driverLocation.lng]}
            icon={carIcon}
          >
            <Popup>You (Driver)</Popup>
          </Marker>
        )}

        {userLocation && (
          <Marker
            position={[userLocation.lat, userLocation.lng]}
            icon={userIcon}
          >
            <Popup>User</Popup>
          </Marker>
        )}

        {route.length > 0 && (
          <Polyline positions={route} color="blue" weight={5} opacity={0.7} />
        )}
      </MapContainer>

      {/* FOOTER SECTION */}
      <div className="h-20 flex justify-evenly items-center bg-green-900 text-yellow-400">
        {isOtp ? (
          <div>
            <input
              type="text"
              placeholder="otp"
              ref={otp}
              className="bg-gray-300 rounded-lg py-1.5 px-2 text-black"
            />{" "}
            <button onClick={()=>{
              if(rideInfo?.otp === otp.current.value){
                toast.success("OTP Verified. Ride Started!");
                navigate(`/finalride?id=${rideId}`);
                setIsOtp(false);
              } else{
                toast.error("Invalid OTP. Please try again.");
              }
            }} className="bg-gray-300 p-1.5">✔️</button>{" "}
          </div>
        ) : (
          <button
            className="px-3 py-1.5 bg-orange-500 rounded-lg cursor-pointer"
            onClick={() => setIsOtp(true)}
          >
            Arrived 🚦
          </button>
        )}

        <p>Distance: {rideInfo?.distance ?? "..."} km</p>
        <p>User Name: {rideInfo?.passenger?.name ?? "..."}</p>
      </div>
    </div>
  );
}
