"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import ConfirmModal from "@/app/components/common/ConfirmModal";

type ModalType = "logout" | "withdraw" | null;

export default function SettingsPage() {
  const router = useRouter();
  const [modal, setModal] = useState<ModalType>(null);
  const [isLoading, setIsLoading] = useState(false);

  const user = useMemo(
    () => ({
      name: "홍길동",
      email: "yena040814@gmail.com",
    }),
    [],
  );

  const closeModal = () => {
    if (isLoading) return;
    setModal(null);
  };

  const handleConfirmLogout = async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);

      setModal(null);
      router.push("/login");
    } catch (e: any) {
      alert(e?.message ?? "로그아웃에 실패했어요.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmWithdraw = async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);

      setModal(null);
      router.push("/login");
    } catch (e: any) {
      alert(e?.message ?? "계정 탈퇴에 실패했어요.");
    } finally {
      setIsLoading(false);
    }
  };

  const modalConfig = useMemo(() => {
    if (modal === "logout") {
      return {
        title: "로그아웃 하시겠어요?",
        description: "로그아웃하면 다시 로그인해야 해요.",
        cancelText: "취소",
        confirmText: "로그아웃",
        onConfirm: handleConfirmLogout,
      };
    }

    if (modal === "withdraw") {
      return {
        title: "계정을 탈퇴하시겠어요?",
        description:
          "탈퇴하면 PIEC에 저장된 프로필 정보와 첨부 자료가 모두 삭제됩니다. Google 계정은 삭제되지 않아요. *이 작업은 되돌릴 수 없어요..",
        cancelText: "계정 유지하기",
        confirmText: "탈퇴하기",
        onConfirm: handleConfirmWithdraw,
      };
    }

    return null;
  }, [modal, isLoading]);

  return (
    <div className="min-h-[calc(100vh-120px)] px-60 pb-14 pt-16">
      <h1 className="text-center text-[28px] font-semibold text-gray-900">
        설정
      </h1>
      <h3 className="text-[20px]/[20px] font-bold text-gray-900 pt-30">
        계정 및 데이터 관리
      </h3>

      <div className="mt-12 rounded-2xl border border-gray-300 bg-white px-7 py-6">
        <div className="flex items-center gap-4">
          <div
            className={[
              "h-12 w-12 rounded-full",
              "border border-gray-200",
              "flex items-center justify-center",
              "text-gray-500 font-semibold",
            ].join(" ")}
          >
            {user.name?.[0] ?? "U"}
          </div>

          <div className="min-w-0">
            <div className="text-[18px] font-semibold text-gray-900">
              {user.name}
            </div>
            <div className="mt-1 text-[14px] text-gray-500">{user.email}</div>
          </div>
        </div>
      </div>

      <div className="mt-60 space-y-4">
        <button
          type="button"
          onClick={() => setModal("logout")}
          className={[
            "w-full rounded-2xl border border-gray-300 bg-white",
            "py-4 text-[18px] font-semibold text-gray-900",
            "hover:bg-gray-50",
          ].join(" ")}
        >
          로그아웃
        </button>

        <button
          type="button"
          onClick={() => setModal("withdraw")}
          className={[
            "w-full rounded-2xl border border-gray-300 bg-white",
            "py-4 text-[18px] font-semibold text-red-500",
            "hover:bg-gray-50",
          ].join(" ")}
        >
          계정 탈퇴
        </button>
      </div>

      <ConfirmModal
        open={!!modalConfig}
        title={modalConfig?.title ?? ""}
        description={modalConfig?.description}
        cancelText={modalConfig?.cancelText}
        confirmText={modalConfig?.confirmText}
        onCancel={closeModal}
        onConfirm={modalConfig?.onConfirm ?? closeModal}
        isLoading={isLoading}
      />
    </div>
  );
}
