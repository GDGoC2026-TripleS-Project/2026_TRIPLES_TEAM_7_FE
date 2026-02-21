"use client";

import Image from "next/image";
import React, { useMemo, useState } from "react";

import InfoIcon from "@/public/icons/info.svg?react";

type Task = {
  id: string;
  text: string;
  checked: boolean;
  checklistId: number;
};

type Section = {
  id: string;
  title: string;
  important?: boolean;
  defaultOpen?: boolean;
  tasks: Task[];
};

type Props = {
  items: Section[];
  className?: string;

  onToggleChecklist: (checklistId: number, current: boolean) => void;
  isToggling?: boolean;
};

export default function ChecklistDetailToggle({
  items,
  className = "",
  onToggleChecklist,
  isToggling = false,
}: Props) {
  const DEFAULT_ITEMS = useMemo<Section[]>(() => items ?? [], [items]);

  // 섹션별 open 관리 (Set)
  const [openIds, setOpenIds] = useState<Set<string>>(() => {
    const init = new Set<string>();
    DEFAULT_ITEMS.forEach((s) => s.defaultOpen && init.add(s.id));
    return init;
  });

  const toggleSection = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  };

  return (
    <section className={["divide-y divide-black/5", className].join(" ")}>
      {DEFAULT_ITEMS.map((sec) => {
        const isOpen = openIds.has(sec.id);

        return (
          <div key={sec.id} className="py-3">
            <button
              type="button"
              className="flex w-full items-center justify-between gap-3"
              onClick={() => toggleSection(sec.id)}
            >
              <div className="flex items-center gap-2">
                {/* 왼쪽 섹션 아이콘(예시) */}
                <Image
                  src="/icons/match-improve.svg"
                  alt=""
                  width={18}
                  height={18}
                />
                <span className="text-[16px] font-semibold text-gray-900">
                  {sec.title}
                </span>

                {sec.important && (
                  <span
                    className={[
                      "ml-1 inline-flex items-center",
                      "text-red-400",
                      "[&_svg_path]:stroke-current",
                    ].join(" ")}
                    aria-label="important"
                    title="중요"
                    onPointerDown={(e) => e.stopPropagation()} // 아이콘 클릭이 토글 버튼 클릭으로 튀는 거 방지
                  >
                    <InfoIcon className="h-5 w-5" />
                  </span>
                )}
              </div>

              <span
                className={[
                  "inline-flex items-center justify-center",
                  "transition-transform duration-150 opacity-70",
                  isOpen ? "rotate-180" : "rotate-0",
                ].join(" ")}
              >
                <Image
                  src="/icons/arrowdown.svg"
                  alt="toggle"
                  width={10}
                  height={10}
                />
              </span>
            </button>

            {/* 섹션 내용 */}
            {isOpen && (
              <div className="mt-3 space-y-2">
                {sec.tasks.map((task) => {
                  const checked = !!task.checked;

                  return (
                    <button
                      key={task.id}
                      disabled={isToggling}
                      onClick={() =>
                        onToggleChecklist(task.checklistId, checked)
                      }
                      className={[
                        "w-full text-left",
                        "flex items-start gap-3",
                        "rounded-[12px] px-4 py-3",
                        "transition-colors",
                        checked ? "bg-blue-50" : "",
                        checked
                          ? "hover:bg-blue-100/60"
                          : "hover:bg-black/[0.03]",
                      ].join(" ")}
                    >
                      {/* 체크박스: 이미지 파일로 연결 */}
                      <span className="mt-[2px] shrink-0">
                        <Image
                          src={
                            checked
                              ? "/icons/checkbox-checked.svg"
                              : "/icons/checkbox-empty.svg"
                          }
                          alt={checked ? "checked" : "unchecked"}
                          width={20}
                          height={20}
                        />
                      </span>

                      <span className="flex-1 text-[14px] leading-5 text-gray-800">
                        {task.text}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
}
