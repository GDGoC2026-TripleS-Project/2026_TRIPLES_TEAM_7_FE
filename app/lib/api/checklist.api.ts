"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "./authApi";

/** 전체 체크리스트 조회 */
export type ChecklistSort = "deadline" | "recent" | "incomplete";
export type ChecklistOrder = "asc" | "desc";

export type ChecklistItem = {
  checklistId: number;
  checkListText: string;
  isButtonActive: boolean;
};

export type GapResult = {
  matchResultId: number;
  cardStatus: "GAP" | string;
  comment: string;
  isRequired: boolean;
  keywords: string[];
  checklists: ChecklistItem[];
};

export type CardSummary = {
  cardId: number;
  jobTitle: string;
  companyName: string;
  employmentType: string;
  matchPercent: number;
  deadlineAt: string;
};

export type ChecklistGroup = {
  matchId: number;
  createdAt: string;
  seenAt: string | null;
  isNew: boolean;
  totalChecklists: number;
  completedChecklists: number;
  cardSummary: CardSummary;
  gapResults: GapResult[];
};

export type GetAllChecklistsResponse = {
  isSuccess: boolean;
  code: string;
  message: string;
  data: ChecklistGroup[];
};

export type GetAllChecklistsParams = {
  sort?: ChecklistSort;
  order?: ChecklistOrder;
};

export async function getAllChecklists(params: GetAllChecklistsParams = {}) {
  const { sort = "deadline", order = "asc" } = params;

  return authApi.get<GetAllChecklistsResponse>(
    `/api/checklists/all-with-card?sort=${sort}&order=${order}`,
  );
}

export function useAllChecklists(params: GetAllChecklistsParams = {}) {
  return useQuery<GetAllChecklistsResponse, Error>({
    queryKey: [
      "checklistsAllWithCard",
      params.sort ?? "deadline",
      params.order ?? "asc",
    ],
    queryFn: () => getAllChecklists(params),
    staleTime: 10_000,
  });
}

export function useAllChecklistsData(params: GetAllChecklistsParams = {}) {
  const q = useAllChecklists(params);
  return {
    ...q,
    items: q.data?.data ?? [],
  };
}

/** 읽음 처리 */

export type MarkChecklistSeenResponse = {
  isSuccess: boolean;
  code: string;
  message: string;
  data: {
    updated: number;
  };
};

/** 특정 matchId 체크리스트 읽음 처리 */
export async function markChecklistSeen(matchId: number) {
  return authApi.patch<MarkChecklistSeenResponse>(
    `/api/matches/${matchId}/checklists/seen`,
  );
}

export function useMarkChecklistSeen() {
  const qc = useQueryClient();

  return useMutation<MarkChecklistSeenResponse, Error, number>({
    mutationFn: (matchId) => markChecklistSeen(matchId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["checklistsAllWithCard"] });
    },
  });
}

/** 체크리스트 항목 토글 */
export type ToggleChecklistResponse = {
  isSuccess: boolean;
  code: string;
  message: string;
  data: {
    checklistId: number;
    isButtonActive: boolean;
  };
};

export type ToggleChecklistResult = ToggleChecklistResponse["data"];

export async function toggleChecklist(checklistId: number) {
  const res = await authApi.patch<ToggleChecklistResponse>(
    `/api/checklists/${checklistId}/toggle`,
  );

  return res.data;
}

export function useToggleChecklist() {
  const qc = useQueryClient();

  return useMutation<ToggleChecklistResult, Error, number>({
    mutationFn: (checklistId) => toggleChecklist(checklistId),
    onSuccess: () => {
      // 버튼 상태/완료 개수(total/completed) 등이 바뀔 수 있으니 전체 재조회
      qc.invalidateQueries({ queryKey: ["checklistsAllWithCard"] });
      qc.invalidateQueries({ queryKey: ["checklistByMatchId"] });
    },
  });
}

/** 특정 공고(matchId) 체크리스트 조회 (GAP 체크리스트 + 카드 요약 포함) */

export type GetChecklistByMatchIdResponse = {
  isSuccess: boolean;
  code: string;
  message: string;
  data: ChecklistGroup;
};

export async function getChecklistByMatchId(matchId: number) {
  return authApi.get<GetChecklistByMatchIdResponse>(
    `/api/matches/${matchId}/checklists-with-card`,
  );
}

export function useChecklistByMatchId(matchId: number | null) {
  return useQuery<GetChecklistByMatchIdResponse, Error>({
    queryKey: ["checklistByMatchId", matchId],
    queryFn: () => getChecklistByMatchId(matchId as number),
    enabled: typeof matchId === "number" && matchId > 0,
    staleTime: 10_000,
  });
}

export function useChecklistByMatchIdData(matchId: number | null) {
  const q = useChecklistByMatchId(matchId);
  return {
    ...q,
    item: q.data?.data ?? null,
  };
}
