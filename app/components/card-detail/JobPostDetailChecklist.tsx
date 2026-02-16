"use client";

import React from "react";
import type { JobPostCardData } from "@/app/(page)/mainboard/_components/PostCard";
import ChecklistDetailToggle from "./ChecklistDetailToggle";
import Image from "next/image";
import MatchRateBadge from "../common/badge&label/MatchRateBadge";

export default function JobPostDetailChecklist({
  job,
}: {
  job: JobPostCardData;
}) {
  const rate = job.match.status === "done" ? job.match.rate : 0;

  return (
    <div className="space-y-4">
      {/* ✅ 상단: title / meta / rate */}
      <section className="space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="truncate text-[18px] font-semibold text-gray-900">
              {job.title}
            </h2>
            <p className="mt-1 text-[12px] text-gray-400">{job.meta}</p>
          </div>

          <div className="shrink-0">
            {job.match.status === "pending" ? (
              <MatchRateBadge status="pending" />
            ) : (
              <MatchRateBadge status="done" rate={job.match.rate} />
            )}
          </div>
        </div>
      </section>

      {/* ✅ 설명 문구 (컴포넌트 내부에 직접 구현) */}
      <section className="flex items-start gap-2 text-[14px] leading-5 text-gray-400">
        {/* 아이콘은 추후 이미지로 교체 예정이면 여기만 바꾸면 됨 */}
        {/* 임시 아이콘 */}
        <Image src="/icons/des_ai.svg" alt="ai" width={25} height={25} />

        <p>
          AI가 보완이 필요한 항목을 바탕으로 준비할 일을 정리했어요.
          <br />이 활동들을 준비하면 공고의 합격률이 더 올라갈 거예요.
        </p>
      </section>

      {/* ✅ 토글 모음 컴포넌트 */}
      <ChecklistDetailToggle />
    </div>
  );
}
