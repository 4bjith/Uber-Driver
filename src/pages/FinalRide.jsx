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
import { use, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

// Default marker icons
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import api from "../api/axiosClint";
const defaultIcon = L.icon({ iconUrl, shadowUrl: iconShadow });
L.Marker.prototype.options.icon = defaultIcon;


const carIcon = new L.Icon({
  iconUrl:
    "https://png.pngtree.com/png-vector/20221117/ourmid/pngtree-map-pinpoint-with-car-inside-color-icon-marker-pointer-isolated-vector-png-image_41730976.jpg",
  iconSize: [35, 35],
  iconAnchor: [25, 55],
});

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

// Haversine distance calculator (in meters)
const calculateDistance = (coord1, coord2) => {
    if (!coord1 || !coord2) return;
    const toRad = (deg) => (deg * Math.PI) / 180;
    const R = 6371; // km
    const dLat = toRad(coord2.lat - coord1.lat);
    const dLng = toRad(coord2.lng - coord1.lng);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(coord1.lat)) *
        Math.cos(toRad(coord2.lat)) *
        Math.sin(dLng / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(2);
  };

export default function FinalRide({socketRef}) {
    const [currentLocation, setCurrentLocation] = useState(null);
    const [destination, setDestination] = useState(null);
    const [route, setRoute] = useState([]);
    const location = useLocation();
    const rideId = new URLSearchParams(location.search).get("id");
    const navigate = useNavigate()

    useEffect(() => {
        if (navigator.geolocation) {
            const watchId = navigator.geolocation.watchPosition((position) => {
                const { latitude, longitude } = position.coords;
                setCurrentLocation({ lat: latitude, lng: longitude });
            });
            return () => navigator.geolocation.clearWatch(watchId);
        }
    }, []);

    // Route drawing
  const getRoute = async () => {
    if (!currentLocation || !destination) return;

    try {
      const apiKey =
        "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6ImM2OTg1ZDk4ZjVkNTQxMWU5OTAzZjVmMGNjMjZlYWIxIiwiaCI6Im11cm11cjY0In0=";
      const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${currentLocation.lng},${currentLocation.lat}&end=${destination.lng},${destination.lat}&geometries=geojson`;

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
  }, [currentLocation, destination]);

  

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

  useEffect(() => {
  if (rideInfo?.dropoffCoordinates?.coordinates) {
    const [lat, lng] = rideInfo.dropoffCoordinates.coordinates;
    setDestination({ lat, lng });
  }
}, [rideInfo]);

useEffect(() => {
    if (!rideId || !destination || !currentLocation) return;
  socketRef.current?.emit("driver:ridestart", { rideId, destination ,currentLocation });
}, [rideId, socketRef, destination, currentLocation]);
  

const handleEndRide = async () => {
  if (!currentLocation || !destination) return;

  const distance = calculateDistance(currentLocation, destination);
  toast.success(`Ride Ended! Total Distance: ${distance} km`);

  try {
    const { data } = await api.put("/ride/end", { rideId });
    console.log(data);
    if (data){
      toast.info("You have reached your destination!");
      navigate("/dashboard")
    }
    
  } catch (err) {
    console.error(err);
    toast.error("Failed to end ride");
  }

  console.log("Ride Ended", distance);
};


  const center = currentLocation
    ? [currentLocation.lat, currentLocation.lng]
    : [20.5937, 78.9629];
    
  return (
    <div className="w-full h-screen relative">
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {/* <FitBounds points={[currentLocation, destination].filter(Boolean)} /> */}
        {currentLocation && (
          <Marker position={[currentLocation.lat, currentLocation.lng]} icon={carIcon}>
            <Popup>Your Current Location</Popup>
          </Marker>
        )}  
        {destination && (
          <Marker position={[destination.lat, destination.lng]}>
            <Popup>Destination</Popup>
          </Marker>
        )}  
        {route.length > 0 && <Polyline positions={route} weight={5} color="blue" />}
      </MapContainer>
        <div className="absolute z-999 bottom-8 left-1/2 transform -translate-x-1/2 bg-white p-4 rounded-lg shadow-lg">   
        <button onClick={handleEndRide}>End Ride</button>   
        </div>
    </div>
  )
}
