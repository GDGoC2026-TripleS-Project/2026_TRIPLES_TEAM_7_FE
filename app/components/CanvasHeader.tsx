"use client";

import Image from "next/image";
import React from "react";

type TabId = "dashboard" | "interview";

type Props = {
  activeTab: TabId;
  onChangeTab?: (tab: TabId) => void;

  filterIconSrc: string;
  chevronDownSrc: string;
  onClickFilter?: () => void;
};

export default function CanvasHeader({
  activeTab,
  onChangeTab,
  filterIconSrc,
  chevronDownSrc,
  onClickFilter,
}: Props) {
  const TabButton = ({ id, label }: { id: TabId; label: string }) => {
    const isActive = activeTab === id;

    return (
      <button
        type="button"
        onClick={() => onChangeTab?.(id)}
        className={[
          "h-10 rounded-[22px] px-6 text-[14px] font-medium transition",
          isActive
            ? "bg-main text-white shadow-sm"
            : " text-gray-600 hover:text-black",
        ].join(" ")}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="inline-flex items-center gap-3">
      <div className="relative inline-flex items-center gap-2 rounded-[23px] px-1 py-1 shadow-sm">
        {/* 배경(반투명 + blur) */}
        <div className="absolute inset-0 rounded-[23px] bg-white/70 backdrop-blur-md" />
        {/* 내용 */}
        <div className="relative z-10 inline-flex items-center gap-2">
          <TabButton id="dashboard" label="대쉬 보드" />
          <TabButton id="interview" label="면접 시뮬레이션" />
        </div>
      </div>

      {/* 필터 버튼 */}
      <button
        type="button"
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
          <Image src={filterIconSrc} alt="filter" width={18} height={18} />
          <span>필터</span>
          <Image src={chevronDownSrc} alt="open" width={8} height={8} />
        </span>
      </button>
    </div>
  );
}
