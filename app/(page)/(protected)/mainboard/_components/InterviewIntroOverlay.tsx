"use client";

import Image from "next/image";
import React, { useEffect, useRef } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  iconSrc: string; // 아이콘은 이미지로 연결
};

export default function InterviewIntroOverlay({
  open,
  onClose,
  iconSrc,
}: Props) {
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e: PointerEvent) => {
      // 안내창 내부 클릭은 닫히지 않게 (원하면 이 조건 제거하면 됨)
      const panel = panelRef.current;
      if (panel && panel.contains(e.target as Node)) return;

      onClose();
    };

    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50" />

      <div className="fixed left-1/2 top-10 z-60 -translate-x-1/2">
        <div
          ref={panelRef}
          className={[
            "w-[358px]  max-w-[calc(100vw-10px)]",
            "rounded-[20px] bg-black",
            "px-8 py-4",
            "shadow-[0_18px_45px_rgba(0,0,0,0.55)]",
          ].join(" ")}
          role="dialog"
          aria-modal="true"
        >
          <div className="flex flex-col items-center gap-2 text-center">
            <Image src={iconSrc} alt="info" width={20} height={20} />
            <p className="whitespace-pre-line text-[12px]/[15.36px] font-medium leading-4 text-white">
              {
                "AI가 모집 공고를 바탕으로 예상 면접 질문을 준비합니다.\n새로고침하면 새로운 질문이 생성되며, 기존 질문은 교체됩니다."
              }
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
