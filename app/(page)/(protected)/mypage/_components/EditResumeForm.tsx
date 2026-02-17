"use client";

import ButtonRounded from "@/app/components/common/button&tab/ButtonRounded";
import ResumeUploadBox from "@/app/components/common/ResumeUploadBox";
import Image from "next/image";
import React, { useState } from "react";

type Resume = {
  name?: string;
  url?: string;
};

type Props = {
  currentResume?: Resume;
  onSubmit: (nextResume: Resume) => void;
  onCancel: () => void;
};

export default function EditResumeForm({
  currentResume,
  onSubmit,
  onCancel,
}: Props) {
  const [resume, setResume] = useState<Resume>(currentResume ?? {});

  const hasResume = !!resume.name;

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
          hasFile={hasResume}
          onPick={(file) => {
            setResume({ name: file.name, url: "" });
          }}
          onRemove={() => setResume({})}
          onOpen={() => {
            if (!resume.name) return;
            console.log("open resume:", resume);
          }}
        />

        <div className="mt-10 flex justify-center">
          <ButtonRounded onClick={() => onSubmit(resume)} disabled={!hasResume}>
            수정완료
          </ButtonRounded>
        </div>
      </div>
    </section>
  );
}
