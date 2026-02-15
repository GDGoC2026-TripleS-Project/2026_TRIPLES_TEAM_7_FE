"use client";

import React from "react";

export type TabId = "dashboard" | "interview";

type Props = {
  id: TabId;
  label: string;
  isActive: boolean;
  onClick?: (id: TabId) => void;
};

export default function TabButton({ id, label, isActive, onClick }: Props) {
  return (
    <button
      onClick={() => onClick?.(id)}
      className={[
        "my-1 mx-1 py-3 px-5 rounded-[26px]",
        "text-[14px]/[14px] font-medium",
        "transition-all duration-200",

        isActive
          ? [
              // dark capsule
              "bg-[#1f1b1f] text-white",

              // 떠있는 느낌
              // "shadow-[0_10px_24px_rgba(0,0,0,0.25)]",

              // 위쪽 하이라이트
              "before:absolute before:inset-0 before:rounded-[26px]",
              "before:bg-gradient-to-b before:from-white/20 before:to-transparent",
              "before:opacity-40 before:pointer-events-none",
            ].join(" ")
          : ["text-gray-500 hover:text-gray-800"].join(" "),
      ].join(" ")}
    >
      {label}
    </button>
  );
}
