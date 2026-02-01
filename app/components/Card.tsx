"use client";

import React, { useRef } from "react";

type Props = {
  id: string;
  x: number;
  y: number;
  title: string;

  getScale: () => number;

  setGesturesBlocked: (blocked: boolean) => void;

  onMove: (id: string, nextX: number, nextY: number) => void;
};

export default function Card({
  id,
  x,
  y,
  title,
  getScale,
  setGesturesBlocked,
  onMove,
}: Props) {
  const dragging = useRef(false);

  return (
    <div
      data-role="card"
      onPointerDown={(e) => {
        e.stopPropagation();
        e.preventDefault();

        (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
        dragging.current = true;

        setGesturesBlocked(true);
      }}
      onPointerMove={(e) => {
        if (!dragging.current) return;
        e.preventDefault();

        const scale = getScale();
        const dx = e.movementX / scale;
        const dy = e.movementY / scale;

        onMove(id, x + dx, y + dy);
      }}
      onPointerUp={(e) => {
        dragging.current = false;
        setGesturesBlocked(false);

        try {
          (e.currentTarget as HTMLDivElement).releasePointerCapture(
            e.pointerId,
          );
        } catch {}
      }}
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 260,
        padding: 16,
        borderRadius: 14,
        background: "white",
        boxShadow: "0 10px 30px rgba(0,0,0,0.10)",
        cursor: dragging.current ? "grabbing" : "grab",
        userSelect: "none",
        touchAction: "none",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: 999,
            background: "#4f46e5",
            flex: "0 0 auto",
          }}
        />
        <div style={{ fontWeight: 700 }}>{title}</div>
      </div>

      <div
        style={{ marginTop: 10, fontSize: 12, opacity: 0.65, lineHeight: 1.4 }}
      >
        - Ctrl + 드래그: 보드 이동
        <br />
        - 터치패드 두 손가락: 보드 이동
        <br />
        - 터치패드 두 손가락 / Ctrl+휠: 확대·축소
        <br />- 카드 드래그 : 카드 이동
        <br />- 빈공간 좌클릭 : 움직임 x
      </div>
    </div>
  );
}
