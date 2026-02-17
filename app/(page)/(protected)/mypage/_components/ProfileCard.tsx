"use client";

import React from "react";
import Image from "next/image";

type Resume = {
  name?: string;
  url?: string;
};

type Props = {
  location: string;
  resume?: Resume;

  onEditAll: () => void;
  onEditLocation: () => void;
  onEditResume: () => void;

  onOpenResume: () => void;
};

export default function ProfileCard({
  location,
  resume,
  onEditAll,
  onEditLocation,
  onEditResume,
  onOpenResume,
}: Props) {
  const hasResume = !!resume?.name;

  return (
    <section className="w-full">
      {/* 상단 라벨 + 전체 수정 */}
      <div className="flex items-end justify-between">
        <h2 className="text-[18px] font-semibold text-gray-900">프로필</h2>

        <button
          className="text-[14px] text-gray-900 hover:opacity-70"
          onClick={onEditAll}
        >
          전체 수정하기
        </button>
      </div>

      <div className="mt-4 rounded-[24px] border border-black/5 bg-white px-8 py-7 shadow-sm">
        {/* 거주지 Row */}
        <div className="flex items-center justify-between gap-6">
          <div className="min-w-0">
            <p className="text-[14px] text-gray-400">거주지</p>
            <p className="mt-1 truncate text-[18px] font-semibold text-gray-900">
              {location}
            </p>
          </div>

          <button
            className="shrink-0 text-[14px] text-gray-900 hover:opacity-70"
            onClick={onEditLocation}
          >
            수정
          </button>
        </div>

        <div className="my-6 h-px w-full bg-black/5" />

        {/* 이력서 Row */}
        <div className="flex items-center justify-between gap-6">
          <div className="min-w-0">
            <p className="text-[14px] text-gray-400">이력서</p>

            <div className="mt-2 flex items-center gap-3">
              {hasResume ? (
                <button
                  onClick={onOpenResume}
                  className="rounded-md p-1 hover:bg-black/[0.03] transition"
                >
                  <Image
                    src="/icons/pdf.svg"
                    alt="pdf"
                    width={26}
                    height={26}
                  />
                </button>
              ) : (
                <span className="text-[14px] text-gray-400">
                  첨부된 파일 없음
                </span>
              )}
            </div>
          </div>

          <button
            className="shrink-0 text-[14px] text-gray-900 hover:opacity-70"
            onClick={onEditResume}
          >
            수정
          </button>
        </div>
      </div>
    </section>
  );
}
