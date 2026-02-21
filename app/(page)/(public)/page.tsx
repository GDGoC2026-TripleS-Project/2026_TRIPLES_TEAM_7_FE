"use client";

import ButtonRounded from "@/app/components/common/button&tab/ButtonRounded";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="bg-landing min-h-screen w-full">
      <div className="mx-auto flex max-w-[1120px] flex-col items-center px-6 pt-[120px] md:pt-[140px]">
        <div className="mb-5">
          <Image
            src="/logo_main.svg"
            alt="PIEC"
            width={59}
            height={34}
            priority
          />
        </div>

        <p className="text-center text-[14px] font-medium text-gray-600">
          지원 공고에 맞춰 당신의 경험을 정리하는 새로운 방법
        </p>

        <div className="mt-14 flex flex-col items-center gap-8">
          <h1 className="text-center text-[44px] font-extrabold leading-[1.15] tracking-[-0.02em] text-black ">
            <span>당신의 </span>
            <span className="relative inline-block">
              <span className="relative z-10 px-5 py-5 text-[#E46B6B]">
                이력서
              </span>
              <span
                aria-hidden
                className="absolute inset-0 -z-0 rounded-[14px] bg-[#F7DADA]"
              />
            </span>
            <span> 를</span>
          </h1>

          <h1 className="text-center text-[44px] font-extrabold leading-[1.15] tracking-[-0.02em] text-black ">
            <span>공고 기준으로 </span>
            <span className="relative inline-block">
              <span className="relative z-10 px-5 py-5 text-[#5AB99C]">
                다시 보다
              </span>
              <span
                aria-hidden
                className="absolute inset-0 -z-0 rounded-[14px] bg-[#D9F5EC]"
              />
            </span>
          </h1>
        </div>

        <div className="mt-10 md:mt-20">
          <ButtonRounded
            className="w-[150px] h-[50px]"
            onClick={() => router.push("/login")}
          >
            시작하러 가기
          </ButtonRounded>
        </div>
      </div>
    </div>
  );
}
