import { useRef, useCallback, useEffect, useState } from 'react';
import { buildLiquidGlassFilter, LiquidGlassOptions } from '@/utils/liquidGlassFilter';
import { installFilter, removeFilter } from '@/utils/liquidGlassManager';

let filterIdCounter = 0;

interface UseLiquidGlassReturn<T> {
  ref: React.RefObject<T>;
  filterId: string;
  glassClass: string;
}

export function useLiquidGlass<T extends HTMLElement>(
  options: Omit<LiquidGlassOptions, 'width' | 'height'> = {}
): UseLiquidGlassReturn<T> {
  const ref = useRef<T>(null);
  const [filterId, setFilterId] = useState('');

  // 用 ref 存储 options，避免每次渲染都触发 rebuild
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const observerRef = useRef<ResizeObserver | null>(null);
  const filterIdRef = useRef(filterId);
  filterIdRef.current = filterId;

  const rebuild = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    if (w < 2 || h < 2) return;

    const newId = `lg-${filterIdCounter++}`;
    const oldId = filterIdRef.current;

    const filterHtml = buildLiquidGlassFilter(newId, {
      width: w,
      height: h,
      ...optionsRef.current,
    });
    if (!filterHtml) return;

    installFilter(newId, filterHtml);
    if (oldId && oldId !== newId) {
      removeFilter(oldId);
    }

    setFilterId(newId);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // 延迟执行，确保元素已渲染并获取到正确尺寸
    const initTimer = setTimeout(() => rebuild(), 300);

    observerRef.current = new ResizeObserver(() => {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(rebuild, 150);
    });
    observerRef.current.observe(el);

    return () => {
      clearTimeout(initTimer);
      clearTimeout(timerRef.current);
      observerRef.current?.disconnect();
      if (filterIdRef.current) {
        removeFilter(filterIdRef.current);
      }
    };
  }, [rebuild]);

  // 当 filterId 变化时，更新元素的 CSS 自定义属性
  useEffect(() => {
    const el = ref.current;
    if (!el || !filterId) return;
    el.style.setProperty('--lg-filter', `url(#${filterId})`);
  }, [filterId]);

  return { ref, filterId, glassClass: 'liquid-glass-surface' };
}
