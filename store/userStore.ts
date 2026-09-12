import { create } from "zustand";

interface UserStore {
  currency: string;
  setCurrency: (value: string) => void;
  needsOnboarding: boolean | null;
  setNeedsOnboarding: (value: boolean | null) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  currency: "BIRR",
  setCurrency: (value: string) => set({ currency: value }),
  needsOnboarding: null,
  setNeedsOnboarding: (value: boolean | null) =>
    set({ needsOnboarding: value }),
}));
