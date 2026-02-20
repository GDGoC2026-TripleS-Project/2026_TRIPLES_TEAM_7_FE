"use client";

import { request, getAccessTokenFromHeader } from "./client";
import { useAuthStore } from "./auth.store";

type GoogleLoginResBody = {
  success: boolean;
  message: string;
  refreshToken?: string;
  user?: { id?: number; email?: string; name?: string };
};

type RefreshResBody = {
  success: boolean;
  message: string;
  refreshToken?: string; // rotation일 수 있음
};

/** 1) 구글 로그인: idToken은 Authorization 헤더로 전달 */
export async function googleLogin(idToken: string) {
  const { res, data } = await request<GoogleLoginResBody>(
    "/api/auth/googleLogin",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    },
  );

  const accessToken = getAccessTokenFromHeader(res); // ✅ 응답 헤더에서
  const refreshToken = data.refreshToken ?? null;

  return { ...data, accessToken, refreshToken };
}

export async function refreshTokens(refreshToken: string) {
  const { res, data } = await request<RefreshResBody>("/api/auth/refresh", {
    method: "POST",
    body: { refreshToken },
  });

  const accessToken = getAccessTokenFromHeader(res); // ✅ 응답 헤더에서
  const nextRefreshToken = data.refreshToken ?? null;

  return { ...data, accessToken, refreshToken: nextRefreshToken };
}

/** ✅ 로그인 성공 시 store까지 바로 저장하는 함수 (중요) */
export async function googleLoginAndStore(idToken: string) {
  const result = await googleLogin(idToken);

  console.log("[auth.api] googleLogin result", {
    hasAccessToken: !!result.accessToken,
    hasRefreshToken: !!result.refreshToken,
    accessTokenPreview: result.accessToken
      ? `${result.accessToken.slice(0, 12)}...${result.accessToken.slice(-6)}`
      : null,
    refreshTokenPreview: result.refreshToken
      ? `${result.refreshToken.slice(0, 12)}...${result.refreshToken.slice(-6)}`
      : null,
    userId: result.user?.id ?? null,
  });

  if (!result.refreshToken) {
    console.warn(
      "[auth.api] ⚠️ refreshToken is missing in login response body. Check server response.",
    );
  }

  useAuthStore.getState().setAuth({
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
    user: result.user ?? null,
  });

  return result;
}

/** ✅ refresh 성공 시 store까지 바로 반영 (rotate 대응) */
export async function refreshTokensAndStore() {
  const { refreshToken } = useAuthStore.getState();
  if (!refreshToken) throw new Error("No refreshToken in store");

  const refreshed = await refreshTokens(refreshToken);

  useAuthStore.getState().setAuth({
    accessToken: refreshed.accessToken,
    refreshToken: refreshed.refreshToken ?? refreshToken,
  });

  return refreshed;
}
