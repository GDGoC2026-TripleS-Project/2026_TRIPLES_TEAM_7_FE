"use client";

import React from "react";

type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
};

export default function ButtonRounded({
  children,
  onClick,
  disabled,
  className = "",
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[
        "h-[40px] rounded-full px-8",
        "bg-main text-white text-[16px] flex items-center justify-center font-semibold whitespace-nowrap",
        "transition",
        disabled ? "opacity-40 cursor-not-allowed" : "hover:opacity-90",
        className,
      ].join(" ")}
    >
      {children}
    </button>
  );
}
