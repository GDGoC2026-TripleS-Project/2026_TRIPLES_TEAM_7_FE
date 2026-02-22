"use client";

import ButtonRounded from "@/app/components/common/button&tab/ButtonRounded";
import Input from "@/app/components/common/Input";
import Image from "next/image";
import React, { useState } from "react";

type Props = {
  initialValue: string;
  onSubmit: (next: string) => Promise<void> | void;
  onCancel: () => void;
  isLoading?: boolean;
  submitText?: string;
};

export default function EditAddressForm({
  initialValue,
  onSubmit,
  onCancel,
  isLoading = false,
  submitText = "수정완료",
}: Props) {
  const [value, setValue] = useState(initialValue);

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
          거주하는 지역을 입력해주세요.
        </h2>
        <p className="text-[16px] text-gray-500">
          주로 지원하는 직무를 기준으로 공고와 이력서를 정리해드려요.
        </p>
      </div>

      <div className="mt-10 rounded-[28px] bg-white px-10 py-10 shadow-sm">
        <div className="">
          <label className="block text-[14px] font-semibold text-gray-900">
            거주 지역
          </label>

          <div className="mt-3">
            <Input
              value={value}
              onChange={setValue}
              placeholder="거주지 입력"
            />
          </div>
        </div>

        <div className="mt-10 flex justify-center">
          <ButtonRounded
            onClick={() => onSubmit(value)}
            disabled={isLoading || value.trim().length === 0}
          >
            {isLoading ? "처리 중..." : submitText}
          </ButtonRounded>
        </div>
      </div>
    </section>
  );
}
