"use client";

import React, { useRef } from "react";
import Image from "next/image";

type Props = {
  label: string;
  helperText?: string;

  hasFile: boolean;

  onPick: (file: File) => void;
  onRemove: () => void;

  onOpen: () => void;
};

export default function ResumeUploadBox({
  label,
  helperText,
  hasFile,
  onPick,
  onRemove,
  onOpen,
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className={["rounded-[18px]", "bg-white px-8 py-6"].join(" ")}>
      <div className="text-[16px] font-semibold text-gray-900">{label}</div>
      {!!helperText && (
        <p className="mt-2 text-[14px] text-gray-500">{helperText}</p>
      )}

      <div className="mt-4 flex flex-col items-start gap-4">
        {hasFile && (
          <div className="relative">
            <button
              onClick={onOpen}
              className="rounded-md p-1 hover:bg-black/[0.03] transition"
            >
              <Image src="/icons/pdf.svg" alt="pdf" width={30} height={30} />
            </button>

            <button
              onClick={() => {
                onRemove();
                if (inputRef.current) inputRef.current.value = "";
              }}
              className="absolute -right-3 -top-2"
            >
              <Image
                src="/icons/delete.svg"
                alt="remove"
                width={15}
                height={15}
              />
            </button>
          </div>
        )}

        {/* 파일 선택 */}
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              onPick(f);
              // 같은 파일 재선택 가능하도록 value 초기화해두는 편이 안전
              e.currentTarget.value = "";
            }}
          />

          <button
            onClick={() => inputRef.current?.click()}
            className={[
              "h-[44px] w-[132px] rounded-full",
              "border border-black/20 bg-white",
              "text-[14px] font-semibold text-gray-900",
              "hover:bg-black/[0.03] transition",
            ].join(" ")}
          >
            파일 선택
          </button>
        </div>
      </div>
    </div>
  );
}
