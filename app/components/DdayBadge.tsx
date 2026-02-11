"use client";

import React from "react";

type Props = {
  daysLeft: number;
  className?: string;
};

export default function DdayBadge({ daysLeft, className = "" }: Props) {
  const d = Math.max(0, Math.floor(daysLeft));
  const danger = d <= 5;

  return (
    <span
      className={[
        "inline-flex items-center justify-center",
        "h-5.5 rounded-full w-9.75 px-7",
        "text-[12px] font-semibold tracking-tight whitespace-nowrap",
        danger ? "bg-[#E76565] text-white" : "bg-[#BDBDBD] text-white",
        "shadow-sm",
        className,
      ].join(" ")}
    >
      D - {d}
    </span>
  );
}
