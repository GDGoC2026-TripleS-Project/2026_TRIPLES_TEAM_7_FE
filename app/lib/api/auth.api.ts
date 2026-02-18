import { request, getAccessTokenFromHeader } from "./client";

export async function googleLogin(idToken: string) {
  const { res, data } = await request<{
    success: boolean;
    message: string;
    refreshToken?: string;
    user?: { email?: string; name?: string };
  }>("/api/auth/googleLogin", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });

  return {
    ...data,
    accessToken: getAccessTokenFromHeader(res),
    refreshToken: data.refreshToken ?? null,
    user: data.user ?? null,
  };
}

export async function refreshTokens(refreshToken: string) {
  const { res, data } = await request<{
    success: boolean;
    message: string;
    refreshToken?: string;
  }>("/api/auth/refresh", {
    method: "POST",
    body: { refreshToken },
  });

  return {
    ...data,
    accessToken: getAccessTokenFromHeader(res),
    refreshToken: data.refreshToken ?? null,
  };
}
