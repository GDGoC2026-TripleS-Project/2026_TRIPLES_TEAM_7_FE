"use client";

import React, { useState } from "react";
import ProfileCard from "./_components/ProfileCard";
import EditResumeForm from "./_components/EditResumeForm";
import EditAddressForm from "./_components/EditAddressForm";

type Mode = "view" | "edit-location" | "edit-resume";

type Resume = {
  name?: string;
  url?: string;
};

export default function MyPage() {
  const [mode, setMode] = useState<Mode>("view");

  const [location, setLocation] = useState("경기도 의정부시 호원동 441-4");
  const [resume, setResume] = useState<Resume>({
    name: "resume.pdf",
    url: "", // 추후 API에서 내려주면 사용
  });

  return (
    <div className="relative">
      <div className="mx-auto w-full max-w-[1120px] px-8 pt-16">
        <h1 className="text-center text-[28px] font-semibold text-gray-900">
          마이 페이지
        </h1>
      </div>

      <div className="mx-auto w-full max-w-[1120px] px-8 pb-16 pt-14">
        {mode === "view" && (
          <ProfileCard
            location={location}
            resume={resume}
            onEditLocation={() => setMode("edit-location")}
            onEditResume={() => setMode("edit-resume")}
            onEditAll={() => {
              setMode("edit-location"); //추후 수정
            }}
            onOpenResume={() => {
              if (!resume.name) return;
              console.log("open resume:", resume);
            }}
          />
        )}

        {mode === "edit-location" && (
          <EditAddressForm
            initialValue={location}
            onCancel={() => setMode("view")}
            onSubmit={(next) => {
              setLocation(next);
              setMode("view");
            }}
          />
        )}

        {mode === "edit-resume" && (
          <EditResumeForm
            currentResume={resume}
            onCancel={() => setMode("view")}
            onSubmit={(next) => {
              setResume(next);
              setMode("view");
            }}
          />
        )}
      </div>
    </div>
  );
}
