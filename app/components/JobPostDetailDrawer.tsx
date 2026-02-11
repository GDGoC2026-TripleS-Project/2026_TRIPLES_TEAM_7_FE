// app/components/JobPostDetailDrawer.tsx
"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";

import DdayBadge from "@/app/components/DdayBadge";
import MatchRateBadge from "@/app/components/MatchRateBadge";
import KeywordLabel from "@/app/components/KeywordLabel";
import { JobPostCardData } from "./PostCard";

type TabId = "info" | "match" | "checklist";

type Props = {
  open: boolean;
  onClose: () => void;
  job: JobPostCardData | null;
};

export default function JobPostDetailDrawer({ open, onClose, job }: Props) {
  const [tab, setTab] = useState<TabId>("info");

  const title = job?.title ?? "";
  const meta = job?.meta ?? "";
  const bullets = job?.bullets ?? [];

  const conditions = useMemo(() => {
    if (!job) return null;
    return {
      required: job.keywords
        .filter((k) => k.variant === "blue")
        .map((k) => k.text),
      preferred: ["Java", "Spring", "RDB 경험"],
      career: ["신입", "경력 무관"],
    };
  }, [job]);

  if (!job) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className={[
          "fixed inset-0 z-[90] transition-opacity duration-200",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        ].join(" ")}
        onMouseDown={onClose}
      >
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* Drawer */}
      <aside
        className={[
          "fixed top-4 bottom-4 right-4 z-[100]",
          "w-[520px] max-w-[calc(100vw-32px)]",
          "rounded-2xl bg-white shadow-2xl",
          "transition-transform duration-200 ease-out",
          open ? "translate-x-0" : "translate-x-[110%]",
          "overflow-hidden",
        ].join(" ")}
        onMouseDown={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5">
          <div className="inline-flex items-center gap-2 text-[14px] font-semibold text-gray-700">
            {/* 체크박스 자리(이미지로 교체 가능) */}
            <span className="inline-flex h-4 w-4 rounded-[4px] border border-gray-300" />
            <span>상세페이지</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-2 py-1 text-gray-500 hover:text-gray-800"
            aria-label="닫기"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="mt-3 px-5">
          <div className="flex items-center justify-between text-[13px] font-semibold text-gray-400">
            <TabButton id="info" active={tab} onClick={setTab} label="정보" />
            <TabButton
              id="match"
              active={tab}
              onClick={setTab}
              label="나의 매치율"
            />
            <TabButton
              id="checklist"
              active={tab}
              onClick={setTab}
              label="체크리스트"
            />
          </div>
          <div className="mt-2 h-px w-full bg-black/5" />
        </div>

        {/* Body (scroll) */}
        <div className="h-[calc(100%-110px)] overflow-y-auto px-5 pb-10 pt-5">
          {tab === "info" && (
            <div>
              {/* Top badges */}
              <div className="flex items-start justify-between gap-4">
                <DdayBadge
                  daysLeft={job.dday ?? 0}
                  className="h-8 px-4 text-[16px] font-bold"
                />

                {job.match.status === "pending" ? (
                  <MatchRateBadge
                    status="pending"
                    className="h-8 px-4 text-[12px]"
                  />
                ) : (
                  <MatchRateBadge
                    status="done"
                    rate={job.match.rate}
                    className="h-8 px-4 text-[12px]"
                  />
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
                <Image
                  src="/icons/des_ai.svg"
                  alt="ai"
                  width={16}
                  height={16}
                />
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
              <div className="text-[13px] font-semibold text-gray-500">
                조건
              </div>

              <div className="mt-4 space-y-4">
                {/* 필수 */}
                <ConditionRow
                  iconSrc="/icons/need.svg"
                  label="필수"
                  chips={(
                    conditions?.required ?? ["Java", "Spring", "RDB 경험"]
                  ).map((t) => ({
                    text: t,
                    variant: "blue" as const,
                  }))}
                />
                {/* 우대 */}
                <ConditionRow
                  iconSrc="/icons/treatment.svg"
                  label="우대"
                  chips={(
                    conditions?.preferred ?? ["Java", "Spring", "RDB 경험"]
                  ).map((t) => ({
                    text: t,
                    variant: "yellow" as const,
                  }))}
                />
                {/* 경력 */}
                <ConditionRow
                  iconSrc="/icons/career.svg"
                  label="경력"
                  chips={(conditions?.career ?? ["신입", "경력 무관"]).map(
                    (t) => ({
                      text: t,
                      variant: "gray" as const,
                    }),
                  )}
                />
              </div>

              <div className="my-6 h-px w-full bg-black/5" />

              {/* 세부정보 (예시) */}
              <div className="text-[13px] font-semibold text-gray-500">
                세부 정보
              </div>

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
          )}

          {tab === "match" && (
            <div className="text-sm text-gray-600">
              (예시) 나의 매치율 탭 내용
            </div>
          )}

          {tab === "checklist" && (
            <div className="text-sm text-gray-600">
              (예시) 체크리스트 탭 내용
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

function TabButton({
  id,
  active,
  label,
  onClick,
}: {
  id: TabId;
  active: TabId;
  label: string;
  onClick: (t: TabId) => void;
}) {
  const isActive = active === id;
  return (
    <button
      type="button"
      onClick={() => onClick(id)}
      className={[
        "relative flex-1 py-2 text-center",
        isActive ? "text-gray-900" : "text-gray-400",
      ].join(" ")}
    >
      {label}
      {isActive && (
        <span className="absolute left-0 right-0 -bottom-[1px] mx-auto h-[2px] w-[60%] bg-gray-900" />
      )}
    </button>
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
