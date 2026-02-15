"use client";

import Image from "next/image";
import React from "react";
import TabButton, { TabId } from "../common/button&tab/TabButton";

type Props = {
  activeTab: TabId;
  onChangeTab?: (tab: TabId) => void;
  onClickFilter?: () => void;
};

export default function CanvasHeader({
  activeTab,
  onChangeTab,
  onClickFilter,
}: Props) {
  return (
    <div className="inline-flex items-center gap-3">
      <div
        className={[
          "relative inline-flex items-center gap-2 rounded-[36px]",

          // ✅ 유리 베이스(투명 그라데이션)
          "bg-[linear-gradient(0deg,#473f42_0%,#473f42_100&)]",
          // 0deg, var(--click-brown, #473F42) 0%, var(--click-brown, #473F42) 100%)

          // ✅ 블러(강하게)
          "backdrop-blur-[1px]",

          // ✅ 테두리/링
          // "border border-white/35",
          // "ring-1 ring-black/10",

          // ✅ 그림자(과하지 않게)
          "shadow-[0_10px_24px_rgba(0,0,0,0.09)]",

          // ✅ 상단 빛반사(유리 느낌 핵심)
          "before:pointer-events-none before:absolute before:inset-x-100 before:top-2 before:h-6",
          "before:rounded-[28px] before:bg-white/10 before:blur-[1px] before:content-['']",

          // ✅ 내부 하이라이트 라인(입체감)
          // "before:absolute before:inset-0 before:rounded-[26px]",
          // "before:bg-linear-to-b before:from-white/5 before:to-transparent",
          // "before:opacity-100 before:pointer-events-none",
          "after:pointer-events-none after:absolute after:inset-0 after:rounded-[28px]",
          "after:shadow-[inset_0_1px_1px_rgba(255,255,255,0.5)] after:content-['']",
        ].join(" ")}
      >
        <div className="relative inline-flex items-center gap-2">
          <TabButton
            id="dashboard"
            label="대쉬 보드"
            isActive={activeTab === "dashboard"}
            onClick={onChangeTab}
          />
          <TabButton
            id="interview"
            label="면접 시뮬레이션"
            isActive={activeTab === "interview"}
            onClick={onChangeTab}
          />
        </div>
      </div>

      {/* 필터 버튼 */}
      <button
        onClick={onClickFilter}
        className={[
          "relative h-14 rounded-[28px] px-6",
          "inline-flex items-center gap-3",

          "bg-[linear-gradient(180deg,#473f42_0%,#473f42_100&),white]",
          "backdrop-blur-[1px]",
          // "border border-white/35",
          // "ring-1 ring-black/10",
          "shadow-[0_10px_24px_rgba(0,0,0,0.09)]",
          "after:pointer-events-none after:absolute after:inset-0 after:rounded-[28px]",
          "after:shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] after:content-['']",

          "text-[14px] font-medium text-gray-700",
        ].join(" ")}
      >
        <Image src="/icons/filter.svg" alt="filter" width={18} height={18} />
        <span>필터</span>
        <Image src="/icons/arrowdown.svg" alt="open" width={8} height={8} />
      </button>
    </div>
  );
}
