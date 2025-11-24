import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useDriverStore = create(
  persist(
    (set) => ({
      token: null,
      driver: null,
      rideId: null,
      // ✅ Correct: accepts a new token and saves it
      setToken: (newToken) => set({ token: newToken }),

      setDriver: (newDriver) => set({ driver: newDriver }),

      setRideId: (newRide) => set({rideId: newRide}),

      // ✅ Clear token on logout
      logout: () => set({ token: null }),
    }),
    {
      name: "driver-storage", // localStorage key
      storage: createJSONStorage(() => localStorage),
    }
  )
);
export default useDriverStore;
