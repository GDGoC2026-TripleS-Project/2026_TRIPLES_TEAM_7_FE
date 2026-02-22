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

/** 로그아웃 / 회원탈퇴 */

export type LogoutResponse = {
  success: boolean;
  message: string;
};

export async function googleLogout() {
  return authApi.post<LogoutResponse>("/api/auth/googleLogout");
}

export function useGoogleLogout() {
  const qc = useQueryClient();

  return useMutation<LogoutResponse, Error, void>({
    mutationFn: () => googleLogout(),
    onSuccess: () => {
      // 로그아웃 시점에 캐시를 비워두는 편이 안전
      qc.clear();
    },
  });
}

export type DeleteAccountResponse = {
  success: boolean;
  message: string;
};

export async function deleteAccount() {
  return authApi.del<DeleteAccountResponse>("/api/auth/delete");
}

export function useDeleteAccount() {
  const qc = useQueryClient();

  return useMutation<DeleteAccountResponse, Error, void>({
    mutationFn: () => deleteAccount(),
    onSuccess: () => {
      // 탈퇴 후에도 남아있는 캐시 제거
      qc.clear();
    },
  });
}

/** 설정 페이지 - username/email 조회 */
export type GetMyAccountResponse = {
  success: boolean;
  message: string;
  data: {
    username: string;
    email: string;
  };
};

export async function getMyAccount() {
  return authApi.get<GetMyAccountResponse>("/api/user/account");
}

export function useMyAccount() {
  return useQuery<GetMyAccountResponse, Error>({
    queryKey: ["myAccount"],
    queryFn: getMyAccount,
    staleTime: 30_000,
  });
}

export function useMyAccountData() {
  const q = useMyAccount();
  return {
    ...q,
    username: q.data?.data.username ?? "",
    email: q.data?.data.email ?? "",
  };
}
