import { useAllChecklistsData } from "@/app/lib/api/checklist.api";
import ChecklistCard from "./_components/ChecklistCard";
import { mapChecklistGroupToJobChecklist } from "./_utils/mapChecklist";

export default function ChecklistsPage() {
  const { items, isLoading, isError, error } = useAllChecklistsData({
    sort: "recent",
    order: "desc",
  });

  const uiItems = items.map(mapChecklistGroupToJobChecklist);

  return (
    <div className="h-screen flex flex-col">
      {/* 상단 고정 영역 */}
      <div className="pt-20 pb-18 text-center">
        <h1 className="text-[30px]/[33px] font-bold">전체 체크리스트</h1>
        <p className="mt-2 text-[20px]/[20px] font-medium text-main-click">
          체크리스트를 하나씩 완료하며 필요한 준비를 차근차근 해보세요.
        </p>
      </div>

      {/* 스크롤 영역 */}
      <div className="flex-1 overflow-y-auto scrollbar-hide pb-20">
        <div className="mx-auto max-w-6xl space-y-4">
          {isLoading && (
            <div className="py-10 text-center text-gray-400">
              불러오는 중...
            </div>
          )}

          {isError && (
            <div className="py-10 text-center text-red-500">
              {error?.message ?? "체크리스트 조회 실패"}
            </div>
          )}

          {!isLoading && !isError && items.length === 0 && (
            <div className="py-10 text-center text-gray-400">
              표시할 체크리스트가 없어요.
            </div>
          )}

          {!isLoading &&
            !isError &&
            uiItems.map((c) => <ChecklistCard key={c.jobId} data={c} />)}
        </div>
      </div>
    </div>
  );
}
