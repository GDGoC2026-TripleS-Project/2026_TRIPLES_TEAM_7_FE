"use client";

import { useMemo, useState } from "react";

import Card from "@/app/components/Card";
import InfiniteCanvas from "@/app/components/InfiniteCanvas";
import CanvasHeader from "@/app/components/CanvasHeader";
import CanvasSidebar from "@/app/components/CanvasSidebar";
import JobPostCard, { JobPostCardData } from "@/app/components/PostCard";
import DraggableJobCard from "@/app/components/DraggablePostCard";
import JobPostDetailDrawer from "@/app/components/JobPostDetailDrawer";

type TabId = "dashboard" | "interview";
type SideId = "link" | "list" | "user" | "settings";

type BoardCard = {
  id: string;
  x: number;
  y: number;
  data: JobPostCardData;
};

export default function CanvasPage() {
  const [activeTab, setActiveTab] = useState<TabId>("dashboard");
  const [activeSide, setActiveSide] = useState<SideId>("link");

  const [cards, setCards] = useState<BoardCard[]>([
    {
      id: "a",
      x: 220,
      y: 160,
      data: {
        id: "a",
        dday: 3,
        match: { status: "pending" },
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

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobPostCardData | null>(null);

  const openDetail = (cardId: string) => {
    const found = cards.find((c) => c.id === cardId)?.data ?? null;
    setSelectedJob(found);
    setDrawerOpen(true);
  };

  const SIDEBAR_LEFT = 16; // left-4
  const SIDEBAR_WIDTH = 76; // CanvasSidebar 폭(w-[76px])에 맞춰줘
  const GAP = 12; // sidebar와 패널 사이 간격 (ml-3 = 12px)
  const HEADER_GAP = 16; // 패널 끝과 헤더 사이 여유

  const PANEL_WIDTH = 280; // CanvasSidebar 패널 폭(너가 만든 값과 동일하게)

  const isPanelOpen = Boolean(activeSide);

  const headerLeft = useMemo(() => {
    // 기본: 사이드바 오른쪽 + 여백
    const base = SIDEBAR_LEFT + SIDEBAR_WIDTH + HEADER_GAP;

    // 패널이 열리면 패널 폭 + GAP 만큼 더 밀기
    return isPanelOpen ? base + GAP + PANEL_WIDTH : base;
  }, [isPanelOpen]);

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <InfiniteCanvas backgroundClassName="bg-dots">
        {({ getScale, setGesturesBlocked }) => (
          <>
            {cards.map((c) => (
              <DraggableJobCard
                key={c.id}
                id={c.id}
                x={c.x}
                y={c.y}
                data={c.data}
                getScale={getScale}
                setGesturesBlocked={setGesturesBlocked}
                onMove={(id, nextX, nextY) => {
                  setCards((prev) =>
                    prev.map((p) =>
                      p.id === id ? { ...p, x: nextX, y: nextY } : p,
                    ),
                  );
                }}
                onClick={openDetail}
              />
            ))}
          </>
        )}
      </InfiniteCanvas>

      <div className="fixed left-4 top-4 bottom-4 z-50">
        <CanvasSidebar
          logoSrc="/logo_P.svg"
          active={activeSide ?? undefined}
          onSelect={(id) => setActiveSide(id ?? null)}
          panelWidth={PANEL_WIDTH}
          items={[
            { id: "link", iconSrc: "/icons/s1.svg", label: "link" },
            { id: "list", iconSrc: "/icons/s2.svg", label: "list" },
            { id: "user", iconSrc: "/icons/s3.svg", label: "user" },
            { id: "settings", iconSrc: "/icons/s4.svg", label: "settings" },
          ]}
        />
      </div>

      <div
        className="fixed top-4 z-50 transition-[left] duration-200 ease-out"
        style={{ left: headerLeft }}
      >
        <CanvasHeader
          activeTab={activeTab}
          onChangeTab={setActiveTab}
          filterIconSrc="/icons/filter.svg"
          chevronDownSrc="/icons/arrowdown.svg"
          onClickFilter={() => {
            console.log("filter click");
          }}
        />
      </div>

      <JobPostDetailDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        job={selectedJob}
      />
    </div>
  );
}
