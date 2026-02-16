"use client";

import Image from "next/image";
import React, { useMemo, useState } from "react";

import InfoIcon from "@/public/icons/info.svg?react";

type Task = {
  id: string;
  text: string;
  checked?: boolean;
};

type Section = {
  id: string;
  title: string;

  important?: boolean;

  tasks: Task[];
  defaultOpen?: boolean;
};

type Props = {
  items?: Section[];
  className?: string;
};

export default function ChecklistDetailToggle({
  items,
  className = "",
}: Props) {
  const DEFAULT_ITEMS = useMemo<Section[]>(
    () =>
      items ?? [
        {
          id: "ts",
          title: "TypeScript 사용 경험이 있으면 더 유리해요.",
          important: true,
          defaultOpen: true,
          tasks: [
            {
              id: "ts-1",
              text: "자바스크립트 프로젝트의 핵심 모듈 3개를 타입스크립트로 마이그레이션하고 any 타입을 모두 제거한 뒤, 깃허브에 Pull Request를 생성하기",
              checked: true,
            },
            {
              id: "ts-2",
              text: "자바스크립트 프로젝트의 핵심 모듈 3개를 타입스크립트로 마이그레이션하고 any 타입을 모두 제거한 뒤, 깃허브에 Pull Request를 생성하기",
            },
            {
              id: "ts-3",
              text: "자바스크립트 프로젝트의 핵심 모듈 3개를 타입스크립트로 마이그레이션하고 any 타입을 모두 제거한 뒤, 깃허브에 Pull Request를 생성하기",
            },
          ],
        },
        {
          id: "test",
          title: "테스트 코드 작성 경험이 도움이 될 수 있어요.",
          tasks: [
            {
              id: "test-1",
              text: "Jest 또는 React Testing Library 기초 사용법 익혀보기",
            },
            {
              id: "test-2",
              text: "Jest 또는 React Testing Library 기초 사용법 익혀보기",
            },
            {
              id: "test-3",
              text: "테스트 코드 적용 사례를 포트폴리오에 정리하기",
            },
          ],
        },
        {
          id: "cert",
          title: "관련 자격증이 있으면 경쟁력이 높아져요.",
          tasks: [
            { id: "cert-1", text: "직무와 관련된 자격증 종류 알아보기" },
            { id: "cert-2", text: "준비 일정 가볍게 계획해보기" },
          ],
        },
      ],
    [items],
  );

  // 섹션별 open을 "여러 개 동시에" 관리 (Set)
  const [openIds, setOpenIds] = useState<Set<string>>(() => {
    const init = new Set<string>();
    DEFAULT_ITEMS.forEach((s) => s.defaultOpen && init.add(s.id));
    return init;
  });

  // 체크 상태도 컴포넌트에서 관리 (API 연동 시 여기만 교체/연결하면 됨)
  const [sections, setSections] = useState<Section[]>(DEFAULT_ITEMS);

  const toggleSection = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleTask = (sectionId: string, taskId: string) => {
    setSections((prev) =>
      prev.map((sec) => {
        if (sec.id !== sectionId) return sec;
        return {
          ...sec,
          tasks: sec.tasks.map((t) =>
            t.id === taskId ? { ...t, checked: !t.checked } : t,
          ),
        };
      }),
    );
  };

  return (
    <section className={["divide-y divide-black/5", className].join(" ")}>
      {sections.map((sec) => {
        const isOpen = openIds.has(sec.id);

        return (
          <div key={sec.id} className="py-3">
            {/* ✅ 섹션 헤더 */}
            <button
              type="button"
              className="flex w-full items-center justify-between gap-3"
              onClick={() => toggleSection(sec.id)}
            >
              <div className="flex items-center gap-2">
                {/* 왼쪽 섹션 아이콘(예시) */}
                <Image
                  src="/icons/match-improve.svg"
                  alt=""
                  width={18}
                  height={18}
                />
                <span className="text-[16px] font-semibold text-gray-900">
                  {sec.title}
                </span>

                {/* ✅ important 아이콘: title 오른쪽 */}
                {sec.important && (
                  <span
                    className={[
                      "ml-1 inline-flex items-center",
                      "text-red-400",
                      "[&_svg_path]:stroke-current",
                    ].join(" ")}
                    aria-label="important"
                    title="중요"
                    onPointerDown={(e) => e.stopPropagation()} // 아이콘 클릭이 토글 버튼 클릭으로 튀는 거 방지
                  >
                    <InfoIcon className="h-5 w-5" />
                  </span>
                )}
              </div>

              <span
                className={[
                  "inline-flex items-center justify-center",
                  "transition-transform duration-150 opacity-70",
                  isOpen ? "rotate-180" : "rotate-0",
                ].join(" ")}
              >
                <Image
                  src="/icons/arrowdown.svg"
                  alt="toggle"
                  width={10}
                  height={10}
                />
              </span>
            </button>

            {/* ✅ 섹션 내용 */}
            {isOpen && (
              <div className="mt-3 space-y-2">
                {sec.tasks.map((task) => {
                  const checked = !!task.checked;

                  return (
                    <button
                      key={task.id}
                      type="button"
                      onClick={() => toggleTask(sec.id, task.id)}
                      className={[
                        "w-full text-left",
                        "flex items-start gap-3",
                        "rounded-[12px] px-4 py-3",
                        "transition-colors",
                        checked ? "bg-blue-50" : "",
                        checked
                          ? "hover:bg-blue-100/60"
                          : "hover:bg-black/[0.03]",
                      ].join(" ")}
                    >
                      {/* ✅ 체크박스: 이미지 파일로 연결 */}
                      <span className="mt-[2px] shrink-0">
                        <Image
                          src={
                            checked
                              ? "/icons/checkbox-checked.svg"
                              : "/icons/checkbox-empty.svg"
                          }
                          alt={checked ? "checked" : "unchecked"}
                          width={20}
                          height={20}
                        />
                      </span>

                      <span className="flex-1 text-[14px] leading-5 text-gray-800">
                        {task.text}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
}
