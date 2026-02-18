"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthUser = {
  email?: string;
  name?: string;
};

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  user: AuthUser | null;

  setAuth: (payload: {
    accessToken?: string | null;
    refreshToken?: string | null;
    user?: AuthUser | null;
  }) => void;

  clearAuth: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,

      setAuth: ({ accessToken, refreshToken, user }) =>
        set((prev) => ({
          accessToken: accessToken ?? prev.accessToken,
          refreshToken: refreshToken ?? prev.refreshToken,
          user: user ?? prev.user,
        })),

      clearAuth: () =>
        set({ accessToken: null, refreshToken: null, user: null }),
    }),
    {
      name: "piec-auth", // localStorage key
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
      }),
    },
  ),
);
