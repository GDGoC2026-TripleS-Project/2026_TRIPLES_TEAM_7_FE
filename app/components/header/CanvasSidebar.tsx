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
  { id: "link", iconSrc: "/icons/s1.svg", label: "link" },
  { id: "list", iconSrc: "/icons/s2.svg", label: "list" },
  { id: "user", iconSrc: "/icons/s3.svg", label: "user" },
  { id: "settings", iconSrc: "/icons/s4.svg", label: "settings" },
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
      <div className="w-19 h-full rounded-[18px] bg-[#1f1b1f] shadow-xl">
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
                    "h-11 w-11 rounded-2xl flex items-center justify-center transition",
                    isActive ? "bg-white/10" : "hover:bg-white/10",
                  ].join(" ")}
                >
                  <Image
                    src={it.iconSrc}
                    alt={it.label}
                    width={24}
                    height={24}
                    className="opacity-95"
                  />
                </button>
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
