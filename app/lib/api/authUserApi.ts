/** Authorization + X-USER-ID 요구하는 api용 (추후 삭제) */
"use client";

import { request } from "./client";
import { refreshTokens } from "./auth.api";
import { useAuthStore } from "./auth.store";

type Options = Parameters<typeof request>[1];

function buildHeaders(
  options: Options,
  accessToken?: string | null,
  userId?: number | string | null,
) {
  const headers = new Headers(options?.headers);

  if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);
  if (userId !== null && userId !== undefined)
    headers.set("X-USER-ID", String(userId));

  return headers;
}

let refreshingPromise: Promise<string | null> | null = null;

async function tryRefreshAndUpdateStore() {
  if (refreshingPromise) return refreshingPromise;

  refreshingPromise = (async () => {
    const { refreshToken, setAuth, clearAuth } = useAuthStore.getState();
    if (!refreshToken) throw new Error("No refreshToken");

    console.log("[auth.refresh] start", {
      refreshTokenPreview: `${refreshToken.slice(0, 12)}...${refreshToken.slice(-6)}`,
    });

    try {
      const refreshed = await refreshTokens(refreshToken);

      console.log("[auth.refresh] success", {
        accessTokenPreview: refreshed.accessToken
          ? `${refreshed.accessToken.slice(0, 12)}...${refreshed.accessToken.slice(-6)}`
          : null,
        refreshTokenPreview: refreshed.refreshToken
          ? `${refreshed.refreshToken.slice(0, 12)}...${refreshed.refreshToken.slice(-6)}`
          : null,
      });

      setAuth({
        accessToken: refreshed.accessToken,
        // ✅ rotation 대응: 새 토큰이 오면 반드시 덮어쓰기
        refreshToken: refreshed.refreshToken ?? refreshToken,
      });

      return refreshed.accessToken;
    } catch (e) {
      console.log("[auth.refresh] failed", e);
      clearAuth();
      throw e;
    } finally {
      refreshingPromise = null;
    }
  })();

  return refreshingPromise;
}

/**
 * ✅ Authorization + X-USER-ID 둘 다 자동 세팅 + 401이면 refresh 후 재시도
 * - 기본 userId는 store.user?.id 사용
 * - 필요하면 호출 시 userIdOverride로 덮어쓰기 가능
 */
export const authUserApi = {
  get: async <T>(
    path: string,
    options: Options = {},
    userIdOverride?: number | string,
  ) => {
    const state = useAuthStore.getState();
    const userId = userIdOverride ?? state.user?.id;

    try {
      const headers = buildHeaders(
        { ...options, method: "GET" },
        state.accessToken,
        userId,
      );
      const { data } = await request<T>(path, {
        ...options,
        method: "GET",
        headers,
      });
      return data;
    } catch (e: any) {
      if (e?.status !== 401) throw e;

      const newAccess = await tryRefreshAndUpdateStore();
      const headers = buildHeaders(
        { ...options, method: "GET" },
        newAccess,
        userId,
      );

      const { data } = await request<T>(path, {
        ...options,
        method: "GET",
        headers,
      });
      return data;
    }
  },

  post: async <T>(
    path: string,
    body?: any,
    options: Options = {},
    userIdOverride?: number | string,
  ) => {
    const state = useAuthStore.getState();
    const userId = userIdOverride ?? state.user?.id;

    try {
      const headers = buildHeaders(
        { ...options, method: "POST" },
        state.accessToken,
        userId,
      );
      const { data } = await request<T>(path, {
        ...options,
        method: "POST",
        body,
        headers,
      });
      return data;
    } catch (e: any) {
      if (e?.status !== 401) throw e;

      const newAccess = await tryRefreshAndUpdateStore();
      const headers = buildHeaders(
        { ...options, method: "POST" },
        newAccess,
        userId,
      );

      const { data } = await request<T>(path, {
        ...options,
        method: "POST",
        body,
        headers,
      });
      return data;
    }
  },

  patch: async <T>(
    path: string,
    body?: any,
    options: Options = {},
    userIdOverride?: number | string,
  ) => {
    const state = useAuthStore.getState();
    const userId = userIdOverride ?? state.user?.id;

    try {
      const headers = buildHeaders(
        { ...options, method: "PATCH" },
        state.accessToken,
        userId,
      );
      const { data } = await request<T>(path, {
        ...options,
        method: "PATCH",
        body,
        headers,
      });
      return data;
    } catch (e: any) {
      if (e?.status !== 401) throw e;

      const newAccess = await tryRefreshAndUpdateStore();
      const headers = buildHeaders(
        { ...options, method: "PATCH" },
        newAccess,
        userId,
      );

      const { data } = await request<T>(path, {
        ...options,
        method: "PATCH",
        body,
        headers,
      });
      return data;
    }
  },

  del: async <T>(
    path: string,
    options: Options = {},
    userIdOverride?: number | string,
  ) => {
    const state = useAuthStore.getState();
    const userId = userIdOverride ?? state.user?.id;

    try {
      const headers = buildHeaders(
        { ...options, method: "DELETE" },
        state.accessToken,
        userId,
      );
      const { data } = await request<T>(path, {
        ...options,
        method: "DELETE",
        headers,
      });
      return data;
    } catch (e: any) {
      if (e?.status !== 401) throw e;

      const newAccess = await tryRefreshAndUpdateStore();
      const headers = buildHeaders(
        { ...options, method: "DELETE" },
        newAccess,
        userId,
      );

      const { data } = await request<T>(path, {
        ...options,
        method: "DELETE",
        headers,
      });
      return data;
    }
  },
};
