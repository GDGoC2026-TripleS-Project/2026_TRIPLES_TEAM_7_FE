"use client";

import { useQuery } from "@tanstack/react-query";
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
