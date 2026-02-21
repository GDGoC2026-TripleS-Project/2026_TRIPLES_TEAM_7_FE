"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import InfiniteCanvas from "@/app/(page)/(protected)/mainboard/_components/InfiniteCanvas";
import CanvasHeader from "@/app/components/header/CanvasHeader";

import type { JobPostCardData } from "@/app/(page)/(protected)/mainboard/_components/PostCard";
import DraggableJobCard from "@/app/(page)/(protected)/mainboard/_components/DraggablePostCard";
import {
  CanvasCardItem,
  useCanvasCards,
  useUpdateCanvasCardPosition,
} from "@/app/lib/api/card.api";
import { useSetAllCardsToInterview } from "@/app/lib/api/interview.api";

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

  onCardClick?: (card: BoardCard) => void;

  onCardContextMenu?: (args: { card: BoardCard; rect: DOMRect }) => void;

  renderBoardExtras?: (args: {
    ctx: RenderCtx;
    cards: BoardCard[];
  }) => React.ReactNode;

  renderFixedOverlays?: (args: { cards: BoardCard[] }) => React.ReactNode;
};

function safeNum(n: any, fallback = 0) {
  const v = typeof n === "number" ? n : Number(n);
  return Number.isFinite(v) ? v : fallback;
}

function calcDday(deadlineAt: string) {
  const end = new Date(deadlineAt).getTime();
  const now = Date.now();
  const diff = end - now;
  const day = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return Math.max(0, day);
}

function mapToBoardCard(item: CanvasCardItem): BoardCard {
  const c = item.cardContent;

  const mp = c.matchPercent;

  return {
    id: String(item.cardId),
    x: safeNum((item as any).canvasX, 0),
    y: safeNum((item as any).canvasY, 0),
    data: {
      id: String(item.cardId),
      dday: calcDday(c.deadlineAt),
      match:
        typeof mp === "number"
          ? { status: "done", rate: mp }
          : { status: "pending" },
      title: c.jobTitle,
      meta: `${c.companyName} · ${c.employmentType}`,
      bullets: String(c.roleText || "")
        .split("\n")
        .filter(Boolean)
        .slice(0, 2),
      keywords: (c.necessaryStack ?? []).slice(0, 6).map((t) => ({
        text: t,
        variant: "blue",
      })),
    },
  };
}

export default function Canvas({
  activeTab,
  onChangeTab,
  backgroundClassName,
  activeCardId,
  dimWhenActive = true,
  onCardClick,
  onCardContextMenu,
  renderBoardExtras,
  renderFixedOverlays,
}: Props) {
  const { data: apiCards, isLoading } = useCanvasCards();

  const updatePos = useUpdateCanvasCardPosition();

  const setInterview = useSetAllCardsToInterview();

  const mapped = useMemo(
    () => (apiCards ?? []).map(mapToBoardCard),
    [apiCards],
  );

  const [cards, setCards] = useState<BoardCard[]>([]);

  useEffect(() => {
    setCards(mapped);
  }, [mapped]);

  useEffect(() => {
    if (!apiCards) return;
    console.log("[GET /api/canvas] cards:", apiCards);
  }, [apiCards]);

  const prevTabRef = useRef<TabId>(activeTab);

  useEffect(() => {
    const prev = prevTabRef.current;

    if (prev !== "interview" && activeTab === "interview") {
      setInterview.mutate(undefined, {
        onSuccess: (res) => {
          console.log("[INTERVIEW STATUS OK]", res);
        },
        onError: (e) => {
          console.log("[INTERVIEW STATUS FAIL]", e);
          alert(e.message);
        },
      });
    }

    prevTabRef.current = activeTab;
  }, [activeTab, setInterview]);

  const handleChangeTab = (tab: TabId) => {
    if (setInterview.isPending) return;
    onChangeTab(tab);
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <InfiniteCanvas backgroundClassName={backgroundClassName}>
        {({ scale, setGesturesBlocked }) => {
          const ctx = { scale, setGesturesBlocked };

          return (
            <>
              {dimWhenActive && activeCardId && (
                <div className="pointer-events-none absolute inset-0 z-[50] bg-black/50" />
              )}

              {isLoading && (
                <div className="absolute left-210 top-90 z-[80] rounded-xl bg-white/70 px-3 py-2 text-lg">
                  불러오는 중...
                </div>
              )}

              {/* 이상하면 빼기 */}
              {setInterview.isPending && (
                <div className="absolute left-210 top-[140px] z-[90] rounded-xl bg-white/80 px-3 py-2 text-sm text-gray-700">
                  면접 시뮬레이션 준비 중...
                </div>
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
                    onDrop={({ id, prevX, prevY, nextX, nextY }) => {
                      console.log("[DROP]", { id, prevX, prevY, nextX, nextY });

                      updatePos.mutate(
                        {
                          cardId: Number(id),
                          x: nextX,
                          y: nextY,
                        },
                        {
                          onSuccess: (res) => {
                            console.log("[UPDATE OK] POST /api/canvas:", res);
                          },
                          onError: (e) => {
                            console.log("[UPDATE FAIL] POST /api/canvas:", e);

                            setCards((prev) =>
                              prev.map((p) =>
                                p.id === id ? { ...p, x: prevX, y: prevY } : p,
                              ),
                            );
                            alert(e.message);
                          },
                        },
                      );
                    }}
                    onClick={() => onCardClick?.(c)}
                    onContextMenu={(rect) =>
                      onCardContextMenu?.({ card: c, rect })
                    }
                    className={isActive ? "z-[60]" : "z-[10]"}
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
          onChangeTab={handleChangeTab}
          onChangeSort={(sort) => console.log("sort:", sort)}
        />
      </div>

      {renderFixedOverlays?.({ cards })}
    </div>
  );
}
