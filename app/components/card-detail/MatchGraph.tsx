"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import InfoIcon from "@/public/icons/info.svg?react";
import InfoTooltip from "./InfoTooltip";

type Props = {
  rate: number;
  title: string;
  subtitle?: string;
};

export default function MatchGraph({ rate, title, subtitle }: Props) {
  const safeRate = Math.max(0, Math.min(100, rate));
  const [openInfo, setOpenInfo] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  return (
    <section className="rounded-2xl bg-white border border-black/5 px-5 py-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-[18px] font-semibold text-gray-900 whitespace-pre-line">
            {title}
          </h3>
          {subtitle && (
            <p className="mt-2 text-[14px] text-gray-700">{subtitle}</p>
          )}
        </div>

        <button
          ref={setAnchorEl}
          type="button"
          onClick={() => setOpenInfo((v) => !v)}
          className="text-gray-500 [&_svg_*]:fill-current"
        >
          <InfoIcon className="h-6 w-6" />
        </button>

        <InfoTooltip
          open={openInfo}
          onClose={() => setOpenInfo(false)}
          anchorEl={anchorEl}
          offsetX={41} // 원하는 만큼 조절
          offsetY={-15}
        >
          <div>공고의 요구조건을 필수, 권장, 조직 적합도의 키워드로</div>
          <div>분해하여, 이력서에 기재된 내용을 바탕으로 준비도를 분석하고</div>
          <div>매칭 점수를 계산합니다.</div>
        </InfoTooltip>
      </div>

      <div className="mt-5">
        <GaugeSemiCircle value={safeRate} />
      </div>
    </section>
  );
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function GaugeSemiCircle({ value }: { value: number }) {
  const r = 78;
  const cx = 100;
  const cy = 92;

  const d = useMemo(() => {
    return `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`;
  }, []);

  const arcLen = Math.PI * r;

  const [animatedValue, setAnimatedValue] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const DURATION_MS = 900;

    let startTs = 0;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const tick = (ts: number) => {
      if (!startTs) startTs = ts;

      const elapsed = ts - startTs;
      const t = clamp(elapsed / DURATION_MS, 0, 1);
      const eased = easeOutCubic(t);

      const next = value * eased;
      setAnimatedValue(next);

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(() => {
      setAnimatedValue(0);
      rafRef.current = requestAnimationFrame(tick);
    });

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [value]);

  const dashOffset = arcLen * (1 - animatedValue / 100);
  const label = `${Math.round(animatedValue)}%`;

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
          d={`M ${cx - 62} ${cy} A 56 56 0 0 1 ${cx + 62} ${cy}`}
          fill="none"
          stroke="rgb(0, 201, 167)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="7 14"
        />

        {/* 작은 아이콘 */}
        <image
          href="/icons/graph.svg"
          x={cx - 10}
          y={cy - 44}
          width={18}
          height={18}
          preserveAspectRatio="xMidYMid meet"
        />

        {/* 중앙 텍스트 */}
        <g transform={`translate(${cx} 78)`}>
          <text
            x="4"
            y="10"
            textAnchor="middle"
            className="fill-[#00C9A7] font-semibold"
            fontSize="18"
          >
            {label}
          </text>
        </g>

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
