import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import DashBoard from "./pages/DashBoard";
import Router from "./Router";
import { ToastContainer } from "react-toastify";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Router />
      <ToastContainer />
    </QueryClientProvider>
  </StrictMode>
);
