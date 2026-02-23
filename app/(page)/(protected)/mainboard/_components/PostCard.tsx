"use client";

import React from "react";
import DdayBadge from "@/app/components/common/badge&label/DdayBadge";
import MatchRateBadge from "@/app/components/common/badge&label/MatchRateBadge";
import KeywordLabel, {
  type KeywordLabelVariant,
} from "@/app/components/common/badge&label/KeywordLabel";

export type Match = { status: "pending" } | { status: "done"; rate: number };

export type JobPostCardData = {
  id: string;

  dday: number;
  isClosed?: boolean;
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
  const closed = !!data.isClosed;

  return (
    <article
      data-board-card="true"
      className={[
        "w-70 rounded-[10px] overflow-hidden",
        "shadow-sm",
        "px-3.5 py-3.5",
        closed ? "bg-[#d2d2d2]" : "bg-white",
        className,
      ].join(" ")}
    >
      {/* 상단 뱃지 라인 */}
      <div className="flex items-start justify-between">
        <DdayBadge daysLeft={data.dday} isClosed={closed} />

        {data.match.status === "pending" ? (
          <MatchRateBadge
            status="pending"
            isClosed={closed}
            className="text-[12px]"
          />
        ) : (
          <MatchRateBadge
            status="done"
            rate={data.match.rate}
            isClosed={closed}
            className="text-[12px]"
          />
        )}
      </div>

      {/* 타이틀/메타 */}
      <div className="mt-3">
        <h3
          className={[
            "text-[16px]/[16px] font-semibold",
            closed ? "text-black/80" : "text-black",
          ].join(" ")}
        >
          {data.title}
        </h3>
        <p
          className={[
            "mt-1.5 mb-3 text-[12px]/[12px] font-normal",
            closed ? "text-black/50" : "text-gray-500",
          ].join(" ")}
        >
          {data.meta}
        </p>
      </div>

      {/* 구분선 */}
      <div
        className={[
          "my-2 h-px w-full",
          closed ? "bg-black/10" : "bg-black/5",
        ].join(" ")}
      />

      {/* 설명(2줄) */}
      <div
        className={[
          "text-[14px]/[14px] font-normal",
          closed ? "text-black/55" : "text-gray-600",
        ].join(" ")}
      >
        {data.bullets.map((line, idx) => (
          <p key={idx} className="leading-5">
            {line}
          </p>
        ))}
      </div>

      <div
        className={[
          "my-2 h-px w-full",
          closed ? "bg-black/10" : "bg-black/5",
        ].join(" ")}
      />

      {/* 키워드 라벨 */}
      <div className="mt-3.5 flex flex-wrap gap-2">
        {data.keywords.map((k, idx) => (
          <KeywordLabel
            key={`${k.text}-${idx}`}
            text={k.text}
            variant={k.variant}
            disabled={closed} // ✅ 지원 마감일 때 회색 라벨
          />
        ))}
      </div>
    </article>
  );
}
