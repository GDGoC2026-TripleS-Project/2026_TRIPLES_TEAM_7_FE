"use client";

import React, { useMemo } from "react";
import type { JobPostCardData } from "@/app/(page)/(protected)/mainboard/_components/PostCard";

import Button from "@/app/components/common/button&tab/Button";
import MatchGraph from "./MatchGraph";
import MatchDetailToggle from "./MatchDetailToggle";
import MatchNotAnalyzed from "./MatchNotAnalyzed";

import { useMyPageData } from "@/app/lib/api/my.api";
import {
  useCreateMatch,
  useLatestMatch,
  type GetLatestMatchResponse,
} from "@/app/lib/api/match.api";
import { useQueryClient } from "@tanstack/react-query";

type Props = { job: JobPostCardData };

export default function JobPostDetailMatch({ job }: Props) {
  const qc = useQueryClient();

  const cardId = Number(job.id);
  const isValidCardId = Number.isFinite(cardId);

  const { resumeUrl } = useMyPageData();

  const latestMatchQuery = useLatestMatch(isValidCardId ? cardId : undefined);
  const latest = latestMatchQuery.data;

  const hasMatchPercent =
    latest != null && typeof (latest as any).matchPercent === "number";

  const isDone = hasMatchPercent;
  const rate = hasMatchPercent ? latest!.matchPercent : 0;

  const createMatch = useCreateMatch();

  const items = useMemo(() => {
    if (!hasMatchPercent) return [];

    return [
      {
        id: "good",
        label: "공고와 잘 맞아요!",
        iconSrc: "/icons/match-good.svg",
        details: (latest.strengthTop3 ?? []).map((x) => ({
          text: x.comment,
        })),
        defaultOpen: true,
      },
      {
        id: "improve",
        label: "보완하면 좋아요!",
        iconSrc: "/icons/match-improve.svg",
        details: (latest.gapTop3 ?? []).map((x) => ({
          text: x.comment,
          required: !!x.isRequired,
        })),
      },
      {
        id: "hard",
        label: "현재 바꾸기 어려워요.",
        iconSrc: "/icons/match-hard.svg",
        details: (latest.riskTop3 ?? []).map((x) => ({
          text: x.comment,
        })),
      },
    ];
  }, [hasMatchPercent, latest]);

  const canRun =
    isValidCardId &&
    !!resumeUrl &&
    !createMatch.isPending &&
    !latestMatchQuery.isFetching;

  const onClickAnalyze = () => {
    if (!isValidCardId) {
      alert("cardId가 올바르지 않습니다.");
      return;
    }
    if (!resumeUrl) {
      alert(
        "이력서가 등록되어 있지 않습니다. 마이페이지에서 이력서를 등록해주세요.",
      );
      return;
    }

    createMatch.mutate(
      { cardId, fileUrl: resumeUrl },
      {
        onSuccess: (res) => {
          qc.setQueryData<GetLatestMatchResponse | null>(
            ["cardMatch", cardId],
            res,
          );

          qc.invalidateQueries({ queryKey: ["cardMatch", cardId] });
        },
        onError: (e) => {
          alert(e.message);
        },
      },
    );
  };

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* 상단 영역 */}
      {latestMatchQuery.isLoading ? (
        <div className="flex flex-1 items-center justify-center text-[13px] text-gray-400">
          매치 결과 불러오는 중...
        </div>
      ) : isDone ? (
        <>
          <div className="shrink-0">
            <MatchGraph
              rate={rate}
              title={"지원공고의 기준으로 이력서를\n다시 정리해봤어요."}
              subtitle="체크리스트를 완료하고 매치율을 높여볼까요?"
            />
          </div>

          <div className="mt-5 flex-1 overflow-y-auto scrollbar-hide pr-1">
            <MatchDetailToggle items={items} />
          </div>
        </>
      ) : (
        <MatchNotAnalyzed />
      )}

      {/* 하단 버튼/문구 */}
      <div className="shrink-0 pt-5">
        <Button
          onClick={onClickAnalyze}
          height={50}
          className="rounded-2xl"
          disabled={!canRun}
        >
          {createMatch.isPending ? "분석 중..." : "매치율 확인하러 가기"}
        </Button>

        {createMatch.isPending && (
          <p className="mt-2 text-center text-[12px] text-gray-400">
            AI가 이력서를 분석하고 있어요. 잠시만 기다려주세요...
          </p>
        )}

        <p className="mt-3 text-center text-[12px] text-gray-400 leading-5">
          AI가 회원님의 이력서를 바탕으로 공고와의 적합도를 분석합니다.
          <br />
          매치율은 선택을 돕기 위한 지표로 제공됩니다.
        </p>
      </div>
    </div>
  );
}
