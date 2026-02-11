// app/components/DraggableJobCard.tsx
"use client";

import React, { useRef } from "react";
import JobPostCard, { JobPostCardData } from "./PostCard";

type Props = {
  id: string;
  x: number;
  y: number;

  data: JobPostCardData;

  getScale: () => number;
  setGesturesBlocked: (v: boolean) => void;

  onMove: (id: string, nextX: number, nextY: number) => void;
  onClick?: (id: string) => void;
};

export default function DraggableJobCard({
  id,
  x,
  y,
  data,
  getScale,
  setGesturesBlocked,
  onMove,
  onClick,
}: Props) {
  const draggingRef = useRef(false);
  const startRef = useRef<{ x: number; y: number } | null>(null);
  const movedRef = useRef(false);

  return (
    <div
      data-role="job-card"
      style={{
        position: "absolute",
        left: x,
        top: y,
        cursor: draggingRef.current ? "grabbing" : "grab",
        userSelect: "none",
        touchAction: "none",
      }}
      onPointerDown={(e) => {
        e.stopPropagation();
        e.preventDefault();

        (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
        draggingRef.current = true;
        movedRef.current = false;
        startRef.current = { x: e.clientX, y: e.clientY };

        setGesturesBlocked(true);
      }}
      onPointerMove={(e) => {
        if (!draggingRef.current) return;
        e.preventDefault();

        const s = startRef.current;
        if (s) {
          const dx = Math.abs(e.clientX - s.x);
          const dy = Math.abs(e.clientY - s.y);
          if (dx + dy > 4) movedRef.current = true; // ✅ 클릭/드래그 구분
        }

        const scale = getScale();
        onMove(id, x + e.movementX / scale, y + e.movementY / scale);
      }}
      onPointerUp={(e) => {
        draggingRef.current = false;
        setGesturesBlocked(false);

        try {
          (e.currentTarget as HTMLDivElement).releasePointerCapture(
            e.pointerId,
          );
        } catch {}

        // ✅ “움직이지 않았다면” 클릭으로 간주해서 상세창 오픈
        if (!movedRef.current) onClick?.(id);
      }}
      onPointerCancel={() => {
        draggingRef.current = false;
        setGesturesBlocked(false);
      }}
    >
      <JobPostCard data={data} />
    </div>
  );
}
