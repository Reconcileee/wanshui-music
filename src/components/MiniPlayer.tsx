import { useEffect, useState, useRef } from 'react';
import { Pause, Play, SkipForward } from 'lucide-react';
import { useMusicStore } from '@/store/useMusicStore';
import { useDraggable } from '@/hooks/useDraggable';
import { useGlassParams } from '@/store/useGlassParams';
import LiquidGlassBox from './LiquidGlassBox';

export default function MiniPlayer() {
  const { currentSong, isPlaying, toggle, next, progress } = useMusicStore();
  const { params: glassParams } = useGlassParams();
  const [mounted, setMounted] = useState(false);
  const [rotation, setRotation] = useState(0);
  const rotationRef = useRef(0);
  const rafRef = useRef<number>(0);

  const dragRef = useDraggable<HTMLDivElement>({
    initialPosition: {
      x: typeof window !== 'undefined' ? window.innerWidth / 2 - 160 : 55,
      y: typeof window !== 'undefined' ? window.innerHeight / 2 + 40 : 400,
    },
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // 播放时封面旋转动画
  useEffect(() => {
    let lastTime = performance.now();

    const animate = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;

      if (isPlaying) {
        rotationRef.current = (rotationRef.current + delta * 0.045) % 360;
        setRotation(rotationRef.current);
      }
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isPlaying]);

  if (!currentSong) return null;

  return (
    <div
      ref={dragRef}
      className={`fixed left-0 top-0 z-50 w-[320px] select-none transition-opacity duration-500 ${mounted ? 'opacity-100' : 'opacity-0'}`}
      style={{ touchAction: 'none' }}
    >
      <LiquidGlassBox
        className="w-full"
        style={{ borderRadius: glassParams.radius }}
        options={{
          radius: glassParams.radius,
          glassThickness: glassParams.glassThickness,
          bezelWidth: glassParams.bezelWidth,
          ior: glassParams.ior,
          scaleRatio: glassParams.scaleRatio,
          blurAmount: glassParams.blurAmount,
          specularOpacity: glassParams.specularOpacity,
          specularSaturation: glassParams.specularSaturation,
        }}
        visualOptions={{
          shadowBlur: glassParams.shadowBlur,
          shadowSpread: glassParams.shadowSpread,
          outerShadowBlur: glassParams.outerShadowBlur,
          tintOpacity: glassParams.tintOpacity,
        }}
      >
        <div className="flex h-[72px] items-center gap-3 px-3 pr-5">
          {/* 封面 */}
          <div className="h-11 w-11 flex-shrink-0 overflow-hidden rounded-xl">
            <img
              src={currentSong.cover}
              alt={currentSong.title}
              className="h-full w-full object-cover"
              draggable={false}
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: isPlaying ? 'none' : 'transform 0.3s ease',
              }}
            />
          </div>

          {/* 歌曲信息 + 进度条 */}
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-[15px] font-semibold text-white drop-shadow">
              {currentSong.title}
            </span>
            <span className="truncate text-[13px] text-white/80 drop-shadow">
              {currentSong.artist}
            </span>
            {/* 进度条 */}
            <div className="relative mt-1.5 h-[3px] w-full overflow-hidden rounded-full bg-white/15">
              <div
                className="absolute left-0 top-0 h-full rounded-full bg-white/90 transition-all duration-100"
                style={{ width: `${progress * 100}%` }}
              />
              <div
                className="absolute top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-white shadow-[0_0_6px_rgba(255,255,255,0.6)] transition-all duration-100"
                style={{ left: `max(0px, calc(${progress * 100}% - 3px))` }}
              />
            </div>
          </div>

          {/* 控制按钮 */}
          <div className="flex flex-shrink-0 items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggle();
              }}
              className={`flex h-9 w-9 items-center justify-center rounded-full text-white transition-all duration-200 hover:scale-110 active:scale-95 ${isPlaying ? 'animate-pulse-glow' : ''}`}
              style={{ background: 'rgba(255,255,255,0.25)' }}
            >
              {isPlaying ? (
                <Pause size={18} fill="white" />
              ) : (
                <Play size={18} fill="white" className="ml-0.5" />
              )}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              className="flex h-9 w-9 items-center justify-center rounded-full text-white transition-all duration-200 hover:scale-110 active:scale-95"
              style={{ background: 'rgba(255,255,255,0.25)' }}
            >
              <SkipForward size={18} fill="white" />
            </button>
          </div>
        </div>
      </LiquidGlassBox>
    </div>
  );
}
