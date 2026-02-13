"use client";

import React from "react";

type Props =
  | {
      status: "pending";
      className?: string;
    }
  | {
      status: "done";
      rate: number;
      className?: string;
    };

function clampRate(n: number) {
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(99, Math.floor(n)));
}

export default function MatchRateBadge(props: Props) {
  if (props.status === "pending") {
    return (
      <span
        className={[
          "inline-flex items-center justify-center",
          "h-7 rounded-full text-[16px] font-medium",
          "border border-gray-500 bg-white text-gray-500",
          "shadow-sm",
          props.className ?? "",
        ].join(" ")}
      >
        분석 전
      </span>
    );
  }

  const rate = clampRate(props.rate);

  const tone = rate <= 49 ? "red" : rate <= 74 ? "yellow" : "green";

  const style =
    tone === "red"
      ? "border-red-300 text-red-500"
      : tone === "yellow"
        ? "border-amber-300 text-amber-600 bg-amber-50"
        : "border-emerald-300 text-emerald-600 bg-emerald-50";

  return (
    <span
      className={[
        "inline-flex items-center justify-center",
        "h-7 rounded-full text-[12px]",
        "border shadow-sm",
        style,
        props.className ?? "",
      ].join(" ")}
    >
      {rate}%
    </span>
  );
}
