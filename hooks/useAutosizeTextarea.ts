"use client";

import { useCallback, useEffect, useRef } from "react";

export function useAutosizeTextarea(
  value: string,
  options?: { minRows?: number; maxHeight?: number }
) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const minRows = options?.minRows ?? 6;
  const maxHeight = options?.maxHeight ?? 420;

  const resize = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    const lineHeight = parseInt(getComputedStyle(el).lineHeight, 10) || 22;
    const minHeight = lineHeight * minRows;
    const next = Math.min(Math.max(el.scrollHeight, minHeight), maxHeight);
    el.style.height = `${next}px`;
    el.style.overflowY = el.scrollHeight > maxHeight ? "auto" : "hidden";
  }, [minRows, maxHeight]);

  useEffect(() => {
    resize();
  }, [value, resize]);

  return { ref, resize };
}
