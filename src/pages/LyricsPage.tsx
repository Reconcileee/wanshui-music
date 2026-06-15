import { useRef, useEffect, useState } from 'react';
import { ArrowLeft, Play, Pause, SkipBack, SkipForward, MoreHorizontal } from 'lucide-react';
import LiquidGlassBox from '@/components/LiquidGlassBox';
import { useMusicStore } from '@/store/useMusicStore';

interface LyricLine {
  time: number; // 秒
  text: string;
}

interface LyricsPageProps {
  lyrics?: LyricLine[];
  onClose?: () => void;
}

// 示例歌词数据
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

  // 模拟播放进度
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentTime(prev => {
        const newTime = prev + 0.1;
        // 找到当前歌词行
        const newIndex = lyrics.findIndex((line, index) => {
          const nextLine = lyrics[index + 1];
          if (!nextLine) return true;
          return newTime >= line.time && newTime < nextLine.time;
        });
        
        if (newIndex !== -1 && newIndex !== currentLineIndex) {
          setCurrentLineIndex(newIndex);
        }
        
        // 循环播放
        if (newTime > lyrics[lyrics.length - 1].time + 10) {
          return 0;
        }
        
        return newTime;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, lyrics, currentLineIndex]);

  // 自动滚动到当前歌词行
  useEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const lineHeight = 48; // 每行高度
    const containerHeight = container.clientHeight;
    const scrollTo = currentLineIndex * lineHeight - containerHeight / 2 + lineHeight / 2;
    
    container.scrollTo({
      top: Math.max(0, scrollTo),
      behavior: 'smooth',
    });
  }, [currentLineIndex]);

  // 格式化时间
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const totalTime = lyrics[lyrics.length - 1]?.time + 10 || 220;

  return (
    <div className="fixed inset-0 z-[200] flex flex-col">
      {/* 背景 - 专辑封面模糊 */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: `url('${currentSong?.cover || 'https://picsum.photos/seed/lyrics/800/800'}')`,
          filter: 'blur(60px) brightness(0.4)',
          transform: 'scale(1.2)',
        }}
      />
      {/* 渐变遮罩 */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

      {/* 顶部导航 */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4">
        <button 
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm transition-colors hover:bg-white/20"
        >
          <ArrowLeft size={20} className="text-white" />
        </button>
        
        {/* 歌曲信息 */}
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg overflow-hidden shadow-lg">
            <img 
              src={currentSong?.cover || 'https://picsum.photos/seed/lyrics/100/100'} 
              alt="cover" 
              className="h-full w-full object-cover" 
            />
          </div>
          <div>
            <div className="text-[15px] font-semibold text-white">{currentSong?.title || '夜色漫步'}</div>
            <div className="text-[13px] text-white/60">{currentSong?.artist || '未知艺人'}</div>
          </div>
        </div>

        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm transition-colors hover:bg-white/20">
          <MoreHorizontal size={20} className="text-white" />
        </button>
      </header>

      {/* 歌词区域 */}
      <div 
        ref={containerRef}
        className="relative z-10 flex-1 overflow-y-auto px-6 py-8 scrollbar-hide"
        style={{ scrollBehavior: 'smooth' }}
      >
        <div className="max-w-2xl mx-auto space-y-3">
          {lyrics.map((line, index) => (
            <div
              key={index}
              className={`text-center transition-all duration-300 ${
                index === currentLineIndex
                  ? 'text-white text-[22px] font-semibold scale-[1.05]'
                  : index < currentLineIndex
                    ? 'text-white/30 text-[18px]'
                    : 'text-white/50 text-[18px]'
              }`}
              style={{
                minHeight: '48px',
                lineHeight: '48px',
              }}
            >
              {line.text || '♪'}
            </div>
          ))}
          
          {/* 底部留白 */}
          <div className="h-[200px]" />
        </div>
      </div>

      {/* 底部迷你播放器 */}
      <footer className="relative z-10 px-4 sm:px-6 pb-4 sm:pb-6">
        <LiquidGlassBox
          className="mx-auto w-full"
          style={{ maxWidth: '500px', borderRadius: 16 }}
          effect="clear"
          interactive
          options={{
            radius: 16,
            blurAmount: 0.3,
            specularOpacity: 0.3,
          }}
          visualOptions={{
            shadowBlur: 20,
            outerShadowBlur: 30,
            tintOpacity: 0.05,
          }}
        >
          <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 min-w-0">
            {/* 播放控制 */}
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              <button 
                onClick={prev}
                className="flex h-7 sm:h-8 w-7 sm:w-8 items-center justify-center rounded-full text-white/60 transition-colors hover:text-white"
              >
                <SkipBack size={16} fill="currentColor" />
              </button>
              <button
                onClick={toggle}
                className="flex h-9 sm:h-10 w-9 sm:w-10 items-center justify-center rounded-full bg-white text-black shadow-md transition-transform hover:scale-[1.05] active:scale-[0.95]"
              >
                {isPlaying ? <Pause size={18} fill="black" /> : <Play size={18} fill="black" className="ml-0.5" />}
              </button>
              <button 
                onClick={next}
                className="flex h-7 sm:h-8 w-7 sm:w-8 items-center justify-center rounded-full text-white/60 transition-colors hover:text-white"
              >
                <SkipForward size={16} fill="currentColor" />
              </button>
            </div>

            {/* 进度条 */}
            <div className="flex-1 min-w-[60px] sm:min-w-[100px] mx-2 sm:mx-4 flex items-center gap-1 sm:gap-2">
              <span className="text-[10px] sm:text-[11px] text-white/40 font-medium w-[30px] sm:w-[36px]">{formatTime(currentTime)}</span>
              <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white/60 rounded-full transition-all duration-100"
                  style={{ width: `${(currentTime / totalTime) * 100}%` }}
                />
              </div>
              <span className="text-[10px] sm:text-[11px] text-white/40 font-medium w-[30px] sm:w-[36px]">{formatTime(totalTime)}</span>
            </div>
          </div>
        </LiquidGlassBox>
      </footer>
    </div>
  );
}