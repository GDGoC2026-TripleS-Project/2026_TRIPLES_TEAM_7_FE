"use client";

import Image from "next/image";
import React, { useMemo } from "react";
import InfoIcon from "@/public/icons/info.svg?react";

type Props = {
  /** 0~100 */
  rate: number;
  title: string;
  subtitle?: string;
};

export default function MatchGraph({ rate, title, subtitle }: Props) {
  const safeRate = Math.max(0, Math.min(100, rate));
  const label = `${safeRate}%`;

  return (
    <section
      className={[
        "rounded-2xl bg-white",
        "border border-black/5",
        "px-5 py-5",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-[18px] font-semibold text-gray-900 whitespace-pre-line">
            {title}
          </h3>
          {subtitle && (
            <p className="mt-2 text-[14px] text-gray-500">{subtitle}</p>
          )}
        </div>

        <button
          className={["[&_svg_path]:stroke-current", "text-gray-300"].join(" ")}
        >
          <InfoIcon width={18} height={18} />
        </button>
      </div>

      <div className="mt-5">
        <GaugeSemiCircle value={safeRate} label={label} />
      </div>
    </section>
  );
}

/**
 * 반원 게이지 (SVG)
 * - 바탕(남은 구간): 진한 회색
 * - 진행(매치율): 그린
 * - 은은한 글로우(연한 민트): 아래에 한 겹
 * - 내부 점선(민트): 장식
 */
function GaugeSemiCircle({ value, label }: { value: number; label: string }) {
  // 반원 path 길이 계산용 (r=78 기준)
  const r = 78;
  const cx = 100;
  const cy = 92;

  const d = useMemo(() => {
    // 위쪽 반원: left -> right
    // M (cx-r, cy) A r r 0 0 1 (cx+r, cy)
    return `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`;
  }, []);

  // 반원 길이 = πr
  const arcLen = Math.PI * r;
  const dashOffset = arcLen * (1 - value / 100);

  return (
    <div className="mx-auto w-[360px] max-w-full">
      <svg viewBox="0 0 200 120" className="w-full">
        {/* 남은 구간(회색) */}
        <path
          d={d}
          fill="none"
          stroke="rgba(109, 109, 109, 1)"
          strokeWidth="12"
          strokeLinecap="round"
        />

        {/* 진행 구간(그린) */}
        <path
          d={d}
          fill="none"
          stroke="rgb(0, 201, 167)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={arcLen}
          strokeDashoffset={dashOffset}
        />

        {/* 내부 점선 장식 */}
        <path
          d={`M ${cx - 60} ${cy} A 56 56 0 0 1 ${cx + 60} ${cy}`}
          fill="none"
          stroke="rgb(0, 201, 167)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="7 16"
        />

        {/* 중앙 텍스트 */}
        <g transform="translate(100 78)">
          <text
            x="4"
            y="6"
            textAnchor="middle"
            className="fill-[#00C9A7] font-semibold"
            fontSize="18"
          >
            {label}
          </text>
        </g>

        {/* 0% / 100% 라벨 */}
        <text
          x="15"
          y="115"
          fontSize="12"
          className="fill-gray-300 font-medium"
        >
          0%
        </text>
        <text
          x="167"
          y="115"
          fontSize="12"
          className="fill-gray-300 font-medium"
        >
          100%
        </text>
      </svg>
    </div>
  );
}
