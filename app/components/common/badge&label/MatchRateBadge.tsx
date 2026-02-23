"use client";

import React from "react";

type Props =
  | {
      status: "pending";
      isClosed?: boolean;
      className?: string;
    }
  | {
      status: "done";
      rate: number;
      isClosed?: boolean;
      className?: string;
    };

function clampRate(n: number) {
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(99, Math.floor(n)));
}

export default function MatchRateBadge(props: Props) {
  const closed = !!props.isClosed;

  if (props.status === "pending") {
    return (
      <span
        className={[
          "inline-flex items-center justify-center",
          "w-13 py-1.25 rounded-[59px] text-[12px]/[12px] font-semibold whitespace-nowrap",
          closed
            ? "border border-black/40 text-black/60" // ✅ 마감 시 회색
            : "border border-gray-400 text-gray-400",
          props.className ?? "",
        ].join(" ")}
      >
        분석 전
      </span>
    );
  }

  const rate = clampRate(props.rate);

  if (closed) {
    return (
      <span
        className={[
          "inline-flex items-center justify-center",
          "w-10.75 py-1.25 rounded-[59px] text-[12px]/[12px] font-semibold whitespace-nowrap",
          "border border-black/40 text-black/70",
          props.className ?? "",
        ].join(" ")}
      >
        {rate}%
      </span>
    );
  }

  const tone = rate <= 49 ? "red" : rate <= 74 ? "yellow" : "green";

  const style =
    tone === "red"
      ? "border-sub-red text-sub-red"
      : tone === "yellow"
        ? "border-amber-300 text-amber-600"
        : "border-emerald-300 text-emerald-600";

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
