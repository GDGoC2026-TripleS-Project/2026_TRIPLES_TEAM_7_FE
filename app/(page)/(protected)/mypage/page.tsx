"use client";

import React, { useMemo, useState } from "react";
import ProfileCard from "./_components/ProfileCard";
import EditResumeForm from "./_components/EditResumeForm";
import EditAddressForm from "./_components/EditAddressForm";
import {
  useMyPageData,
  useUpdateMyAddress,
  useUploadMyResume,
} from "@/app/lib/api/my.api";

type Mode = "view" | "edit-location" | "edit-resume";

type ResumeState = {
  name?: string;
  url?: string;
  file?: File;
};

function filenameFromUrl(url?: string | null) {
  if (!url) return undefined;
  try {
    const clean = url.split("?")[0];
    return decodeURIComponent(clean.split("/").pop() || "");
  } catch {
    return "resume.pdf";
  }
}

export default function MyPage() {
  const [mode, setMode] = useState<Mode>("view");

  const [isEditAllFlow, setIsEditAllFlow] = useState(false);

  const { address, resumeUrl, isLoading, isError, error, refetch } =
    useMyPageData();

  const updateAddress = useUpdateMyAddress();
  const uploadResume = useUploadMyResume();

  const resume: ResumeState = useMemo(() => {
    return {
      url: resumeUrl ?? undefined,
      name: filenameFromUrl(resumeUrl),
    };
  }, [resumeUrl]);

  const location = address ?? "";

  const goView = () => {
    setMode("view");
    setIsEditAllFlow(false);
  };

  const startEditAll = () => {
    setIsEditAllFlow(true);
    setMode("edit-location");
  };

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-[1320px] px-60 pt-16">
        <h1 className="text-center text-[28px] font-semibold text-gray-900">
          마이 페이지
        </h1>
        <div className="pt-20 text-center text-gray-400">불러오는 중...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto w-full max-w-[1320px] px-60 pt-16">
        <h1 className="text-center text-[28px] font-semibold text-gray-900">
          마이 페이지
        </h1>

        <div className="pt-20 text-center text-red-500">
          {error?.message ?? "마이페이지 조회 실패"}
          <button className="ml-2 underline" onClick={() => refetch()}>
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="mx-auto w-full max-w-[1320px] px-60 pt-16">
        <h1 className="text-center text-[28px] font-semibold text-gray-900">
          마이 페이지
        </h1>
      </div>

      <div className="mx-auto w-full max-w-[1320px] px-8 pb-16 pt-30">
        {mode === "view" && (
          <ProfileCard
            location={location || "거주지를 입력해주세요."}
            resume={resume}
            onEditLocation={() => {
              setIsEditAllFlow(false);
              setMode("edit-location");
            }}
            onEditResume={() => {
              setIsEditAllFlow(false);
              setMode("edit-resume");
            }}
            onEditAll={startEditAll}
            onOpenResume={() => {
              if (!resume.url) return;
              window.open(resume.url, "_blank", "noopener,noreferrer");
            }}
          />
        )}

        {mode === "edit-location" && (
          <EditAddressForm
            initialValue={location}
            isLoading={updateAddress.isPending}
            submitText={isEditAllFlow ? "다음" : "수정완료"}
            onCancel={goView}
            onSubmit={async (next) => {
              await updateAddress.mutateAsync({ address: next });
              if (isEditAllFlow) setMode("edit-resume");
              else goView();
            }}
          />
        )}

        {mode === "edit-resume" && (
          <EditResumeForm
            currentResume={resume}
            isLoading={uploadResume.isPending}
            submitText="수정완료"
            onCancel={goView}
            onSubmit={async (next) => {
              if (next.file) {
                await uploadResume.mutateAsync(next.file);
              }
              goView();
            }}
          />
        )}
      </div>
    </div>
  );
}
