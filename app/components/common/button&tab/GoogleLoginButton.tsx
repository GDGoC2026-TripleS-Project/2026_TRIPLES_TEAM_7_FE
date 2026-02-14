"use client";

import { googleLogin } from "@/app/lib/api/auth.api";
import { signInWithGoogleAndGetIdToken } from "@/app/lib/api/googleLoginClient";

export default function GoogleLoginButton() {
  const onClick = async () => {
    try {
      const { idToken } = await signInWithGoogleAndGetIdToken();

      // 서버로 idToken 전달
      const data = await googleLogin(idToken);

      console.log("server login ok:", data);
      alert("구글 로그인 성공!");
      // TODO: data로 유저 상태 저장 / 라우팅
    } catch (e: any) {
      console.error(e);
      alert(e?.message ?? "구글 로그인 실패");
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className="h-12 rounded-xl px-4 bg-black text-white"
    >
      Google로 로그인
    </button>
  );
}
