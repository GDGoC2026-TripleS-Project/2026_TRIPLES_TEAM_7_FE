"use client";

import Image from "next/image";
import React, { useMemo, useState } from "react";

export type MatchDetailLine = {
  text: string;
  required?: boolean;
};

export type MatchToggleItem = {
  id: string;
  label: string;
  iconSrc: string;
  details?: MatchDetailLine[];
  defaultOpen?: boolean;
};

type Props = {
  items: MatchToggleItem[];
  className?: string;
  contentClassName?: string;
};

export default function MatchDetailToggle({
  items,
  className = "",
  contentClassName = "",
}: Props) {
  const list = useMemo(() => items ?? [], [items]);

  const [openIds, setOpenIds] = useState<Set<string>>(() => {
    const init = new Set<string>();

    if (!list.length) return init;

    const defaults = list.filter((x) => x.defaultOpen).map((x) => x.id);
    if (defaults.length > 0) {
      defaults.forEach((id) => init.add(id));
      return init;
    }

    init.add(list[0].id);
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

  if (!list.length) {
    return (
      <section className={["mt-4", className].join(" ")}>
        <div className="rounded-2xl border border-black/5 bg-white px-4 py-5 text-[14px] text-gray-500">
          분석 결과가 아직 없어요.
        </div>
      </section>
    );
  }

  return (
    <section className={["mt-4", className].join(" ")}>
      <div className="divide-y divide-black/5">
        {list.map((it) => {
          const isOpen = openIds.has(it.id);

          return (
            <div key={it.id} className="py-3">
              <button
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
                  {(it.details ?? []).length > 0 ? (
                    (it.details ?? []).map((line, idx) => (
                      <div
                        key={`${it.id}-${idx}`}
                        className="rounded-[12px] border border-black/10 bg-white px-4 py-3 text-[14px] text-gray-700"
                      >
                        <div className="flex items-center gap-2">
                          <span className="leading-5">{line.text}</span>

                          {line.required && (
                            <span className="inline-flex shrink-0">
                              <Image
                                src="/icons/important.svg"
                                alt="important"
                                width={13}
                                height={13}
                              />
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-xl bg-gray-50 p-4 text-[14px] text-gray-600">
                      표시할 내용이 없어요.
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
