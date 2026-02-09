"use client";

import Image from "next/image";
import React from "react";

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
};

export default function CanvasSidebar({
  logoSrc,
  items,
  active,
  onSelect,
}: Props) {
  return (
    <div className="w-19 h-full rounded-[18px] bg-[#1f1b1f] shadow-xl">
      <div className="flex flex-col items-center py-5">
        {/* 로고 */}
        <div className="mb-7 flex items-center justify-center">
          <Image src={logoSrc} alt="logo" width={38} height={38} />
        </div>

        {/* 아이콘 */}
        <div className="flex flex-col items-center gap-3 pt-25">
          {items.map((it) => {
            const isActive = active === it.id;

            return (
              <button
                key={it.id}
                type="button"
                onClick={() => onSelect?.(it.id)}
                aria-label={it.label}
                className={[
                  "h-11 w-11 rounded-2xl flex items-center justify-center transition",
                  isActive ? "bg-white/10" : "hover:bg-white/10",
                ].join(" ")}
              >
                <Image
                  src={it.iconSrc}
                  alt={it.label}
                  width={22}
                  height={22}
                  className="opacity-95"
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
