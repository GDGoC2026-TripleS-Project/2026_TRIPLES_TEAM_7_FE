"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "./authApi";

/** 공고 카드 생성 */
export type CreateCardRequest = {
  url: string;
};

export type CreateCardResponse = {
  isSuccess: boolean;
  code: string;
  message: string;
  data: {
    cardId: number;
    message: string;
  };
};

export async function createJobCard(payload: CreateCardRequest) {
  return authApi.post<CreateCardResponse>("/api/card/create", payload);
}

export function useCreateJobCard() {
  const qc = useQueryClient();

  return useMutation<CreateCardResponse, Error, CreateCardRequest>({
    mutationFn: createJobCard,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["canvasCards"] });
    },
  });
}

/** 캔버스 카드 조회 */
export type CanvasCardContent = {
  jobPostId: number;
  deadlineAt: string;
  jobTitle: string;
  companyName: string;
  employmentType: string;
  roleText: string;
  necessaryStack: string[];
  isAnalyzed: boolean;
};

export type CanvasCardItem = {
  cardId: string | number;
  cardContent: CanvasCardContent;
  canvasX: number;
  canvasY: number;
};

export async function getCanvasCards() {
  return authApi.get<CanvasCardItem[]>("/api/canvas");
}

export function useCanvasCards() {
  return useQuery<CanvasCardItem[], Error>({
    queryKey: ["canvasCards"],
    queryFn: getCanvasCards,
    staleTime: 10_000,
  });
}

/** 캔버스 카드 위치 업데이트 */
export type UpdateCanvasCardPositionRequest = {
  cardId: number;
  x: number;
  y: number;
};

export type UpdateCanvasCardPositionResponse = {
  success: boolean;
  message: string;
  data: {
    cardId: number;
    x: number;
    y: number;
  };
};

export async function updateCanvasCardPosition(
  payload: UpdateCanvasCardPositionRequest,
) {
  return authApi.post<UpdateCanvasCardPositionResponse>("/api/canvas", payload);
}

export function useUpdateCanvasCardPosition() {
  return useMutation<
    UpdateCanvasCardPositionResponse,
    Error,
    UpdateCanvasCardPositionRequest
  >({
    mutationFn: updateCanvasCardPosition,
  });
}

/** 카드 상세 조회 */
export type CardAddressPoint = {
  type: "Point";
  coordinates: [number, number];
};

export type CardStatus = "CANVAS" | "ARCHIVED" | "DELETED" | string;

export type CardDetailDto = {
  id: number;
  userId: number;
  jobPostId: number;

  fileUrl: string | null;

  deadlineAt: string;
  jobTitle: string;
  companyName: string;
  employmentType: string;

  roleText: string;
  necessaryStack: string[];
  preferStack: string[];

  salaryText: string | null;
  locationText: string | null;
  experienceLevel: string | null;
  workDay: string | null;

  addressPoint: CardAddressPoint | null;

  cardStatus: CardStatus;
  createdAt: string;
};

export type GetCardDetailResponse = {
  isSuccess: boolean;
  code: string;
  message: string;
  data: CardDetailDto;
};

export async function getCardDetail(cardId: number) {
  return authApi.get<GetCardDetailResponse>(`/api/card/${cardId}`);
}

export function useCardDetail(cardId?: number) {
  return useQuery<GetCardDetailResponse, Error>({
    queryKey: ["cardDetail", cardId],
    queryFn: () => getCardDetail(cardId as number),
    enabled: typeof cardId === "number" && Number.isFinite(cardId),
    staleTime: 10_000,
  });
}
