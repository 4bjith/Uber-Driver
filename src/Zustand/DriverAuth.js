import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useDriverStore = create(
  persist(
    (set) => ({
      token: null,
      driver: null,
      rideId: null,
      socket: null,

      setToken: (newToken) => set({ token: newToken }),
      setDriver: (newDriver) => set({ driver: newDriver }),
      setRideId: (newRide) => set({ rideId: newRide }),
      setSocket: (newSocket) => set({ socket: newSocket }),

      // Clear all driver state on logout
      logout: () => set({ token: null, driver: null, rideId: null, socket: null }),
    }),
    {
      name: "driver-storage", // localStorage key
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useDriverStore;

