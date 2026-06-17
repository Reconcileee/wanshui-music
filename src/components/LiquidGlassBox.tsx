import { useRef, useEffect, useState, useCallback } from 'react';
import { buildLiquidGlassFilter, buildSimpleLiquidGlassFilter, LiquidGlassOptions } from '@/utils/liquidGlassFilter';
import { installFilter, removeFilter } from '@/utils/liquidGlassManager';

/** 效果模式 (参考 callstack/liquid-glass) */
type GlassEffect = 'clear' | 'regular' | 'none';

/** 颜色方案 */
type ColorScheme = 'light' | 'dark' | 'system';

interface LiquidGlassBoxProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  options?: Omit<LiquidGlassOptions, 'width' | 'height'>;
  /** 额外视觉参数：阴影与着色 */
  visualOptions?: {
    shadowBlur?: number;
    shadowSpread?: number;
    outerShadowBlur?: number;
  };
  /** 是否启用按压交互效果 (参考 callstack/liquid-glass) */
  interactive?: boolean;
  /** 视觉效果模式 (参考 callstack/liquid-glass)
   * - 'clear': 更透明的玻璃效果
   * - 'regular': 标准玻璃模糊效果
   * - 'none': 无玻璃效果（透明视图）
   */
  effect?: GlassEffect;
  /** 颜色方案 (参考 callstack/liquid-glass) */
  colorScheme?: ColorScheme;
  /** 是否动画化效果变化 */
  animated?: boolean;
  /** 动画持续时间 (ms) */
  animationDuration?: number;
}

/**
 * 正宗 iOS26 Liquid Glass 组件
 * 四层结构：
 *  Layer 0 (base-blur):  backdrop-filter blur + saturate
 *  Layer 1 (effect):     SVG filter 物理折射
 *  Layer 3 (edge):       1px 边框 + 顶部高光 + 底部微光
 *  Layer 4 (content):    内容层
 */
