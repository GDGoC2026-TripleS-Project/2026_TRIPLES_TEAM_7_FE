"use client";

import React, { useEffect, useRef, useState } from "react";
import JobPostCard, { JobPostCardData } from "./PostCard";

type Props = {
  id: string;
  x: number;
  y: number;
  data: JobPostCardData;
  isActive?: boolean;

  scale: number;
  setGesturesBlocked: (v: boolean) => void;

  gesturesLocked?: boolean;

  onMove: (id: string, nextX: number, nextY: number) => void;

  onDrop?: (args: {
    id: string;
    prevX: number;
    prevY: number;
    nextX: number;
    nextY: number;
  }) => void;

  onClick?: (id: string) => void;
  className?: string;
  onContextMenu?: (args: { id: string; rect: DOMRect }) => void;
};

function safeNum(n: any, fallback = 0) {
  const v = typeof n === "number" ? n : Number(n);
  return Number.isFinite(v) ? v : fallback;
}

export default function DraggableJobCard({
  id,
  x,
  y,
  data,
  scale,
  setGesturesBlocked,
  gesturesLocked = false,
  onMove,
  onDrop,
  onClick,
  className = "",
  isActive = false,
  onContextMenu,
}: Props) {
  const [isDragging, setIsDragging] = useState(false);

  const startPointerRef = useRef<{ x: number; y: number } | null>(null);
  const startPosRef = useRef<{ x: number; y: number } | null>(null);
  const posRef = useRef<{ x: number; y: number }>({
    x: safeNum(x),
    y: safeNum(y),
  });
  const movedRef = useRef(false);
  const elementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    posRef.current = { x: safeNum(x), y: safeNum(y) };
  }, [x, y]);

  const allowInteract = !gesturesLocked || isActive;

  return (
    <div
      ref={elementRef}
      data-board-card="true"
      data-card-id={id}
      className={["absolute", "select-none", className].join(" ")}
      style={{
        left: x,
        top: y,
        cursor: allowInteract ? (isDragging ? "grabbing" : "grab") : "default",
        userSelect: "none",
        touchAction: "none",
      }}
      onContextMenu={(e) => {
        if (!allowInteract) return;

        e.preventDefault(); // 브라우저 기본 메뉴 막기
        e.stopPropagation(); // 캔버스 쪽으로 전파 막기

        const rect = elementRef.current?.getBoundingClientRect();
        if (!rect) return;

        onContextMenu?.({ id, rect });
      }}
      onPointerDown={(e) => {
        if (!allowInteract) return;
        if (e.button !== 0) return;

        e.stopPropagation();
        e.preventDefault();

        startPointerRef.current = { x: e.clientX, y: e.clientY };
        startPosRef.current = { x: posRef.current.x, y: posRef.current.y };
        movedRef.current = false;
      }}
      onPointerMove={(e) => {
        if (!startPointerRef.current) return;

        const dx = e.clientX - startPointerRef.current.x;
        const dy = e.clientY - startPointerRef.current.y;

        const distance = Math.abs(dx) + Math.abs(dy);

        if (!isDragging && distance > 4) {
          setIsDragging(true);
          movedRef.current = true;
          elementRef.current?.setPointerCapture(e.pointerId);
          setGesturesBlocked(true);
        }

        if (!isDragging) return;

        const s = safeNum(scale, 1);

        const nextX = startPosRef.current!.x + dx / s;
        const nextY = startPosRef.current!.y + dy / s;

        posRef.current = { x: nextX, y: nextY };
        onMove(id, nextX, nextY);

        window.dispatchEvent(new Event("canvas:transform"));
      }}
      onPointerUp={(e) => {
        if (isDragging) {
          elementRef.current?.releasePointerCapture(e.pointerId);
          setGesturesBlocked(false);
        }

        if (!movedRef.current) {
          onClick?.(id);
        } else {
          const prev = startPosRef.current!;
          const next = posRef.current;

          onDrop?.({
            id,
            prevX: prev.x,
            prevY: prev.y,
            nextX: next.x,
            nextY: next.y,
          });
        }

        setIsDragging(false);
        startPointerRef.current = null;
      }}
      onPointerCancel={() => {
        setIsDragging(false);
        startPointerRef.current = null;
        setGesturesBlocked(false);
      }}
    >
      <JobPostCard
        data={data}
        className={isActive ? "ring-2 ring-main-click" : ""}
      />
    </div>
  );
}
