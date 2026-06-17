import { Song } from '@/types';
import { useMusicStore } from '@/store/useMusicStore';
import { Play, MoreHorizontal } from 'lucide-react';

interface AlbumCardProps {
  song: Song;
  index: number;
}

export default function AlbumCard({ song, index }: AlbumCardProps) {
  const playSong = useMusicStore((s) => s.playSong);
  const currentSong = useMusicStore((s) => s.currentSong);
  const isPlaying = useMusicStore((s) => s.isPlaying);

  const isCurrentSong = currentSong?.id === song.id;

  return (
    <button
      onClick={() => playSong(index)}
      className="group relative flex-shrink-0 w-[160px] overflow-hidden rounded-xl bg-black/20 transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
      style={{
        boxShadow: isCurrentSong
          ? '0 0 0 2px rgba(255, 45, 85, 0.6), 0 8px 24px rgba(0,0,0,0.2)'
          : '0 4px 12px rgba(0,0,0,0.1)',
      }}
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden">
        <img
          src={song.cover}
          alt={song.album}
          className={`h-full w-full object-cover transition-transform duration-500 ${
            isCurrentSong && isPlaying ? 'scale-105' : 'group-hover:scale-105'
          }`}
          loading="lazy"
          draggable={false}
        />

        {/* 悬停灰度遮罩 - 带有入场和出场动画 */}
        <div className="cover-hover-overlay pointer-events-none absolute inset-0 bg-black/25" style={{ backdropFilter: 'grayscale(0.6)' }} />

        {/* 左右按钮 */}
        <span
          className="absolute bottom-2 left-2 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100 hover:!bg-[#fa586a]"
          onClick={(e) => { e.stopPropagation(); playSong(index); }}
        >
          {isCurrentSong && isPlaying ? (
            <div className="flex items-center gap-[2px]">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-[2px] rounded-full bg-white"
                  style={{
                    height: '12px',
                    animation: `equalizer 0.6s ease-in-out ${i * 0.1}s infinite alternate`,
                  }}
                />
              ))}
            </div>
          ) : (
            <Play size={14} fill="white" className="ml-0.5" />
          )}
        </span>
        <span
          className="absolute bottom-2 right-2 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100 hover:!bg-[#fa586a]"
          onClick={(e) => { e.stopPropagation(); }}
        >
          <MoreHorizontal size={14} />
        </span>

        {/* Apple Music Logo */}
        <div className="absolute right-2 top-2 flex items-center gap-0.5 rounded-md bg-black/30 px-1.5 py-0.5 backdrop-blur-sm">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.21-1.96 1.07-3.11-1.05.05-2.31.71-3.06 1.64-.68.84-1.27 2.18-1.11 3.29 1.19.09 2.38-.6 3.1-1.82z" />
          </svg>
          <span className="text-[9px] font-medium text-white">Music</span>
        </div>
      </div>

      {/* 歌曲信息 */}
      <div className="px-2 py-2 text-left">
        <p
          className={`truncate text-[13px] font-medium leading-tight ${
            isCurrentSong ? 'text-[#FF2D55]' : 'text-white'
          }`}
        >
          {song.title}
        </p>
        <p className="truncate text-[11px] text-white/60">{song.artist}</p>
      </div>
    </button>
  );
}
