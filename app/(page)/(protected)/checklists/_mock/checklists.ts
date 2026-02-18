import { JobChecklist } from "../_types/checklist";

export const mockChecklists: JobChecklist[] = [
  {
    jobId: "naver-backend",
    title: "Backend Developer (Java)",
    meta: "네이버랩스 · 인턴 / 계약직",
    rate: 75,
    isNew: true,
    keywords: ["TypeScript 사용 경험", "테스트 코드 작성 경험", "자격증"],
    tasks: [
      {
        id: "1",
        text: "JS 프로젝트 3개를 TS로 마이그레이션 후 PR 생성",
        done: true,
      },
      {
        id: "2",
        text: "TypeScript 사용 경험 포트폴리오 정리",
        done: false,
      },
      { id: "3", text: "Jest 또는 RTL 기본 사용 익히기", done: false },
      { id: "4", text: "테스트 적용 사례 포폴 정리", done: false },
    ],
  },
  {
    jobId: "kakao-data",
    title: "Data Platform Engineer",
    meta: "카카오 · 정규직",
    rate: 52,
    isNew: false,
    keywords: ["Python", "SQL", "대용량 처리"],
    tasks: [
      { id: "1", text: "대용량 로그 처리 프로젝트 작성", done: false },
      { id: "2", text: "ETL 파이프라인 구조 설명 문서 작성", done: false },
    ],
  },
];
