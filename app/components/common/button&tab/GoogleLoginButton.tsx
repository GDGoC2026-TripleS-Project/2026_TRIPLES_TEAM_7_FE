"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { googleLogin, googleLoginAndStore } from "@/app/lib/api/auth.api";
import { useAuthStore } from "@/app/lib/api/auth.store";
import { signInWithGoogleAndGetIdToken } from "@/app/lib/login-setting/googleLoginClient";
import { useState } from "react";

export default function GoogleLoginButton() {
  const router = useRouter();
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const [loading, setLoading] = useState(false);

  const onClick = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const { idToken } = await signInWithGoogleAndGetIdToken();
      console.log(idToken);
      console.log("firebase idToken exists?", !!idToken, idToken?.slice(0, 20));

      await googleLoginAndStore(idToken);

      const st = useAuthStore.getState();
      console.log("[login] stored?", {
        hasAccessToken: !!st.accessToken,
        hasRefreshToken: !!st.refreshToken,
        user: st.user,
      });

      router.push("/mainboard/dashboard");
    } catch (e: any) {
      console.error(e);

      // ✅ 로그인 실패 시에만 auth 정리 (안전)
      clearAuth();

      alert(e?.message ?? "구글 로그인 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={[
        "w-full",
        "h-[56px] rounded-full",
        "bg-white text-gray-900",
        "flex items-center justify-center gap-3",
        "font-semibold text-[18px]/[18px]",
        "shadow-sm hover:opacity-95 active:scale-[0.99]",
        "transition",
        "disabled:opacity-60 disabled:cursor-not-allowed",
      ].join(" ")}
    >
      <Image src="/logo_G.svg" alt="Google" width={20} height={20} />
      <span>{loading ? "로그인 중..." : "구글 계정으로 로그인 하기"}</span>
    </button>
  );
}
