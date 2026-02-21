"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { JobChecklist } from "../_types/checklist";
import MatchRateBadge from "@/app/components/common/badge&label/MatchRateBadge";
import Image from "next/image";
import {
  useMarkChecklistSeen,
  useToggleChecklist,
} from "@/app/lib/api/checklist.api";

type Props = {
  data: JobChecklist;
};

export default function ChecklistCard({ data }: Props) {
  const [open, setOpen] = useState(false);

  const toggleMut = useToggleChecklist();
  const seenMut = useMarkChecklistSeen();

  const didMarkSeenRef = useRef(false);

  const [overrideDoneByChecklistId, setOverrideDoneByChecklistId] = useState<
    Record<number, boolean>
  >({});

  const effectiveOverride = useMemo(() => {
    const validIds = new Set(data.tasks.map((t) => t.checklistId));
    const next: Record<number, boolean> = {};
    for (const [k, v] of Object.entries(overrideDoneByChecklistId)) {
      const id = Number(k);
      if (validIds.has(id)) next[id] = v;
    }
    return next;
  }, [data.tasks, overrideDoneByChecklistId]);

  const tasks = useMemo(() => {
    return data.tasks.map((t) => {
      const overridden = effectiveOverride[t.checklistId];
      return {
        ...t,
        done: typeof overridden === "boolean" ? overridden : t.done,
      };
    });
  }, [data.tasks, effectiveOverride]);

  const total = tasks.length;
  const done = useMemo(() => tasks.filter((t) => t.done).length, [tasks]);

  useEffect(() => {
    if (data.isNew) didMarkSeenRef.current = false;
  }, [data.isNew]);

  useEffect(() => {
    if (!open) return;
    if (!data.isNew) return;
    if (didMarkSeenRef.current) return;

    didMarkSeenRef.current = true;
    seenMut.mutate(data.matchId, {
      onError: () => {
        didMarkSeenRef.current = false;
      },
    });
  }, [open, data.isNew, data.matchId, seenMut]);

  const onToggleOpen = () => setOpen((v) => !v);

  const onToggleChecklist = (checklistId: number) => {
    if (toggleMut.isPending) return;

    const current =
      tasks.find((t) => t.checklistId === checklistId)?.done ?? false;

    setOverrideDoneByChecklistId((prev) => ({
      ...prev,
      [checklistId]: !current,
    }));

    toggleMut.mutate(checklistId, {
      onSuccess: (res) => {
        const next = res.isButtonActive;
        if (typeof next === "boolean") {
          setOverrideDoneByChecklistId((prev) => ({
            ...prev,
            [checklistId]: next,
          }));
        }
      },
      onError: (e) => {
        setOverrideDoneByChecklistId((prev) => ({
          ...prev,
          [checklistId]: current,
        }));
        alert(e.message);
      },
    });
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
          <p className="text-sm text-gray-400"> {data.meta}</p>
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

      {open && (
        <div className="mt-6 space-y-1 pb-10">
          {tasks.map((task) => {
            const checked = !!task.done;

            return (
              <button
                key={task.id}
                onClick={() => onToggleChecklist(task.checklistId)}
                disabled={toggleMut.isPending}
                className={[
                  "w-full text-left",
                  "flex items-start gap-3",
                  "rounded-[12px] px-4 py-3",
                  "transition-colors",
                  checked ? "bg-blue-50" : "",
                  checked ? "hover:bg-blue-100/60" : "hover:bg-black/[0.03]",
                  toggleMut.isPending ? "opacity-70 cursor-not-allowed" : "",
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

      <div className="relative">
        <button
          onClick={onToggleOpen}
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
