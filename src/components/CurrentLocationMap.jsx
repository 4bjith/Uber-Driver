// components/CurrentLocationMap.js
import React, { useState, useEffect } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const CurrentLocationMap = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyBhxEt5g6ZwXLjydOl5GXJMv_x5dcRmnCo", // 🔒 Replace with your actual key
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (err) => {
          setError("Unable to retrieve location");
          console.error(err);
        }
      );
    } else {
      setError("Geolocation not supported");
    }
  }, []);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <div
      className="w-full h-full min-h-[300px]" // ✅ responsive height
      style={{
        position: "relative",
        borderRadius: "12px",
        overflow: "hidden",
      }}
    >
      {error && <p className="text-red-500 text-center">{error}</p>}
      {location ? (
        <GoogleMap
          mapContainerStyle={{
            width: "100%",
            height: "100%", // ✅ fills parent div
          }}
          center={location}
          zoom={15}
        >
          <Marker position={location} />
        </GoogleMap>
      ) : (
        <p className="text-center">Fetching current location...</p>
      )}
    </div>
  );
};

export default CurrentLocationMap;
