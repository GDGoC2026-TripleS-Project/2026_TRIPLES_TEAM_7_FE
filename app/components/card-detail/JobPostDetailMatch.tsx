"use client";

import React from "react";
import { JobPostCardData } from "@/app/(page)/mainboard/_components/PostCard";

export default function JobPostDetailMatch({ job }: { job: JobPostCardData }) {
  return (
    <div className="text-sm text-gray-600">
      (예시) 나의 매치율 탭 내용 —{" "}
      {job.match.status === "done" ? `${job.match.rate}%` : "분석 전"}
    </div>
  );
}
