"use client";

import ButtonRounded from "@/app/components/common/button&tab/ButtonRounded";
import Input from "@/app/components/common/Input";
import ResumeUploadBox from "@/app/components/common/ResumeUploadBox";
import React from "react";

type Step = 1 | 2;

type Props = {
  step: Step;

  // step1 (address)
  address: string;
  onChangeAddress: (v: string) => void;

  // step2 (resume)
  hasResumeFile: boolean;
  onPickResume: (file: File) => void;
  onRemoveResume: () => void;
  onOpenResume: () => void;

  // actions
  onSkip: () => void;
  onNext: () => void; // step1: 다음 / step2: 준비완료
  loading?: boolean;
};

export default function WelcomeStepCard({
  step,
  address,
  onChangeAddress,
  hasResumeFile,
  onPickResume,
  onRemoveResume,
  onOpenResume,
  onSkip,
  onNext,
  loading = false,
}: Props) {
  const isStep1 = step === 1;

  const desc = isStep1
    ? "거주 지역은 나에게 맞는 공고를 정리하는 기준으로 사용돼요."
    : "나중에 수정할 수 있어요. 첨부한 자료를 기준으로 공고와의 현재 준비 상태를 정리해줄거예요.";

  const primaryLabel = isStep1 ? "다음" : "준비완료";

  const primaryDisabled = loading
    ? true
    : isStep1
      ? address.trim().length === 0
      : !hasResumeFile;

  return (
    <div
      className={[
        "w-[1014px] max-w-[calc(100vw-80px)]",
        "rounded-[28px] bg-gray-50",
        "px-14 py-12",
      ].join(" ")}
    >
      <div className="flex items-start gap-3">
        <div className="text-[24px]/[24px] font-bold text-gray-900">
          <span className="mr-2 text-[#ff6b6b]">{isStep1 ? "01." : "02."}</span>
          {isStep1
            ? "선호 조건을 알려주세요."
            : "지금 준비된 자료를 첨부해주세요."}
        </div>
      </div>

      <p className="mt-3 text-[16px] text-gray-600">{desc}</p>

      {/* 콘텐츠 영역 */}
      <div className="mt-10">
        {isStep1 ? (
          <div className="max-w-[900px]">
            <div className="text-[14px] font-semibold text-gray-800">
              거주 지역
            </div>
            <div className="mt-3">
              <Input
                value={address}
                onChange={onChangeAddress}
                placeholder="시/군/구를 입력해주세요."
              />
            </div>
          </div>
        ) : (
          <div className="max-w-[920px]">
            <ResumeUploadBox
              label="이력서"
              helperText="PDF 파일을 권장해요. 클릭해서 업로드하세요."
              hasFile={hasResumeFile}
              onPick={onPickResume}
              onRemove={onRemoveResume}
              onOpen={onOpenResume}
            />
          </div>
        )}
      </div>

      {/* 하단 액션 */}
      <div className="mt-10 flex items-center justify-end gap-6">
        <button
          type="button"
          onClick={onSkip}
          className="text-[16px] font-medium text-gray-400 hover:text-gray-500 transition"
        >
          건너뛰기
        </button>

        <ButtonRounded
          onClick={onNext}
          disabled={primaryDisabled}
          className={
            !isStep1 ? "bg-[#66c7a8] text-white disabled:opacity-40" : ""
          }
        >
          {loading ? "처리 중..." : primaryLabel}
        </ButtonRounded>
      </div>
    </div>
  );
}
