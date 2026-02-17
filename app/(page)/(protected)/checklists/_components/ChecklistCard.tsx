"use client";

import { useMemo, useState } from "react";
import { JobChecklist } from "../_types/checklist";
import MatchRateBadge from "@/app/components/common/badge&label/MatchRateBadge";
import Image from "next/image";

type Props = {
  data: JobChecklist;
};

export default function ChecklistCard({ data }: Props) {
  const [open, setOpen] = useState(false);

  const [tasks, setTasks] = useState(() => data.tasks);

  const total = tasks.length;
  const done = useMemo(() => tasks.filter((t) => t.done).length, [tasks]);

  const toggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, done: !t.done } : t)),
    );
  };

  return (
    <div className="rounded-[20px] bg-white p-6 shadow-sm border border-gray-100">
      {/* 헤더 */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            {data.isNew && (
              <span className="h-2 w-2 rounded-full bg-yellow-400" />
            )}
            {done}/{total}
          </div>

          <h3 className="mt-1 text-lg font-semibold text-gray-900">
            {data.title}
          </h3>
          <p className="text-sm text-gray-400">{data.meta}</p>
        </div>

        <MatchRateBadge status="done" rate={data.rate} />
      </div>

      <div className="my-4 h-px w-full bg-black/5" />

      {/* 키워드 */}
      <div className="mt-3 flex flex-wrap gap-2">
        <Image src="/icons/des_ai.svg" alt="ai 분석" width={20} height={20} />
        {data.keywords.map((k) => (
          <span
            key={k}
            className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-500"
          >
            {k}
          </span>
        ))}
      </div>

      <div className="my-4 h-px w-full bg-black/5" />

      {/* ===================== 체크리스트 영역 ===================== */}
      {open && (
        <div className="mt-6 space-y-1 pb-10">
          {tasks.map((task) => {
            const checked = !!task.done;

            return (
              <button
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className={[
                  "w-full text-left",
                  "flex items-start gap-3",
                  "rounded-[12px] px-4 py-3",
                  "transition-colors",
                  checked ? "bg-blue-50" : "",
                  checked ? "hover:bg-blue-100/60" : "hover:bg-black/[0.03]",
                ].join(" ")}
              >
                {/* 체크박스 이미지 */}
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

      {/* ===================== 토글 버튼 (항상 존재 + 자연스러운 회전) ===================== */}
      <div className="relative">
        <button
          onClick={() => setOpen((v) => !v)}
          className={[
            "absolute left-1/2 -translate-x-1/2",
            "transition-all duration-300 ease-out",
            open ? "bottom-0 translate-y-full mt-6 mb-5" : "top-0",
          ].join(" ")}
        >
          <Image
            src="/icons/chevrondown.svg"
            alt="toggle"
            width={16}
            height={16}
            className={[
              "transition-transform duration-300 ease-out",
              open ? "rotate-180" : "rotate-0",
            ].join(" ")}
          />
        </button>
      </div>
    </div>
  );
}
