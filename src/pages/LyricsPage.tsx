import { useRef, useEffect, useState } from 'react';
import { ArrowLeft, Play, Pause, SkipBack, SkipForward, MoreHorizontal, ChevronDown } from 'lucide-react';
import LiquidGlassBox from '@/components/LiquidGlassBox';
import { useMusicStore } from '@/store/useMusicStore';

interface LyricLine {
  time: number;
  text: string;
}

interface LyricsPageProps {
  lyrics?: LyricLine[];
  onClose?: () => void;
}

const SAMPLE_LYRICS: LyricLine[] = [
  { time: 0, text: '♪ 前奏 ♪' },
  { time: 5, text: '夜色渐浓' },
  { time: 10, text: '星光闪烁在天空' },
  { time: 15, text: '我独自漫步在这城市' },
  { time: 20, text: '寻找着属于我的方向' },
  { time: 25, text: '' },
  { time: 30, text: '风吹过脸庞' },
  { time: 35, text: '带来一丝凉意' },
  { time: 40, text: '我想起了那些往事' },
  { time: 45, text: '那些曾经的梦想' },
  { time: 50, text: '' },
  { time: 55, text: '时间在流逝' },
  { time: 60, text: '岁月在变迁' },
  { time: 65, text: '但我依然坚持着' },
  { time: 70, text: '那份最初的信念' },
  { time: 75, text: '' },
  { time: 80, text: '无论多远' },
  { time: 85, text: '我都会继续前行' },
  { time: 90, text: '直到找到那个终点' },
  { time: 95, text: '那个属于我的终点' },
  { time: 100, text: '' },
  { time: 105, text: '♪ 间奏 ♪' },
  { time: 115, text: '夜色渐浓' },
  { time: 120, text: '星光闪烁在天空' },
  { time: 125, text: '我独自漫步在这城市' },
  { time: 130, text: '寻找着属于我的方向' },
  { time: 135, text: '' },
  { time: 140, text: '风吹过脸庞' },
  { time: 145, text: '带来一丝凉意' },
  { time: 150, text: '我想起了那些往事' },
  { time: 155, text: '那些曾经的梦想' },
  { time: 160, text: '' },
  { time: 165, text: '时间在流逝' },
  { time: 170, text: '岁月在变迁' },
  { time: 175, text: '但我依然坚持着' },
  { time: 180, text: '那份最初的信念' },
  { time: 185, text: '' },
  { time: 190, text: '无论多远' },
  { time: 195, text: '我都会继续前行' },
  { time: 200, text: '直到找到那个终点' },
  { time: 205, text: '那个属于我的终点' },
  { time: 210, text: '' },
  { time: 215, text: '♪ 结尾 ♪' },
];

