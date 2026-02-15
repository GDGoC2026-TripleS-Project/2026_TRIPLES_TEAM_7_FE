"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Canvas, { BoardCard, TabId } from "../_components/Canvas";

export default function InterviewPage() {
  const router = useRouter();

  const [openCardId, setOpenCardId] = useState<string | null>(null);

  const onChangeTab = (tab: TabId) => {
    if (tab === "interview") return;
    router.push("/mainboard/dashboard");
  };

  const onCardClick = (card: BoardCard) => {
    setOpenCardId((prev) => (prev === card.id ? null : card.id));
  };

  return (
    <Canvas
      activeTab="interview"
      onChangeTab={onChangeTab}
      backgroundClassName="bg-main-click"
      onCardClick={onCardClick}
    />
  );
}
