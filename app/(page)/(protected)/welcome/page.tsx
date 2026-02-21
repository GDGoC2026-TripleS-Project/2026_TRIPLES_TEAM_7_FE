"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import WelcomeStepCard from "./_components/WelcomeStepCard";
import {
  useMyPageData,
  useUpdateMyAddress,
  useUploadMyResume,
} from "@/app/lib/api/my.api";

export default function WelcomePage() {
  const router = useRouter();

  const {
    address: savedAddress,
    resumeUrl: savedResumeUrl,
    isLoading: myLoading,
  } = useMyPageData();

  const updateAddress = useUpdateMyAddress();
  const uploadResume = useUploadMyResume();

  const [step, setStep] = useState<1 | 2>(1);
  const [address, setAddress] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const hasResumeFile = useMemo(() => !!resumeFile, [resumeFile]);

  const isSubmitting = updateAddress.isPending || uploadResume.isPending;

  useEffect(() => {
    if (myLoading) return;
    const alreadyOnboarded = !!savedAddress || !!savedResumeUrl;
    if (alreadyOnboarded) {
      router.replace("/mainboard");
    }
  }, [myLoading, savedAddress, savedResumeUrl, router]);

  const handleSkip = () => {
    if (isSubmitting) return;

    if (step === 1) {
      setStep(2); // 주소 → 이력서 단계 이동
    } else {
      router.push("/mainboard"); // 이력서 → 메인 이동
    }
  };

  const handleNext = () => {
    if (isSubmitting) return;

    // step1: 주소 저장 후 step2로
    if (step === 1) {
      const trimmed = address.trim();
      if (!trimmed) return;

      updateAddress.mutate(
        { address: trimmed },
        {
          onSuccess: () => {
            setStep(2);
          },
          onError: (e) => {
            alert(e.message);
          },
        },
      );
      return;
    }

    // step2: 이력서 업로드 후 메인으로
    if (!resumeFile) return;

    uploadResume.mutate(resumeFile, {
      onSuccess: () => {
        router.push("/mainboard");
      },
      onError: (e) => {
        alert(e.message);
      },
    });
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-auth">
      {/* 배경 그라데이션 오버레이 */}
      <div
        className="
          absolute inset-0
          bg-[radial-gradient(circle_at_50%_-20%,#3A2B2F_0%,#1E171A_60%)]
        "
      />

      {/* 중앙 콘텐츠 영역 */}
      <div className="relative z-10 flex min-h-screen flex-col items-center pt-[110px]">
        {/* 상단 로고 + 텍스트 */}
        <div className="flex items-center gap-2">
          {/* 로고 이미지 (경로만 맞춰줘) */}
          <Image
            src="/logo_white.svg"
            alt="PIEC"
            width={59}
            height={27}
            priority
          />
          <h1 className="text-[26px] font-semibold text-white/90">
            에 오신 걸 환영해요.
          </h1>
        </div>

        {/* 카드 영역 */}
        <div className="mt-26">
          <WelcomeStepCard
            step={step}
            address={address}
            onChangeAddress={setAddress}
            hasResumeFile={hasResumeFile}
            onPickResume={(f) => setResumeFile(f)}
            onRemoveResume={() => setResumeFile(null)}
            onOpenResume={() => {
              if (resumeFile) alert(resumeFile.name);
            }}
            onSkip={handleSkip}
            onNext={handleNext}
          />
        </div>
      </div>
    </div>
  );
}
