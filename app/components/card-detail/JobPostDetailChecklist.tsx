"use client";

import React from "react";
import { JobPostCardData } from "@/app/(page)/mainboard/_components/PostCard";

export default function JobPostDetailChecklist({
  job,
}: {
  job: JobPostCardData;
}) {
  return (
    <div className="text-sm text-gray-600">
      (예시) 체크리스트 탭 내용 — {job.title}
    </div>
  );
}
