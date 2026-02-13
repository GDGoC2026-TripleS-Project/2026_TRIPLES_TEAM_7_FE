"use client";

import { useCallback, useEffect, useRef } from "react";
import type { ReactZoomPanPinchRef } from "react-zoom-pan-pinch";
import { clamp } from "../utils/math";

type TransformState = {
  scale: number;
  positionX: number;
  positionY: number;
  previousScale?: number;
};

type PanningState = null | {
  pointerId: number;
  startClientX: number;
  startClientY: number;
  startX: number;
  startY: number;
};

type Options = {
  minScale?: number;
  maxScale?: number;
  zoomIntensity?: number;
};

type OnTransformedState = {
  scale: number;
  positionX: number;
  positionY: number;
};

export function useCanvasGestures({
  apiRef,
  containerRef,
  options,
  gesturesBlocked,
  onTransformStateChange,
}: {
  apiRef: React.RefObject<ReactZoomPanPinchRef | null>;
  containerRef: React.RefObject<HTMLDivElement | null>;
  options?: Options;
  gesturesBlocked?: boolean;
  onTransformStateChange?: (
    st: Pick<TransformState, "scale" | "positionX" | "positionY">,
  ) => void;
}) {
  const stateRef = useRef<TransformState>({
    scale: 1,
    positionX: 0,
    positionY: 0,
    previousScale: 1,
  });

  const panningRef = useRef<PanningState>(null);
  const isPanningRef = useRef(false);
  const suppressClickRef = useRef(false);

  const minScale = options?.minScale ?? 0.03;
  const maxScale = options?.maxScale ?? 6;
  const zoomIntensity = options?.zoomIntensity ?? 0.0018;

  const onTransformed = useCallback(
    (_ref: ReactZoomPanPinchRef, state: OnTransformedState) => {
      const next: TransformState = {
        scale: state.scale,
        positionX: state.positionX,
        positionY: state.positionY,
        previousScale: stateRef.current.previousScale,
      };

      stateRef.current = next;

      onTransformStateChange?.({
        scale: next.scale,
        positionX: next.positionX,
        positionY: next.positionY,
      });
    },
    [onTransformStateChange],
  );

  const endPanning = (el?: HTMLDivElement, pointerId?: number) => {
    panningRef.current = null;
    isPanningRef.current = false;

    if (el && typeof pointerId === "number") {
      try {
        el.releasePointerCapture(pointerId);
      } catch {}
    }

    suppressClickRef.current = true;
    window.setTimeout(() => {
      suppressClickRef.current = false;
    }, 250);
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (gesturesBlocked) return;
    if (!e.ctrlKey || e.button !== 0) return;

    e.preventDefault();

    const api = apiRef.current;
    if (!api) return;

    const el = e.currentTarget as HTMLDivElement;
    el.setPointerCapture(e.pointerId);

    isPanningRef.current = true;
    panningRef.current = {
      pointerId: e.pointerId,
      startClientX: e.clientX,
      startClientY: e.clientY,
      startX: stateRef.current.positionX,
      startY: stateRef.current.positionY,
    };
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (gesturesBlocked) return;
    if (!isPanningRef.current) return;

    const st = panningRef.current;
    if (!st) return;
    if (st.pointerId !== e.pointerId) return;

    e.preventDefault();

    const api = apiRef.current;
    if (!api) return;

    const dx = e.clientX - st.startClientX;
    const dy = e.clientY - st.startClientY;

    api.setTransform(st.startX + dx, st.startY + dy, stateRef.current.scale, 0);
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const st = panningRef.current;
    if (!st) return;
    if (st.pointerId !== e.pointerId) return;

    endPanning(e.currentTarget as HTMLDivElement, e.pointerId);
  };

  const onPointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    const st = panningRef.current;
    if (!st) return;
    if (st.pointerId !== e.pointerId) return;

    endPanning(e.currentTarget as HTMLDivElement, e.pointerId);
  };

  const onLostPointerCapture = () => {
    panningRef.current = null;
    isPanningRef.current = false;

    suppressClickRef.current = true;
    window.setTimeout(() => {
      suppressClickRef.current = false;
    }, 250);
  };

  const onClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!suppressClickRef.current) return;
    e.preventDefault();
    e.stopPropagation();
  };

  const onDoubleClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!suppressClickRef.current) return;
    e.preventDefault();
    e.stopPropagation();
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheelNative = (e: WheelEvent) => {
      if (gesturesBlocked) {
        e.preventDefault();
        return;
      }

      if (isPanningRef.current) {
        e.preventDefault();
        return;
      }

      const api = apiRef.current;
      if (!api) return;

      const { scale, positionX, positionY } = stateRef.current;

      if (e.ctrlKey) {
        e.preventDefault();

        const factor = Math.exp(-e.deltaY * zoomIntensity);
        const nextScale = clamp(scale * factor, minScale, maxScale);

        const rect = el.getBoundingClientRect();
        const sx = e.clientX - rect.left;
        const sy = e.clientY - rect.top;

        const worldX = (sx - positionX) / scale;
        const worldY = (sy - positionY) / scale;

        const nextX = sx - worldX * nextScale;
        const nextY = sy - worldY * nextScale;

        api.setTransform(nextX, nextY, nextScale, 0);
        return;
      }

      api.setTransform(positionX - e.deltaX, positionY - e.deltaY, scale, 0);
    };

    el.addEventListener("wheel", onWheelNative, { passive: false });
    return () => el.removeEventListener("wheel", onWheelNative);
  }, [
    apiRef,
    containerRef,
    gesturesBlocked,
    minScale,
    maxScale,
    zoomIntensity,
  ]);

  return {
    onTransformed,
    gestureHandlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel,
      onLostPointerCapture,
      onClickCapture,
      onDoubleClickCapture,
    },
  };
}
