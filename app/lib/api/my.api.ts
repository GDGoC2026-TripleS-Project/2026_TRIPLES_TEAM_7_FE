"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "./authApi";

/** 마이페이지 - 주소, 이력서 조회 */
export type GetMyPageResponse = {
  success: boolean;
  message: string;
  data: {
    address: string | null;
    resumeUrl: string | null;
  };
};

export async function getMyPage() {
  return authApi.get<GetMyPageResponse>("/api/user/mypage");
}

export function useMyPage() {
  return useQuery<GetMyPageResponse, Error>({
    queryKey: ["myPage"],
    queryFn: getMyPage,
    staleTime: 30_000,
  });
}

export function useMyPageData() {
  const q = useMyPage();
  return {
    ...q,
    my: q.data?.data,
    address: q.data?.data.address ?? null,
    resumeUrl: q.data?.data.resumeUrl ?? null,
  };
}

/**주소 업데이트 */
export type UpdateAddressRequest = {
  address: string;
};

export type UpdateAddressResponse = {
  success: boolean;
  message: string;
  result: {
    address: string;
  };
};

export async function updateMyAddress(payload: UpdateAddressRequest) {
  return authApi.patch<UpdateAddressResponse>("/api/user/address", payload);
}

export function useUpdateMyAddress() {
  const qc = useQueryClient();

  return useMutation<UpdateAddressResponse, Error, UpdateAddressRequest>({
    mutationFn: updateMyAddress,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["myPage"] });
    },
  });
}

/** 이력서 업로드/수정 */
export type UploadResumeResponse = {
  success: boolean;
  message: string;
  resumeUrl: string;
};

export async function uploadMyResume(resumeFile: File) {
  const formData = new FormData();
  formData.append("resume", resumeFile);

  return authApi.patch<UploadResumeResponse>("/api/user/resume", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export function useUploadMyResume() {
  const qc = useQueryClient();

  return useMutation<UploadResumeResponse, Error, File>({
    mutationFn: uploadMyResume,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["myPage"] });
    },
  });
}
