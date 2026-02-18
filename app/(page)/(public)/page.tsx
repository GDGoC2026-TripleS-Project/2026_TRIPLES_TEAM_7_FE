"use client";

import ButtonRounded from "@/app/components/common/button&tab/ButtonRounded";
import { useRouter } from "next/navigation";
import React from "react";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="bg-landing min-h-screen w-full">
      <div className="mx-auto flex max-w-[1120px] flex-col items-center pt-[200px]">
        <ButtonRounded onClick={() => router.push("/login")}>
          시작하러 가기
        </ButtonRounded>
      </div>
    </div>
  );
}
