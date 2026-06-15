import { useState, useCallback } from 'react';
import { LiquidGlassOptions } from '@/utils/liquidGlassFilter';
import { SlidersHorizontal, X } from 'lucide-react';

export interface GlassParams extends Omit<LiquidGlassOptions, 'width' | 'height' | 'enableFallback'> {
  /** 内阴影模糊 */
  shadowBlur: number;
  /** 内阴影扩散 */
  shadowSpread: number;
  /** 外阴影模糊 */
  outerShadowBlur: number;
  /** 着色不透明度 0-1 */
  tintOpacity: number;
  /** 自定义着色颜色 R */
  tintR: number;
  /** 自定义着色颜色 G */
  tintG: number;
  /** 自定义着色颜色 B */
  tintB: number;
}

export const DEFAULT_GLASS_PARAMS: GlassParams = {
  radius: 60,
  glassThickness: 80,
  bezelWidth: 60,
  ior: 3.0,
  scaleRatio: 1.0,
  blurAmount: 0.3,
  specularOpacity: 0.5,
  specularSaturation: 4,
  shadowBlur: 20,
  shadowSpread: -5,
  outerShadowBlur: 24,
  tintOpacity: 0.06,
  tintR: 255,
  tintG: 255,
  tintB: 255,
  shape: 'superellipse',
  superellipseN: 5,
  effect: 'regular',
};

interface SliderConfig {
  key: keyof GlassParams;
  label: string;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  group: string;
}

const SLIDERS: SliderConfig[] = [
  // Glass Shape
  { key: 'radius', label: '圆角半径', min: 8, max: 100, step: 1, format: (v) => `${Math.round(v)}px`, group: '形状' },
  { key: 'superellipseN', label: '超椭圆指数', min: 2, max: 10, step: 0.5, format: (v) => v.toFixed(1), group: '形状' },
  // Refraction
  { key: 'glassThickness', label: '玻璃厚度', min: 10, max: 200, step: 1, format: (v) => `${Math.round(v)}`, group: '折射' },
  { key: 'bezelWidth', label: '边框宽度', min: 2, max: 60, step: 1, format: (v) => `${Math.round(v)}`, group: '折射' },
  { key: 'ior', label: '折射率', min: 1.0, max: 3.0, step: 0.05, format: (v) => v.toFixed(2), group: '折射' },
  { key: 'scaleRatio', label: '缩放比', min: 0.0, max: 2.0, step: 0.05, format: (v) => v.toFixed(2), group: '折射' },
  // Appearance
  { key: 'blurAmount', label: '模糊量', min: 0, max: 8, step: 0.1, format: (v) => v.toFixed(1), group: '外观' },
  { key: 'specularOpacity', label: '高光透明度', min: 0, max: 1, step: 0.05, format: (v) => v.toFixed(2), group: '外观' },
  { key: 'specularSaturation', label: '高光饱和度', min: 0, max: 12, step: 1, format: (v) => `${Math.round(v)}`, group: '外观' },
  // Shadow
  { key: 'shadowBlur', label: '内阴影模糊', min: 0, max: 40, step: 1, format: (v) => `${Math.round(v)}px`, group: '阴影' },
  { key: 'shadowSpread', label: '内阴影扩散', min: -15, max: 10, step: 1, format: (v) => `${Math.round(v)}px`, group: '阴影' },
  { key: 'outerShadowBlur', label: '外阴影模糊', min: 0, max: 50, step: 1, format: (v) => `${Math.round(v)}px`, group: '阴影' },
  // Tint
  { key: 'tintOpacity', label: '着色透明度', min: 0, max: 0.4, step: 0.01, format: (v) => `${Math.round(v * 100)}%`, group: '着色' },
  { key: 'tintR', label: '着色 R', min: 0, max: 255, step: 1, format: (v) => `${Math.round(v)}`, group: '着色' },
  { key: 'tintG', label: '着色 G', min: 0, max: 255, step: 1, format: (v) => `${Math.round(v)}`, group: '着色' },
  { key: 'tintB', label: '着色 B', min: 0, max: 255, step: 1, format: (v) => `${Math.round(v)}`, group: '着色' },
];

interface LiquidGlassControlsProps {
  params: GlassParams;
  onChange: (params: GlassParams) => void;
}

