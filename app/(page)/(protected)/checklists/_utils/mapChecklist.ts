import { ChecklistGroup } from "@/app/lib/api/checklist.api";
import { JobChecklist } from "../_types/checklist";
import { mapEmploymentTypeToLabel } from "@/app/lib/constants/mapEmploymentType";

export function mapChecklistGroupToJobChecklist(
  group: ChecklistGroup,
): JobChecklist {
  const card = group.cardSummary;

  const tasks = group.gapResults.flatMap((gr) =>
    gr.checklists.map((c) => ({
      id: String(c.checklistId),
      text: c.checkListText,
      done: !!c.isButtonActive,
      checklistId: c.checklistId,
    })),
  );

  const keywords = Array.from(
    new Set(group.gapResults.flatMap((gr) => gr.keywords ?? [])),
  );

  return {
    jobId: String(group.matchId),
    matchId: group.matchId,
    title: card.jobTitle,
    meta: `${card.companyName} · ${mapEmploymentTypeToLabel(card.employmentType)}`,
    rate: card.matchPercent,
    keywords,
    isNew: group.isNew,
    tasks,
  };
}
