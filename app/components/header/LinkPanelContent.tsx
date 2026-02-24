"use client";

import { useAuthStore } from "@/app/lib/api/auth.store";
import {
  getCardDetail,
  useCreateJobCard,
  useCreateJobStatus,
} from "@/app/lib/api/card.api";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  width?: number;

  closeOnSuccess?: boolean;
};

function isValidUrl(input: string) {
  try {
    const u = new URL(input);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export default function LinkPanelContent({
  open,
  onClose,
  width = 280,
  closeOnSuccess = false,
}: Props) {
  const [url, setUrl] = useState("");
  const [jobId, setJobId] = useState<string | null>(null);

  const createCard = useCreateJobCard();
  const statusQuery = useCreateJobStatus(jobId ?? undefined, !!jobId);
  const qc = useQueryClient();

  const { hasHydrated, accessToken, refreshToken } = useAuthStore();

  const trimmed = useMemo(() => url.trim(), [url]);
  const hasText = useMemo(() => trimmed.length > 0, [trimmed]);
  const isUrlOk = useMemo(
    () => (hasText ? isValidUrl(trimmed) : true),
    [hasText, trimmed],
  );

  const canSubmit = useMemo(() => {
    if (!hasHydrated) return false;
    if (!hasText || !isUrlOk) return false;
    return !!accessToken || !!refreshToken;
  }, [hasHydrated, hasText, isUrlOk, accessToken, refreshToken]);

  const isCreating =
    createCard.isPending || statusQuery.data?.status === "PENDING";

  useEffect(() => {
    if (!jobId) return;
    if (statusQuery.data?.status !== "DONE") return;

    const newCardId = statusQuery.data?.data?.cardId;
    if (!newCardId) return;

    const run = async () => {
      try {
        const detailRes = await getCardDetail(newCardId);
        const detail = detailRes.data;

        const newCanvasItem = {
          cardId: detail.id,
          cardContent: {
            jobPostId: detail.jobPostId,
            deadlineAt: detail.deadlineAt,
            jobTitle: detail.jobTitle,
            companyName: detail.companyName,
            employmentType: detail.employmentType,
            roleText: detail.roleText,
            necessaryStack: detail.necessaryStack ?? [],
            matchPercent: detail.matchPercent ?? null,
          },
          canvasX: 0,
          canvasY: 0,
        };

        qc.setQueryData(["canvasCards"], (old: any) => {
          if (!old) return [newCanvasItem];

          const exists = old.some(
            (c: any) => String(c.cardId) === String(newCardId),
          );
          if (exists) return old;

          return [newCanvasItem, ...old];
        });

        qc.invalidateQueries({ queryKey: ["canvasCards"] });
        qc.refetchQueries({ queryKey: ["canvasCards"] });
      } catch (e) {
        console.error("카드 optimistic prepend 실패:", e);
      }

      setUrl("");
      setJobId(null);

      if (closeOnSuccess) onClose();
    };

    run();
  }, [jobId, statusQuery.data?.status, closeOnSuccess, onClose, qc]);

  const onSubmit = () => {
    if (!canSubmit || isCreating) return;

    createCard.mutate(
      { url: trimmed },
      {
        onSuccess: (res) => {
          setJobId(res.data?.jobId);
        },
        onError: (e) => {
          alert(e.message);
        },
      },
    );
  };

  return (
    <aside
      className={[
        "ml-auto  h-full overflow-hidden",
        open ? "opacity-100" : "opacity-0 pointer-events-none",
      ].join(" ")}
      style={{
        width: open ? width : 0,
        transform: open ? "translateX(0px)" : "translateX(-8px)",
      }}
    >
      {/* 패널 박스 */}
      <div className="h-full rounded-br-[18px] rounded-tr-[18px]  bg-[#332c2f]">
        {/* 상단 헤더 */}
        <div className="flex items-center justify-end px-5 pt-5">
          <button
            onClick={onClose}
            className="rounded-md text-white/60 hover:text-white/90"
          >
            <Image
              src="/icons/close_panel.svg"
              alt="link"
              width={20}
              height={20}
            />
          </button>
        </div>

        {/* 본문 */}
        <div className="px-5 pb-5 pt-20 h-[calc(100%-56px)] whitespace-nowrap">
          <div className="flex h-full flex-col">
            {/* 상단: 링크 붙여넣기 */}
            <div>
              <div className="flex items-center justify-start gap-2 text-white/80 text-sm font-semibold">
                <Image src="/icons/s1.svg" alt="link" width={18} height={18} />
                <span>링크 붙여넣기</span>
              </div>

              <div className="mt-3">
                <div className="relative">
                  <input
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") onSubmit();
                    }}
                    placeholder="채용 공고 링크를 붙여넣어 주세요."
                    className={[
                      "w-full h-11 rounded-xl pl-4 pr-12",
                      "bg-white/10 text-white placeholder:text-gray-300",
                      "border border-white/10",
                      "outline-none focus:border-white/25 text-sm",
                      !isUrlOk
                        ? "border-red-400/60 focus:border-red-400/60"
                        : "",
                    ].join(" ")}
                    disabled={isCreating}
                  />

                  {canSubmit && (
                    <button
                      onClick={onSubmit}
                      disabled={isCreating}
                      className={[
                        "absolute right-2 top-1/2 -translate-y-1/2",
                        "h-8 w-8 rounded-lg bg-white/90 hover:bg-white",
                        "grid place-items-center",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                      ].join(" ")}
                    >
                      <Image
                        src="/icons/arrow_right.svg"
                        alt="create"
                        width={16}
                        height={16}
                      />
                    </button>
                  )}
                </div>

                {!hasHydrated && (
                  <p className="mt-2 text-[12px] text-white/50">
                    인증 정보를 불러오는 중...
                  </p>
                )}

                {hasHydrated && !accessToken && !refreshToken && (
                  <p className="mt-2 text-[12px] text-red-300">
                    로그인 정보가 없습니다. 다시 로그인해주세요.
                  </p>
                )}

                {!isUrlOk && canSubmit && (
                  <p className="mt-2 text-[12px] text-red-300">
                    올바른 URL 형식(http/https)을 입력해주세요.
                  </p>
                )}

                {jobId && statusQuery.data?.status === "PENDING" && (
                  <p className="mt-2 text-[12px] text-white/70">
                    카드 생성 중입니다... (잠시만 기다려주세요)
                  </p>
                )}

                {/* (선택) 에러 표시 */}
                {createCard.isError && (
                  <p className="mt-2 text-[12px] text-red-300">
                    {createCard.error?.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex-1" />
          </div>
        </div>
      </div>
    </aside>
  );
}
