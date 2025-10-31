// Import necessary libraries
import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import io from "socket.io-client";

import useDriverStore from "../Zustand/DriverAuth";

const carIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/744/744465.png",
  iconSize: [28, 35],
  iconAnchor: [22, 94],
});

// 🔑 Simple JWt decoder (client side)
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
    console.log("Error decoding JWT: ", err);
    return null;
  }
};

// ================================================
// ✅ Component: Recenter Map on Current Location
// ================================================
function RecenterMapOnCurrentLocation({ location }) {
  const map = useMap();

  useEffect(() => {
    if (location) {
      map.setView(location, map.getZoom(), { animate: true });
    }
  }, [location, map]);

  return null;
}

// ================================================
// ✅ Component: CurrentLocationMap
// ================================================
function CurrentLocationMap() {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const socketRef = useRef(null);
  const [driverEmail, setDriverEmail] = useState(null);

  // 🧠 Access token from Zustand store
  const token = useDriverStore((state) => state.token);

  // ✉️ Decode token to get email
  useEffect(() => {
    if (token) {
      const decoded = decodeJWT(token);
      if (decoded?.email) {
        setDriverEmail(decoded.email);
        console.log("👨‍✈️ Driver email:", decoded.email);
      } else {
        console.warn("No email found in token");
      }
    } else {
      console.warn("No token found");
    }
  }, [token]);

  // 🔌 Connect to soket server
  useEffect(() => {
    socketRef.current = io("http://localhost:8080", {
      transports: ["websocket"],
    });

    socketRef.current.on("connect", () => {
      console.log("🚗 Client connected:", socketRef.current.id);
    });

    socketRef.current.on("disconnect", () => {
      console.log("🚗 Client disconnected");
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

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

        // ✅ Emit driver email + location to socket
        if (socketRef.current && socketRef.current.connected && driverEmail) {
          socketRef.current.emit("driver:location:update", {
            email: driverEmail,
            coordinates: coords, // also rename key to match backend
          });
        }
      },
      (err) => {
        console.error(err);
        setError("Unable to retrive your loction");
      },
      { enableHighAccuracy: true }
    );
    return () => navigator.geolocation.clearWatch(watcher);
  }, [driverEmail]);

  return (
    <div className="w-full h-full">
      {error && (
        <p className="text-red-500 text-center py-4 font-medium">{error}</p>
      )}

      {!location && !error && (
        <p className="text-gray-500 text-center py-4 font-medium">
          Loading your location...
        </p>
      )}

      {location && (
        <MapContainer
          center={location}
          zoom={13}
          scrollWheelZoom={true}
          style={{ width: "100%", height: "100%", borderRadius: "1rem" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          />
          <Marker position={location} icon={carIcon}>
            <Popup>You are here</Popup>
          </Marker>
          <RecenterMapOnCurrentLocation location={location} />
        </MapContainer>
      )}
    </div>
  );
}

export default CurrentLocationMap;
