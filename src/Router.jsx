import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashBoard from "./pages/DashBoard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AccountManager from "./pages/AccountManager";
import EditPersonalInfo from "./components/EditPersonalInfo";
import EditVehicleInfo from "./components/EditVehicleInfo";
import ProfileImgUpdateForm from "./pages/ProfileImageUpdateForm";

function router() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<DashBoard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/account" element={<AccountManager />} />
          <Route path="/update/personalinfo" element={<EditPersonalInfo />} />
          <Route path="/update/vehicleinfo" element={<EditVehicleInfo />} />
          <Route path="/update/prfileImage" element={<ProfileImgUpdateForm />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default router;
