"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import JobPostDetailDrawer from "@/app/components/card-detail/JobPostDetailDrawer";
import type { JobPostCardData } from "@/app/(page)/mainboard/_components/PostCard";
import Canvas, { BoardCard, TabId } from "../_components/Canvas";

export default function DashboardPage() {
  const router = useRouter();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobPostCardData | null>(null);

  const onCardClick = (card: BoardCard) => {
    setSelectedJob(card.data);
    setDrawerOpen(true);
  };

  const onChangeTab = (tab: TabId) => {
    if (tab === "dashboard") return;
    router.push("/mainboard/interview");
  };

  return (
    <Canvas
      activeTab="dashboard"
      onChangeTab={onChangeTab}
      backgroundClassName="bg-dots"
      onCardClick={onCardClick}
      renderFixedOverlays={() => (
        <JobPostDetailDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          job={selectedJob}
        />
      )}
    />
  );
}
