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
  onContextMenu?: (rect: DOMRect) => void;
  className?: string;
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
  onContextMenu,
  className = "",
  isActive = false,
}: Props) {
  const [isDragging, setIsDragging] = useState(false);

  const startPointerRef = useRef<{ x: number; y: number } | null>(null);
  const startPosRef = useRef<{ x: number; y: number } | null>(null);
  const posRef = useRef<{ x: number; y: number }>({
    x: safeNum(x),
    y: safeNum(y),
  });
  const movedRef = useRef(false);

  useEffect(() => {
    posRef.current = { x: safeNum(x), y: safeNum(y) };
  }, [x, y]);

  const safeX = safeNum(x);
  const safeY = safeNum(y);

  return (
    <div
      data-board-card="true"
      data-card-id={id}
      className={["absolute", "select-none", className].join(" ")}
      style={{
        left: safeX,
        top: safeY,
        cursor: gesturesLocked ? "default" : isDragging ? "grabbing" : "grab",
        userSelect: "none",
        touchAction: "none",
      }}
      onContextMenu={(e) => {
        if (gesturesLocked) return;
        e.preventDefault();
        e.stopPropagation();
        const rect = (
          e.currentTarget as HTMLDivElement
        ).getBoundingClientRect();
        onContextMenu?.(rect);
      }}
      onPointerDown={(e) => {
        if (gesturesLocked) return;

        e.stopPropagation();
        e.preventDefault();

        (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
        setIsDragging(true);

        movedRef.current = false;
        startPointerRef.current = { x: e.clientX, y: e.clientY };
        startPosRef.current = { x: posRef.current.x, y: posRef.current.y };

        setGesturesBlocked(true);
      }}
      onPointerMove={(e) => {
        if (!isDragging) return;

        const s = safeNum(scale, 1);
        if (s === 0) return;

        e.preventDefault();

        const sp = startPointerRef.current;
        if (sp) {
          const dx = Math.abs(e.clientX - sp.x);
          const dy = Math.abs(e.clientY - sp.y);
          if (dx + dy > 4) movedRef.current = true;
        }

        const nextX = posRef.current.x + e.movementX / s;
        const nextY = posRef.current.y + e.movementY / s;

        const nx = safeNum(nextX, posRef.current.x);
        const ny = safeNum(nextY, posRef.current.y);

        posRef.current = { x: nx, y: ny };
        onMove(id, nx, ny);
      }}
      onPointerUp={(e) => {
        if (gesturesLocked) return;

        e.stopPropagation();
        setIsDragging(false);
        setGesturesBlocked(false);

        try {
          (e.currentTarget as HTMLDivElement).releasePointerCapture(
            e.pointerId,
          );
        } catch {}

        if (movedRef.current) {
          const prev = startPosRef.current;
          const next = posRef.current;
          if (prev) {
            onDrop?.({
              id,
              prevX: prev.x,
              prevY: prev.y,
              nextX: next.x,
              nextY: next.y,
            });
          }
          return;
        }

        onClick?.(id);
      }}
      onPointerCancel={() => {
        if (gesturesLocked) return;
        setIsDragging(false);
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
