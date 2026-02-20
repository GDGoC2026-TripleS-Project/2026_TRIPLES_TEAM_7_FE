"use client";

import { JobPostCardData } from "@/app/(page)/(protected)/mainboard/_components/PostCard";
import React, { useState } from "react";
import TabBar from "../common/button&tab/TabBar";
import JobPostDetailInfo from "./JobPostDetailInfo";
import JobPostDetailMatch from "./JobPostDetailMatch";
import JobPostDetailChecklist from "./JobPostDetailChecklist";
import Image from "next/image";
import { useCardDetail } from "@/app/lib/api/card.api";

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

export default function JobPostDetailDrawer(props: Props) {
  const { job } = props;
  if (!job) return null;

  return <JobPostDetailDrawerInner key={job.id} {...props} />;
}

function JobPostDetailDrawerInner({
  open,
  onClose,
  job,
  showOverlay = true,
}: Props) {
  const [tab, setTab] = useState<TabId>("info");

  const cardId = job ? Number(job.id) : undefined;

  const {
    data: detailRes,
    isLoading,
    isError,
    error,
    refetch,
  } = useCardDetail(
    typeof cardId === "number" && Number.isFinite(cardId) ? cardId : undefined,
  );

  if (!job) return null;

  const detail = detailRes?.data;

  return (
    <>
      {/* Overlay */}
      <div
        className={[
          "fixed inset-0 z-[90] transition-opacity duration-200",
          open ? "opacity-100" : "pointer-events-none opacity-0",
          // showOverlay가 true면 딤, false면 투명(딤 없음)
          !showOverlay && "pointer-events-none",
          showOverlay ? "bg-black/10" : "bg-transparent",
        ].join(" ")}
        onPointerDown={onClose}
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
        onPointerDown={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-7 pt-7">
          <div className="inline-flex items-center gap-5 text-[16px]/[16px] font-semibold text-main">
            <Image
              src="/icons/close_panel.svg"
              alt="close"
              width={20}
              height={20}
              onClick={onClose}
              className="cursor-pointer"
            />
            <span>상세페이지</span>
          </div>
        </div>

        {/* TabBar */}
        <div className="mt-7">
          <TabBar<TabId> value={tab} items={[...TAB_ITEMS]} onChange={setTab} />
        </div>

        {/* Body (scroll) */}
        <div className="h-[calc(100%-110px)] overflow-y-auto px-7 pb-10 pt-7">
          {tab === "info" && (
            <>
              {isLoading && (
                <div className="mb-4 rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-600">
                  상세 정보를 불러오는 중...
                </div>
              )}

              {isError && (
                <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                  상세 정보를 불러오지 못했어요.{" "}
                  <button
                    className="ml-2 underline"
                    onClick={() => refetch()}
                    type="button"
                  >
                    다시 시도
                  </button>
                  <div className="mt-1 text-[12px] text-red-500">
                    {error?.message}
                  </div>
                </div>
              )}

              <JobPostDetailInfo job={job} detail={detail} />
            </>
          )}
          {tab === "match" && <JobPostDetailMatch job={job} />}
          {tab === "checklist" && <JobPostDetailChecklist job={job} />}
        </div>
      </aside>
    </>
  );
}
