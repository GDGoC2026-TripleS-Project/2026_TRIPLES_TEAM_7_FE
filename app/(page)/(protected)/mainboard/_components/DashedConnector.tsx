type Props = {
  fromRect: DOMRect; // 카드의 실제 화면 rect
  toPos: { x: number; y: number }; // 패널의 화면 좌상단 위치
  panelHeight?: number; // 필요 시 커스터마이즈 가능
};

export default function DashedConnector({
  fromRect,
  toPos,
  panelHeight = 360,
}: Props) {
  // ✅ 카드 오른쪽 중앙 (실제 DOM 기준)
  const x1 = fromRect.right;
  const y1 = fromRect.top + fromRect.height / 2;

  // ✅ 패널 왼쪽 중앙
  const x2 = toPos.x;
  const y2 = toPos.y + panelHeight / 2;

  // SVG 컨테이너 위치 계산
  const left = Math.min(x1, x2);
  const top = Math.min(y1, y2);
  const width = Math.abs(x2 - x1);
  const height = Math.abs(y2 - y1);

  // SVG 내부 좌표
  const sx1 = x1 - left;
  const sy1 = y1 - top;
  const sx2 = x2 - left;
  const sy2 = y2 - top;

  // 부드러운 곡선
  const midX = (sx1 + sx2) / 2;
  const d = `M ${sx1} ${sy1} 
             C ${midX} ${sy1}, 
               ${midX} ${sy2}, 
               ${sx2} ${sy2}`;

  return (
    <svg
      className="fixed z-[125] pointer-events-none"
      style={{
        left,
        top,
        width: Math.max(2, width),
        height: Math.max(2, height),
        overflow: "visible",
      }}
    >
      <path
        d={d}
        fill="none"
        stroke="rgba(255,255,255,0.8)"
        strokeWidth={2}
        strokeDasharray="6 6"
        strokeLinecap="round"
      />
    </svg>
  );
}
