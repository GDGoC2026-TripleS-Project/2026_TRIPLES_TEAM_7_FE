"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import JobPostDetailDrawer from "@/app/components/card-detail/JobPostDetailDrawer";
import type { JobPostCardData } from "@/app/(page)/(protected)/mainboard/_components/PostCard";
import Canvas, { BoardCard, TabId } from "../_components/Canvas";

type Selected = {
  cardId: string;
  job: JobPostCardData;
};

export default function DashboardPage() {
  const router = useRouter();

  const [openCardId, setOpenCardId] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<JobPostCardData | null>(null);

  const [linkOpen, setLinkOpen] = useState(true);

  const onCardClick = (card: BoardCard) => {
    setOpenCardId((prev) => {
      // 같은 카드면 닫기
      if (prev === card.id) {
        setSelectedJob(null);
        return null;
      }
      // 다른 카드면 즉시 전환
      setSelectedJob(card.data);
      return card.id;
    });
  };

  const onChangeTab = (tab: TabId) => {
    if (tab === "dashboard") return;
    router.push("/mainboard/interview");
  };

  useEffect(() => {
    if (!openCardId) return;

    const onPointerDown = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;

      // 드로어 내부 클릭이면 닫지 않음 (drawer에 data-attr 추가할 예정)
      if (t.closest('[data-job-drawer="true"]')) return;

      // 카드 클릭이면(다른 카드로 전환/토글은 onCardClick이 담당) 닫지 않음
      if (t.closest('[data-board-card="true"]')) return;

      setOpenCardId(null);
      setSelectedJob(null);
    };

    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [openCardId]);

  const drawerOpen = !!openCardId;

  return (
    <Canvas
      activeTab="dashboard"
      onChangeTab={onChangeTab}
      backgroundClassName="bg-dots"
      onCardClick={onCardClick}
      activeCardId={openCardId}
      dimWhenActive={false}
      renderFixedOverlays={() => (
        <JobPostDetailDrawer
          open={drawerOpen}
          onClose={() => {
            setOpenCardId(null);
            setSelectedJob(null);
          }}
          job={selectedJob}
          showOverlay={false}
        />
      )}
    />
  );
}
