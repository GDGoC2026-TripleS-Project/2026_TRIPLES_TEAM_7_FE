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

type Props = {
  open: boolean;
  onClose: () => void;
  width?: number;
};

export default function LinkPanelContent({
  open,
  onClose,
  width = 280,
}: Props) {
  const [url, setUrl] = useState("");

  return (
    <aside
      className={[
        "ml-auto  h-full overflow-hidden",
        // 효과 뺄지 말지 물어보기
        // "transition-[width,opacity,transform] duration-200 ease-out",
        open ? "opacity-100" : "opacity-0 pointer-events-none",
      ].join(" ")}
      style={{
        width: open ? width : 0,
        transform: open ? "translateX(0px)" : "translateX(-8px)",
      }}
    >
      {/* 패널 박스 */}
      <div className="h-full rounded-br-[18px] rounded-tr-[18px]  bg-[#332c2f]">
        {/* 상단 헤더 */}
        <div className="flex items-center justify-end px-5 pt-5">
          <button
            onClick={onClose}
            className="rounded-md text-white/60 hover:text-white/90"
          >
            <Image
              src="/icons/close_panel.svg"
              alt="link"
              width={20}
              height={20}
            />
          </button>
        </div>

        {/* 본문 */}
        <div className="px-5 pb-5 pt-20 h-[calc(100%-56px)] whitespace-nowrap">
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
                    "bg-white/10 text-white placeholder:text-gray-300",
                    "border border-white/10",
                    "outline-none focus:border-white/25 text-sm",
                  ].join(" ")}
                />
              </div>
            </div>

            {/* 최근 url */}
            <div className="mt-6">
              <div className="text-sm font-semibold text-white/80">
                최근 url
              </div>

              <div className="mt-3 flex flex-col gap-3">
                {MOCK_RECENTS.map((it) => (
                  <button
                    key={it.id}
                    className={[
                      "text-left rounded-xl px-4 py-3",
                      "hover:bg-main",
                      "transition",
                    ].join(" ")}
                    onClick={() => setUrl("https://example.com/job-posting")}
                  >
                    <div className="text-[12px] text-white/55">
                      {it.company}
                    </div>
                    <div className="text-[14px] font-semibold text-white/90">
                      {it.title}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1" />
          </div>
        </div>
      </div>
    </aside>
  );
}
