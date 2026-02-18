import { request } from "./client";

type PublicOptions = Parameters<typeof request>[1];

export const publicApi = {
  get: <T>(path: string, options: PublicOptions = {}) =>
    request<T>(path, { ...options, method: "GET" }).then((r) => r.data),

  post: <T>(path: string, body?: any, options: PublicOptions = {}) =>
    request<T>(path, { ...options, method: "POST", body }).then((r) => r.data),

  patch: <T>(path: string, body?: any, options: PublicOptions = {}) =>
    request<T>(path, { ...options, method: "PATCH", body }).then((r) => r.data),

  del: <T>(path: string, options: PublicOptions = {}) =>
    request<T>(path, { ...options, method: "DELETE" }).then((r) => r.data),
};
