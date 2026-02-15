"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Canvas, { BoardCard, TabId } from "../_components/Canvas";
import InterviewQuestionsCard from "../_components/InterviewQuestionsCard";
import InterviewIntroOverlay from "../_components/InterviewIntroOverlay";

export default function InterviewPage() {
  const router = useRouter();

  const [introOpen, setIntroOpen] = useState(true);

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
      activeCardId={openCardId}
      boardDimmed={!!openCardId}
      onBoardDimClick={() => setOpenCardId(null)}
      renderBoardExtras={({ cards }) => {
        if (!openCardId) return null;
        const card = cards.find((c) => c.id === openCardId);
        if (!card) return null;

        const PANEL_OFFSET_X = 380;
        return (
          <InterviewQuestionsCard
            x={card.x + PANEL_OFFSET_X}
            y={card.y}
            onClose={() => setOpenCardId(null)}
            onRefresh={() => console.log("refresh questions")}
          />
        );
      }}
      renderFixedOverlays={() => (
        <InterviewIntroOverlay
          open={introOpen}
          onClose={() => setIntroOpen(false)}
          iconSrc="/icons/info.svg"
        />
      )}
    />
  );
}
