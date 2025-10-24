// components/CurrentLocationMap.js
import React, { useState, useEffect } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useQuery } from "@tanstack/react-query";
import useDriverStore from "../Zustand/DriverAuth";
import api from "../api/axiosClint";

const CurrentLocationMap = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const token = useDriverStore((state) => state.token);

  const { data } = useQuery({
    queryKey: ["location"],
    queryFn: async () => {
      const response = await api.get("/driver", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
    retry: false,
    enabled: !!token,
  });

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyBnPKTRjRNAcLlyREwkVi2mwLAJtKl7j7M", // 🔒 Replace with your key
  });

  // Set map location once backend data is available
  useEffect(() => {
    if (data?.driver?.location?.coordinates) {
      setLocation({
        lat: data.driver.location.coordinates[1],
        lng: data.driver.location.coordinates[0],
      });
    }
  }, [data]);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <div
      className="w-full h-full min-h-[300px]"
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
            height: "100%",
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
