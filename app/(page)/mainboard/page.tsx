"use client";

import { useState } from "react";

import Card from "@/app/components/Card";
import InfiniteCanvas from "@/app/components/InfiniteCanvas";
import CanvasHeader from "@/app/components/CanvasHeader";
import CanvasSidebar from "@/app/components/CanvasSidebar";

type DebugCard = { id: string; x: number; y: number; title: string };
type TabId = "dashboard" | "interview";
type SideId = "link" | "list" | "user" | "settings";

export default function CanvasPage() {
  const [cards, setCards] = useState<DebugCard[]>([
    { id: "1", x: 260, y: 240, title: "Naver FE" },
    { id: "2", x: 620, y: 420, title: "Kakao FE" },
    { id: "3", x: 980, y: 300, title: "Line FE" },
  ]);

  const [activeTab, setActiveTab] = useState<TabId>("dashboard");
  const [activeSide, setActiveSide] = useState<SideId>("link");

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* ✅ 보드 (줌/패닝/카드) */}
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

      {/* ✅ 고정 UI (보드와 독립) */}
      <div className="fixed left-4 top-4 bottom-4 z-50">
        <CanvasSidebar
          logoSrc="/logo_P.svg"
          active={activeSide}
          onSelect={setActiveSide}
          items={[
            { id: "link", iconSrc: "/icons/s1.svg", label: "link" },
            { id: "list", iconSrc: "/icons/s2.svg", label: "list" },
            { id: "user", iconSrc: "/icons/s3.svg", label: "user" },
            { id: "settings", iconSrc: "/icons/s3.svg", label: "settings" },
          ]}
        />
      </div>

      <div className="fixed top-4 left-26 z-50">
        <CanvasHeader
          activeTab={activeTab}
          onChangeTab={setActiveTab}
          filterIconSrc="/icons/filter.svg"
          chevronDownSrc="/icons/arrowdown.svg"
          onClickFilter={() => {
            // TODO: 필터 드롭다운/모달
            console.log("filter click");
          }}
        />
      </div>
    </div>
  );
}
