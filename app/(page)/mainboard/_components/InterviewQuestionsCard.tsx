"use client";

import React from "react";

import RefreshIcon from "@/public/icons/refresh.svg?react";
import CloseIcon from "@/public/icons/close.svg?react";

type Question = {
  id: string;
  tags: string[];
  text: string;
};

type Props = {
  x: number;
  y: number;

  onClose: () => void;
  onRefresh?: () => void;

  questions?: Question[];
};

const MOCK_QUESTIONS: Question[] = [
  {
    id: "q1",
    tags: ["TypeScript", "기술 역량 연결"],
    text: "TypeScript를 사용하면서 JavaScript 대비 어떤 장점을 느꼈나요? 실제 적용 사례를 설명해주세요.",
  },
  {
    id: "q2",
    tags: ["테스트", "실무 경험"],
    text: "테스트 코드를 작성해본 경험이 있나요? 품질이나 협업에 어떤 도움이 되었는지 말해주세요.",
  },
  {
    id: "q3",
    tags: ["문제 해결", "성장성 연결"],
    text: "최근 부족하다고 느낀 역량을 어떻게 보완하려고 노력했나요?",
  },
];

export default function InterviewQuestionsCard({
  x,
  y,
  onClose,
  onRefresh,
  questions = MOCK_QUESTIONS,
}: Props) {
  const iconBtnBase = [
    "h-10 w-10 rounded-2xl",
    "inline-flex items-center justify-center",
    "transition",
    "active:bg-main-click",
    // 색상은 text로 컨트롤 -> svg stroke가 currentColor 따라가게
    "text-gray-500 hover:text-gray-700 active:text-gray-500",
    // ✅ svg 내부 path에 stroke-current 강제
    "[&_svg_path]:stroke-current",
  ].join(" ");

  const iconBtnDisabled =
    "opacity-40 cursor-not-allowed hover:bg-transparent active:bg-transparent";

  return (
    <div
      // onPointerDown={(e) => e.stopPropagation()}
      // ✅ 바깥 클릭 닫기 예외 판단용
      data-interview-panel="true"
      className={[
        "absolute z-[70]", // ✅ 선택카드보다 위
        "w-130 overflow-hidden rounded-2xl bg-white shadow-2xl",
      ].join(" ")}
      style={{ left: x, top: y }}
    >
      {/* 헤더 */}
      <div className="flex items-center justify-between bg-[#2B272B] px-5 py-4">
        <div className="text-[14px] font-semibold text-white/90">
          예상 면접 질문
        </div>

        <div className="flex items-center">
          <button
            type="button"
            aria-label="refresh"
            title="새로고침"
            onClick={onRefresh}
            disabled={!onRefresh}
            className={[iconBtnBase, !onRefresh ? iconBtnDisabled : ""].join(
              " ",
            )}
          >
            <RefreshIcon className="" />
          </button>

          <button
            type="button"
            aria-label="close"
            title="닫기"
            onClick={onClose}
            className={iconBtnBase}
          >
            <CloseIcon className="" />
          </button>
        </div>
      </div>

      {/* 본문 */}
      <div className="space-y-4 px-5 py-4">
        {questions.map((q, idx) => (
          <QuestionItem key={q.id} idx={idx + 1} tags={q.tags} text={q.text} />
        ))}
      </div>
    </div>
  );
}

function QuestionItem({
  idx,
  tags,
  text,
}: {
  idx: number;
  tags: string[];
  text: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        {tags.map((t) => (
          <span
            key={t}
            className="rounded-full bg-gray-100 px-3 py-1 text-[12px] font-semibold text-gray-600"
          >
            {t}
          </span>
        ))}
      </div>

      <div className="text-[14px] leading-6 text-gray-900">
        <span className="font-semibold">{idx}. </span>
        {text}
      </div>
    </div>
  );
}
