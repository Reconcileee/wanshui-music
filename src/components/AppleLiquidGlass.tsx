import LiquidGlass from 'liquid-glass-react';

interface AppleLiquidGlassProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  /** 效果模式 */
  mode?: 'standard' | 'polar' | 'prominent' | 'shader';
  /** 位移强度 (default: 70) */
  displacementScale?: number;
  /** 模糊程度 (default: 0.0625) */
  blurAmount?: number;
  /** 饱和度 (default: 140) */
  saturation?: number;
  /** 色散强度 (default: 2) */
  aberrationIntensity?: number;
  /** 弹性 (default: 0.15) - 0=刚性，更高=更弹性 */
  elasticity?: number;
  /** 圆角 (default: 999) */
  cornerRadius?: number;
  /** 内边距 */
  padding?: string;
  /** 是否在浅色背景上 */
  overLight?: boolean;
  /** 点击事件 */
  onClick?: () => void;
}

/**
 * Apple Liquid Glass 效果组件
 * 基于 liquid-glass-react 库实现
 * 
 * 特点：
 * - 真实的边缘弯曲和折射
 * - 多种折射模式
 * - 可配置的模糊程度
 * - 支持任意子元素
 * - 正确的悬停和点击效果
 * - 色散效果
 * - 弹性效果（模拟 Apple 的 "liquid" 感觉）
 */
export default function AppleLiquidGlass({
  children,
  className = '',
  style = {},
  mode = 'standard',
  displacementScale = 70,
  blurAmount = 0.0625,
  saturation = 140,
  aberrationIntensity = 2,
  elasticity = 0.15,
  cornerRadius = 999,
  padding,
  overLight = false,
  onClick,
}: AppleLiquidGlassProps) {
  return (
    <LiquidGlass
      className={className}
      style={style}
      mode={mode}
      displacementScale={displacementScale}
      blurAmount={blurAmount}
      saturation={saturation}
      aberrationIntensity={aberrationIntensity}
      elasticity={elasticity}
      cornerRadius={cornerRadius}
      padding={padding}
      overLight={overLight}
      onClick={onClick}
    >
      {children}
    </LiquidGlass>
  );
}