"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Canvas, { BoardCard, TabId } from "../_components/Canvas";
import InterviewQuestionsCard from "../_components/InterviewQuestionsCard";
import InterviewIntroOverlay from "../_components/InterviewIntroOverlay";
import DashedConnector from "../_components/DashedConnector";

type PanelPos = { x: number; y: number };

export default function InterviewPage() {
  const router = useRouter();

  const [introOpen, setIntroOpen] = useState(true);
  const [openCardId, setOpenCardId] = useState<string | null>(null);

  const [cardRect, setCardRect] = useState<DOMRect | null>(null);
  const [panelPos, setPanelPos] = useState<PanelPos | null>(null);

  const onChangeTab = (tab: TabId) => {
    if (tab === "interview") return;
    router.push("/mainboard/dashboard");
  };

  const onCardClick = (card: BoardCard) => {
    setOpenCardId((prev) => (prev === card.id ? null : card.id));
  };

  useEffect(() => {
    if (!openCardId) {
      setCardRect(null);
      setPanelPos(null);
      return;
    }

    const el = document.querySelector(
      `[data-card-id="${openCardId}"]`,
    ) as HTMLElement | null;

    if (!el) return;

    const r = el.getBoundingClientRect();
    setCardRect(r);

    const PANEL_GAP = 24; // 카드 오른쪽으로 띄우는 간격(화면 기준)
    const nextX = r.right + PANEL_GAP;
    const nextY = r.top;

    setPanelPos({ x: nextX, y: nextY });
  }, [openCardId]);

  // ✅ 열려있는 동안: 리사이즈/스크롤(혹은 레이아웃 변화) 시에도 rect 재계산
  useEffect(() => {
    if (!openCardId) return;

    const recalc = () => {
      const el = document.querySelector(
        `[data-card-id="${openCardId}"]`,
      ) as HTMLElement | null;
      if (!el) return;

      const r = el.getBoundingClientRect();
      setCardRect(r);

      const PANEL_GAP = 24;
      setPanelPos({ x: r.right + PANEL_GAP, y: r.top });
    };

    window.addEventListener("resize", recalc);
    // 캔버스가 스크롤되는 구조가 아니라면 없어도 되지만, 안전하게 넣어둠
    window.addEventListener("scroll", recalc, true);

    return () => {
      window.removeEventListener("resize", recalc);
      window.removeEventListener("scroll", recalc, true);
    };
  }, [openCardId]);

  // ✅ 바깥 클릭 닫기: fixed 오버레이를 쓰면 오버레이 클릭으로 닫을 수 있어서
  //    기존 window pointerdown 로직은 유지하되, 인터뷰 패널/카드 클릭은 예외 처리
  useEffect(() => {
    if (!openCardId) return;

    const onPointerDown = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;

      // 질문카드 내부 클릭이면 닫지 않음
      if (t.closest('[data-interview-panel="true"]')) return;

      // 보드 카드(어떤 카드든) 클릭이면 닫지 않음
      if (t.closest('[data-board-card="true"]')) return;

      setOpenCardId(null);
    };

    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [openCardId]);

  const showPanel = !!openCardId && !!cardRect && !!panelPos;

  return (
    <Canvas
      activeTab="interview"
      onChangeTab={onChangeTab}
      backgroundClassName="bg-main-click"
      onCardClick={onCardClick}
      activeCardId={openCardId}
      gesturesLocked={!!openCardId}
      renderBoardExtras={() => null}
      renderFixedOverlays={() => (
        <>
          <InterviewIntroOverlay
            open={introOpen}
            onClose={() => setIntroOpen(false)}
            iconSrc="/icons/info.svg"
          />

          {showPanel && (
            <div className="fixed inset-0 z-[120] pointer-events-auto">
              <div className="absolute inset-0" />

              <DashedConnector fromRect={cardRect} toPos={panelPos} />

              <div
                className="fixed z-[130] pointer-events-auto"
                style={{ left: panelPos.x, top: panelPos.y }}
                // 오버레이 닫기 방지
                onPointerDown={(e) => e.stopPropagation()}
              >
                <InterviewQuestionsCard
                  cardId={Number(openCardId)}
                  x={0}
                  y={0}
                  onClose={() => setOpenCardId(null)}
                />
              </div>
            </div>
          )}
        </>
      )}
    />
  );
}
