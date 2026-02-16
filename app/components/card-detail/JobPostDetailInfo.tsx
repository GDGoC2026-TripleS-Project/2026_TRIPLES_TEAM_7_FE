"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import { JobPostCardData } from "@/app/(page)/(protected)/mainboard/_components/PostCard";
import DdayBadge from "../common/badge&label/DdayBadge";
import MatchRateBadge from "../common/badge&label/MatchRateBadge";
import KeywordLabel from "../common/badge&label/KeywordLabel";

export default function JobPostDetailInfo({ job }: { job: JobPostCardData }) {
  const title = job.title ?? "";
  const meta = job.meta ?? "";
  const bullets = job.bullets ?? [];

  const conditions = useMemo(() => {
    return {
      required: job.keywords
        .filter((k) => k.variant === "blue")
        .map((k) => k.text),
      preferred: ["Java", "Spring", "RDB 경험"],
      career: ["신입", "경력 무관"],
    };
  }, [job]);

  return (
    <div>
      {/* Top badges */}
      <div className="flex items-start justify-between gap-4">
        <DdayBadge daysLeft={job.dday ?? 0} />

        {job.match.status === "pending" ? (
          <MatchRateBadge status="pending" />
        ) : (
          <MatchRateBadge status="done" rate={job.match.rate} />
        )}
      </div>

      {/* Title/meta */}
      <div className="mt-4">
        <h3 className="text-[20px] font-bold text-black">{title}</h3>
        <p className="mt-1 text-[13px] text-gray-500">{meta}</p>
      </div>

      <div className="my-5 h-px w-full bg-black/5" />

      {/* AI 분석 */}
      <div className="flex items-center gap-2 text-[13px] font-semibold text-gray-500">
        <Image src="/icons/des_ai.svg" alt="ai" width={16} height={16} />
        <span>AI 분석</span>
      </div>
      <div className="mt-3 space-y-1 text-[15px] text-gray-800">
        {bullets.map((line, idx) => (
          <p key={idx} className="leading-6">
            {line}
          </p>
        ))}
      </div>

      <div className="my-6 h-px w-full bg-black/5" />

      {/* 조건 */}
      <div className="text-[13px] font-semibold text-gray-500">조건</div>

      <div className="mt-4 space-y-4">
        <ConditionRow
          iconSrc="/icons/need.svg"
          label="필수"
          chips={(conditions.required.length
            ? conditions.required
            : ["Java"]
          ).map((t) => ({ text: t, variant: "blue" as const }))}
        />
        <ConditionRow
          iconSrc="/icons/treatment.svg"
          label="우대"
          chips={conditions.preferred.map((t) => ({
            text: t,
            variant: "yellow" as const,
          }))}
        />
        <ConditionRow
          iconSrc="/icons/career.svg"
          label="경력"
          chips={conditions.career.map((t) => ({
            text: t,
            variant: "gray" as const,
          }))}
        />
      </div>

      <div className="my-6 h-px w-full bg-black/5" />

      {/* 세부정보 (예시) */}
      <div className="text-[13px] font-semibold text-gray-500">세부 정보</div>

      <div className="mt-4 space-y-4 text-[13px] text-gray-800">
        <DetailRow
          iconSrc="/icons/pay.svg"
          label="연봉"
          value="2000만원 · 협상 가능"
        />
        <DetailRow
          iconSrc="/icons/working.svg"
          label="출근"
          value="주 5일 (월,화,수,목,금)"
        />
        <DetailRow
          iconSrc="/icons/location.svg"
          label="주소"
          value="서울특별시 성동구 성수이로 24길 32, 7층 (성수동2가)"
        />
        <DetailRow
          iconSrc="/icons/linkurl.svg"
          label="링크"
          value="https://linkareer.com"
          link
        />
      </div>
    </div>
  );
}

function ConditionRow({
  iconSrc,
  label,
  chips,
}: {
  iconSrc: string;
  label: string;
  chips: Array<{ text: string; variant: "blue" | "yellow" | "gray" }>;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex w-[68px] items-center gap-2 text-[13px] text-gray-600">
        <Image src={iconSrc} alt={label} width={16} height={16} />
        <span className="font-semibold">{label}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {chips.map((c, idx) => (
          <KeywordLabel
            key={`${c.text}-${idx}`}
            text={c.text}
            variant={c.variant}
            className="h-7 px-3 text-[13px]"
          />
        ))}
      </div>
    </div>
  );
}

function DetailRow({
  iconSrc,
  label,
  value,
  link,
}: {
  iconSrc: string;
  label: string;
  value: string;
  link?: boolean;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex w-[60px] items-center gap-2 text-gray-600">
        <Image src={iconSrc} alt={label} width={16} height={16} />
        <span className="text-[13px] font-semibold">{label}</span>
      </div>
      {link ? (
        <a
          className="text-[13px] font-semibold text-gray-900 underline"
          href={value}
          target="_blank"
          rel="noreferrer"
        >
          {value}
        </a>
      ) : (
        <div className="text-[13px] font-medium text-gray-900">{value}</div>
      )}
    </div>
  );
}
