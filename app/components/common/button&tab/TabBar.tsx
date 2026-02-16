"use client";

import React from "react";

export type TabBarItem<T extends string> = {
  id: T;
  label: string;
};

type Props<T extends string> = {
  value: T;
  items: Array<TabBarItem<T>>;
  onChange: (next: T) => void;
  className?: string;
};

export default function TabBar<T extends string>({
  value,
  items,
  onChange,
  className = "",
}: Props<T>) {
  return (
    <div className={["px-5", className].join(" ")}>
      <div className="flex items-center justify-between text-[13px] font-semibold text-gray-400">
        {items.map((it) => {
          const isActive = value === it.id;
          return (
            <button
              key={it.id}
              type="button"
              onClick={() => onChange(it.id)}
              className={[
                "relative flex-1 py-2 text-center",
                isActive ? "text-gray-900" : "text-gray-400",
              ].join(" ")}
            >
              {it.label}
              {isActive && (
                <span className="absolute left-0 right-0 -bottom-[1px] mx-auto h-[2px] w-[60%] bg-gray-900" />
              )}
            </button>
          );
        })}
      </div>
      {/* <div className="mt-2 h-px w-full bg-black/5" /> */}
    </div>
  );
}
