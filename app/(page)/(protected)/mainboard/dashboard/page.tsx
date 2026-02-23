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

  useEffect(() => {
    if (!deleteMenu) return;

    const close = () => setDeleteMenu(null);

    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);

    return () => {
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [deleteMenu]);

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
        renderBoardExtras={() => (
          <>
            {deleteMenu && (
              <>
                {/* ✅ 보드 세계 내부 딤(absolute) */}
                <div
                  className="absolute inset-0 z-[110] bg-black/30"
                  onPointerDown={() => setDeleteMenu(null)}
                />

                {/* ✅ 버튼은 viewport 기준이니까 fixed 유지 */}
                <button
                  type="button"
                  className="fixed z-[130] h-10 rounded-[10px] px-6 bg-red-500 text-white font-semibold shadow-lg hover:bg-red-600"
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
        renderFixedOverlays={() => (
          <JobPostDetailDrawer
            open={drawerOpen}
            onClose={() => {
              setOpenCardId(null);
              setSelectedJob(null);
            }}
            job={selectedJob}
            showOverlay={false}
          />
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
