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
          "w-13 py-1.25 rounded-[59px] text-[12px]/[12px] font-semibold whitespace-nowrap",
          "border border-gray-400 text-gray-400",
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
      ? "border-sub-red text-sub-red"
      : tone === "yellow"
        ? "border-amber-300 text-amber-600 bg-amber-50"
        : "border-emerald-300 text-emerald-600 bg-emerald-50";

  return (
    <span
      className={[
        "inline-flex items-center justify-center",
        "w-10.75 py-1.25 rounded-[59px] text-[12px]/[12px] font-semibold whitespace-nowrap",
        "border",
        style,
        props.className ?? "",
      ].join(" ")}
    >
      {rate}%
    </span>
  );
}
