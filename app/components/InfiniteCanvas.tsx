"use client";

import React, { useMemo, useRef } from "react";
import {
  TransformWrapper,
  TransformComponent,
  type ReactZoomPanPinchRef,
} from "react-zoom-pan-pinch";
import { useCanvasGestures } from "../lib/hooks/useCanvasGestures";

type RenderCtx = {
  getScale: () => number;
  setGesturesBlocked: (blocked: boolean) => void;
};

type Props = {
  children?: React.ReactNode | ((ctx: RenderCtx) => React.ReactNode);

  boardSize?: number;
  minScale?: number;
  maxScale?: number;
  zoomIntensity?: number;

  backgroundClassName?: string;
  showBackgroundLayer?: boolean;
};

export default function InfiniteCanvas({
  children,
  boardSize = 100000,
  minScale = 0.03,
  maxScale = 6,
  zoomIntensity = 0.0018,

  backgroundClassName,
  showBackgroundLayer = true,
}: Props) {
  const apiRef = useRef<ReactZoomPanPinchRef | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const boardStyle = useMemo<React.CSSProperties>(
    () => ({ width: boardSize, height: boardSize, position: "relative" }),
    [boardSize],
  );

  const { onTransformed, gestureHandlers, getScale, blockGesturesRef } =
    useCanvasGestures({
      apiRef,
      containerRef,
      options: { minScale, maxScale, zoomIntensity },
    });

  const renderCtx: RenderCtx = {
    getScale,
    setGesturesBlocked: (blocked) => {
      blockGesturesRef.current = blocked;
    },
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {showBackgroundLayer && backgroundClassName ? (
        <div className={`absolute inset-0 ${backgroundClassName}`} />
      ) : null}

      <div
        ref={containerRef}
        className="absolute inset-0"
        style={{
          touchAction: "none",
          userSelect: "none",
        }}
        {...gestureHandlers}
      >
        <TransformWrapper
          ref={apiRef}
          minScale={minScale}
          maxScale={maxScale}
          wheel={{ disabled: true }}
          doubleClick={{ disabled: true }}
          panning={{ disabled: true }}
          pinch={{ step: 5 }}
          limitToBounds={false}
          alignmentAnimation={{ disabled: true }}
          velocityAnimation={{ disabled: true }}
          zoomAnimation={{ disabled: true }}
          onTransformed={onTransformed}
        >
          <TransformComponent
            wrapperStyle={{ width: "100%", height: "100%" }}
            contentStyle={boardStyle}
          >
            {typeof children === "function" ? children(renderCtx) : children}
          </TransformComponent>
        </TransformWrapper>
      </div>
    </div>
  );
}
