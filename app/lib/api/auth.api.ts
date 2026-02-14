export async function googleLogin(idToken: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/googleLogin`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // ✅ 서버가 refreshToken 등을 쿠키로 주는 구조면 필수
      body: JSON.stringify({ idToken }),
    },
  );

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`googleLogin failed: ${res.status} ${text}`);
  }

  // swagger 예시: { success, message, idToken, user:{email,name}}
  return res.json() as Promise<{
    success: boolean;
    message: string;
    idToken: string; // (주의) 여기 idToken은 서버에서 다시 주는 토큰일 수도 있어 네이밍 정리 권장
    user: { email: string; name: string };
  }>;
}
