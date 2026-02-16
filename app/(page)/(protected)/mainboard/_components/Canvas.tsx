"use client";

import { useMemo, useState } from "react";

import InfiniteCanvas from "@/app/(page)/(protected)/mainboard/_components/InfiniteCanvas";
import CanvasHeader from "@/app/components/header/CanvasHeader";

import type { JobPostCardData } from "@/app/(page)/(protected)/mainboard/_components/PostCard";
import DraggableJobCard from "@/app/(page)/(protected)/mainboard/_components/DraggablePostCard";

export type TabId = "dashboard" | "interview";

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

  activeCardId?: string | null;

  dimWhenActive?: boolean;

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
  activeCardId,
  dimWhenActive = true,
  onCardClick,
  renderBoardExtras,
  renderFixedOverlays,
}: Props) {
  const [cards, setCards] = useState<BoardCard[]>([
    {
      id: "a",
      x: 220,
      y: 160,
      data: {
        id: "a",
        dday: 3,
        match: { status: "done", rate: 70 },
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

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <InfiniteCanvas backgroundClassName={backgroundClassName}>
        {({ scale, setGesturesBlocked }) => {
          const ctx = { scale, setGesturesBlocked };

          return (
            <>
              {/* ✅ 딤을 "캔버스 내부"에 렌더 */}
              {dimWhenActive && activeCardId && (
                <div className="pointer-events-none absolute inset-0 z-[50] bg-black/50" />
              )}

              {cards.map((c) => {
                const isActive = activeCardId === c.id;

                return (
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
                    className={isActive ? "z-[60]" : "z-[10]"}
                    // ✅ 추가: 카드 강조를 JobPostCard에 주기 위해
                    isActive={isActive}
                  />
                );
              })}

              {renderBoardExtras?.({ ctx, cards })}
            </>
          );
        }}
      </InfiniteCanvas>

      <div
        className="fixed top-2 z-50 transition-[left] duration-200 ease-out"
        style={{ left: "var(--protected-header-left, 108px)" }}
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
