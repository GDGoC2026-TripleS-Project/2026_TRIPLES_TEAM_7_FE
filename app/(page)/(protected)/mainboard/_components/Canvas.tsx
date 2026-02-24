"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import InfiniteCanvas from "@/app/(page)/(protected)/mainboard/_components/InfiniteCanvas";
import CanvasHeader from "@/app/components/header/CanvasHeader";

import type { JobPostCardData } from "@/app/(page)/(protected)/mainboard/_components/PostCard";
import DraggableJobCard from "@/app/(page)/(protected)/mainboard/_components/DraggablePostCard";
import {
  CanvasCardItem,
  CanvasPrioritySort,
  useCanvasCards,
  useCanvasSortedCardsData,
  useUpdateCanvasCardPosition,
} from "@/app/lib/api/card.api";
import { useSetAllCardsToInterview } from "@/app/lib/api/interview.api";
import { mapEmploymentTypeToLabel } from "@/app/lib/constants/mapEmploymentType";

export type TabId = "dashboard" | "interview";
type SortId = "deadline" | "distance" | "salary" | "match";

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
  contextCardId?: string | null;
  gesturesLocked?: boolean;
};

function safeNum(n: any, fallback = 0) {
  const v = typeof n === "number" ? n : Number(n);
  return Number.isFinite(v) ? v : fallback;
}

function calcDday(deadlineAt: string) {
  const end = new Date(deadlineAt).getTime();
  const now = Date.now();
  const diff = end - now;
  if (diff < 0) return { isClosed: true, dday: 0 };
  const day = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return { isClosed: false, dday: Math.max(0, day) };
}

