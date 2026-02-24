"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";

import Canvas, { BoardCard, TabId } from "../_components/Canvas";
import InterviewQuestionsCard from "../_components/InterviewQuestionsCard";
import InterviewIntroOverlay from "../_components/InterviewIntroOverlay";
import DashedConnector from "../_components/DashedConnector";

type PanelPos = { x: number; y: number };
type LayoutSnap = { cardRect: DOMRect | null; panelPos: PanelPos | null };

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

function BodyPortal({ children }: { children: React.ReactNode }) {
  const isClient = useIsClient();
  if (!isClient) return null;
  return createPortal(children, document.body);
}

function useInterviewPanelLayout(openCardId: string | null) {
  const snapRef = useRef<LayoutSnap>({ cardRect: null, panelPos: null });

  const compute = () => {
    if (!openCardId) return { cardRect: null, panelPos: null };

    const el = document.querySelector(
      `[data-card-id="${openCardId}"]`,
    ) as HTMLElement | null;

    if (!el) return { cardRect: null, panelPos: null };

    const r = el.getBoundingClientRect();
    const PANEL_GAP = 24;

    return {
      cardRect: r,
      panelPos: { x: r.right + PANEL_GAP, y: r.top },
    };
  };

  const same = (a: LayoutSnap, b: LayoutSnap) => {
    // panelPos 비교
    const ap = a.panelPos;
    const bp = b.panelPos;
    const samePos =
      (!ap && !bp) || (!!ap && !!bp && ap.x === bp.x && ap.y === bp.y);

    // DOMRect는 객체가 매번 새로 만들어지므로 "좌표 값"으로 비교
    const ar = a.cardRect;
    const br = b.cardRect;
    const sameRect =
      (!ar && !br) ||
      (!!ar &&
        !!br &&
        ar.left === br.left &&
        ar.top === br.top &&
        ar.right === br.right &&
        ar.bottom === br.bottom);

    return samePos && sameRect;
  };

  return useSyncExternalStore(
    (onStoreChange) => {
      if (typeof window === "undefined") return () => {};

      const update = () => {
        const next = compute();
        if (!same(snapRef.current, next)) {
          snapRef.current = next;
          onStoreChange();
        }
      };

      // 처음 한 번 계산(열렸을 때 바로 위치 잡기)
      update();

      window.addEventListener("resize", update);
      window.addEventListener("scroll", update, true);
      window.addEventListener("canvas:transform", update); // InfiniteCanvas에서 dispatch

      return () => {
        window.removeEventListener("resize", update);
        window.removeEventListener("scroll", update, true);
        window.removeEventListener("canvas:transform", update);
      };
    },
    () => snapRef.current, // ✅ 캐시된 스냅샷 그대로 반환
    () => ({ cardRect: null, panelPos: null }),
  );
}

export default function InterviewPage() {
  const router = useRouter();

  const [introOpen, setIntroOpen] = useState(true);
  const [openCardId, setOpenCardId] = useState<string | null>(null);

  const { cardRect, panelPos } = useInterviewPanelLayout(openCardId);
  const showPanel = !!openCardId && !!cardRect && !!panelPos;

  const onChangeTab = (tab: TabId) => {
    if (tab === "interview") return;
    router.push("/mainboard/dashboard");
  };

  const onCardClick = (card: BoardCard) => {
    setOpenCardId((prev) => (prev === card.id ? null : card.id));
  };

  /** ✅ 바깥 클릭 닫기: capture로 걸어서 제스처 핸들러가 막아도 닫히게 */
  useEffect(() => {
    if (!openCardId) return;

    const onPointerDownCapture = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;

      // 질문카드 내부 클릭이면 닫지 않음
      if (t.closest('[data-interview-panel="true"]')) return;

      // 보드 카드 클릭이면 (토글은 카드 클릭 로직이 처리)
      if (t.closest('[data-board-card="true"]')) return;

      setOpenCardId(null);
    };

    document.addEventListener("pointerdown", onPointerDownCapture, true);
    return () =>
      document.removeEventListener("pointerdown", onPointerDownCapture, true);
  }, [openCardId]);

  return (
    <>
      <Canvas
        activeTab="interview"
        onChangeTab={onChangeTab}
        backgroundClassName="bg-main-click"
        onCardClick={onCardClick}
        activeCardId={openCardId}
        gesturesLocked={!!openCardId}
        renderBoardExtras={() => null}
        dimWhenActive={false}
      />

      {/* ✅ 오버레이/패널은 무조건 body로 portal */}
      <BodyPortal>
        <InterviewIntroOverlay
          open={introOpen}
          onClose={() => setIntroOpen(false)}
          iconSrc="/icons/info.svg"
        />

        {showPanel && (
          <>
            {/* ✅ dim 오버레이: Transform 밖(body)에서 fixed로 */}
            <div className="fixed inset-0 z-[120] pointer-events-none" />

            {/* ✅ 커넥터 + 패널 */}
            <div className="fixed inset-0 z-[130] pointer-events-none">
              <DashedConnector fromRect={cardRect!} toPos={panelPos!} />

              <div
                className="fixed z-[140] pointer-events-auto"
                style={{ left: panelPos!.x, top: panelPos!.y }}
              >
                <InterviewQuestionsCard
                  cardId={Number(openCardId)}
                  x={0}
                  y={0}
                  onClose={() => setOpenCardId(null)}
                />
              </div>
            </div>
          </>
        )}
      </BodyPortal>
    </>
  );
}
