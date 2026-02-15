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
        "w-70 rounded-[10px] bg-white",
        "shadow-sm",
        "px-3.5 py-3.5",
        className,
      ].join(" ")}
    >
      {/* 상단 뱃지 라인 */}
      <div className="flex items-start justify-between">
        <DdayBadge daysLeft={data.dday} />

        {data.match.status === "pending" ? (
          <MatchRateBadge status="pending" className="text-[12px]" />
        ) : (
          <MatchRateBadge
            status="done"
            rate={data.match.rate}
            className="text-[12px]"
          />
        )}
      </div>

      {/* 타이틀/메타 */}
      <div className="mt-3">
        <h3 className="text-[16px]/[16px] font-semibold">{data.title}</h3>
        <p className="mt-1.5 mb-3 text-[12px]/[12px] font-normal text-gray-500">
          {data.meta}
        </p>
      </div>

      {/* 구분선 */}
      <div className="my-2 h-px w-full bg-black/5" />

      {/* 설명(2줄) */}
      <div className="text-[14px]/[14px] font-normal text-gray-600">
        {data.bullets.map((line, idx) => (
          <p key={idx} className="leading-5">
            {line}
          </p>
        ))}
      </div>

      <div className="my-2 h-px w-full bg-black/5" />

      {/* 키워드 라벨 */}
      <div className="mt-3.5 flex flex-wrap gap-2">
        {data.keywords.map((k, idx) => (
          <KeywordLabel
            key={`${k.text}-${idx}`}
            text={k.text}
            variant={k.variant}
          />
        ))}
      </div>
    </article>
  );
}
