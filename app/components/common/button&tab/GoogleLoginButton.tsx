"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { googleLogin } from "@/app/lib/api/auth.api";
import { useAuthStore } from "@/app/lib/api/auth.store";
import { signInWithGoogleAndGetIdToken } from "@/app/lib/login-setting/googleLoginClient";

export default function GoogleLoginButton() {
  const router = useRouter();
  const setAuth = useAuthStore((s: any) => s.setAuth);

  const onClick = async () => {
    try {
      const { idToken, user } = await signInWithGoogleAndGetIdToken();
      console.log("firebase idToken exists?", !!idToken, idToken?.slice(0, 20));
      const data = await googleLogin(idToken);

      setAuth({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        user: data.user ?? {
          email: user.email ?? undefined,
          name: user.displayName ?? undefined,
        },
      });

      router.push("/mainboard/dashboard");
    } catch (e: any) {
      console.error(e);
      alert(e?.message ?? "구글 로그인 실패");
    }
  };

  return (
    <button
      onClick={onClick}
      className={[
        "w-full",
        "h-[56px] rounded-full",
        "bg-white text-gray-900",
        "flex items-center justify-center gap-3",
        "font-semibold text-[18px]/[18px]",
        "shadow-sm hover:opacity-95 active:scale-[0.99]",
        "transition",
      ].join(" ")}
    >
      <Image src="/logo_G.svg" alt="Google" width={20} height={20} />
      <span>구글 계정으로 로그인 하기</span>
    </button>
  );
}
