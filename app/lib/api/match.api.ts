"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "./authApi";

/** AI 매칭 생성 */

export type CreateMatchRequest = {
  cardId: number;
  fileUrl: string; // resumeUrl
};

export type MatchResultItem = {
  matchResultId: number;
  comment: string;
};

export type MatchGapItem = MatchResultItem & {
  isRequired: boolean;
};

export type CreateMatchResponse = {
  matchId: number;
  matchPercent: number;
  createdAt: string;
  sourceFileUrl: string;
  strengthTop3: MatchResultItem[];
  gapTop3: MatchGapItem[];
  riskTop3: MatchResultItem[];
  canCreateChecklist: boolean;
};

export async function createMatch(payload: CreateMatchRequest) {
  const { cardId, fileUrl } = payload;
  return authApi.post<CreateMatchResponse>(`/api/cards/${cardId}/match`, {
    fileUrl,
  });
}

export function useCreateMatch() {
  const qc = useQueryClient();

  return useMutation<CreateMatchResponse, Error, CreateMatchRequest>({
    mutationFn: createMatch,
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["cardDetail", variables.cardId] });
      qc.invalidateQueries({ queryKey: ["cardMatch", variables.cardId] });
      qc.invalidateQueries({ queryKey: ["canvasCards"] });
    },
  });
}

/** 최신 매칭 결과 조회 */
export type GetLatestMatchResponse = CreateMatchResponse;

export async function getLatestMatch(cardId: number) {
  try {
    return await authApi.get<GetLatestMatchResponse>(
      `/api/cards/${cardId}/match`,
    );
  } catch (e: any) {
    if (e?.status === 404) return null;
    throw e;
  }
}

export function useLatestMatch(cardId?: number) {
  const enabled = typeof cardId === "number" && Number.isFinite(cardId);

  return useQuery<GetLatestMatchResponse | null, Error>({
    queryKey: ["cardMatch", cardId],
    queryFn: () => getLatestMatch(cardId as number),
    enabled,
    staleTime: 10_000,
    retry: false,
  });
}
