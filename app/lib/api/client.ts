import axios, { AxiosError, AxiosResponse, Method } from "axios";

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(status: number, message: string, data?: any) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export function getAccessTokenFromHeader(res: any) {
  const headers = res?.headers ?? {};

  const raw =
    headers["authorization"] ||
    headers["Authorization"] ||
    headers["access-token"] ||
    headers["Access-Token"] ||
    headers["x-access-token"] ||
    headers["X-Access-Token"];

  if (!raw) return null;

  const val = Array.isArray(raw) ? raw[0] : String(raw);
  return val.toLowerCase().startsWith("bearer ") ? val.slice(7) : val;
}

export type RequestOptions = {
  method?: Method | string;
  headers?: HeadersInit;
  body?: any;
  params?: Record<string, any>;
  parseAs?: "json" | "text" | "blob" | "none";
  signal?: AbortSignal;
  withCredentials?: boolean;
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

// 공통 axios 인스턴스
const http = axios.create({
  baseURL: API_BASE,
  withCredentials: false,
});

function normalizeHeaders(input?: HeadersInit) {
  if (!input) return {} as Record<string, string>;

  if (typeof Headers !== "undefined" && input instanceof Headers) {
    return Object.fromEntries(input.entries());
  }

  if (Array.isArray(input)) {
    return Object.fromEntries(input);
  }

  return { ...(input as Record<string, string>) };
}

export async function request<T = any>(
  path: string,
  options: RequestOptions = {},
) {
  const {
    body,
    headers,
    params,
    parseAs = "json",
    method = "GET",
    signal,
    withCredentials,
  } = options;

  const finalHeaders = normalizeHeaders(headers);

  const isFormData =
    typeof FormData !== "undefined" && body instanceof FormData;
  const hasBody = body !== undefined && body !== null;

  // FormData면 Content-Type 지정 금지
  if (!isFormData) {
    const hasContentType =
      !!finalHeaders["Content-Type"] || !!finalHeaders["content-type"];

    if (!hasContentType && hasBody) {
      finalHeaders["Content-Type"] = "application/json";
    }
  }

  console.log("[client.request] REQUEST →", {
    path,
    method,
    headers: finalHeaders,
    params: params ?? null,
    body: hasBody ? (isFormData ? "(FormData)" : body) : null,
  });

  try {
    const res: AxiosResponse = await http.request({
      url: path,
      method: method as Method,
      headers: finalHeaders,
      params,
      data: hasBody ? body : undefined,
      signal,
      withCredentials: withCredentials ?? false,
      responseType:
        parseAs === "blob" ? "blob" : parseAs === "text" ? "text" : "json",
    });

    console.log("[client.request] RESPONSE ←", {
      path,
      status: res.status,
      authorization:
        res.headers?.authorization ?? res.headers?.Authorization ?? null,
      data: res.data,
    });

    const data = (res.data ?? {}) as T;
    return { res, data };
  } catch (err) {
    const e = err as AxiosError<any>;

    const status = e.response?.status ?? 0;
    const data = e.response?.data ?? null;

    console.log("[client.request] ERROR ←", {
      path,
      status,
      data,
    });

    const message =
      (data && (data.message || data.error)) ||
      e.message ||
      `Request failed: ${status}`;

    throw new ApiError(status, message, data);
  }
}
