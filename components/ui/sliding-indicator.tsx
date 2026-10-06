"use client";

import { useLayoutEffect, useRef, useState } from "react";

export type SlidingRect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

const indicatorCache = new Map<string, SlidingRect>();

function sameRect(left: SlidingRect, right: SlidingRect) {
  return (
    left.left === right.left &&
    left.top === right.top &&
    left.width === right.width &&
    left.height === right.height
  );
}

export function useSlidingIndicator<T extends HTMLElement = HTMLElement>(
  activeKey: string | null | undefined,
  {
    cacheKey,
    insetX = 0,
    thickness = 3,
    orientation = "horizontal",
    deps = [],
  }: {
    cacheKey?: string;
    insetX?: number;
    thickness?: number;
    orientation?: "horizontal" | "vertical";
    deps?: unknown[];
  } = {},
) {
  const listRef = useRef<T>(null);
  const rectRef = useRef<SlidingRect>(
    (cacheKey ? indicatorCache.get(cacheKey) : undefined) ?? {
      left: 0,
      top: 0,
      width: 0,
      height: orientation === "vertical" ? 0 : thickness,
    },
  );
  const [rect, setRect] = useState<SlidingRect>(rectRef.current);
  const [ready, setReady] = useState(() => {
    const cached = cacheKey ? indicatorCache.get(cacheKey) : undefined;
    return Boolean(cached && (cached.width > 0 || cached.height > 0));
  });

  useLayoutEffect(() => {
    const list = listRef.current;

    function commit(next: SlidingRect) {
      if (sameRect(rectRef.current, next)) {
        return;
      }

      rectRef.current = next;
      if (cacheKey) {
        indicatorCache.set(cacheKey, next);
      }
      setRect(next);
    }

    function updateIndicator() {
      if (!list) {
        return;
      }

      const listBox = list.getBoundingClientRect();
      if (list.offsetParent === null || listBox.width === 0) {
        return;
      }

      if (!activeKey) {
        commit(
          orientation === "vertical"
            ? { ...rectRef.current, height: 0 }
            : { ...rectRef.current, width: 0 },
        );
        return;
      }

      const active = list.querySelector<HTMLElement>(`[data-tab="${CSS.escape(activeKey)}"]`);
      if (!active) {
        return;
      }

      const activeBox = active.getBoundingClientRect();
      const top = Math.round(activeBox.top - listBox.top + list.scrollTop);

      if (orientation === "vertical") {
        commit({
          left: -1,
          top,
          width: thickness,
          height: Math.round(activeBox.height),
        });
        return;
      }

      commit({
        left: Math.round(activeBox.left - listBox.left + list.scrollLeft - insetX),
        top: top + Math.round(activeBox.height) - thickness,
        width: Math.round(activeBox.width + insetX * 2),
        height: thickness,
      });
    }

    updateIndicator();
    requestAnimationFrame(() => setReady(true));

    if (!list) {
      return;
    }

    const observer = new ResizeObserver(updateIndicator);
    observer.observe(list);
    window.addEventListener("resize", updateIndicator);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateIndicator);
    };
    // Labels, locale, and item counts are passed in `deps` so the bar can remeasure.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeKey, cacheKey, insetX, orientation, thickness, ...deps]);

  return { listRef, rect, ready };
}

export function SlidingIndicator({
  rect,
  ready,
  className,
  viewTransitionName,
}: {
  rect: SlidingRect;
  ready: boolean;
  className: string;
  viewTransitionName?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute ${
        ready ? "transition-[left,top,width,height] duration-200 ease-out motion-reduce:transition-none" : ""
      } ${className}`}
      style={{
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
        viewTransitionName,
      }}
    />
  );
}
