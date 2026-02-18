"use client";

import GoogleLoginButton from "@/app/components/common/button&tab/GoogleLoginButton";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="bg-auth min-h-screen w-full">
      <div className="mx-auto flex min-h-screen max-w-[1120px] flex-col items-center justify-center px-6">
        <div className="mb-20 flex justify-center">
          <Image
            src="/logo_white.svg"
            alt="Piec"
            width={95}
            height={43}
            priority
          />
        </div>

        <section
          className={[
            "w-full max-w-[720px]",
            "rounded-[28px]",
            "bg-black/35",
            "px-10 py-12",
          ].join(" ")}
        >
          <h1 className="mb-10 text-center text-[24px]/[24px] font-bold text-white">
            로그인
          </h1>

          <GoogleLoginButton />
        </section>
      </div>
    </div>
  );
}
