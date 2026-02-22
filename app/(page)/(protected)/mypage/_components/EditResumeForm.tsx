"use client";

import ButtonRounded from "@/app/components/common/button&tab/ButtonRounded";
import ResumeUploadBox from "@/app/components/common/ResumeUploadBox";
import Image from "next/image";
import React, { useMemo, useState } from "react";

type ResumeState = {
  name?: string;
  url?: string;
  file?: File;
};

type Props = {
  currentResume?: ResumeState;
  onSubmit: (nextResume: ResumeState) => Promise<void> | void;
  onCancel: () => void;
  isLoading?: boolean;
  submitText?: string;
};

export default function EditResumeForm({
  currentResume,
  onSubmit,
  onCancel,
  isLoading = false,
  submitText = "수정완료",
}: Props) {
  const [resume, setResume] = useState<ResumeState>(currentResume ?? {});

  const canSubmit = !!resume.file;

  const hasExisting = !!resume.url;
  const existingLabel = useMemo(() => {
    if (!hasExisting) return undefined;
    return resume.name ?? "resume.pdf";
  }, [hasExisting, resume.name]);

  return (
    <section className="w-full">
      <Image
        src="icons/back.svg"
        alt="뒤로가기"
        width={24}
        height={24}
        className="mb-6 cursor-pointer"
        onClick={onCancel}
      />

      <div className="space-y-2">
        <h2 className="text-[28px] font-semibold text-gray-900">
          지금 준비된 자료를 첨부해주세요.
        </h2>
        <p className="text-[16px] text-gray-500">
          첨부한 자료를 기준으로 공고와의 현재 준비 상태를 정리해줄게요.
        </p>
      </div>

      <div className="mt-10">
        <ResumeUploadBox
          label="이력서"
          helperText="PDF 파일을 권장해요. 클릭해서 업로드하세요."
          hasFile={hasExisting || !!resume.file}
          onPick={(file) => {
            setResume((prev) => ({
              ...prev,
              file,
              name: file.name,
            }));
          }}
          onRemove={() => {
            setResume((prev) => ({
              ...prev,
              file: undefined,
              name: existingLabel, // 기존 표시 유지
            }));
          }}
          onOpen={() => {
            if (!resume.url) return;
            window.open(resume.url, "_blank", "noopener,noreferrer");
          }}
        />

        {hasExisting && (
          <p className="mt-3 text-[14px] text-gray-500">
            현재 등록된 파일:{" "}
            <span className="font-semibold text-gray-800">{existingLabel}</span>
          </p>
        )}

        <div className="mt-10 flex justify-center">
          <ButtonRounded
            onClick={() => onSubmit(resume)}
            disabled={isLoading || !canSubmit}
          >
            {isLoading ? "업로드 중..." : submitText}
          </ButtonRounded>
        </div>
      </div>
    </section>
  );
}