export default function LyricsPage({ lyrics = SAMPLE_LYRICS, onClose }: LyricsPageProps) {
  const { isPlaying, currentSong, toggle, next, prev } = useMusicStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentTime(prev => {
        const newTime = prev + 0.1;
        const newIndex = lyrics.findIndex((line, index) => {
          const nextLine = lyrics[index + 1];
          if (!nextLine) return true;
          return newTime >= line.time && newTime < nextLine.time;
        });
        
        if (newIndex !== -1 && newIndex !== currentLineIndex) {
          setCurrentLineIndex(newIndex);
        }
        
        if (newTime > lyrics[lyrics.length - 1].time + 10) {
          return 0;
        }
        
        return newTime;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, lyrics, currentLineIndex]);

  useEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const lineHeight = 52;
    const containerHeight = container.clientHeight;
    const scrollTo = currentLineIndex * lineHeight - containerHeight / 2 + lineHeight / 2;
    
    container.scrollTo({
      top: Math.max(0, scrollTo),
      behavior: 'smooth',
    });
  }, [currentLineIndex]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const totalTime = lyrics[lyrics.length - 1]?.time + 10 || 220;

  return (
    <div className="fixed inset-0 z-[200] flex flex-col">
      {/* 背景 - 专辑封面模糊 (Apple Music 风格) */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: currentSong ? `url('${currentSong.cover}')` : 'none',
          filter: 'blur(80px) brightness(0.35) saturate(1.5)',
          transform: 'scale(1.3)',
        }}
      />
      {/* 深色渐变遮罩 */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />

      {/* 顶部导航 - Apple Music 风格 */}
      <header className="relative z-10 flex items-center justify-between px-5 py-3 sm:px-6 sm:py-4">
        <button 
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-black/30 backdrop-blur-md text-white/80 transition-all hover:bg-black/50 hover:text-white"
        >
          <ChevronDown size={20} />
        </button>
        
        {currentSong && (
          <div className="flex flex-col items-center">
            <div className="text-[11px] font-medium text-white/50 uppercase tracking-wider">正在播放</div>
            <div className="text-[14px] font-semibold text-white truncate max-w-[200px]">{currentSong.title}</div>
            <div className="text-[12px] text-white/50 truncate max-w-[200px]">{currentSong.artist}</div>
          </div>
        )}

        <button className="flex h-8 w-8 items-center justify-center rounded-full bg-black/30 backdrop-blur-md text-white/80 transition-all hover:bg-black/50 hover:text-white">
          <MoreHorizontal size={18} />
        </button>
      </header>

      {/* 歌词区域 - Apple Music 大字体居中风格 */}
      <div 
        ref={containerRef}
        className="relative z-10 flex-1 overflow-y-auto px-6 py-4 scrollbar-hide"
        style={{ scrollBehavior: 'smooth' }}
      >
        <div className="max-w-2xl mx-auto space-y-2">
          {/* 顶部留白 */}
          <div className="h-[25vh]" />
          
          {lyrics.map((line, index) => {
            const isActive = index === currentLineIndex;
            const isPast = index < currentLineIndex;
            
            return (
              <div
                key={index}
                className={`text-center transition-all duration-500 ease-out ${
                  isActive
                    ? 'text-white text-[26px] sm:text-[28px] font-bold scale-[1.02]'
                    : isPast
                      ? 'text-white/25 text-[20px] sm:text-[22px] font-medium'
                      : 'text-white/40 text-[20px] sm:text-[22px] font-medium'
                }`}
                style={{
                  minHeight: '52px',
                  lineHeight: '52px',
                  filter: isActive ? 'none' : isPast ? 'blur(0.3px)' : 'blur(0.5px)',
                }}
              >
                {line.text || '·'}
              </div>
            );
          })}
          
          {/* 底部留白 */}
          <div className="h-[30vh]" />
        </div>
      </div>

      {/* 底部播放控制 - Apple Music 简约风格 */}
      <footer className="relative z-10 px-5 sm:px-6 pb-6 sm:pb-8">
        {/* 进度条 */}
        <div className="mb-4 flex items-center gap-2">
          <span className="text-[10px] text-white/40 font-medium w-[32px] text-right">{formatTime(currentTime)}</span>
          <div className="flex-1 h-[3px] bg-white/15 rounded-full overflow-hidden relative">
            <div
              className="absolute left-0 top-0 h-full bg-white/80 rounded-full transition-all duration-100"
              style={{ width: `${(currentTime / totalTime) * 100}%` }}
            />
            {/* 拖拽圆点 */}
            <div
              className="absolute top-1/2 -translate-y-1/2 h-3 w-3 bg-white rounded-full shadow-md transition-all duration-100"
              style={{ left: `calc(${(currentTime / totalTime) * 100}% - 6px)` }}
            />
          </div>
          <span className="text-[10px] text-white/40 font-medium w-[32px]">-{formatTime(Math.max(0, totalTime - currentTime))}</span>
        </div>
        
        {/* 播放控制按钮 */}
        <div className="flex items-center justify-center gap-8">
          <button 
            onClick={prev}
            className="flex h-9 w-9 items-center justify-center text-white/70 transition-colors hover:text-white"
          >
            <SkipBack size={24} fill="currentColor" />
          </button>
          <button
            onClick={toggle}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-black shadow-xl transition-transform active:scale-[0.93]"
          >
            {isPlaying ? <Pause size={26} fill="black" /> : <Play size={26} fill="black" className="ml-1" />}
          </button>
          <button 
            onClick={next}
            className="flex h-9 w-9 items-center justify-center text-white/70 transition-colors hover:text-white"
          >
            <SkipForward size={24} fill="currentColor" />
          </button>
        </div>
      </footer>
    </div>
  );
}
