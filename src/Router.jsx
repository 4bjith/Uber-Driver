import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashBoard from "./pages/DashBoard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AccountManager from "./pages/AccountManager";
import EditPersonalInfo from "./components/EditPersonalInfo";
import EditVehicleInfo from "./components/EditVehicleInfo";
import ProfileImgUpdateForm from "./pages/ProfileImageUpdateForm";
import io from "socket.io-client";
import { useRef, useState, useEffect } from "react";
import CurrentRide from "./pages/CurrentRide";
import FinalRide from "./pages/FinalRide";
import RideHistory from "./pages/RideHistory";
import useDriverStore from "./Zustand/DriverAuth";
import { ToastContainer, toast } from "react-toastify";

// Sound synthesizer using Web Audio API
const playAlertChime = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.setValueAtTime(1200, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.4, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  } catch (e) {
    // audio block fallback
  }
};

function Router() {
  const [isMsg, setIsMsg] = useState("");
  const socketRef = useRef(null);
  const setSocket = useDriverStore((state) => state.setSocket);

  // Request notification permissions
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // 🔌 Connect to socket server
  useEffect(() => {
    socketRef.current = io("http://localhost:8080", {
      transports: ["websocket", "polling"],
      reconnection: true,
    });

    socketRef.current.on("connect", () => {
      console.log("🚗 Driver connected:", socketRef.current.id);
      setSocket(socketRef.current.id);
    });

    socketRef.current.on("disconnect", () => {
      console.log("🚗 Driver disconnected");
      setSocket(null);
    });

    socketRef.current.on("ride:alert", (m) => {
      setIsMsg(m);
      console.log("🚨 New ride alert received:", m);
      playAlertChime();
      toast.info(`🔔 New Ride Request: Pickup at ${m.pickup || "nearby"}!`);

      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("Voyago — New Ride Request!", {
          body: `Pickup from ${m.pickup} to ${m.dropoff}. Estimated fare: $${m.earnings || 15}`,
        });
      }
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <DashBoard
                socketRef={socketRef}
                Msg={isMsg}
                setIsMsg={setIsMsg}
              />
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/account" element={<AccountManager />} />
          <Route path="/update/personalinfo" element={<EditPersonalInfo />} />
          <Route path="/update/vehicleinfo" element={<EditVehicleInfo />} />
          <Route
            path="/currentride"
            element={<CurrentRide socketRef={socketRef} />}
          />
          <Route
            path="/finalride"
            element={<FinalRide socketRef={socketRef} />}
          />
          <Route path="/trips" element={<RideHistory />} />
          <Route
            path="/update/prfileImage"
            element={<ProfileImgUpdateForm />}
          />
        </Routes>

        <ToastContainer
          position="top-right"
          autoClose={2500}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          draggable
        />
      </BrowserRouter>
    </>
  );
}

export default Router;
