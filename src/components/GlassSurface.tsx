import { forwardRef } from 'react';

interface GlassSurfaceProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const GlassSurface = forwardRef<HTMLDivElement, GlassSurfaceProps>(
  ({ children, className = '', style = {} }, ref) => {
    return (
      <div
        ref={ref}
        className={`relative ${className}`}
        style={{
          isolation: 'isolate',
          backdropFilter: 'blur(20px) saturate(1.4)',
          WebkitBackdropFilter: 'blur(20px) saturate(1.4)',
          background: 'rgba(255, 255, 255, 0.12)',
          boxShadow:
            '0 8px 32px rgba(0,0,0,0.1), inset 0 0 20px rgba(255,255,255,0.15), inset 0 0 0 1px rgba(255,255,255,0.2)',
          ...style,
        }}
      >
        {children}
      </div>
    );
  }
);

GlassSurface.displayName = 'GlassSurface';

export default GlassSurface;
