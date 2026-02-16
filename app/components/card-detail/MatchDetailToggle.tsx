"use client";

import Image from "next/image";
import React, { useMemo, useState } from "react";

type Item = {
  id: string;
  label: string;
  iconSrc: string; // 왼쪽 아이콘(이미지 연결)
  details?: string[];
  defaultOpen?: boolean;
  rightIconSrc?: string;
};

type Props = {
  items?: Item[];
  className?: string;
  contentClassName?: string;
};

const DEFAULT_ITEMS: Item[] = [
  {
    id: "good",
    label: "공고와 잘 맞아요!",
    iconSrc: "/icons/match-good.svg",
    details: [
      "React 실무 프로젝트 경험 3년 이상",
      "협업 기반 서비스 개발 경험",
      "포트폴리오 완성도 높음",
    ],
  },
  {
    id: "improve",
    label: "보완하면 좋아요!",
    iconSrc: "/icons/match-improve.svg",
    rightIconSrc: "/icons/info.svg", // ✅ 빨간 느낌표(예시) - 원하면 제거 가능
    details: [
      "TypeScript 사용 경험이 있으면 더 유리해요.",
      "테스트 코드 작성 경험이 도움이 될 수 있어요.",
      "관련 자격증이 있으면 경쟁력이 높아져요.",
    ],
  },
  {
    id: "hard",
    label: "현재 바꾸기 어려워요.",
    iconSrc: "/icons/match-hard.svg",
    details: ["5년 이상 경력 요구 조건이 있어요."],
  },
];

export default function MatchDetailToggle({
  items,
  className = "",
  contentClassName = "",
}: Props) {
  const list = useMemo<Item[]>(() => items ?? DEFAULT_ITEMS, [items]);

  // ✅ 여러 토글이 동시에 열리도록 Set으로 관리
  const [openIds, setOpenIds] = useState<Set<string>>(() => {
    const init = new Set<string>();

    // defaultOpen이 하나라도 있으면 그걸(들) 우선 오픈
    const defaults = list.filter((x) => x.defaultOpen).map((x) => x.id);
    if (defaults.length > 0) {
      defaults.forEach((id) => init.add(id));
      return init;
    }

    // 기존 동작 유지: defaultOpen이 없으면 "good"을 기본 오픈
    const hasGood = list.some((x) => x.id === "good");
    if (hasGood) init.add("good");

    return init;
  });

  const toggle = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <section className={["mt-4", className].join(" ")}>
      <div className="divide-y divide-black/5">
        {list.map((it) => {
          const isOpen = openIds.has(it.id);

          return (
            <div key={it.id} className="py-3">
              <button
                type="button"
                className="flex w-full items-center justify-between gap-3"
                onClick={() => toggle(it.id)}
              >
                <div className="flex items-center gap-2.5">
                  <Image
                    src={it.iconSrc}
                    alt={it.label}
                    width={18}
                    height={18}
                  />
                  <span className="text-[16px] font-semibold text-gray-900">
                    {it.label}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {!!it.rightIconSrc && (
                    <Image
                      src={it.rightIconSrc}
                      alt="info"
                      width={16}
                      height={16}
                    />
                  )}

                  <span
                    className={[
                      "inline-flex items-center justify-center",
                      "transition-transform duration-150",
                      isOpen ? "rotate-180" : "rotate-0",
                      "opacity-70",
                    ].join(" ")}
                  >
                    <Image
                      src="/icons/arrowdown.svg"
                      alt="toggle"
                      width={10}
                      height={10}
                    />
                  </span>
                </div>
              </button>

              {isOpen && (
                <div className={["mt-3 space-y-2", contentClassName].join(" ")}>
                  {(it.details ?? []).map((line, idx) => (
                    <div
                      key={`${it.id}-${idx}`}
                      className="rounded-[12px] border border-black/10 bg-white px-4 py-3 text-[14px] text-gray-700"
                    >
                      {line}
                    </div>
                  ))}

                  {(!it.details || it.details.length === 0) && (
                    <div className="rounded-xl bg-gray-50 p-4 text-[14px] text-gray-600">
                      (여기에 API 결과 분석 내용을 넣을 예정)
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
