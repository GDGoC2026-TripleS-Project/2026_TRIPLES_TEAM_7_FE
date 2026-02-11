"use client";

import Image from "next/image";
import React, { useState } from "react";

type RecentUrlItem = {
  id: string;
  company: string;
  title: string;
};

const MOCK_RECENTS: RecentUrlItem[] = [
  { id: "1", company: "현대 캐피코", title: "시니어 소프트웨어 엔지니어" },
  { id: "2", company: "현대 캐피코", title: "시니어 소프트웨어 엔지니어" },
  { id: "3", company: "현대 캐피코", title: "시니어 소프트웨어 엔지니어" },
];

export default function LinkPanelContent() {
  const [url, setUrl] = useState("");

  return (
    <div className="flex h-full flex-col">
      {/* 상단: 링크 붙여넣기 */}
      <div>
        <div className="flex items-center justify-start gap-2 text-white/80 text-sm font-semibold">
          <Image src="/icons/s1.svg" alt="link" width={18} height={18} />
          <span>링크 붙여넣기</span>
        </div>

        <div className="mt-3">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="채용 공고 링크를 붙여넣어 주세요."
            className={[
              "w-full h-11 rounded-xl px-4",
              "bg-white/10 text-white placeholder:text-white/40",
              "border border-white/10",
              "outline-none focus:border-white/25 text-sm",
            ].join(" ")}
          />
        </div>
      </div>

      {/* 최근 url */}
      <div className="mt-6">
        <div className="text-sm font-semibold text-white/80">최근 url</div>

        <div className="mt-3 flex flex-col gap-3">
          {MOCK_RECENTS.map((it) => (
            <button
              key={it.id}
              type="button"
              className={[
                "text-left rounded-xl px-4 py-3",
                "bg-[#1f1b1f]/55 hover:bg-[#1f1b1f]/70",
                "transition",
              ].join(" ")}
              onClick={() => {
                // TODO: 최근 URL 선택 시 입력창에 채우기 + 공고 생성 트리거 등
                setUrl("https://example.com/job-posting");
              }}
            >
              <div className="text-[12px] text-white/55">{it.company}</div>
              <div className="text-[14px] font-semibold text-white/90">
                {it.title}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 아래 여백 */}
      <div className="flex-1" />
    </div>
  );
}
