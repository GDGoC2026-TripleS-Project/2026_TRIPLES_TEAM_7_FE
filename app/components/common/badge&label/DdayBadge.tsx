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
        "w-10 h-5.5 rounded-[59px]",
        "text-[12px]/[12px] font-semibold tracking-tight whitespace-nowrap",
        danger ? "bg-sub-red text-white" : "bg-[#BDBDBD] text-white",
        className,
      ].join(" ")}
    >
      D<span className="px-0.5">-</span>
      {d}
    </span>
  );
}
