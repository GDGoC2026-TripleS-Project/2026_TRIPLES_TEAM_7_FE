"use client";

import Image from "next/image";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type Props = {
  open: boolean;
  onClose: () => void;
  anchorEl: HTMLElement | null; // 아이콘 버튼 엘리먼트
  children: React.ReactNode;

  // 아이콘 기준 위치 미세조정
  offsetX?: number; // 좌(-) 우(+)
  offsetY?: number; // 위(-) 아래(+)
};

export default function InfoTooltip({
  open,
  onClose,
  anchorEl,
  children,
  offsetX = -40, // 살짝 좌측
  offsetY = -12, // 살짝 위
}: Props) {
  const boxRef = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const [pos, setPos] = useState<{ left: number; top: number }>({
    left: 0,
    top: 0,
  });

  useEffect(() => setMounted(true), []);

  const compute = () => {
    if (!anchorEl) return;

    const r = anchorEl.getBoundingClientRect();
    // 기본: 아이콘 위로 띄우기
    const left = r.left + r.width / 2 + offsetX;
    const top = r.top + offsetY;

    setPos({ left, top });
  };

  // open 되는 순간 + 레이아웃 반영 후 위치 계산
  useLayoutEffect(() => {
    if (!open) return;
    compute();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, anchorEl, offsetX, offsetY]);

  // 스크롤/리사이즈 시 재계산
  useEffect(() => {
    if (!open) return;

    const onScroll = () => compute();
    const onResize = () => compute();

    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, anchorEl, offsetX, offsetY]);

  // 바깥 클릭 / ESC 닫기
  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e: PointerEvent) => {
      const box = boxRef.current;
      if (!box) return;

      if (box.contains(e.target as Node)) return;
      if (anchorEl && anchorEl.contains(e.target as Node)) return; // 아이콘 클릭은 토글로 처리
      onClose();
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("pointerdown", onPointerDown, { capture: true });
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("pointerdown", onPointerDown, {
        capture: true,
      } as any);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose, anchorEl]);

  if (!mounted || !open || !anchorEl) return null;

  return createPortal(
    <div
      ref={boxRef}
      className="fixed z-[100]"
      style={{
        left: pos.left,
        top: pos.top,
        transform: "translate(-100%, -100%)", // 기준점을 박스 우상단으로(= 아이콘 위에 떠 보이게)
      }}
    >
      <div className="relative rounded-[25px] bg-black px-7 py-4 text-white text-[14px] font-medium shadow-lg">
        <div className="flex items-start gap-3">
          <Image
            src="/icons/info.svg"
            alt="info"
            width={15}
            height={15}
            className="shrink-0 mt-1.5"
          />

          <div className="whitespace-nowrap">{children}</div>
        </div>

        {/* 꼬리 */}
        <div className="absolute -bottom-1.5 right-10 h-3 w-3 rotate-45 bg-black" />
      </div>
    </div>,
    document.body,
  );
}
