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

export function getAccessTokenFromHeader(res: Response) {
  const raw =
    res.headers.get("authorization") || res.headers.get("Authorization");
  if (!raw) return null;
  return raw.toLowerCase().startsWith("bearer ") ? raw.slice(7) : raw;
}

type RequestOptions = Omit<RequestInit, "body"> & {
  // JSON이면 object 넣고, 파일 업로드면 FormData 넣기
  body?: any;
  // JSON이 아닐 수 있는 경우를 위해 옵션 제공
  parseAs?: "json" | "text" | "blob" | "none";
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export async function request<T = any>(
  path: string,
  options: RequestOptions = {},
) {
  const { body, headers, parseAs = "json", ...init } = options;

  const finalHeaders = new Headers(headers);

  const isFormData =
    typeof FormData !== "undefined" && body instanceof FormData;
  const hasBody = body !== undefined && body !== null;

  // FormData면 Content-Type 설정 금지(브라우저가 boundary 포함해서 자동 설정)
  if (!isFormData) {
    if (!finalHeaders.has("Content-Type") && hasBody) {
      finalHeaders.set("Content-Type", "application/json");
    }
  }

  console.log("REQUEST →", path, {
    method: init.method,
    headers: Object.fromEntries(finalHeaders.entries()),
    body: hasBody ? (isFormData ? body : JSON.stringify(body)) : null,
  });

  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: finalHeaders,
    body: hasBody ? (isFormData ? body : JSON.stringify(body)) : undefined,
  });

  // 응답 파싱(에러 메시지에도 사용)
  let data: any = null;
  try {
    if (parseAs === "json") data = await res.json();
    else if (parseAs === "text") data = await res.text();
    else if (parseAs === "blob") data = await res.blob();
    else data = null;
  } catch {
    data = null;
  }

  if (!res.ok) {
    const message =
      (data && (data.message || data.error)) || `Request failed: ${res.status}`;
    throw new ApiError(res.status, message, data);
  }

  return { res, data: data as T };
}
