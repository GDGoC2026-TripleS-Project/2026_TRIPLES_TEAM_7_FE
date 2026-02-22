"use client";

import React, { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import CanvasSidebar from "@/app/components/header/CanvasSidebar";
import { useAuthStore } from "@/app/lib/api/auth.store";

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
  const pathname = usePathname();

  const [activeSide, setActiveSide] = useState<SideId | null>(null);

  // const hasHydrated = useAuthStore((s) => s.hasHydrated);
  // const accessToken = useAuthStore((s) => s.accessToken);
  // const refreshToken = useAuthStore((s) => s.refreshToken);
  // const clearAuth = useAuthStore((s) => s.clearAuth);

  // useEffect(() => {
  //   if (!hasHydrated) return;

  //   const authed = !!accessToken;

  //   if (!authed) {
  //     clearAuth();
  //     router.replace("/login");
  //   }
  // }, [hasHydrated, accessToken, refreshToken, clearAuth, router]);

  // if (!hasHydrated) return null;

  // if (!accessToken) return null;

  const hideSidebar = pathname.startsWith("/welcome");

  const isPanelOpen = activeSide === "link";

  const headerLeft = useMemo(() => {
    const base = SIDEBAR_LEFT + SIDEBAR_WIDTH + HEADER_GAP;
    return isPanelOpen ? base + GAP + PANEL_WIDTH : base;
  }, [isPanelOpen]);

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

  const useProtectedBg =
    pathname.startsWith("/checklists") ||
    pathname.startsWith("/mypage") ||
    pathname.startsWith("/settings");

  return (
    <div className="relative min-h-screen w-screen overflow-hidden">
      {!hideSidebar && (
        <div className="fixed left-4 top-4 bottom-4 z-50">
          <CanvasSidebar
            active={activeSide}
            onSelect={setActiveSide}
            panelWidth={PANEL_WIDTH}
            onNavigate={onNavigate}
          />
        </div>
      )}

      <div
        data-protected-shell="true"
        className={useProtectedBg ? "min-h-screen bg-protected-pages" : ""}
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
