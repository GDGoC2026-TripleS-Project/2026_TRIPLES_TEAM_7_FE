"use client";

import Card from "@/app/components/Card";
import InfiniteCanvas from "@/app/components/InfiniteCanvas";
import { useState } from "react";

type DebugCard = { id: string; x: number; y: number; title: string };

export default function CanvasPage() {
  const [cards, setCards] = useState<DebugCard[]>([
    { id: "1", x: 260, y: 240, title: "Naver FE" },
    { id: "2", x: 620, y: 420, title: "Kakao FE" },
    { id: "3", x: 980, y: 300, title: "Line FE" },
  ]);

  return (
    <InfiniteCanvas backgroundClassName="bg-dots">
      {({ getScale, setGesturesBlocked }) => (
        <>
          {cards.map((c) => (
            <Card
              key={c.id}
              id={c.id}
              x={c.x}
              y={c.y}
              title={c.title}
              getScale={getScale}
              setGesturesBlocked={setGesturesBlocked}
              onMove={(id, nextX, nextY) => {
                setCards((prev) =>
                  prev.map((p) =>
                    p.id === id ? { ...p, x: nextX, y: nextY } : p,
                  ),
                );
              }}
            />
          ))}
        </>
      )}
    </InfiniteCanvas>
  );
}
