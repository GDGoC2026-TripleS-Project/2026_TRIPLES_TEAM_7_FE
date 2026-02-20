"use client";

import React, { useEffect, useMemo } from "react";

import RefreshIcon from "@/public/icons/refresh.svg?react";
import CloseIcon from "@/public/icons/close.svg?react";
import {
  InterviewQuestionSet,
  useCreateInterviewQuestions,
  useInterviewQuestions,
} from "@/app/lib/api/interview.api";

type UiQuestion = {
  id: string;
  tags: string[];
  text: string;
};

type Props = {
  cardId: number;
  x: number;
  y: number;
  onClose: () => void;
};

export default function InterviewQuestionsCard({
  cardId,
  x,
  y,
  onClose,
}: Props) {
  // 먼저 "최근 질문 조회"
  const query = useInterviewQuestions(cardId);

  // 없으면 "생성"
  const create = useCreateInterviewQuestions();

  /**
   * 조회가 실패하면(대부분 404) 자동 생성
   * + 조회는 성공했지만 questions가 비어있으면 생성
   */
  useEffect(() => {
    if (!Number.isFinite(cardId)) return;
    if (query.isLoading) return;
    if (create.isPending) return;

    const questionCount = query.data?.data?.questions?.length ?? 0;

    if (questionCount === 0) {
      create.mutate(cardId);
    }
  }, [cardId, query.isLoading, query.data, create]);

  const isLoading = query.isLoading || create.isPending;

  // ✅ 생성 결과가 있으면 그걸 우선 보여주고, 없으면 조회 결과를 보여줌
  const questionSet: InterviewQuestionSet | null =
    create.data?.data ?? query.data?.data ?? null;

  const questions: UiQuestion[] = useMemo(() => {
    if (!questionSet) return [];

    const sorted = [...(questionSet.questions ?? [])].sort(
      (a, b) => (a.orderNo ?? 0) - (b.orderNo ?? 0),
    );

    return sorted.map((q) => ({
      id: String(q.questionId),
      tags: q.keywords ?? [],
      text: q.questionText,
    }));
  }, [questionSet]);

  const onRefresh = () => {
    if (!Number.isFinite(cardId)) return;
    if (create.isPending) return;
    create.mutate(cardId); // ✅ 새로고침 = 재생성
  };

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
        <div className="text-[16px] font-semibold text-white/90">
          예상 면접 질문
        </div>

        <div className="flex items-center">
          <button
            type="button"
            aria-label="refresh"
            title="새로고침"
            onClick={onRefresh}
            disabled={isLoading}
            className={[iconBtnBase, isLoading ? iconBtnDisabled : ""].join(
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
      <div className="space-y-4 px-5 py-4 min-h-[310px]">
        {isLoading && (
          <div className="rounded-2xl flex justify-center mt-24 bg-white px-4 py-5 text-[16px] text-gray-500">
            질문을 준비 중이에요...
          </div>
        )}

        {!isLoading && questions.length === 0 && (
          <div className="rounded-2xl border border-black/5 bg-white px-4 py-5 text-[14px] text-gray-500">
            아직 질문이 없어요. 새로고침을 눌러 생성해보세요.
          </div>
        )}

        {!isLoading &&
          questions.map((q, idx) => (
            <QuestionItem
              key={q.id}
              idx={idx + 1}
              tags={q.tags}
              text={q.text}
            />
          ))}

        {/* 에러 표시: 조회도 생성도 실패했을 때 */}
        {!isLoading && query.isError && create.isError && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-600">
            질문을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.
          </div>
        )}
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
