"use client";

import React from "react";

type Props = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
};

export default function Input({
  value,
  onChange,
  placeholder,
  disabled,
}: Props) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className={[
        "w-full rounded-[12px] border border-black/10",
        "px-4 py-3 text-[16px] text-gray-900",
        "placeholder:text-gray-300",
        "outline-none",
        "focus:border-black/20 focus:ring-2 focus:ring-black/5",
        disabled ? "bg-gray-50 text-gray-400" : "bg-white",
      ].join(" ")}
    />
  );
}
