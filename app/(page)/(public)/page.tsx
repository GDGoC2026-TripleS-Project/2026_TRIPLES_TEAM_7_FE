"use client";

import ButtonRounded from "@/app/components/common/button&tab/ButtonRounded";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

export default function LandingPage() {
  const router = useRouter();

  const puzzleHeightClass = "h-[clamp(140px,25vh,420px)]";

  return (
    <div className="bg-landing relative min-h-screen w-full overflow-hidden">
      {/* 본문이 하단 퍼즐에 안 가리도록 padding-bottom을 퍼즐 높이만큼 */}
      <div className={`relative z-10 pb-[clamp(140px,18vh,220px)]`}>
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

          <p className="text-center text-[16px]/[16px] font-medium text-gray-600">
            지원 공고에 맞춰 당신의 경험을 정리하는 새로운 방법
          </p>

          <div className="mt-14 flex flex-col items-center text-[40px]/[51.2px] font-bold gap-8">
            <h1 className="text-center leading-[1.15] tracking-[-0.02em] text-black">
              <span>당신의 </span>
              <span className="relative inline-block align-middle px-9 py-3 mx-1">
                <Image
                  src="/puzzle_red.svg"
                  alt=""
                  fill
                  priority
                  className="pointer-events-none select-none object-contain"
                />
                <span className="relative z-10 text-[#E46B6B]">이력서</span>
              </span>
              <span> 를</span>
            </h1>

            <h1 className="text-center leading-[1.15] tracking-[-0.02em] text-black">
              <span>공고 기준으로 </span>
              <span className="relative inline-block align-middle px-9 py-3">
                <Image
                  src="/puzzle_mint.svg"
                  alt=""
                  fill
                  priority
                  className="pointer-events-none select-none object-contain"
                />
                <span className="relative z-10 px-6 py-3 text-[#5AB99C]">
                  다시 보다
                </span>
              </span>
            </h1>
          </div>

          <div className="mt-16">
            <ButtonRounded
              className="w-[160px] h-[50px] flex gap-1"
              onClick={() => router.push("/login")}
            >
              시작하러 가기
              <Image
                src="/icons/arrow_external.svg"
                alt="화살표"
                width={25}
                height={25}
              />
            </ButtonRounded>
          </div>
        </div>
      </div>

      {/* 하단 퍼즐: 화면 너비 꽉 채우고(끊김 없이), 확대/축소에도 자연스럽게 */}
      <div
        className={[
          "pointer-events-none select-none",
          "absolute inset-x-0 bottom-0",
          puzzleHeightClass,
          "z-0",
        ].join(" ")}
      >
        <Image
          src="/bglanding_puzzles.svg"
          alt=""
          fill
          priority
          sizes="100vw"
          // object-cover: 가로는 무조건 꽉, 세로는 잘릴 수 있으나(끊김 방지 목적)
          // object-top: 상단 기준으로 잘리게(퍼즐 윗라인 유지)
          className="object-cover object-top"
        />
      </div>
    </div>
  );
}