export default function LiquidGlassBox({
  children,
  className = '',
  style = {},
  options = {},
  visualOptions = {},
  interactive = false,
  effect = 'regular',
  colorScheme = 'system',
  animated = true,
  animationDuration = 300,
}: LiquidGlassBoxProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const filterIdRef = useRef('');
  const rebuildTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const [filterState, setFilterState] = useState<{
    ready: boolean;
    filterUrl: string;
    fallbackBlur: string;
  }>({
    ready: false,
    filterUrl: '',
    fallbackBlur: 'blur(16px) saturate(1.4)',
  });

  // 根据效果模式调整参数
  const getEffectParams = useCallback(() => {
    switch (effect) {
      case 'clear':
        return {
          blurAmount: 0.3,
          specularOpacity: 0.3,
          backdropBlur: 16,
          backdropSaturate: 1.3,
        };
      case 'regular':
        return {
          blurAmount: 0.5,
          specularOpacity: 0.5,
          backdropBlur: 24,
          backdropSaturate: 1.6,
        };
      case 'none':
        return {
          blurAmount: 0,
          specularOpacity: 0,
          backdropBlur: 0,
          backdropSaturate: 1,
        };
      default:
        return {
          blurAmount: 0.5,
          specularOpacity: 0.5,
          backdropBlur: 24,
          backdropSaturate: 1.6,
        };
    }
  }, [effect]);

  // 用序列化字符串作为依赖，避免对象引用变化导致不必要的重建
  const optionsKey = JSON.stringify({ ...options, effect, colorScheme });

  // 防抖重建：延迟 150ms，避免滑块拖动时频繁重建
  const scheduleRebuild = useCallback(() => {
    clearTimeout(rebuildTimerRef.current);
    rebuildTimerRef.current = setTimeout(() => {
      const el = wrapperRef.current;
      if (!el) return;

      // effect 为 'none' 时不需要滤镜
      if (effect === 'none') {
        setFilterState({
          ready: true,
          filterUrl: '',
          fallbackBlur: '',
        });
        return;
      }

      let cancelled = false;
      let rafId = 0;
      let attempts = 0;
      const MAX_ATTEMPTS = 60;

      const tryBuild = () => {
        if (cancelled) return;

        const rect = el.getBoundingClientRect();
        const w = Math.round(rect.width);
        const h = Math.round(rect.height);

        if (w < 2 || h < 2) {
          attempts++;
          if (attempts < MAX_ATTEMPTS) {
            rafId = requestAnimationFrame(tryBuild);
          }
          return;
        }

        const newId = `lgf-${Math.random().toString(36).slice(2, 9)}`;
        const effectParams = getEffectParams();

        try {
          let filterHtml = buildLiquidGlassFilter(newId, {
            width: w,
            height: h,
            ...options,
            blurAmount: options.blurAmount ?? effectParams.blurAmount,
            specularOpacity: options.specularOpacity ?? effectParams.specularOpacity,
          });

          if (!filterHtml && options.enableFallback !== false) {
            filterHtml = buildSimpleLiquidGlassFilter(newId, {
              blurAmount: effectParams.blurAmount,
              specularOpacity: effectParams.specularOpacity,
            });
          }

          if (!filterHtml) {
            attempts++;
            if (attempts < MAX_ATTEMPTS) {
              rafId = requestAnimationFrame(tryBuild);
            }
            return;
          }

          const installed = installFilter(newId, filterHtml);
          if (!installed) {
            attempts++;
            if (attempts < MAX_ATTEMPTS) {
              rafId = requestAnimationFrame(tryBuild);
            }
            return;
          }

          // 移除旧滤镜
          const oldId = filterIdRef.current;
          if (oldId && oldId !== newId) {
            removeFilter(oldId);
          }

          filterIdRef.current = newId;
          setFilterState({
            ready: true,
            filterUrl: `url(#${newId})`,
            fallbackBlur: `blur(${effectParams.backdropBlur}px) saturate(${effectParams.backdropSaturate})`,
          });
        } catch (e) {
          console.error('[LiquidGlassBox] Filter build failed:', e);
          attempts++;
          if (attempts < MAX_ATTEMPTS) {
            rafId = requestAnimationFrame(tryBuild);
          }
        }
      };

      rafId = requestAnimationFrame(() => {
        rafId = requestAnimationFrame(tryBuild);
      });

      return () => {
        cancelled = true;
        cancelAnimationFrame(rafId);
      };
    }, 150);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [optionsKey, effect]);

  // 监听 options 变化触发重建
  useEffect(() => {
    scheduleRebuild();
    return () => {
      clearTimeout(rebuildTimerRef.current);
      if (filterIdRef.current) {
        removeFilter(filterIdRef.current);
        filterIdRef.current = '';
      }
    };
  }, [scheduleRebuild]);

  const borderRadius = style.borderRadius || options.radius || 36;
  const shadowBlur = visualOptions.shadowBlur ?? 20;
  const shadowSpread = visualOptions.shadowSpread ?? -5;
  const outerShadowBlur = visualOptions.outerShadowBlur ?? 24;

  // 效果参数
  const effectParams = getEffectParams();

  const currentBackdropFilter = effect === 'none' ? '' : (filterState.ready ? filterState.filterUrl : filterState.fallbackBlur);

  // 按压交互效果 (参考 callstack/liquid-glass)
  const [pressed, setPressed] = useState(false);
  const pressScale = pressed ? 0.97 : 1;
  const pressOpacity = pressed ? 0.9 : 1;

  // 动画过渡时间
  const transitionDuration = animated ? `${animationDuration}ms` : '0ms';

  return (
    <div
      ref={wrapperRef}
      className={`relative ${className}`}
      style={{
        isolation: 'isolate',
        borderRadius,
        overflow: 'hidden',
        boxShadow: effect === 'none' ? 'none' : `0 6px ${outerShadowBlur}px rgba(0, 0, 0, 0.22), 0 2px 8px rgba(0, 0, 0, 0.12)`,
        transform: interactive ? `scale(${pressScale})` : undefined,
        transition: interactive ? `transform 0.15s ease, opacity 0.15s ease` : undefined,
        opacity: interactive ? pressOpacity : undefined,
        ...style,
      }}
      onMouseDown={interactive ? () => setPressed(true) : undefined}
      onMouseUp={interactive ? () => setPressed(false) : undefined}
      onMouseLeave={interactive ? () => setPressed(false) : undefined}
      onTouchStart={interactive ? () => setPressed(true) : undefined}
      onTouchEnd={interactive ? () => setPressed(false) : undefined}
    >
      {/* Layer 0: 基础模糊层 */}
      {effect !== 'none' && (
        <div
          className="absolute inset-0"
          style={{
            zIndex: 0,
            borderRadius: 'inherit',
            backdropFilter: `blur(${effectParams.backdropBlur}px) saturate(${effectParams.backdropSaturate})`,
            WebkitBackdropFilter: `blur(${effectParams.backdropBlur}px) saturate(${effectParams.backdropSaturate})`,
            transition: `backdrop-filter ${transitionDuration} ease, -webkit-backdrop-filter ${transitionDuration} ease`,
          }}
        />
      )}

      {/* Layer 1: SVG 滤镜折射层 */}
      {effect !== 'none' && (
        <div
          className="absolute inset-0"
          style={{
            zIndex: 1,
            borderRadius: 'inherit',
            backdropFilter: currentBackdropFilter,
            WebkitBackdropFilter: currentBackdropFilter,
            isolation: 'isolate',
            opacity: filterState.ready ? 1 : 0.85,
            transition: `opacity ${transitionDuration} ease, backdrop-filter ${transitionDuration} ease`,
          }}
        />
      )}

      {/* Layer 3: 边缘层 */}
      {effect !== 'none' && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 3,
            borderRadius: 'inherit',
            boxShadow: `
              inset 0 ${shadowBlur > 15 ? 0.8 : 0.5}px 0.8px 0 rgba(255, 255, 255, 0.45),
              inset 0 -0.5px 0.8px 0 rgba(255, 255, 255, 0.12),
              inset 0 0 ${shadowBlur}px ${shadowSpread}px rgba(255, 255, 255, 0.25),
              inset 0 0 0 1px rgba(255, 255, 255, 0.08)
            `,
          }}
        />
      )}

      {/* Layer 4: 内容层 */}
      <div className="relative" style={{ zIndex: 4 }}>
        {children}
      </div>
    </div>
  );
}
