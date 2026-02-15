"use client";

import React from "react";

export type KeywordLabelVariant = "blue" | "yellow" | "gray";

type Props = {
  text: string;
  variant?: KeywordLabelVariant;
  className?: string;
};

export default function KeywordLabel({
  text,
  variant = "blue",
  className = "",
}: Props) {
  const style =
    variant === "blue"
      ? "bg-[#E6EFFF] text-[#2C599D]"
      : variant === "yellow"
        ? "bg-amber-50 text-amber-600"
        : "bg-gray-100 text-gray-700";

  return (
    <span
      className={[
        "inline-flex items-center justify-center",
        "px-2 h-5.5 rounded-[59px] whitespace-nowrap",
        "text-[12px]/[12px] font-medium",
        style,
        className,
      ].join(" ")}
    >
      {text}
    </span>
  );
}
