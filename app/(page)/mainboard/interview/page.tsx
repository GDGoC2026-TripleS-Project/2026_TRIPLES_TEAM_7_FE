"use client";

import { useEffect, useMemo, useState } from "react";
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

  useEffect(() => {
    if (!openCardId) return;

    const onPointerDown = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;

      // 질문카드 내부 클릭이면 닫지 않음
      if (t.closest('[data-interview-panel="true"]')) return;

      // 보드 카드(어떤 카드든) 클릭이면 닫지 않음 (카드 클릭 로직이 전환/토글 담당)
      if (t.closest('[data-board-card="true"]')) return;

      // 그 외(빈 공간) 클릭이면 닫기
      setOpenCardId(null);
    };

    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [openCardId]);

  return (
    <Canvas
      activeTab="interview"
      onChangeTab={onChangeTab}
      backgroundClassName="bg-main-click"
      onCardClick={onCardClick}
      activeCardId={openCardId}
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
