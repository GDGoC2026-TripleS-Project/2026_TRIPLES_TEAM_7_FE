"use client";

import { request, RequestOptions } from "./client";
import { refreshTokens } from "./auth.api";
import { useAuthStore } from "./auth.store";

type AuthOptions = RequestOptions; // RequestOptions | undefined

function mergeHeaderObject(
  base?: AuthOptions extends undefined ? never : AuthOptions["headers"],
  extra?: Record<string, string>,
) {
  const obj: Record<string, string> = {};

  // base -> obj
  if (base) {
    if (typeof Headers !== "undefined" && base instanceof Headers) {
      base.forEach((v, k) => (obj[k] = v));
    } else if (Array.isArray(base)) {
      base.forEach(([k, v]) => (obj[k] = v));
    } else {
      Object.assign(obj, base as Record<string, string>);
    }
  }

  // extra -> obj
  if (extra) Object.assign(obj, extra);

  return obj;
}

async function withAuthHeader(options: AuthOptions = {}) {
  const { accessToken } = useAuthStore.getState();

  const headers = mergeHeaderObject(options.headers, {
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  });

  console.log("[authApi] attach Authorization?", {
    hasAccessToken: !!accessToken,
    Authorization: headers.Authorization ? "Bearer ***" : null,
  });

  return { ...options, headers };
}

let refreshingPromise: Promise<string | null> | null = null;

async function tryRefreshAndUpdateStore() {
  if (refreshingPromise) return refreshingPromise;

  refreshingPromise = (async () => {
    const { refreshToken, setAuth, clearAuth } = useAuthStore.getState();
    if (!refreshToken) throw new Error("No refreshToken");

    try {
      const refreshed = await refreshTokens(refreshToken);

      setAuth({
        accessToken: refreshed.accessToken,
        refreshToken: refreshed.refreshToken ?? refreshToken,
      });

      return refreshed.accessToken;
    } catch (e) {
      clearAuth();
      throw e;
    } finally {
      refreshingPromise = null;
    }
  })();

  return refreshingPromise;
}

async function retryWithNewAccess<T>(
  path: string,
  options: AuthOptions,
  method: "GET" | "POST" | "PATCH" | "DELETE",
  body?: any,
) {
  const newAccess = await tryRefreshAndUpdateStore();
  const headers = mergeHeaderObject(options.headers, {
    ...(newAccess ? { Authorization: `Bearer ${newAccess}` } : {}),
  });

  return request<T>(path, { ...options, method, headers, body });
}

export const authApi = {
  get: async <T>(path: string, options: AuthOptions = {}) => {
    try {
      const opt = await withAuthHeader({ ...options, method: "GET" });
      const { data } = await request<T>(path, opt);
      return data;
    } catch (e: any) {
      if (e?.status !== 401) throw e;
      const { data } = await retryWithNewAccess<T>(path, options, "GET");
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
      const { data } = await retryWithNewAccess<T>(path, options, "POST", body);
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
      const { data } = await retryWithNewAccess<T>(
        path,
        options,
        "PATCH",
        body,
      );
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
      const { data } = await retryWithNewAccess<T>(path, options, "DELETE");
      return data;
    }
  },
};
