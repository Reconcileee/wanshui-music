import { useRef, useEffect, useState } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Star,
  MoreHorizontal,
  Volume2,
  VolumeX,
} from 'lucide-react';
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
  { time: 0, text: '之后他就恢复了自证这个解释' },
  { time: 4, text: '词汇' },
  { time: 8, text: '因为这才是挥手向云彩道别的滋味' },
  { time: 14, text: '小船静静往返' },
  { time: 18, text: '马谛斯的海岸' },
  { time: 22, text: '星空下的夜晚' },
  { time: 26, text: '交给梵谷点燃' },
  { time: 30, text: '梦美的太短暂' },
  { time: 34, text: '孟克桥上的呐喊' },
];

export default function LyricsPage({ lyrics = SAMPLE_LYRICS, onClose }: LyricsPageProps) {
  const { isPlaying, currentSong, toggle, next, prev } = useMusicStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentLineIndex, setCurrentLineIndex] = useState(3);
  const [volume, setVolume] = useState(0.6);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [favorited, setFavorited] = useState(false);
  const [muted, setMuted] = useState(false);

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

        if (newTime > (lyrics[lyrics.length - 1]?.time + 10 || 220)) {
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

  const totalTime = 224; // 3:44
  const songTitle = currentSong?.title || '最伟大的作品';
  const songArtist = currentSong?.artist || '周杰伦';
  const songCover = currentSong?.cover || '';

  return (
    <div className="fixed inset-0 z-[200] flex overflow-hidden">
      {/* 背景 - 专辑封面模糊 (Apple Music 风格) */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: songCover ? `url('${songCover}')` : 'none',
          filter: 'blur(60px) brightness(0.4) saturate(1.4)',
          transform: 'scale(1.3)',
        }}
      />
      {/* 深色渐变遮罩 */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />

      {/* 左侧：专辑 + 播放控制 */}
      <div className="relative z-10 flex flex-1 flex-col justify-center px-8 py-6 lg:px-12">
        {/* 专辑封面 */}
        <div className="relative mx-auto w-full max-w-[340px]">
          <div className="aspect-square w-full overflow-hidden rounded-lg shadow-2xl shadow-black/60">
            {songCover ? (
              <img src={songCover} alt={songTitle} className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-amber-200 via-orange-300 to-rose-400" />
            )}
          </div>

          {/* 歌名 + 收藏 + 更多 */}
          <div className="mt-5 flex items-end justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h2 className="truncate text-[18px] font-semibold text-white">{songTitle}</h2>
              <p className="truncate text-[14px] text-white/60">{songArtist}</p>
            </div>
            <div className="flex flex-shrink-0 items-center gap-1">
              <button
                onClick={() => setFavorited(!favorited)}
                className="flex h-7 w-7 items-center justify-center text-white/70 transition-colors hover:text-white"
              >
                <Star size={18} fill={favorited ? '#fa2d48' : 'none'} stroke={favorited ? '#fa2d48' : 'currentColor'} />
              </button>
              <button className="flex h-7 w-7 items-center justify-center text-white/70 transition-colors hover:text-white">
                <MoreHorizontal size={18} />
              </button>
            </div>
          </div>

          {/* 进度条 */}
          <div className="mt-3 flex items-center gap-2">
            <span className="w-9 text-right text-[11px] font-medium text-white/50">
              {formatTime(currentTime)}
            </span>
            <div className="group relative h-[3px] flex-1 cursor-pointer rounded-full bg-white/20">
              <div
                className="absolute left-0 top-0 h-full rounded-full bg-white/70"
                style={{ width: `${(currentTime / totalTime) * 100}%` }}
              />
              <div
                className="absolute top-1/2 h-[10px] w-[10px] -translate-y-1/2 rounded-full bg-white shadow opacity-0 transition-opacity group-hover:opacity-100"
                style={{ left: `calc(${(currentTime / totalTime) * 100}% - 5px)` }}
              />
            </div>
            <span className="w-9 text-[11px] font-medium text-white/50">
              -{formatTime(Math.max(0, totalTime - currentTime))}
            </span>
          </div>

          {/* 播放控制按钮 */}
          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={() => setShuffle(!shuffle)}
              className={`transition-colors ${shuffle ? 'text-[#fa2d48]' : 'text-white/60 hover:text-white'}`}
            >
              <Shuffle size={16} />
            </button>
            <button
              onClick={prev}
              className="text-white/80 transition-colors hover:text-white"
            >
              <SkipBack size={28} fill="currentColor" />
            </button>
            <button
              onClick={toggle}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-black shadow-lg transition-transform active:scale-95"
            >
              {isPlaying ? <Pause size={22} fill="black" /> : <Play size={22} fill="black" className="ml-0.5" />}
            </button>
            <button
              onClick={next}
              className="text-white/80 transition-colors hover:text-white"
            >
              <SkipForward size={28} fill="currentColor" />
            </button>
            <button
              onClick={() => setRepeat(!repeat)}
              className={`transition-colors ${repeat ? 'text-[#fa2d48]' : 'text-white/60 hover:text-white'}`}
            >
              <Repeat size={16} />
            </button>
          </div>

          {/* 音量 */}
          <div className="mt-4 flex items-center gap-2">
            <button
              onClick={() => setMuted(!muted)}
              className="flex h-6 w-6 flex-shrink-0 items-center justify-center text-white/60 transition-colors hover:text-white"
            >
              {muted || volume === 0 ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </button>
            <div className="group relative h-[3px] flex-1 cursor-pointer rounded-full bg-white/20">
              <div
                className="absolute left-0 top-0 h-full rounded-full bg-white/80"
                style={{ width: `${muted ? 0 : volume * 100}%` }}
              />
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={muted ? 0 : volume}
                onChange={(e) => {
                  setVolume(parseFloat(e.target.value));
                  setMuted(false);
                }}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              />
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 text-[11px] font-medium text-white/60 transition-colors hover:text-white"
              title="收起歌词"
            >
              收起
            </button>
          </div>
        </div>
      </div>

      {/* 右侧：滚动歌词 */}
      <div
        ref={containerRef}
        className="relative z-10 hidden flex-1 overflow-y-auto px-8 py-6 scrollbar-hide md:block"
        style={{ scrollBehavior: 'smooth' }}
      >
        <div className="mx-auto max-w-md pl-4">
          {/* 顶部留白，让第一行能滚动到中央 */}
          <div className="h-[40vh]" />

          {lyrics.map((line, index) => {
            const isActive = index === currentLineIndex;
            const isPast = index < currentLineIndex;

            return (
              <div
                key={index}
                className={`transition-all duration-500 ease-out ${
                  isActive
                    ? 'text-white text-[30px] font-semibold'
                    : isPast
                      ? 'text-white/25 text-[28px] font-normal'
                      : 'text-white/40 text-[28px] font-normal'
                }`}
                style={{
                  minHeight: '52px',
                  lineHeight: '52px',
                  filter: isActive ? 'none' : 'blur(0.3px)',
                }}
              >
                <span className="truncate">{line.text || '·'}</span>
              </div>
            );
          })}

          {/* 底部留白 */}
          <div className="h-[40vh]" />
        </div>
      </div>
    </div>
  );
}
