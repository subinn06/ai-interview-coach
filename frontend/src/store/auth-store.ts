import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/features/auth/types/auth.types";

interface AuthState {
  accessToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  setAccessToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  loginSuccess: (token: string, user?: User) => void;
  logout: () => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      isAuthenticated: false,
      setAccessToken: (token) =>
        set({ accessToken: token, isAuthenticated: Boolean(token) }),
      setUser: (user) => set({ user }),
      loginSuccess: (token, user = undefined) =>
        set({ accessToken: token, user: user || null, isAuthenticated: true }),
      logout: () => set({ accessToken: null, user: null, isAuthenticated: false }),
      clear: () => set({ accessToken: null, user: null, isAuthenticated: false }),
    }),
    {
      name: "auth-storage",
    }
  )
);
