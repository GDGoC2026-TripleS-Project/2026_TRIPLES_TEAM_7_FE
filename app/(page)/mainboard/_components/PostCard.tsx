"use client";

import React from "react";
import DdayBadge from "@/app/components/common/badge&label/DdayBadge";
import MatchRateBadge from "@/app/components/common/badge&label/MatchRateBadge";
import KeywordLabel, {
  type KeywordLabelVariant,
} from "@/app/components/common/badge&label/KeywordLabel";

type Match = { status: "pending" } | { status: "done"; rate: number };

export type JobPostCardData = {
  id: string;

  dday: number;
  match: Match;

  title: string;
  meta: string; // 예: "네이버랩스 · 인턴 / 계약직"

  bullets: string[]; // 2줄 정도
  keywords: Array<{ text: string; variant: KeywordLabelVariant }>;
};

type Props = {
  data: JobPostCardData;
  className?: string;
};

export default function JobPostCard({ data, className = "" }: Props) {
  return (
    <article
      className={[
        "w-[410px] rounded-2xl bg-white",
        "border border-black/5 shadow-sm",
        "px-6 py-5",
        className,
      ].join(" ")}
    >
      {/* 상단 뱃지 라인 */}
      <div className="flex items-start justify-between gap-4">
        <DdayBadge
          daysLeft={data.dday}
          className="h-8 px-4 text-[16px] font-bold"
        />

        {data.match.status === "pending" ? (
          <MatchRateBadge status="pending" className="h-8 px-4 text-[12px]" />
        ) : (
          <MatchRateBadge
            status="done"
            rate={data.match.rate}
            className="h-8 px-4 text-[12px]"
          />
        )}
      </div>

      {/* 타이틀/메타 */}
      <div className="mt-4">
        <h3 className="text-[16px] font-bold text-black">{data.title}</h3>
        <p className="mt-1 text-[13px] text-gray-500">{data.meta}</p>
      </div>

      {/* 구분선 */}
      <div className="my-4 h-px w-full bg-black/5" />

      {/* 설명(2줄) */}
      <div className="space-y-1 text-[15px] text-gray-700">
        {data.bullets.map((line, idx) => (
          <p key={idx} className="leading-6">
            {line}
          </p>
        ))}
      </div>

      {/* 키워드 라벨 */}
      <div className="mt-5 flex flex-wrap gap-2">
        {data.keywords.map((k, idx) => (
          <KeywordLabel
            key={`${k.text}-${idx}`}
            text={k.text}
            variant={k.variant}
            className="h-8 px-4 text-[14px]"
          />
        ))}
      </div>
    </article>
  );
}
