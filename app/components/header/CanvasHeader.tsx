"use client";

import Image from "next/image";
import React, { useEffect, useMemo, useRef, useState } from "react";
import TabButton, { TabId } from "../common/button&tab/TabButton";

export type CanvasTabId = "dashboard" | "interview";

type SortId = "deadline" | "distance" | "salary" | "match";

type SortItem = {
  id: SortId;
  label: string;
};

type Props = {
  activeTab: TabId;
  onChangeTab?: (tab: TabId) => void;

  onChangeSort?: (sort: SortId | null) => void;
  defaultSort?: SortId | null;
};

export default function CanvasHeader({
  activeTab,
  onChangeTab,
  onChangeSort,
  defaultSort = null,
}: Props) {
  const SORT_ITEMS: SortItem[] = useMemo(
    () => [
      { id: "deadline", label: "마감일 순" },
      { id: "distance", label: "거리 순" },
      { id: "salary", label: "연봉 순" },
    ],
    [],
  );

  const [filterOpen, setFilterOpen] = useState(false);
  const [sort, setSort] = useState<SortId | null>(defaultSort);

  const rootRef = useRef<HTMLDivElement | null>(null);

  const selectedLabel =
    sort == null
      ? "필터"
      : (SORT_ITEMS.find((s) => s.id === sort)?.label ?? "필터");

  useEffect(() => {
    if (!filterOpen) return;

    const onPointerDown = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      if (rootRef.current?.contains(t)) return;
      setFilterOpen(false);
    };

    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [filterOpen]);

  return (
    <div ref={rootRef} className="relative inline-flex items-center gap-3">
      <div
        className={[
          "relative inline-flex items-center gap-2 rounded-[36px]",
          "bg-[linear-gradient(0deg,#473f42_0%,#473f42_100&)]",
          "backdrop-blur-[3px]",
          "shadow-[0_10px_24px_rgba(0,0,0,0.09)]",
          "before:pointer-events-none before:absolute before:inset-x-100 before:top-2 before:h-6",
          "before:rounded-[28px] before:bg-white/10 before:blur-[1px] before:content-['']",
          "after:pointer-events-none after:absolute after:inset-0 after:rounded-[28px]",
          "after:shadow-[inset_0_1px_1px_rgba(255,255,255,0.5)] after:content-['']",
        ].join(" ")}
      >
        <div className="relative inline-flex items-center">
          <TabButton
            id="dashboard"
            label="대쉬 보드"
            isActive={activeTab === "dashboard"}
            onClick={onChangeTab}
          />
          <TabButton
            id="interview"
            label="면접 시뮬레이션"
            isActive={activeTab === "interview"}
            onClick={onChangeTab}
          />
        </div>
      </div>

      {/* 필터 버튼 */}
      <div className="relative">
        <button
          onClick={() => setFilterOpen((v) => !v)}
          className={[
            "flex items-center justify-center gap-2 px-5 h-12 rounded-[36px] whitespace-nowrap",
            "bg-[linear-gradient(0deg,#473f42_0%,#473f42_100&)]",
            "backdrop-blur-[3px]",
            "shadow-[0_10px_24px_rgba(0,0,0,0.09)]",
            "before:pointer-events-none before:absolute before:inset-x-100 before:top-2 before:h-6",
            "before:rounded-[28px] before:bg-white/10 before:blur-[1px] before:content-['']",
            "after:pointer-events-none after:absolute after:inset-0 after:rounded-[28px]",
            "after:shadow-[inset_0_1px_1px_rgba(255,255,255,0.5)] after:content-['']",
            "text-[14px] font-semibold",
          ].join(" ")}
        >
          <Image src="/icons/filter.svg" alt="filter" width={18} height={18} />
          <span>{selectedLabel}</span>

          <span
            className={[
              "ml-1 inline-flex items-center justify-center opacity-70",
              "transition-transform duration-150",
              filterOpen ? "rotate-180" : "rotate-0",
            ].join(" ")}
          >
            <Image src="/icons/arrowdown.svg" alt="open" width={8} height={8} />
          </span>
        </button>

        {/* 드롭다운 */}
        {filterOpen && (
          <div
            className={[
              "absolute left-0 mt-3 z-[120]",
              "w-[200px]",
              "rounded-[22px]",
              "bg-[linear-gradient(0deg,#473f42_0%,#473f42_100&)]",
              "backdrop-blur-[3px]",
              "shadow-[0_10px_24px_rgba(0,0,0,0.09)]",
              "before:pointer-events-none before:absolute before:inset-x-100 before:top-2 before:h-6",
              "before:rounded-[28px] before:bg-white/10 before:blur-[1px] before:content-['']",
              "after:pointer-events-none after:absolute after:inset-0 after:rounded-[28px]",
              "after:shadow-[inset_0_1px_1px_rgba(255,255,255,0.5)] after:content-['']",
              "overflow-hidden",
            ].join(" ")}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <ul className="py-3">
              {SORT_ITEMS.map((item) => {
                const active = item.id === sort;

                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      className={[
                        "w-full px-5 py-3",
                        "flex items-center justify-between",
                        "text-left",
                        active
                          ? "text-gray-900 font-semibold"
                          : "text-gray-500 font-medium",
                        // active ? "" : "hover:bg-black/[0.03]",
                      ].join(" ")}
                      onClick={() => {
                        setSort(item.id);
                        onChangeSort?.(item.id);
                        setFilterOpen(false);
                      }}
                    >
                      <span className="text-[15px] leading-6">
                        {item.label}
                      </span>

                      {active && (
                        <span className="shrink-0">
                          <Image
                            src="/icons/checkbox-checked.svg"
                            alt="selected"
                            width={20}
                            height={20}
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
    </div>
  );
}
