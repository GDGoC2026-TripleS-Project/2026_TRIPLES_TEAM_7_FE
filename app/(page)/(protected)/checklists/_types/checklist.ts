export type ChecklistTask = {
  id: string;
  text: string;
  done: boolean;
};

export type JobChecklist = {
  jobId: string;
  title: string;
  meta: string;
  rate: number;
  keywords: string[];

  isNew: boolean; // 노란 점 표시용
  tasks: ChecklistTask[];
};
