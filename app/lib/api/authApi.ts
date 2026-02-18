"use client";

import { request, getAccessTokenFromHeader } from "./client";
import { refreshTokens } from "./auth.api";
import { useAuthStore } from "./auth.store";

type AuthOptions = Parameters<typeof request>[1];

async function withAuthHeader(options: AuthOptions = {}) {
  const { accessToken } = useAuthStore.getState();

  const headers = new Headers(options.headers);
  if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);

  return { ...options, headers };
}

async function tryRefreshAndUpdateStore() {
  const { refreshToken, setAuth, clearAuth } = useAuthStore.getState();
  if (!refreshToken) throw new Error("No refreshToken");

  const refreshed = await refreshTokens(refreshToken);

  // refreshToken rotation 대응
  setAuth({
    accessToken: refreshed.accessToken,
    refreshToken: refreshed.refreshToken,
  });

  // accessToken이 헤더로만 오는 구조라면 refreshed.accessToken이 null일 수 있음
  // 이 경우 refreshTokens()에서 헤더 파싱이 실패한 것(서버 헤더명/형식 확인 필요)
  return refreshed.accessToken;
}

export const authApi = {
  get: async <T>(path: string, options: AuthOptions = {}) => {
    try {
      const opt = await withAuthHeader({ ...options, method: "GET" });
      const { data } = await request<T>(path, opt);
      return data;
    } catch (e: any) {
      if (e?.status !== 401) throw e;

      // 401이면 refresh 후 재시도
      const newAccess = await tryRefreshAndUpdateStore();
      const headers = new Headers(options.headers);

      if (newAccess) headers.set("Authorization", `Bearer ${newAccess}`);
      const { data } = await request<T>(path, {
        ...options,
        method: "GET",
        headers,
      });
      return data;
    }
  },

  post: async <T>(path: string, body?: any, options: AuthOptions = {}) => {
    try {
      const opt = await withAuthHeader({ ...options, method: "POST", body });
      const { data } = await request<T>(path, opt);
      return data;
    } catch (e: any) {
      if (e?.status !== 401) throw e;

      const newAccess = await tryRefreshAndUpdateStore();
      const headers = new Headers(options.headers);
      if (newAccess) headers.set("Authorization", `Bearer ${newAccess}`);

      const { data } = await request<T>(path, {
        ...options,
        method: "POST",
        body,
        headers,
      });
      return data;
    }
  },

  patch: async <T>(path: string, body?: any, options: AuthOptions = {}) => {
    try {
      const opt = await withAuthHeader({ ...options, method: "PATCH", body });
      const { data } = await request<T>(path, opt);
      return data;
    } catch (e: any) {
      if (e?.status !== 401) throw e;

      const newAccess = await tryRefreshAndUpdateStore();
      const headers = new Headers(options.headers);
      if (newAccess) headers.set("Authorization", `Bearer ${newAccess}`);

      const { data } = await request<T>(path, {
        ...options,
        method: "PATCH",
        body,
        headers,
      });
      return data;
    }
  },

  del: async <T>(path: string, options: AuthOptions = {}) => {
    try {
      const opt = await withAuthHeader({ ...options, method: "DELETE" });
      const { data } = await request<T>(path, opt);
      return data;
    } catch (e: any) {
      if (e?.status !== 401) throw e;

      const newAccess = await tryRefreshAndUpdateStore();
      const headers = new Headers(options.headers);
      if (newAccess) headers.set("Authorization", `Bearer ${newAccess}`);

      const { data } = await request<T>(path, {
        ...options,
        method: "DELETE",
        headers,
      });
      return data;
    }
  },
};
