// import React from "react";

// export default function LandingPage() {
//   return <div className="flex justify-center mt-10">랜딩페이지</div>;
// }

// app/(page)/badges-example/page.tsx
"use client";

import MatchRateBadge from "@/app/components/MatchRateBadge";
import DdayBadge from "@/app/components/DdayBadge";
import KeywordLabel from "@/app/components/KeywordLabel";

export default function BadgesExamplePage() {
  return (
    <div className="min-h-screen bg-white p-10">
      <h1 className="text-2xl font-bold">Badges / Labels UI 예시</h1>

      {/* 1) 매치율 뱃지 */}
      <section className="mt-8">
        <h2 className="text-lg font-semibold">1) 매치율 검사 뱃지</h2>

        <div className="mt-4 inline-flex flex-col gap-3 rounded-2xl border border-dashed border-violet-300 p-6">
          <div className="text-sm font-semibold text-violet-500">
            ◆ 매치율 %
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <MatchRateBadge status="pending" />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <MatchRateBadge status="done" rate={1} />
            <MatchRateBadge status="done" rate={49} />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <MatchRateBadge status="done" rate={50} />
            <MatchRateBadge status="done" rate={74} />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <MatchRateBadge status="done" rate={75} />
            <MatchRateBadge status="done" rate={99} />
          </div>
        </div>
      </section>

      {/* 2) 디데이 뱃지 */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold">2) 모집 기한 D-day 뱃지</h2>

        <div className="mt-4 flex flex-col gap-6">
          <DdayBadge daysLeft={6} />
          <DdayBadge daysLeft={5} />
        </div>
      </section>

      {/* 3) 라벨 */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold">3) 키워드 라벨</h2>

        <div className="mt-4 flex flex-wrap gap-3">
          <KeywordLabel text="Java" variant="blue" />
          <KeywordLabel text="Spring" variant="blue" />
          <KeywordLabel text="RDB 경험" variant="blue" />

          <KeywordLabel text="Java" variant="yellow" />
          <KeywordLabel text="Spring" variant="yellow" />
          <KeywordLabel text="협업능력" variant="yellow" />

          <KeywordLabel text="신입" variant="gray" />
          <KeywordLabel text="경력 무관" variant="gray" />
        </div>
      </section>
    </div>
  );
}
