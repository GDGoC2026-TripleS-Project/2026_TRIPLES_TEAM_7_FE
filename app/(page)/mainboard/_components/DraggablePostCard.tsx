"use client";

import React, { useRef, useState } from "react";
import JobPostCard, { JobPostCardData } from "./PostCard";

type Props = {
  id: string;
  x: number;
  y: number;
  data: JobPostCardData;
  isActive?: boolean;

  scale: number;
  setGesturesBlocked: (v: boolean) => void;

  onMove: (id: string, nextX: number, nextY: number) => void;
  onClick?: (id: string) => void;
  className?: string;
};

export default function DraggableJobCard({
  id,
  x,
  y,
  data,
  scale,
  setGesturesBlocked,
  onMove,
  onClick,
  className = "",
  isActive = false,
}: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const startRef = useRef<{ x: number; y: number } | null>(null);
  const movedRef = useRef(false);

  return (
    <div
      data-board-card="true"
      data-card-id={id}
      className={["absolute", "select-none", className].join(" ")}
      style={{
        left: x,
        top: y,
        cursor: isDragging ? "grabbing" : "grab",
        userSelect: "none",
        touchAction: "none",
      }}
      onPointerDown={(e) => {
        e.stopPropagation();
        e.preventDefault();

        (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
        setIsDragging(true);
        movedRef.current = false;
        startRef.current = { x: e.clientX, y: e.clientY };

        setGesturesBlocked(true);
      }}
      onPointerMove={(e) => {
        if (!isDragging) return;
        e.preventDefault();

        const s = startRef.current;
        if (s) {
          const dx = Math.abs(e.clientX - s.x);
          const dy = Math.abs(e.clientY - s.y);
          if (dx + dy > 4) movedRef.current = true;
        }

        onMove(id, x + e.movementX / scale, y + e.movementY / scale);
      }}
      onPointerUp={(e) => {
        setIsDragging(false);
        setGesturesBlocked(false);

        try {
          (e.currentTarget as HTMLDivElement).releasePointerCapture(
            e.pointerId,
          );
        } catch {}

        if (!movedRef.current) onClick?.(id);
      }}
      onPointerCancel={() => {
        setIsDragging(false);
        setGesturesBlocked(false);
      }}
    >
      <JobPostCard
        data={data}
        className={isActive ? "ring-1 ring-black" : ""}
      />
    </div>
  );
}
