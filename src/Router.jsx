import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashBoard from "./pages/DashBoard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AccountManager from "./pages/AccountManager";
import EditPersonalInfo from "./components/EditPersonalInfo";
import EditVehicleInfo from "./components/EditVehicleInfo";
import ProfileImgUpdateForm from "./pages/ProfileImageUpdateForm";
import CurrentRide from "./pages/CurrentRide";
import FinalRide from "./pages/FinalRide";
import RideHistory from "./pages/RideHistory";
import io from "socket.io-client";
import { useRef, useState, useEffect } from "react";
import useDriverStore from "./Zustand/DriverAuth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider, useTheme } from "./context/ThemeContext";

// Sound synthesizer using Web Audio API for ride alerts
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

function RouterContent() {
  const [isMsg, setIsMsg] = useState(null);
  const socketRef = useRef(null);
  const setSocket = useDriverStore((state) => state.setSocket);
  const token = useDriverStore((state) => state.token);
  const { theme } = useTheme();

  // Request browser notification permissions
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // Connect to backend socket server
  useEffect(() => {
    socketRef.current = io("http://localhost:8080", {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
    });

    socketRef.current.on("connect", () => {
      console.log("🚗 Driver socket connected:", socketRef.current.id);
      setSocket(socketRef.current.id);
    });

    socketRef.current.on("disconnect", () => {
      console.log("🚗 Driver socket disconnected");
      setSocket(null);
    });

    socketRef.current.on("ride:alert", (m) => {
      setIsMsg(m);
      console.log("🚨 New incoming ride alert:", m);
      playAlertChime();
      toast.info(`🔔 New Ride Request from ${m.pickup || "nearby"}!`);

      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("Voyago — New Ride Request!", {
          body: `Pickup: ${m.pickup}\nDropoff: ${m.dropoff}\nNet Driver Payout: ₹${m.earnings || "185.00"}`,
        });
      }
    });

    socketRef.current.on("ride:paid", (payment) => {
      console.log("💳 Cashfree payment settlement received:", payment);
      toast.success(
        `💳 Cashfree Settlement Received! ₹${payment.amount || "0.00"} credited to your account.`
      );
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [setSocket]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={token ? <Navigate to="/dashboard" replace /> : <Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
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
        <Route path="/account" element={<AccountManager />} />
        <Route path="/update/personalinfo" element={<EditPersonalInfo />} />
        <Route path="/update/vehicleinfo" element={<EditVehicleInfo />} />
        <Route path="/update/profileImage" element={<ProfileImgUpdateForm />} />
        <Route path="/update/prfileImage" element={<ProfileImgUpdateForm />} />
        <Route
          path="/currentride"
          element={<CurrentRide socketRef={socketRef} />}
        />
        <Route
          path="/finalride"
          element={<FinalRide socketRef={socketRef} />}
        />
        <Route path="/trips" element={<RideHistory />} />
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme={theme === "dark" ? "dark" : "light"}
      />
    </BrowserRouter>
  );
}

export default function Router() {
  return (
    <ThemeProvider>
      <RouterContent />
    </ThemeProvider>
  );
}
