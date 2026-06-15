import { mockSongs } from '@/utils/mockData';
import AlbumCard from './AlbumCard';

export default function AlbumGrid() {
  return (
    <div className="animate-fade-in px-5 pt-12 pb-40">
      <h1 className="mb-4 text-[28px] font-bold tracking-tight text-white drop-shadow-lg">
        最近添加
      </h1>
      <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
        {mockSongs.map((song, index) => (
          <div
            key={song.id}
            className="animate-card-enter"
            style={{ animationDelay: `${index * 80}ms`, opacity: 0 }}
          >
            <AlbumCard song={song} index={index} />
          </div>
        ))}
      </div>
    </div>
  );
}
