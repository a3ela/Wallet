import { create } from "zustand";

interface userStore {
  currency: string;
  setCurrency: (value: string) => void;
  needsOnboarding: boolean | null;
  setNeedsOnboarding: (value: boolean | null) => void;
}

export const useUserStore = create<userStore>((set) => ({
  currency: "BIRR",
  setCurrency: (value) => set({ currency: value }),
  needsOnboarding: null,
  setNeedsOnboarding: (value) => set({ needsOnboarding: value }),
}));
