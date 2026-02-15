"use client";

import { useMemo, useState } from "react";

import InfiniteCanvas from "@/app/(page)/mainboard/_components/InfiniteCanvas";
import CanvasHeader from "@/app/components/header/CanvasHeader";
import CanvasSidebar from "@/app/components/header/CanvasSidebar";

import type { JobPostCardData } from "@/app/(page)/mainboard/_components/PostCard";
import DraggableJobCard from "@/app/(page)/mainboard/_components/DraggablePostCard";

export type TabId = "dashboard" | "interview";
export type SideId = "link" | "list" | "user" | "settings";

export type BoardCard = {
  id: string;
  x: number;
  y: number;
  data: JobPostCardData;
};

type RenderCtx = {
  scale: number;
  setGesturesBlocked: (blocked: boolean) => void;
};

type Props = {
  activeTab: TabId;
  onChangeTab: (tab: TabId) => void;

  backgroundClassName?: string;

  // 카드 클릭 시 페이지별 처리
  onCardClick?: (card: BoardCard) => void;

  // 보드(캔버스) 위에 추가로 렌더(면접 질문 패널 같은 것)
  renderBoardExtras?: (args: {
    ctx: RenderCtx;
    cards: BoardCard[];
  }) => React.ReactNode;

  // 캔버스 밖(고정 레이어)에 추가로 렌더(대쉬보드 Drawer 같은 것)
  renderFixedOverlays?: (args: { cards: BoardCard[] }) => React.ReactNode;
};

export default function Canvas({
  activeTab,
  onChangeTab,
  backgroundClassName,

  onCardClick,
  renderBoardExtras,
  renderFixedOverlays,
}: Props) {
  const [activeSide, setActiveSide] = useState<SideId | null>(null);

  const [cards, setCards] = useState<BoardCard[]>([
    {
      id: "a",
      x: 220,
      y: 160,
      data: {
        id: "a",
        dday: 3,
        match: { status: "pending" },
        title: "Backend Developer (Java)",
        meta: "네이버랩스 · 인턴 / 계약직",
        bullets: [
          "대규모 트래픽 API 설계 및 운영",
          "Spring 기반 서버 개발 및 유지보수",
        ],
        keywords: [
          { text: "Java", variant: "blue" },
          { text: "Spring", variant: "blue" },
          { text: "RDB 경험", variant: "blue" },
        ],
      },
    },
    {
      id: "b",
      x: 680,
      y: 160,
      data: {
        id: "b",
        dday: 5,
        match: { status: "done", rate: 23 },
        title: "Backend Developer (Java)",
        meta: "네이버랩스 · 인턴 / 계약직",
        bullets: [
          "대규모 트래픽 API 설계 및 운영",
          "Spring 기반 서버 개발 및 유지보수",
        ],
        keywords: [
          { text: "Java", variant: "blue" },
          { text: "Spring", variant: "blue" },
          { text: "RDB 경험", variant: "blue" },
        ],
      },
    },
  ]);

  const SIDEBAR_LEFT = 16; // left-4
  const SIDEBAR_WIDTH = 76;
  const GAP = 12;
  const HEADER_GAP = 16;
  const PANEL_WIDTH = 280;

  const isPanelOpen = activeSide === "link";

  const headerLeft = useMemo(() => {
    const base = SIDEBAR_LEFT + SIDEBAR_WIDTH + HEADER_GAP;
    return isPanelOpen ? base + GAP + PANEL_WIDTH : base;
  }, [isPanelOpen]);

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <InfiniteCanvas backgroundClassName={backgroundClassName}>
        {({ scale, setGesturesBlocked }) => {
          const ctx = { scale, setGesturesBlocked };

          return (
            <>
              {cards.map((c) => (
                <DraggableJobCard
                  key={c.id}
                  id={c.id}
                  x={c.x}
                  y={c.y}
                  data={c.data}
                  scale={scale}
                  setGesturesBlocked={setGesturesBlocked}
                  onMove={(id, nextX, nextY) => {
                    setCards((prev) =>
                      prev.map((p) =>
                        p.id === id ? { ...p, x: nextX, y: nextY } : p,
                      ),
                    );
                  }}
                  onClick={() => onCardClick?.(c)}
                />
              ))}

              {renderBoardExtras?.({ ctx, cards })}
            </>
          );
        }}
      </InfiniteCanvas>

      {/* Sidebar */}
      <div className="fixed left-4 top-4 bottom-4 z-50">
        <CanvasSidebar
          active={activeSide}
          onSelect={setActiveSide}
          panelWidth={PANEL_WIDTH}
          onNavigate={(id) => {
            console.log("navigate:", id);
          }}
        />
      </div>

      {/* Header */}
      <div
        className="fixed top-2 z-50 transition-[left] duration-200 ease-out"
        style={{ left: headerLeft }}
      >
        <CanvasHeader
          activeTab={activeTab}
          onChangeTab={onChangeTab}
          onClickFilter={() => console.log("filter click")}
        />
      </div>

      {renderFixedOverlays?.({ cards })}
    </div>
  );
}
