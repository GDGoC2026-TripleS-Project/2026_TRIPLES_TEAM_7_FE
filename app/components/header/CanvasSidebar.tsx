"use client";

import Image from "next/image";
import React from "react";
import LinkPanelContent from "./LinkPanelContent";

type SideId = "link" | "list" | "user" | "settings";

type Props = {
  active?: SideId | null;
  onSelect?: (id: SideId | null) => void;
  onNavigate?: (id: Exclude<SideId, "link">) => void;
  panelWidth?: number;
};

const ITEMS: Array<{ id: SideId; iconSrc: string; label: string }> = [
  { id: "link", iconSrc: "/icons/s1.svg", label: "링크" },
  { id: "list", iconSrc: "/icons/s2.svg", label: "체크리스트" },
  { id: "user", iconSrc: "/icons/s3.svg", label: "마이페이지" },
  { id: "settings", iconSrc: "/icons/s4.svg", label: "설정" },
];

export default function CanvasSidebar({
  active = null,
  onSelect,
  onNavigate,
  panelWidth = 280,
}: Props) {
  const isLinkOpen = active === "link";

  return (
    <div className="relative h-full flex items-stretch">
      {/* 사이드바 본체 */}
      <div
        className={[
          "w-19 h-full bg-[#1f1b1f] shadow-xl",
          isLinkOpen ? "rounded-l-[18px] rounded-r-none" : "rounded-[18px]", // ✅ 여기!
        ].join(" ")}
      >
        <div className="flex h-full flex-col items-center py-5">
          {/* 로고 */}
          <div className="mb-7 flex items-center justify-center">
            <Image src="/logo_P.svg" alt="logo" width={38} height={38} />
          </div>

          {/* 아이콘 */}
          <div className="mt-20 flex flex-col items-center gap-3">
            {ITEMS.map((it) => {
              const isActive = active === it.id;

              return (
                <div key={it.id} className="relative group">
                  <button
                    key={it.id}
                    onClick={() => {
                      // link만 패널 토글
                      if (it.id === "link") {
                        onSelect?.(isActive ? null : "link");
                        return;
                      }

                      // 나머지는 페이지 이동 (패널 없음)
                      onSelect?.(null);
                      onNavigate?.(it.id);
                    }}
                    className={[
                      "h-11 w-11 rounded-[10px] flex items-center justify-center transition",
                      isActive ? "" : "hover:bg-white/10",
                    ].join(" ")}
                  >
                    <Image
                      src={it.iconSrc}
                      alt={it.label}
                      width={24}
                      height={24}
                      className={
                        isActive
                          ? "opacity-100"
                          : "opacity-40 hover:opacity-100"
                      }
                    />
                  </button>

                  <div
                    className={[
                      "pointer-events-none absolute left-[71px] top-1/2 -translate-y-1/2",
                      "opacity-0 translate-x-[-6px]",
                      "group-hover:opacity-100 group-hover:translate-x-0",
                      "transition-all duration-150 ease-out",
                      "z-50",
                    ].join(" ")}
                  >
                    <div className="relative">
                      {/* 말풍선 본체 */}
                      <div className="rounded-[6px] bg-[#2B272B] px-2.5 py-0.5 shadow-lg">
                        <span className="text-[12px]/[12px] font-normal text-white whitespace-nowrap">
                          {it.label}
                        </span>
                      </div>

                      {/* 꼬리(왼쪽 삼각형) */}
                      <div className="absolute left-[-4.5px] top-1/2 -translate-y-1/2">
                        <div
                          className="h-0 w-0
                          border-y-[9px] border-y-transparent
                          border-r-[6px] border-r-[#2B272B]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <LinkPanelContent
        open={isLinkOpen}
        onClose={() => onSelect?.(null)}
        width={panelWidth}
      />
    </div>
  );
}