export default function LiquidGlassControls({ params, onChange }: LiquidGlassControlsProps) {
  const [open, setOpen] = useState(false);

  const handleChange = useCallback(
    (key: keyof GlassParams, value: number) => {
      onChange({ ...params, [key]: value });
    },
    [params, onChange]
  );

  const handleReset = useCallback(() => {
    onChange({ ...DEFAULT_GLASS_PARAMS });
  }, [onChange]);

  // 按组分类
  const groups: { name: string; items: SliderConfig[] }[] = [];
  for (const s of SLIDERS) {
    const g = groups.find((g) => g.name === s.group);
    if (g) g.items.push(s);
    else groups.push({ name: s.group, items: [s] });
  }

  return (
    <>
      {/* 切换按钮 */}
      <button
        onClick={() => setOpen(true)}
        className={`lg-ctrl-toggle ${open ? 'lg-ctrl-toggle-hidden' : ''}`}
        aria-label="打开液态玻璃控制面板"
      >
        <SlidersHorizontal size={18} />
      </button>

      {/* 遮罩层（移动端） */}
      {open && <div className="lg-ctrl-overlay" onClick={() => setOpen(false)} />}

      {/* 控制面板 */}
      <div className={`lg-ctrl-panel ${open ? 'lg-ctrl-panel-open' : ''}`}>
        <div className="lg-ctrl-header">
          <span className="lg-ctrl-title">液态玻璃参数</span>
          <div className="lg-ctrl-header-actions">
            <button className="lg-ctrl-reset" onClick={handleReset}>
              重置
            </button>
            <button className="lg-ctrl-close" onClick={() => setOpen(false)} aria-label="关闭">
              <X size={14} />
            </button>
          </div>
        </div>

        <div className="lg-ctrl-scroll">
          {/* 模式切换 */}
          <div style={{ marginBottom: 12 }}>
            <h3 className="lg-ctrl-group-title">模式</h3>
            <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
              <button
                className="lg-ctrl-reset"
                style={{
                  background: params.effect === 'regular' ? 'rgba(139, 124, 247, 0.3)' : undefined,
                  color: params.effect === 'regular' ? '#fff' : undefined,
                }}
                onClick={() => onChange({ ...params, effect: 'regular' })}
              >
                Regular
              </button>
              <button
                className="lg-ctrl-reset"
                style={{
                  background: params.effect === 'clear' ? 'rgba(139, 124, 247, 0.3)' : undefined,
                  color: params.effect === 'clear' ? '#fff' : undefined,
                }}
                onClick={() => onChange({ ...params, effect: 'clear' })}
              >
                Clear
              </button>
            </div>
          </div>

          {/* 形状切换 */}
          <div style={{ marginBottom: 12 }}>
            <h3 className="lg-ctrl-group-title">形状</h3>
            <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
              <button
                className="lg-ctrl-reset"
                style={{
                  background: params.shape === 'squircle' ? 'rgba(139, 124, 247, 0.3)' : undefined,
                  color: params.shape === 'squircle' ? '#fff' : undefined,
                }}
                onClick={() => onChange({ ...params, shape: 'squircle' })}
              >
                Squircle
              </button>
              <button
                className="lg-ctrl-reset"
                style={{
                  background: params.shape === 'superellipse' ? 'rgba(139, 124, 247, 0.3)' : undefined,
                  color: params.shape === 'superellipse' ? '#fff' : undefined,
                }}
                onClick={() => onChange({ ...params, shape: 'superellipse' })}
              >
                Superellipse
              </button>
            </div>
          </div>

          {groups.map((group) => (
            <div key={group.name}>
              <h3 className="lg-ctrl-group-title">{group.name}</h3>
              {group.items.map((s) => (
                <label key={s.key} className="lg-ctrl-row">
                  <span className="lg-ctrl-label">{s.label}</span>
                  <input
                    type="range"
                    className="lg-ctrl-slider"
                    min={s.min}
                    max={s.max}
                    step={s.step}
                    value={params[s.key] as number}
                    onChange={(e) => handleChange(s.key, Number(e.target.value))}
                  />
                  <span className="lg-ctrl-value">{s.format(params[s.key] as number)}</span>
                </label>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
