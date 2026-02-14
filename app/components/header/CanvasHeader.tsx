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
      <div className="relative inline-flex items-center gap-2 rounded-[23px] px-1 py-1 shadow-sm">
        {/* 배경(반투명 + blur) */}
        <div className="absolute inset-0 rounded-[23px] bg-white/70 backdrop-blur-md" />
        {/* 내용 */}
        <div className="relative z-10 inline-flex items-center gap-2">
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
          "relative h-12 rounded-full px-5",
          "inline-flex items-center gap-3",
          "shadow-sm",
          "text-[14px] font-medium text-gray-600",
        ].join(" ")}
      >
        {/* 배경(반투명 + blur) */}
        <div className="absolute inset-0 rounded-full bg-white/70 backdrop-blur-md" />
        {/* 내용 */}
        <span className="relative z-10 inline-flex items-center gap-3">
          <Image src="/icons/filter.svg" alt="filter" width={18} height={18} />
          <span>필터</span>
          <Image src="/icons/arrowdown.svg" alt="open" width={8} height={8} />
        </span>
      </button>
    </div>
  );
}
