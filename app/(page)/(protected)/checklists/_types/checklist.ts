export type ChecklistTask = {
  id: string;
  text: string;
  done: boolean;

  checklistId: number;
};

export type JobChecklist = {
  jobId: string;
  title: string;
  meta: string;
  rate: number;
  keywords: string[];

  isNew: boolean;

  matchId: number;

  tasks: ChecklistTask[];
};
