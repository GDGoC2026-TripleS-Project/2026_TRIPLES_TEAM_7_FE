"use client";

import { refreshTokens } from "./auth.api";
import { useAuthStore } from "./auth.store";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

type AuthFetchInit = RequestInit & {
  auth?: boolean; // 기본 true로 취급
};

export async function authFetch(input: string, init: AuthFetchInit = {}) {
  const { accessToken, refreshToken, setAuth, clearAuth } =
    useAuthStore.getState();

  const doFetch = (token: string | null) => {
    const headers = new Headers(init.headers);
    headers.set(
      "Content-Type",
      headers.get("Content-Type") ?? "application/json",
    );

    if (init.auth !== false && token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return fetch(`${API_BASE}${input}`, {
      ...init,
      headers,
      credentials: "include",
    });
  };

  // 1) 1차 요청
  let res = await doFetch(accessToken);

  // 2) 만료(401)면 refresh 시도
  if (res.status === 401 && refreshToken) {
    try {
      const refreshed = await refreshTokens(refreshToken);

      if (refreshed.accessToken || refreshed.refreshToken) {
        setAuth({
          accessToken: refreshed.accessToken,
          refreshToken: refreshed.refreshToken,
        });
      }

      // 3) 갱신 토큰으로 재시도
      res = await doFetch(refreshed.accessToken ?? accessToken);
    } catch (e) {
      clearAuth();
      throw e;
    }
  }

  return res;
}
