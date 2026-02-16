"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import CanvasSidebar from "@/app/components/header/CanvasSidebar";

type SideId = "link" | "list" | "user" | "settings";

const SIDEBAR_LEFT = 16; // left-4
const SIDEBAR_WIDTH = 76; // w-19
const GAP = 12;
const HEADER_GAP = 16;
const PANEL_WIDTH = 280;

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const [activeSide, setActiveSide] = useState<SideId | null>(null);

  // ✅ link 패널이 열리는 케이스만 headerLeft에 영향
  const isPanelOpen = activeSide === "link";

  const headerLeft = useMemo(() => {
    const base = SIDEBAR_LEFT + SIDEBAR_WIDTH + HEADER_GAP;
    return isPanelOpen ? base + GAP + PANEL_WIDTH : base;
  }, [isPanelOpen]);

  // ✅ link는 "패널 토글"이므로 라우팅 대상 아님
  const onNavigate = (id: Exclude<SideId, "link">) => {
    if (id === "list") {
      router.push("/checklists");
      return;
    }
    if (id === "user") {
      router.push("/mypage");
      return;
    }
    if (id === "settings") {
      router.push("/settings");
      return;
    }
  };

  return (
    <div className="relative min-h-screen w-screen overflow-hidden">
      {/* ✅ Sidebar: protected 공통 */}
      <div className="fixed left-4 top-4 bottom-4 z-50">
        <CanvasSidebar
          active={activeSide}
          onSelect={setActiveSide}
          panelWidth={PANEL_WIDTH}
          onNavigate={onNavigate}
        />
      </div>

      {/* ✅ CanvasHeader가 사용할 left 값을 CSS 변수로 내려줌 (추가 파일/cloneElement 불필요) */}
      <div
        data-protected-shell="true"
        style={
          {
            ["--protected-header-left" as any]: `${headerLeft}px`,
          } as React.CSSProperties
        }
      >
        {children}
      </div>
    </div>
  );
}
