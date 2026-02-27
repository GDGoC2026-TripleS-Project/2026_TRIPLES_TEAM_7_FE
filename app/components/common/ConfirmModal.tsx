"use client";

import Image from "next/image";
import React, { useEffect } from "react";

type Props = {
  open: boolean;
  title: string;
  description?: string;

  confirmText?: string;
  cancelText?: string;

  onConfirm: () => void;
  onCancel: () => void;

  isLoading?: boolean;
};

export default function ConfirmModal({
  open,
  title,
  description,
  confirmText = "확인",
  cancelText = "취소",
  onConfirm,
  onCancel,
  isLoading = false,
}: Props) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200]">
      {/* overlay */}
      <div className="absolute inset-0 bg-black/30" onPointerDown={onCancel} />

      {/* modal */}
      <div className="absolute left-1/2 top-1/2 w-[720px] max-w-[calc(100vw-40px)] -translate-x-1/2 -translate-y-1/2 rounded-[18px] bg-white px-7 py-6 shadow-2xl">
        <button
          type="button"
          onClick={onCancel}
          className="absolute right-6 top-6 opacity-60 hover:opacity-100"
          aria-label="close"
          disabled={isLoading}
        >
          <Image src="/icons/close.svg" alt="close" width={16} height={16} />
        </button>

        <h3 className="text-[28px] font-extrabold text-gray-900">{title}</h3>
        {description && (
          <p className="mt-2 text-[16px] text-gray-500">{description}</p>
        )}

        <div className="mt-8 flex justify-end gap-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className={[
              "h-12 rounded-[12px] px-7 text-[16px] font-semibold",
              "border border-gray-200 bg-white text-gray-800",
              isLoading ? "opacity-60 cursor-not-allowed" : "hover:bg-gray-50",
            ].join(" ")}
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={[
              "h-12 rounded-[12px] px-7 text-[16px] font-semibold",
              "bg-sub-red text-white shadow-sm",
              isLoading ? "opacity-60 cursor-not-allowed" : "hover:bg-red-500",
            ].join(" ")}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
