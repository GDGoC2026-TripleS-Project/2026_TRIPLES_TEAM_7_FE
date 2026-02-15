"use client";

import { JobPostCardData } from "@/app/(page)/mainboard/_components/PostCard";
import React, { useEffect, useState } from "react";
import TabBar from "../common/button&tab/TabBar";
import JobPostDetailInfo from "./JobPostDetailInfo";
import JobPostDetailMatch from "./JobPostDetailMatch";
import JobPostDetailChecklist from "./JobPostDetailChecklist";

type TabId = "info" | "match" | "checklist";

type Props = {
  open: boolean;
  onClose: () => void;
  job: JobPostCardData | null;

  showOverlay?: boolean;
};

const TAB_ITEMS = [
  { id: "info", label: "정보" },
  { id: "match", label: "나의 매치율" },
  { id: "checklist", label: "체크리스트" },
] as const;

export default function JobPostDetailDrawer({
  open,
  onClose,
  job,
  showOverlay = true,
}: Props) {
  const [tab, setTab] = useState<TabId>("info");

  useEffect(() => {
    setTab("info");
  }, [job?.id]);

  if (!job) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className={[
          "fixed inset-0 z-[90] transition-opacity duration-200",
          open ? "opacity-100" : "pointer-events-none opacity-0",
          // showOverlay가 true면 딤, false면 투명(딤 없음)
          showOverlay ? "bg-black/10" : "bg-transparent",
        ].join(" ")}
        onPointerDown={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        data-job-drawer="true"
        className={[
          "fixed top-4 bottom-4 right-4 z-[100]",
          "w-[520px] max-w-[calc(100vw-32px)]",
          "rounded-2xl bg-white shadow-2xl",
          "transition-transform duration-200 ease-out",
          open ? "translate-x-0" : "translate-x-[110%]",
          "overflow-hidden",
        ].join(" ")}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5">
          <div className="inline-flex items-center gap-2 text-[14px] font-semibold text-gray-700">
            <span className="inline-flex h-4 w-4 rounded-[4px] border border-gray-300" />
            <span>상세페이지</span>
          </div>

          <button
            onClick={onClose}
            className="rounded-md px-2 py-1 text-gray-500 hover:text-gray-800"
          >
            ✕
          </button>
        </div>

        {/* TabBar */}
        <div className="mt-3">
          <TabBar<TabId> value={tab} items={[...TAB_ITEMS]} onChange={setTab} />
        </div>

        {/* Body (scroll) */}
        <div className="h-[calc(100%-110px)] overflow-y-auto px-5 pb-10 pt-5">
          {tab === "info" && <JobPostDetailInfo job={job} />}
          {tab === "match" && <JobPostDetailMatch job={job} />}
          {tab === "checklist" && <JobPostDetailChecklist job={job} />}
        </div>
      </aside>
    </>
  );
}
