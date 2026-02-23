"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "./authApi";
import { EmploymentType } from "../constants/mapEmploymentType";

/** 공고 카드 생성 */
export type CreateCardRequest = {
  url: string;
};

export type CreateCardResponse = {
  isSuccess: boolean;
  code: string;
  message: string;
  data: {
    jobId: string;
  };
};

export async function createJobCard(payload: CreateCardRequest) {
  return authApi.post<CreateCardResponse>("/api/card/create", payload);
}

export type CardCreateJobStatus = "PENDING" | "DONE" | string;

export type CardCreateStatusResponse = {
  isSuccess: boolean;
  status: CardCreateJobStatus; // "PENDING" | "DONE"
  data: null | {
    cardId: number;
    message: string;
  };
  error: any | null;
};

export async function getCreateJobStatus(jobId: string) {
  return authApi.get<CardCreateStatusResponse>(`/api/card/status/${jobId}`);
}

export async function waitForCardCreateDone(args: {
  jobId: string;
  intervalMs?: number;
  timeoutMs?: number;
}) {
  const { jobId, intervalMs = 3000, timeoutMs = 60_000 } = args;

  const startedAt = Date.now();

  // eslint-disable-next-line no-constant-condition
  while (true) {
    if (Date.now() - startedAt > timeoutMs) {
      throw new Error(
        "카드 생성 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.",
      );
    }

    const res = await getCreateJobStatus(jobId);

    if (!res?.isSuccess) {
      throw new Error(
        res?.error?.message ?? "카드 생성 상태 조회에 실패했습니다.",
      );
    }

    if (res.status === "DONE") {
      if (!res.data?.cardId) {
        throw new Error("카드 생성 완료 응답에 cardId가 없습니다.");
      }
      return res; // DONE 응답 그대로 반환
    }

    // PENDING이면 대기 후 재조회
    await new Promise((r) => setTimeout(r, intervalMs));
  }
}

export function useCreateJobStatus(jobId?: string, enabled = true) {
  return useQuery<CardCreateStatusResponse, Error>({
    queryKey: ["cardCreateStatus", jobId],
    queryFn: () => getCreateJobStatus(jobId as string),
    enabled: !!jobId && enabled,
    // 권장 3초 간격 폴링 (PENDING일 때만 유지하고 싶다면 아래처럼 함수로도 가능)
    refetchInterval: (q) => (q.state.data?.status === "PENDING" ? 3000 : false),
    staleTime: 0,
  });
}

// export function useCreateJobCard() {
//   const qc = useQueryClient();

//   return useMutation<CardCreateStatusResponse, Error, CreateCardRequest>({
//     mutationFn: async (payload) => {
//       // 1) 생성 요청 → jobId 받기
//       const accepted = await createJobCard(payload);

//       if (!accepted?.isSuccess || !accepted?.data?.jobId) {
//         throw new Error(accepted?.message ?? "카드 생성 요청에 실패했습니다.");
//       }

//       // 2) jobId로 DONE까지 폴링
//       const doneRes = await waitForCardCreateDone({
//         jobId: accepted.data.jobId,
//         intervalMs: 3000,
//         timeoutMs: 60_000, // 필요시 늘리기
//       });

//       return doneRes;
//     },
//     onSuccess: () => {
//       // DONE 되면 캔버스 카드 다시 불러오기
//       qc.invalidateQueries({ queryKey: ["canvasCards"] });
//     },
//   });
// }

export function useCreateJobCard() {
  return useMutation<CreateCardResponse, Error, CreateCardRequest>({
    mutationFn: createJobCard,
  });
}

/** 캔버스 카드 조회 */
export type CanvasCardContent = {
  jobPostId: number;
  deadlineAt: string;
  jobTitle: string;
  companyName: string;
  employmentType: EmploymentType;
  roleText: string;
  necessaryStack: string[];
  matchPercent: number | null;
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
  employmentType: EmploymentType;

  roleText: string;
  necessaryStack: string[];
  preferStack: string[];

  salaryText: string | null;
  locationText: string | null;
  experienceLevel: string | null;
  workDay: string | null;

  addressPoint: CardAddressPoint | null;

  matchPercent: number | null;

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

/** 카드 삭제 */
export type DeleteCardResponse = {
  isSuccess: boolean;
  code: string;
  message: string;
  data: {
    cardId: number;
  };
};

export async function deleteCard(cardId: number) {
  return authApi.del<DeleteCardResponse>(`/api/card/delete/${cardId}`);
}

export function useDeleteCard() {
  const qc = useQueryClient();

  return useMutation<DeleteCardResponse, Error, number>({
    mutationFn: (cardId) => deleteCard(cardId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["canvasCards"] });
      qc.invalidateQueries({ queryKey: ["cardDetail"] });
    },
  });
}

/** 우선순위별 카드 조회 */
export type CanvasPrioritySort =
  | "deadline"
  | "salary"
  | "distance"
  | "matchedPercent"
  | null;

export type CanvasPriorityGroup = {
  priorityLevel: number;
  cardIds: number[];
};

export type GetCanvasSortedResponse = {
  success: boolean;
  sort: CanvasPrioritySort;
  message: string;
  data: CanvasPriorityGroup[];
};

export async function getCanvasSortedCards(sort: CanvasPrioritySort) {
  return authApi.get<GetCanvasSortedResponse>(
    `/api/canvas/sorted?sort=${sort}`,
  );
}

export function useCanvasSortedCards(sort: CanvasPrioritySort) {
  return useQuery<GetCanvasSortedResponse, Error>({
    queryKey: ["canvasSortedCards", sort],
    queryFn: () => getCanvasSortedCards(sort),
    enabled: !!sort,
    staleTime: 10_000,
  });
}

export function useCanvasSortedCardsData(sort: CanvasPrioritySort) {
  const q = useCanvasSortedCards(sort);
  return {
    ...q,
    groups: q.data?.data ?? [],
    sort: q.data?.sort ?? sort,
  };
}
