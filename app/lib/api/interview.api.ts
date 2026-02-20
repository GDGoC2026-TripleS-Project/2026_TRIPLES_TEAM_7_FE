"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "./authApi";

/** 내 카드 전체 INTERVIEW 상태로 변경 */
export type SetInterviewStatusResponse = {
  isSuccess: boolean;
  code: string;
  data: {
    userId: number;
    updatedCount: number;
  };
};

export async function setAllCardsToInterview() {
  return authApi.post<SetInterviewStatusResponse>(
    "/api/interview/cards/status",
  );
}

export function useSetAllCardsToInterview() {
  const qc = useQueryClient();

  return useMutation<SetInterviewStatusResponse, Error, void>({
    mutationFn: setAllCardsToInterview,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["canvasCards"] });
      qc.invalidateQueries({ queryKey: ["cardDetail"] });
    },
  });
}

/**
 * 공통 타입: 면접 질문 세트
 */

export type InterviewQuestionItem = {
  questionId: number;
  orderNo: number;
  questionText: string;
  keywords: string[];
};

export type InterviewQuestionSet = {
  cardId: number;
  setId: number;
  generatedAt: string;
  questions: InterviewQuestionItem[];
};

/** 특정 카드 면접 질문 생성 */
export type CreateInterviewQuestionsResponse = {
  isSuccess: boolean;
  code: string;
  data: InterviewQuestionSet;
};

export async function createInterviewQuestions(cardId: number) {
  return authApi.post<CreateInterviewQuestionsResponse>(
    `/api/cards/${cardId}/interview/questions`,
  );
}

export function useCreateInterviewQuestions() {
  const qc = useQueryClient();

  return useMutation<CreateInterviewQuestionsResponse, Error, number>({
    mutationFn: (cardId) => createInterviewQuestions(cardId),
    onSuccess: (_res, cardId) => {
      qc.invalidateQueries({ queryKey: ["interviewQuestions", cardId] });
    },
  });
}

/** 특정 카드 활성화된 면접 질문 조회 */
export type GetInterviewQuestionsResponse = {
  isSuccess: boolean;
  code: string;
  data: InterviewQuestionSet;
};

export async function getInterviewQuestions(cardId: number) {
  return authApi.get<GetInterviewQuestionsResponse>(
    `/api/cards/${cardId}/interview/questions`,
  );
}

export function useInterviewQuestions(cardId?: number) {
  return useQuery<GetInterviewQuestionsResponse, Error>({
    queryKey: ["interviewQuestions", cardId],
    queryFn: () => getInterviewQuestions(cardId as number),
    enabled: Number.isFinite(cardId),
    staleTime: 10_000,
  });
}
