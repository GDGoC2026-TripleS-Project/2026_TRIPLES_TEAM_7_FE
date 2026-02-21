"use client";

import Image from "next/image";
import React, { useEffect, useMemo, useRef, useState } from "react";

export type ChecklistFilterId = "recruit" | "recent" | "incomplete";

type FilterItem = {
  id: ChecklistFilterId;
  label: string;
};

type Props = {
  value: ChecklistFilterId;
  onChange: (next: ChecklistFilterId) => void;

  className?: string;

  checkIconSrc?: string;
};

export default function ChecklistFilterDropdown({
  value,
  onChange,
  className = "",
  checkIconSrc = "/icons/checkbox_checked.svg",
}: Props) {
  const ITEMS: FilterItem[] = useMemo(
    () => [
      { id: "recruit", label: "모집 공고 순" },
      { id: "recent", label: "최근 순" },
      { id: "incomplete", label: "미완료 순" },
    ],
    [],
  );

  const selected = ITEMS.find((x) => x.id === value)?.label ?? "필터";

  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  // 바깥 클릭 닫기
  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      if (rootRef.current?.contains(t)) return;
      setOpen(false);
    };

    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  // ESC 닫기
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <div
      ref={rootRef}
      className={["relative inline-block", className].join(" ")}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={[
          "relative h-14 rounded-[28px] px-6",
          "inline-flex items-center gap-3",
          "bg-gray-200",
          "shadow-[0_10px_24px_rgba(0,0,0,0.09)]",
          "after:pointer-events-none after:absolute after:inset-0 after:rounded-[28px]",
          "after:shadow-[inset_0_1px_0_rgba(255,255,255,0.55)] after:content-['']",
          "text-[16px] font-semibold text-gray-800",
        ].join(" ")}
      >
        <Image src="/icons/filter.svg" alt="filter" width={18} height={18} />
        <span>{selected}</span>
        <span
          className={[
            "ml-1 inline-flex items-center justify-center opacity-70",
            "transition-transform duration-150",
            open ? "rotate-180" : "rotate-0",
          ].join(" ")}
        >
          <Image src="/icons/arrowdown.svg" alt="open" width={8} height={8} />
        </span>
      </button>

      {open && (
        <div
          className={[
            "absolute left-0 mt-3 z-[120]",
            "w-[320px] max-w-[calc(100vw-24px)]",
            "rounded-[26px]",
            "bg-white/80",
            "backdrop-blur-[14px]",
            "shadow-[0_18px_40px_rgba(0,0,0,0.12)]",
            "border border-white/40",
            "overflow-hidden",
          ].join(" ")}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <ul className="py-3">
            {ITEMS.map((item) => {
              const active = item.id === value;

              return (
                <li key={item.id}>
                  <button
                    type="button"
                    className={[
                      "w-full px-6 py-4",
                      "flex items-center justify-between",
                      "text-left",
                      "transition-colors",
                      active
                        ? "text-gray-900 font-semibold"
                        : "text-gray-500 font-medium hover:bg-black/[0.03]",
                    ].join(" ")}
                    onClick={() => {
                      onChange(item.id);
                      setOpen(false);
                    }}
                  >
                    <span className="text-[20px] leading-6">{item.label}</span>

                    {active && (
                      <span className="shrink-0">
                        <Image
                          src={checkIconSrc}
                          alt="selected"
                          width={22}
                          height={22}
                        />
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