function mapToBoardCard(item: CanvasCardItem): BoardCard {
  const c = item.cardContent;
  const mp = c.matchPercent;

  const { dday } = calcDday(c.deadlineAt);

  return {
    id: String(item.cardId),
    x: safeNum((item as any).canvasX, 0),
    y: safeNum((item as any).canvasY, 0),
    data: {
      id: String(item.cardId),
      dday,
      match:
        typeof mp === "number"
          ? { status: "done", rate: mp }
          : { status: "pending" },
      title: c.jobTitle,
      meta: `${c.companyName} · ${mapEmploymentTypeToLabel(c.employmentType)}`,
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

function normalizeCardIds(cardIds: unknown): number[] {
  if (Array.isArray(cardIds)) {
    return cardIds
      .map((v) => (typeof v === "number" ? v : Number(v)))
      .filter((n) => Number.isFinite(n));
  }

  if (typeof cardIds === "number") return [cardIds];

  if (typeof cardIds === "string") {
    return cardIds
      .split(",")
      .map((s) => Number(s.trim()))
      .filter((n) => Number.isFinite(n));
  }

  if (cardIds && typeof cardIds === "object") {
    const maybe = (cardIds as any).cardIds ?? (cardIds as any).ids;
    if (Array.isArray(maybe)) return normalizeCardIds(maybe);
  }

  return [];
}

function mapSortIdToApiSort(sort: SortId): CanvasPrioritySort {
  switch (sort) {
    case "deadline":
      return "deadline";
    case "salary":
      return "salary";
    case "distance":
      return "distance";
    case "match":
      return "matchedPercent";
  }
}

function buildAutoLayoutPositions(args: {
  groups: { priorityLevel: number; cardIds: number[] }[];
  cardsById: Map<string, BoardCard>;
}) {
  const { groups, cardsById } = args;

  const CARD_W = 280;
  const CARD_H = 320;
  const GAP_X = 40;
  const GAP_Y = 10;
  const GROUP_GAP_Y = 20;
  const COLS = 3;

  const startX = 0;
  let cursorY = 0;

  const nextPosById = new Map<string, { x: number; y: number }>();

  for (const group of groups) {
    const ids = normalizeCardIds((group as any).cardIds).map(String);

    ids.forEach((id, idx) => {
      const col = idx % COLS;
      const row = Math.floor(idx / COLS);

      const x = startX + col * (CARD_W + GAP_X);
      const y = cursorY + row * (CARD_H + GAP_Y);

      if (cardsById.has(id)) nextPosById.set(id, { x, y });
    });

    const rows = Math.ceil(ids.length / COLS);
    cursorY += rows * (CARD_H + GAP_Y) + GROUP_GAP_Y;
  }

  return nextPosById;
}

function CanvasInner(props: {
  scale: number;
  setGesturesBlocked: (blocked: boolean) => void;
  gesturesLocked: boolean;

  dimWhenActive: boolean;
  activeCardId?: string | null;

  isLoading: boolean;
  isInterviewPending: boolean;

  cards: BoardCard[];
  setCards: React.Dispatch<React.SetStateAction<BoardCard[]>>;

  updatePos: ReturnType<typeof useUpdateCanvasCardPosition>;
  onCardClick?: (card: BoardCard) => void;
  onCardContextMenu?: (args: { card: BoardCard; rect: DOMRect }) => void;

  renderBoardExtras?: (args: {
    ctx: RenderCtx;
    cards: BoardCard[];
  }) => React.ReactNode;
  contextCardId?: string | null;
}) {
  const {
    scale,
    setGesturesBlocked,
    gesturesLocked,
    dimWhenActive,
    activeCardId,
    isLoading,
    isInterviewPending,
    cards,
    setCards,
    updatePos,
    onCardClick,
    onCardContextMenu,
    renderBoardExtras,
    contextCardId,
  } = props;

  useEffect(() => {
    setGesturesBlocked(gesturesLocked);
  }, [gesturesLocked, setGesturesBlocked]);

  const ctx: RenderCtx = { scale, setGesturesBlocked };

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

      {isInterviewPending && (
        <div className="absolute left-210 top-[140px] z-[90] rounded-xl bg-white/80 px-3 py-2 text-sm text-gray-700">
          면접 시뮬레이션 준비 중...
        </div>
      )}

      {cards.map((c) => {
        const isActive = activeCardId === c.id;
        const isContext = contextCardId === c.id;

        const dimOthers = !!activeCardId; // 패널 열렸을 때만 dim 처리
        const dimClass = dimOthers && !isActive ? "opacity-35" : "opacity-100";

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
              updatePos.mutate(
                { cardId: Number(id), x: nextX, y: nextY },
                {
                  onError: (e: any) => {
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
            onContextMenu={(rect) => onCardContextMenu?.({ card: c, rect })}
            className={[
              "transition-opacity duration-150",
              dimClass,
              isContext ? "z-[121]" : isActive ? "z-[90]" : "z-[10]",
            ].join(" ")}
            isActive={isActive}
            gesturesLocked={gesturesLocked}
          />
        );
      })}

      {renderBoardExtras?.({ ctx, cards })}
    </>
  );
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
  contextCardId = null,
  gesturesLocked = false,
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

  const [sort, setSort] = useState<SortId | null>(null);

  const apiSort = useMemo(() => {
    if (sort == null) return null;
    return mapSortIdToApiSort(sort);
  }, [sort]);

  const { groups: sortedGroups } = useCanvasSortedCardsData(apiSort);

  useEffect(() => {
    if (!sortedGroups || sortedGroups.length === 0) return;

    setCards((prev) => {
      const cardsById = new Map(prev.map((c) => [c.id, c]));
      const nextPosById = buildAutoLayoutPositions({
        groups: sortedGroups,
        cardsById,
      });

      return prev.map((c) => {
        const nextPos = nextPosById.get(c.id);
        return nextPos ? { ...c, x: nextPos.x, y: nextPos.y } : c;
      });
    });
  }, [sortedGroups]);

  const prevTabRef = useRef<TabId>(activeTab);

  useEffect(() => {
    const prev = prevTabRef.current;

    if (prev !== "interview" && activeTab === "interview") {
      setInterview.mutate(undefined, {
        onSuccess: (res: any) => console.log("[INTERVIEW STATUS OK]", res),
        onError: (e: any) => {
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
        {({ scale, setGesturesBlocked }) => (
          <CanvasInner
            scale={scale}
            setGesturesBlocked={setGesturesBlocked}
            gesturesLocked={gesturesLocked}
            dimWhenActive={dimWhenActive}
            activeCardId={activeCardId}
            isLoading={isLoading}
            isInterviewPending={setInterview.isPending}
            cards={cards}
            setCards={setCards}
            updatePos={updatePos}
            onCardClick={onCardClick}
            onCardContextMenu={onCardContextMenu}
            renderBoardExtras={renderBoardExtras}
            contextCardId={contextCardId}
          />
        )}
      </InfiniteCanvas>

      <div
        className="fixed top-2 z-50 transition-[left] duration-200 ease-out"
        style={{ left: "var(--protected-header-left, 108px)" }}
      >
        <CanvasHeader
          activeTab={activeTab}
          onChangeTab={handleChangeTab}
          onChangeSort={(nextSort) => setSort(nextSort)}
          defaultSort={null}
        />
      </div>

      {renderFixedOverlays?.({ cards })}
    </div>
  );
}
