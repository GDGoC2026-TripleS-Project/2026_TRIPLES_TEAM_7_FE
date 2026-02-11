"use client";

import Image from "next/image";
import React, { useMemo } from "react";
import LinkPanelContent from "./LinkPanelContent";

type ItemId = "link" | "list" | "user" | "settings";

type SidebarItem = {
  id: ItemId;
  iconSrc: string;
  label: string;
};

type Props = {
  logoSrc: string;
  items: SidebarItem[];
  active?: ItemId;
  onSelect?: (id: ItemId) => void;

  // 패널 폭 (디자인에 맞게 조절)
  panelWidth?: number; // default: 280
};

export default function CanvasSidebar({
  logoSrc,
  items,
  active,
  onSelect,
  panelWidth = 280,
}: Props) {
  const isPanelOpen = Boolean(active); // active가 있으면 패널이 뜨는 구조
  const showLinkPanel = active === "link";

  const panelTitle = useMemo(() => {
    switch (active) {
      case "link":
        return "링크 붙여넣기";
      case "list":
        return "리스트";
      case "user":
        return "프로필";
      case "settings":
        return "설정";
      default:
        return "";
    }
  }, [active]);

  return (
    <div className="relative h-full flex items-stretch">
      {/* 사이드바 본체 */}
      <div className="w-19 h-full rounded-[18px] bg-[#1f1b1f] shadow-xl">
        <div className="flex h-full flex-col items-center py-5">
          {/* 로고 */}
          <div className="mb-7 flex items-center justify-center">
            <Image src={logoSrc} alt="logo" width={38} height={38} />
          </div>

          {/* 아이콘 */}
          <div className="mt-20 flex flex-col items-center gap-3">
            {items.map((it) => {
              const isActive = active === it.id;

              return (
                <button
                  key={it.id}
                  type="button"
                  onClick={() => {
                    // 같은 아이콘을 다시 누르면 닫기 토글
                    if (isActive) onSelect?.(undefined as unknown as ItemId);
                    else onSelect?.(it.id);
                  }}
                  aria-label={it.label}
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

      {/* 펼쳐지는 패널 */}
      <aside
        className={[
          "ml-3 h-full",
          "overflow-hidden",
          "transition-[width,opacity,transform] duration-200 ease-out",
          isPanelOpen ? "opacity-100" : "opacity-0",
        ].join(" ")}
        style={{
          width: isPanelOpen ? panelWidth : 0,
          transform: isPanelOpen ? "translateX(0px)" : "translateX(-8px)",
        }}
        aria-hidden={!isPanelOpen}
      >
        {/* 패널 박스 */}
        <div className="h-full rounded-[18px] bg-[#2B272B] shadow-xl">
          {/* 상단 닫기 버튼 */}
          <div className="flex items-center justify-between px-5 pt-5">
            <div className="text-sm font-semibold text-white/80">
              {panelTitle}
            </div>

            <button
              type="button"
              onClick={() => onSelect?.(undefined as unknown as ItemId)}
              className="rounded-md px-2 py-1 text-white/60 hover:text-white/90"
              aria-label="close panel"
            >
              ✕
            </button>
          </div>

          {/* 본문 */}
          <div className="px-5 pb-5 pt-4 h-[calc(100%-56px)]">
            {showLinkPanel ? (
              <LinkPanelContent />
            ) : (
              <div className="text-sm text-white/60">준비 중인 패널입니다.</div>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}
