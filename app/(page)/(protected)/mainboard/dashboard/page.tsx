"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import JobPostDetailDrawer from "@/app/components/card-detail/JobPostDetailDrawer";
import type { JobPostCardData } from "@/app/(page)/(protected)/mainboard/_components/PostCard";
import Canvas, { BoardCard, TabId } from "../_components/Canvas";
import { useDeleteCard } from "@/app/lib/api/card.api";
import ConfirmModal from "@/app/components/common/ConfirmModal";

type DeleteMenuState = {
  cardId: string;
  rect: DOMRect;
  job: JobPostCardData;
};

export default function DashboardPage() {
  const router = useRouter();

  const [openCardId, setOpenCardId] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<JobPostCardData | null>(null);

  const [deleteMenu, setDeleteMenu] = useState<DeleteMenuState | null>(null);

  // ✅ 확인 모달
  const [confirmOpen, setConfirmOpen] = useState(false);

  const deleteMut = useDeleteCard();

  const onCardClick = (card: BoardCard) => {
    if (deleteMenu) setDeleteMenu(null);

    setOpenCardId((prev) => {
      // 같은 카드면 닫기
      if (prev === card.id) {
        setSelectedJob(null);
        return null;
      }
      // 다른 카드면 즉시 전환
      setSelectedJob(card.data);
      return card.id;
    });
  };

  const onChangeTab = (tab: TabId) => {
    if (tab === "dashboard") return;
    router.push("/mainboard/interview");
  };

  useEffect(() => {
    if (!openCardId) return;

    const onPointerDown = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;

      // 드로어 내부 클릭이면 닫지 않음 (drawer에 data-attr 추가할 예정)
      if (t.closest('[data-job-drawer="true"]')) return;

      // 카드 클릭이면(다른 카드로 전환/토글은 onCardClick이 담당) 닫지 않음
      if (t.closest('[data-board-card="true"]')) return;

      setOpenCardId(null);
      setSelectedJob(null);
    };

    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [openCardId]);

  const getCardRect = (cardId: string) => {
    const el = document.querySelector(
      `[data-board-card="true"][data-card-id="${cardId}"]`,
    ) as HTMLElement | null;

    return el?.getBoundingClientRect() ?? null;
  };

  useEffect(() => {
    if (!deleteMenu) return;

    const updateRect = () => {
      const r = getCardRect(deleteMenu.cardId);
      if (!r) return;

      setDeleteMenu((prev) =>
        prev && prev.cardId === deleteMenu.cardId ? { ...prev, rect: r } : prev,
      );
    };

    updateRect();

    window.addEventListener("canvas:transform", updateRect);

    window.addEventListener("resize", updateRect);
    window.addEventListener("scroll", updateRect, true);

    return () => {
      window.removeEventListener("canvas:transform", updateRect);
      window.removeEventListener("resize", updateRect);
      window.removeEventListener("scroll", updateRect, true);
    };
  }, [deleteMenu?.cardId]);

  const drawerOpen = !!openCardId && !deleteMenu && !confirmOpen;

  const deleteButtonStyle = useMemo(() => {
    if (!deleteMenu) return null;
    const r = deleteMenu.rect;
    return {
      left: r.left + r.width / 2,
      top: r.top,
      transform: "translate(-50%, calc(-100% - 12px))",
    } as const;
  }, [deleteMenu]);

  return (
    <>
      <Canvas
        activeTab="dashboard"
        onChangeTab={onChangeTab}
        backgroundClassName="bg-dots"
        onCardClick={onCardClick}
        activeCardId={openCardId}
        dimWhenActive={false}
        onCardContextMenu={({ card, rect }) => {
          setDeleteMenu({ cardId: card.id, rect, job: card.data });

          setOpenCardId(null);
          setSelectedJob(null);
        }}
        gesturesLocked={!!deleteMenu || confirmOpen}
        // ❌ 여기(renderBoardExtras)에서는 더 이상 딤/버튼 렌더링하지 않음
        renderBoardExtras={() => null}
        // ✅ 뷰포트 fixed 오버레이는 여기에서
        renderFixedOverlays={() => (
          <>
            {/* 기존 드로어 */}
            <JobPostDetailDrawer
              open={drawerOpen}
              onClose={() => {
                setOpenCardId(null);
                setSelectedJob(null);
              }}
              job={selectedJob}
              showOverlay={false}
            />

            {/* ✅ 삭제 딤 + 버튼 */}
            {deleteMenu && (
              <>
                {/* ✅ 둥근 구멍 뚫린 딤 오버레이 (카드 rounded에 맞춤) */}
                <svg
                  className="fixed inset-0 z-[120] pointer-events-auto"
                  width="100%"
                  height="100%"
                  onPointerDown={() => setDeleteMenu(null)}
                >
                  <defs>
                    <mask id="hole-mask">
                      {/* 전체는 보이게(white) */}
                      <rect width="100%" height="100%" fill="white" />

                      {/* 구멍 부분은 안 보이게(black) */}
                      {(() => {
                        const r = deleteMenu.rect;

                        const pad = 1; // 카드 그림자/링 여유
                        const x = Math.max(0, r.left - pad);
                        const y = Math.max(0, r.top - pad);
                        const w = Math.max(0, r.width + pad * 2);
                        const h = Math.max(0, r.height + pad * 2);

                        const radius = 10; // ✅ 카드 rounded 정도로 맞추기 (예: rounded-[18px])
                        return (
                          <rect
                            x={x}
                            y={y}
                            width={w}
                            height={h}
                            rx={radius}
                            ry={radius}
                            fill="black"
                          />
                        );
                      })()}
                    </mask>
                  </defs>

                  {/* dim 레이어 */}
                  <rect
                    width="100%"
                    height="100%"
                    fill="rgba(0,0,0,0.30)"
                    mask="url(#hole-mask)"
                  />
                </svg>

                {/* ✅ 삭제 버튼 */}
                <button
                  type="button"
                  className="fixed z-[130] h-10 rounded-[10px] px-6 bg-sub-red text-white font-semibold shadow-lg hover:bg-red-500"
                  style={deleteButtonStyle ?? undefined}
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={() => setConfirmOpen(true)}
                >
                  삭제하기
                </button>
              </>
            )}
          </>
        )}
        contextCardId={deleteMenu?.cardId ?? null}
      />

      <ConfirmModal
        open={confirmOpen}
        title="이 카드를 정말 삭제할까요?"
        description="지우면 다시 복구할 수 없어요."
        cancelText="취소"
        confirmText="삭제하기"
        isLoading={deleteMut.isPending}
        onCancel={() => {
          if (deleteMut.isPending) return;
          setConfirmOpen(false);
        }}
        onConfirm={() => {
          if (!deleteMenu) return;

          const cardIdNum = Number(deleteMenu.cardId);
          if (!Number.isFinite(cardIdNum)) return;

          deleteMut.mutate(cardIdNum, {
            onSuccess: () => {
              // 모달/우클릭 메뉴 닫기
              setConfirmOpen(false);
              setDeleteMenu(null);

              // 삭제한 카드가 drawer 열려있으면 닫기
              setOpenCardId((prev) =>
                prev === deleteMenu.cardId ? null : prev,
              );
              setSelectedJob((prev) =>
                openCardId === deleteMenu.cardId ? null : prev,
              );
            },
            onError: (e) => {
              alert(e.message);
            },
          });
        }}
      />
    </>
  );
}
