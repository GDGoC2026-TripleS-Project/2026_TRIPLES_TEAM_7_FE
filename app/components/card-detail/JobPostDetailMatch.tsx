"use client";

import React from "react";
import type { JobPostCardData } from "@/app/(page)/(protected)/mainboard/_components/PostCard";

import Button from "@/app/components/common/button&tab/Button";
import MatchGraph from "./MatchGraph";
import MatchDetailToggle from "./MatchDetailToggle";

export default function JobPostDetailMatch({ job }: { job: JobPostCardData }) {
  const rate = job.match.status === "done" ? job.match.rate : 0;
  const isDone = job.match.status === "done";

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="shrink-0">
        <MatchGraph
          rate={rate}
          title={"지원공고의 기준으로 이력서를\n다시 정리해봤어요."}
          subtitle="체크리스트를 완료하고 매치율을 높여볼까요?"
        />
      </div>

      <div className="mt-5 flex-1 overflow-y-auto pr-1">
        <MatchDetailToggle />
      </div>

      <div className="shrink-0 pt-5">
        <Button
          onClick={() => console.log("go match analyze")}
          height={50}
          className="rounded-2xl"
          disabled={!isDone} // 분석 전이면 비활성 처리(원하면 제거)
        >
          매치율 확인하러 가기
        </Button>

        <p className="mt-3 text-center text-[12px] text-gray-400 leading-5">
          AI가 회원님의 이력서를 바탕으로 공고와의 적합도를 분석합니다.
          <br />
          매치율은 선택을 돕기 위한 지표로 제공됩니다.
        </p>
      </div>
    </div>
  );
}
