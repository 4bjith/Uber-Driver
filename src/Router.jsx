import { BrowserRouter, Routes, Route } from "react-router-dom";
import DriverDashboard from "./pages/DriverDashboard";

function router() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DriverDashboard />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default router;
