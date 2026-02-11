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
      type="button"
      onClick={() => onClick?.(id)}
      className={[
        "h-10 rounded-[22px] px-6 text-[14px] font-medium transition",
        isActive
          ? "bg-main text-white shadow-sm"
          : "text-gray-600 hover:text-black",
      ].join(" ")}
    >
      {label}
    </button>
  );
}
