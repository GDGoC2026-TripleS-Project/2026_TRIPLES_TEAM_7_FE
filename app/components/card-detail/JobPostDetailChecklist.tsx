"use client";

import React, { useMemo, useState } from "react";
import type { JobPostCardData } from "@/app/(page)/(protected)/mainboard/_components/PostCard";
import ChecklistDetailToggle from "./ChecklistDetailToggle";
import Image from "next/image";
import MatchRateBadge from "../common/badge&label/MatchRateBadge";
import {
  useChecklistByMatchIdData,
  useToggleChecklist,
} from "@/app/lib/api/checklist.api";
import { mapEmploymentTypeToLabel } from "@/app/lib/constants/mapEmploymentType";
import { useLatestMatch } from "@/app/lib/api/match.api";

function pickMatchId(input: unknown): number | null {
  if (!input || typeof input !== "object") return null;

  // case1) { matchId: 123 }
  const direct = (input as any).matchId;
  if (typeof direct === "number" && Number.isFinite(direct) && direct > 0) {
    return direct;
  }

  // case2) { data: { matchId: 123 } }
  const nested = (input as any).data?.matchId;
  if (typeof nested === "number" && Number.isFinite(nested) && nested > 0) {
    return nested;
  }

  // case3) matchId가 string으로 올 수도 있으니 마지막 fallback
  const maybe = direct ?? nested;
  const n = Number(maybe);
  return Number.isFinite(n) && n > 0 ? n : null;
}

type Props = {
  job: JobPostCardData;
};

export default function JobPostDetailChecklist({ job }: Props) {
  console.log("job passed to checklist:", job);

  const cardIdNum = useMemo(() => {
    const n = Number(job?.id);
    return Number.isFinite(n) && n > 0 ? n : null;
  }, [job?.id]);

  // ✅ cardIdNum이 없으면 최신 매칭 조회 자체를 하지 않게 (undefined 전달)
  const latestMatchQuery = useLatestMatch(cardIdNum ?? undefined);

  const matchIdNum = useMemo(() => {
    return pickMatchId(latestMatchQuery.data);
  }, [latestMatchQuery.data]);

  const {
    item,
    isLoading,
    isError,
    error, // ✅ 너 원본 코드에서 error를 쓰는데 destructuring에 없어서 에러났을 가능성 있음
  } = useChecklistByMatchIdData(matchIdNum);

  const toggleMut = useToggleChecklist();

  const [overrideCheckedById, setOverrideCheckedById] = useState<
    Record<number, boolean>
  >({});

  const sections = useMemo(() => {
    if (!item) return [];

    return item.gapResults.map((gr) => ({
      id: String(gr.matchResultId),
      title: gr.comment, // 예: "TypeScript 사용경험"
      important: gr.isRequired,
      // required는 기본 open 원하면 true 주면 됨
      defaultOpen: gr.isRequired,
      tasks: gr.checklists.map((c) => ({
        id: String(c.checklistId),
        checklistId: c.checklistId,
        text: c.checkListText,
        checked:
          typeof overrideCheckedById[c.checklistId] === "boolean"
            ? overrideCheckedById[c.checklistId]
            : c.isButtonActive,
      })),
    }));
  }, [item, overrideCheckedById]);

  // 상단 표시용 (상세 API 기준으로 맞춰줌)
  const title = item?.cardSummary?.jobTitle ?? job.title;
  const meta = item?.cardSummary
    ? `${item.cardSummary.companyName} · ${mapEmploymentTypeToLabel(item.cardSummary.employmentType)}`
    : job.meta;

  const rate =
    item?.cardSummary?.matchPercent ??
    (job.match?.status === "done" ? job.match.rate : 0);

  const onToggleChecklist = (checklistId: number, current: boolean) => {
    if (toggleMut.isPending) return;

    setOverrideCheckedById((prev) => ({ ...prev, [checklistId]: !current }));

    toggleMut.mutate(checklistId, {
      onSuccess: (res) => {
        const next = res.isButtonActive;
        setOverrideCheckedById((prev) => ({ ...prev, [checklistId]: next }));
      },
      onError: (e) => {
        setOverrideCheckedById((prev) => ({ ...prev, [checklistId]: current }));
        alert(e.message);
      },
    });
  };

  return (
    <div className="space-y-4">
      {/* 상단: title / meta / rate */}
      <section className="space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="truncate text-[18px] font-semibold text-gray-900">
              {title}
            </h2>
            <p className="mt-1 text-[12px] text-gray-400">{meta}</p>
          </div>

          <div className="shrink-0">
            {job.match?.status === "pending" ? (
              <MatchRateBadge status="pending" />
            ) : (
              <MatchRateBadge status="done" rate={rate} />
            )}
          </div>
        </div>
      </section>

      {/* 설명 문구 */}
      <section className="flex items-start gap-2 text-[14px] leading-5 text-gray-400">
        <Image src="/icons/des_ai.svg" alt="ai" width={25} height={25} />

        <p>
          AI가 보완이 필요한 항목을 바탕으로 준비할 일을 정리했어요.
          <br />이 활동들을 준비하면 공고의 합격률이 더 올라갈 거예요.
        </p>
      </section>

      {/* 상태 처리 */}
      {matchIdNum == null && (
        <div className="rounded-xl bg-yellow-50 px-4 py-3 text-sm text-yellow-800 text-center">
          아직 매치율 검사를 하지 않았어요!
        </div>
      )}

      {isLoading && (
        <div className="rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-600">
          체크리스트를 불러오는 중...
        </div>
      )}

      {isError && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          체크리스트 조회 실패: {error?.message}
        </div>
      )}

      {!isLoading && !isError && item && sections.length === 0 && (
        <div className="rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-600">
          표시할 체크리스트가 없어요.
        </div>
      )}

      {/* 토글 모음 */}
      {!isLoading && !isError && item && sections.length > 0 && (
        <ChecklistDetailToggle
          key={matchIdNum}
          items={sections}
          onToggleChecklist={onToggleChecklist}
          isToggling={toggleMut.isPending}
        />
      )}
    </div>
  );
}
