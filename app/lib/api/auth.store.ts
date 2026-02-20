"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthUser = {
  id?: number;
  email?: string;
  name?: string;
};

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  user: AuthUser | null;

  hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;

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

      hasHydrated: false,
      setHasHydrated: (v) => {
        console.log("[auth.store] setHasHydrated()", v);
        set({ hasHydrated: v });
      },

      setAuth: ({ accessToken, refreshToken, user }) =>
        set((prev) => {
          const next = {
            accessToken: accessToken ?? prev.accessToken,
            refreshToken: refreshToken ?? prev.refreshToken,
            user: user ?? prev.user,
          };

          console.log("[auth.store] setAuth()", {
            prev: {
              hasAccessToken: !!prev.accessToken,
              hasRefreshToken: !!prev.refreshToken,
              userId: prev.user?.id ?? null,
            },
            payload: {
              hasAccessToken:
                accessToken !== undefined ? !!accessToken : "(keep)",
              hasRefreshToken:
                refreshToken !== undefined ? !!refreshToken : "(keep)",
              userId: user?.id ?? "(keep)",
            },
            next: {
              hasAccessToken: !!next.accessToken,
              hasRefreshToken: !!next.refreshToken,
              userId: next.user?.id ?? null,
            },
            accessTokenPreview: next.accessToken
              ? `${next.accessToken.slice(0, 12)}...${next.accessToken.slice(-6)}`
              : null,
            refreshTokenPreview: next.refreshToken
              ? `${next.refreshToken.slice(0, 12)}...${next.refreshToken.slice(-6)}`
              : null,
          });

          return next;
        }),

      clearAuth: () => {
        console.log("[auth.store] clearAuth()");
        set({ accessToken: null, refreshToken: null, user: null });
      },
    }),
    {
      name: "piec-auth",
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
      }),

      onRehydrateStorage: () => (state, error) => {
        if (error) console.log("[auth.store] rehydrate error", error);
        state?.setHasHydrated(true);
      },
    },
  ),
);
