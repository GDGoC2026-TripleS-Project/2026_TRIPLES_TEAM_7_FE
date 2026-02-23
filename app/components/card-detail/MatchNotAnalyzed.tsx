"use client";

import React from "react";

export default function MatchNotAnalyzed() {
  return (
    <div className="flex flex-1 justify-center px-6 pt-20">
      <p className="text-center text-[14px] font-medium leading-6 text-gray-400 whitespace-pre-line">
        이 공고와 얼마나 잘 맞는지 아직 알 수 없어요.
        {"\n"}
        간단한 분석으로 확인해보세요.
      </p>
    </div>
  );
}
