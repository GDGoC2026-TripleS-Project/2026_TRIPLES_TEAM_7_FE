"use client";

import React from "react";

type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;

  /** 기본: 100% */
  fullWidth?: boolean;

  /** 기본: 50 (px) */
  height?: number;

  /** 추가 커스텀 */
  className?: string;
};

export default function Button({
  children,
  onClick,
  disabled = false,
  fullWidth = true,
  height = 50,
  className = "",
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[
        "rounded-2xl font-semibold transition",
        "bg-[#281D21] text-white",
        "hover:brightness-110 active:brightness-95",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        fullWidth ? "w-full" : "",
        className,
      ].join(" ")}
      style={{ height }}
    >
      {children}
    </button>
  );
}
