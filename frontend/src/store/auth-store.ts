import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
}

interface AuthState {
  accessToken: string | null;
  user: UserProfile | null;
  setAccessToken: (token: string | null) => void;
  setUser: (user: UserProfile | null) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // seed with a default mock token
      accessToken: "mock-foundation-sprint-token",
      user: {
        id: "mock-id",
        email: "candidate@example.com",
        full_name: "Mock Candidate"
      },
      setAccessToken: (token) => set({ accessToken: token }),
      setUser: (user) => set({ user }),
      clear: () => set({ accessToken: null, user: null }),
    }),
    {
      name: "auth-storage", // key name in localStorage
    }
  )
);
