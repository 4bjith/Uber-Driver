import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashBoard from "./pages/DashBoard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AccountManager from "./pages/AccountManager";
import EditPersonalInfo from "./components/EditPersonalInfo";
import EditVehicleInfo from "./components/EditVehicleInfo";
import ProfileImgUpdateForm from "./pages/ProfileImageUpdateForm";
import io from "socket.io-client";
import { useRef, useState } from "react";
import { useEffect } from "react";
import CurrentRide from "./pages/CurrentRide";
import FinalRide from "./pages/FinalRide";
import RideHistory from "./pages/RideHistory";

function router() {
  const [isMsg, setIsMsg] = useState("");
  const socketRef = useRef(null);
  // 🔌 Connect to socket server
  useEffect(() => {
    socketRef.current = io("http://localhost:8080");

    socketRef.current.on("connect", () => {
      console.log("🚗 Client connected:", socketRef.current.id);
    });

    socketRef.current.on("disconnect", () => {
      console.log("🚗 Client disconnected");
    });

    socketRef.current.on("ride:alert", (m) => {
      setIsMsg(m)
      console.log("🚨 New ride alert received:", m);
      alert("New ride available!");
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<DashBoard socketRef={socketRef} Msg={isMsg} setIsMsg={setIsMsg}/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/account" element={<AccountManager />} />
          <Route path="/update/personalinfo" element={<EditPersonalInfo />} />
          <Route path="/update/vehicleinfo" element={<EditVehicleInfo />} />
          <Route path="/currentride" element={<CurrentRide socketRef={socketRef} />} />
          <Route path="/finalride" element={<FinalRide socketRef={socketRef} />} /> 
          <Route path="/trips" element={<RideHistory />} />
          <Route
            path="/update/prfileImage"
            element={<ProfileImgUpdateForm />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default router;
