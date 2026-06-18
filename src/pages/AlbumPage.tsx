import { useState } from 'react';
import {
  Play,
  Pause,
  MoreHorizontal,
  ChevronLeft,
  Share,
  Plus,
} from 'lucide-react';
import { useMusicStore } from '@/store/useMusicStore';
import { Song } from '@/types';
import Sidebar from '@/components/Sidebar';
import { useAlbumSync } from '@/hooks/useAlbumSync';

// ---- Album Data ----
export interface AlbumTrack {
  id: number;
  title: string;
  duration: string;
  durationSec: number;
  feat?: string;
  popular?: boolean;
  explicit?: boolean;
  playable?: boolean;
}

export interface AlbumData {
  title: string;
  artist: string;
  genre: string;
  year: string;
  releaseDate: string;
  trackCount: number;
  totalDuration: string;
  label: string;
  cover: string;
  description: string;
  tracks: AlbumTrack[];
  videos?: { title: string; artist: string; cover: string }[];
  otherVersions?: { title: string; subtitle: string; cover: string }[];
  moreFromArtist?: { title: string; subtitle: string; cover: string }[];
  appearsIn?: { title: string; subtitle: string; cover: string }[];
  youMayAlsoLike?: { title: string; subtitle: string; cover: string }[];
}

export const OLIVIA_ALBUM: AlbumData = {
  title: 'you seem pretty sad for a girl so in love',
  artist: 'Olivia Rodrigo',
  genre: '国际流行',
  year: '2026年',
  releaseDate: '2026年6月12日',
  trackCount: 14,
  totalDuration: '51 分钟',
  label: '℗ 2026 Olivia Rodrigo, under exclusive license to Geffen Records',
  cover: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/1d/1b/f9/1d1bf9b1-44c6-9a6c-6ffb-c158488c06ce/26UMGIM39303.rgb.jpg/632x632bb.webp',
  description:
    '用整张专辑回答爱的双面性带来的种种困惑，写下成长路上的疼痛、悸动与希望。从《drivers license》中那个在郊区街道上心碎落泪的少女，到如今，Olivia Rodrigo 已经历过许多次爱与失去。她成长了，对好情歌的标准更高了，对一段好的感情也是如此。在第三张专辑《you seem pretty sad for a girl so in love》中，Rodrigo 迫不及待地想分享这些年来的体悟。酒吧洗手间门口排队时与 crush 相遇的故事并不新鲜，就像她在《drop dead》中唱的那样，但很少有人能将这样一个熟悉得不能再熟悉的瞬间描绘得如此鲜活。在《u ＋ me ＝ ᐸ3》中，她放肆心动，甚至爱屋及乌地喜欢着与对方面容相似的姐姐；《purple》捕捉了一段感情从悸动走向深刻的微妙变化。当然，Rodrigo 明白甜蜜和迷醉并非爱的永恒基调。《expectations》写出了滤镜褪去后的尴尬与幻灭；《my way》则借鉴 Avril Lavigne 与 Paramore 式的流行朋克锋芒，释放出更强硬的姿态。即便专辑不乏轻松活泼的时刻，那些更克制、编曲更简约的抒情作品，依旧最能体现 Rodrigo 的创作信念。《cigarette smoke》不仅展现了 Rodrigo 极具张力的演唱功底，也奉献了一句分手金句；在《less》中，她独自回到钢琴前，明白了有时候就算爱依旧存在，关系也难以维系。而在音乐上，Rodrigo 从摇滚乐先辈身上汲取养分：《the cure》探讨关系中那些令人难以摆脱的情感包袱；《what\'s wrong with me》中，她更是直接追本溯源，请来了 The Cure 乐队主唱 Robert Smith 合唱，颇有 80 年代另类摇滚气质。',
  tracks: [
    { id: 1, title: 'drop dead', duration: '3:44', durationSec: 224, popular: true },
    { id: 2, title: 'stupid song', duration: '3:29', durationSec: 209, popular: true },
    { id: 3, title: 'honeybee', duration: '3:43', durationSec: 223, popular: true },
    { id: 4, title: 'maggots for brains', duration: '4:00', durationSec: 240, popular: true },
    { id: 5, title: 'u + me = <3', duration: '4:07', durationSec: 247, explicit: true },
    { id: 6, title: 'my way', duration: '3:00', durationSec: 180, explicit: true },
    { id: 7, title: 'purple', duration: '4:00', durationSec: 240 },
    { id: 8, title: 'the cure', duration: '4:57', durationSec: 297, popular: true, explicit: true },
    { id: 9, title: 'begged', duration: '3:37', durationSec: 217 },
    { id: 10, title: 'what\'s wrong with me', duration: '3:44', durationSec: 224, feat: 'Robert Smith' },
    { id: 11, title: 'less', duration: '3:13', durationSec: 193 },
    { id: 12, title: 'expectations', duration: '3:41', durationSec: 221 },
    { id: 13, title: 'cigarette smoke', duration: '5:40', durationSec: 340, explicit: true },
    { id: 14, title: 'you seem pretty sad for a girl so in love', duration: '0:20', durationSec: 20 },
  ],
  videos: [
    { title: 'you seem pretty sad for a girl so in love', artist: 'Olivia Rodrigo', cover: 'https://is1-ssl.mzstatic.com/image/thumb/Video221/v4/a2/04/56/a20456ea-7e8e-b5a4-9679-217c2d1471d1/31b8b2e1bf708fc753cf464eab12d4b8_Preview_Image_Intermediate_nonvideo_sdr_437717063_2650428695.png/632x632bb.webp' },
    { title: 'the cure', artist: 'Olivia Rodrigo', cover: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/1d/1b/f9/1d1bf9b1-44c6-9a6c-6ffb-c158488c06ce/26UMGIM39303.rgb.jpg/632x632bb.webp' },
    { title: 'stupid song', artist: 'Olivia Rodrigo', cover: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/1d/1b/f9/1d1bf9b1-44c6-9a6c-6ffb-c158488c06ce/26UMGIM39303.rgb.jpg/632x632bb.webp' },
  ],
  otherVersions: [
    { title: 'you seem pretty sad for a girl so in love', subtitle: 'Olivia Rodrigo · 13 首歌曲', cover: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/1d/1b/f9/1d1bf9b1-44c6-9a6c-6ffb-c158488c06ce/26UMGIM39303.rgb.jpg/300x300bb.webp' },
  ],
  moreFromArtist: [
    { title: 'drivers license - Single', subtitle: 'Olivia Rodrigo · 2021', cover: 'https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/52/cb/9c/52cb9c8e-6891-3e3e-ec72-93f0e2e4af1b/21UM1IM05267.rgb.jpg/300x300bb.webp' },
    { title: 'SOUR (Video Version)', subtitle: 'Olivia Rodrigo · 2021', cover: 'https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/72/95/b1/7295b1c2-3e1a-2e73-80ca-7e4d7c4e4d4e/21UM1IM05267.rgb.jpg/300x300bb.webp' },
    { title: 'GUTS (spilled)', subtitle: 'Olivia Rodrigo · 2023', cover: 'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/51/cb/9c/51cb9c8e-6891-3e3e-ec72-93f0e2e4af1b/23UM1IM05267.rgb.jpg/300x300bb.webp' },
    { title: 'you seem pretty sad for a girl so in love', subtitle: 'Olivia Rodrigo · 2026', cover: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/1d/1b/f9/1d1bf9b1-44c6-9a6c-6ffb-c158488c06ce/26UMGIM39303.rgb.jpg/300x300bb.webp' },
  ],
  appearsIn: [
    { title: '今日热门', subtitle: 'Apple Music 国际流行', cover: 'https://is1-ssl.mzstatic.com/image/thumb/Features126/v4/ac/40/b3/ac40b331-c407-1190-ea71-a9d088ff01f1/c19db56b-dfc8-4250-9e48-ddcbc9a4df41.png/300x300cc.webp' },
    { title: '乐之夏', subtitle: 'Apple Music', cover: 'https://is1-ssl.mzstatic.com/image/thumb/Features122/v4/0a/da/f6/0adaf638-daba-b86c-51c9-2e24d16f6ae8/aa9d358d-5ab5-4e83-83d1-af4cc92f29db.png/300x300cc.webp' },
    { title: 'Olivia Rodrigo 代表作', subtitle: 'Apple Music 国际流行', cover: 'https://is1-ssl.mzstatic.com/image/thumb/Features115/v4/bc/95/4b/bc954b7e-be33-8f66-5679-9fd65b3af65b/U0MtTVMtV1ctVGVlbl9Qb3BfSGl0c18tQURBTV9JRD05NzY0NjUzNjAucG5n.png/300x300cc.webp' },
    { title: 'A-List: 国际流行', subtitle: 'Apple Music 国际流行', cover: 'https://is1-ssl.mzstatic.com/image/thumb/Features115/v4/d3/0a/d3/d30ad392-142d-2d60-f721-16028ae68ebb/dj.lmoukelr.jpg/300x300cc.webp' },
    { title: '办公室 DJ', subtitle: 'Apple Music', cover: 'https://is1-ssl.mzstatic.com/image/thumb/Features/v4/23/97/b1/2397b12a-8edd-b5ff-ad5b-97ce074d9a47/fea1deed-c7c4-48fc-b8f0-f4a3b8c39174.png/300x300cc.webp' },
  ],
  youMayAlsoLike: [
    { title: 'Daughter from Hell', subtitle: 'Gracie Abrams', cover: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/4f/13/47/4f1347cf-9564-e8b6-523a-386202f4d265/26UMGIM54147.rgb.jpg/300x300bb.webp' },
    { title: 'petal', subtitle: 'Ariana Grande', cover: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/7e/e6/82/7ee682bd-1b17-6adc-be63-b5af1bdff369/26UMGIM51126.rgb.jpg/300x300bb.webp' },
    { title: 'WILD - EP', subtitle: 'KATSEYE', cover: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/56/ca/63/56ca63e3-7b54-5953-2d8c-c5bd745e0d93/cover_KM0024723_1.jpg/300x300bb.webp' },
    { title: 'Cruel World', subtitle: 'Holly Humberstone', cover: 'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/51/cb/9c/51cb9c8e-6891-3e3e-ec72-93f0e2e4af1b/23UM1IM05267.rgb.jpg/300x300bb.webp' },
    { title: 'The Long Way Home Vol 1', subtitle: 'Hudson Ingram', cover: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/1c/b2/46/1cb246db-afae-a599-d377-44a7ea7267fa/196874346976.jpg/300x300bb.webp' },
  ],
};

export const SHOUDU_ALBUM: AlbumData = {
  title: '首都',
  artist: '罗大佑',
  genre: '华语流行',
  year: '1992年',
  releaseDate: '1992年',
  trackCount: 13,
  totalDuration: '52 分钟',
  label: '℗ 1992 滚石唱片',
  cover: import.meta.env.BASE_URL + 'musics/albums/罗大佑/首都_cover.jpg',
  description:
    '《首都》是罗大佑"中国三部曲"的终章，与《皇后大道东》《原乡》共同构成他对家国命运的深沉思考。从香港前途的追问，到台湾根源的探索，再到对祖国大陆变动的审视，罗大佑以史诗般的笔触铺陈民族命运的宏大叙事。同名曲《首都》以粤语吟唱，将千年帝都的兴衰更迭浓缩于方寸之间——"首都万里河山千代人物，首都万世乾坤青云路"，既有对历史的回望，也有对现实的叩问。整张专辑融合摇滚、民谣与中式曲调，在批判与抒情之间游刃有余，是华语音乐中罕见的兼具思想深度与艺术高度的作品。',
  tracks: [
    { id: 1, title: '飛車', duration: '3:15', durationSec: 195 },
    { id: 2, title: '首都', duration: '5:31', durationSec: 331, playable: true },
    { id: 3, title: '母親ⅰ', duration: '2:48', durationSec: 168 },
    { id: 4, title: '情人眼里', duration: '4:12', durationSec: 252 },
    { id: 5, title: '親親表哥', duration: '3:56', durationSec: 236 },
    { id: 6, title: '母親ⅱ', duration: '3:22', durationSec: 202 },
    { id: 7, title: '新聞報導', duration: '1:30', durationSec: 90 },
    { id: 8, title: '首都', duration: '5:31', durationSec: 331 },
    { id: 9, title: '不在乎', duration: '3:48', durationSec: 228 },
    { id: 10, title: '愛色', duration: '4:05', durationSec: 245 },
    { id: 11, title: '只要是愛', duration: '3:40', durationSec: 220 },
    { id: 12, title: '首都', duration: '5:31', durationSec: 331 },
    { id: 13, title: '新生代', duration: '4:18', durationSec: 258 },
  ],
  moreFromArtist: [
    { title: '之乎者也', subtitle: '罗大佑 · 1982', cover: 'https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/a4/fa/86/a4fa86d6-c23a-c37f-1251-00376ff144cd/00602498378830.rgb.jpg/300x300bb.webp' },
    { title: '皇后大道东', subtitle: '罗大佑 · 1991', cover: 'https://is1-ssl.mzstatic.com/image/thumb/Music6/v4/43/52/5e/43525e86-9c47-cb57-5ca5-a374aa7afa40/LaLa.jpg/300x300bb.webp' },
    { title: '原乡', subtitle: '罗大佑 · 1991', cover: 'https://is1-ssl.mzstatic.com/image/thumb/Music6/v4/43/52/5e/43525e86-9c47-cb57-5ca5-a374aa7afa40/LaLa.jpg/300x300bb.webp' },
    { title: '恋曲2000', subtitle: '罗大佑 · 1994', cover: 'https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/a4/fa/86/a4fa86d6-c23a-c37f-1251-00376ff144cd/00602498378830.rgb.jpg/300x300bb.webp' },
  ],
  appearsIn: [
    { title: '华语经典', subtitle: 'Apple Music 华语流行', cover: 'https://is1-ssl.mzstatic.com/image/thumb/Features115/v4/d3/0a/d3/d30ad392-142d-2d60-f721-16028ae68ebb/dj.lmoukelr.jpg/300x300cc.webp' },
    { title: '华语摇滚精选', subtitle: 'Apple Music', cover: 'https://is1-ssl.mzstatic.com/image/thumb/Features/v4/23/97/b1/2397b12a-8edd-b5ff-ad5b-97ce074d9a47/fea1deed-c7c4-48fc-b8f0-f4a3b8c39174.png/300x300cc.webp' },
    { title: '罗大佑代表作品', subtitle: 'Apple Music 华语流行', cover: 'https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/a4/fa/86/a4fa86d6-c23a-c37f-1251-00376ff144cd/00602498378830.rgb.jpg/300x300cc.webp' },
  ],
  youMayAlsoLike: [
    { title: '之乎者也', subtitle: '罗大佑', cover: 'https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/a4/fa/86/a4fa86d6-c23a-c37f-1251-00376ff144cd/00602498378830.rgb.jpg/300x300bb.webp' },
    { title: '一场游戏一场梦', subtitle: '王杰', cover: 'https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/a4/fa/86/a4fa86d6-c23a-c37f-1251-00376ff144cd/00602498378830.rgb.jpg/300x300bb.webp' },
    { title: '搭错车', subtitle: '苏芮', cover: 'https://is1-ssl.mzstatic.com/image/thumb/Music6/v4/43/52/5e/43525e86-9c47-cb57-5ca5-a374aa7afa40/LaLa.jpg/300x300bb.webp' },
    { title: '光阴的故事', subtitle: '罗大佑', cover: 'https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/a4/fa/86/a4fa86d6-c23a-c37f-1251-00376ff144cd/00602498378830.rgb.jpg/300x300bb.webp' },
    { title: '明天会更好', subtitle: '罗大佑', cover: 'https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/a4/fa/86/a4fa86d6-c23a-c37f-1251-00376ff144cd/00602498378830.rgb.jpg/300x300bb.webp' },
  ],
};

// ---- Explicit Badge (9x9 SVG E icon) ----
function ExplicitBadge() {
  return (
    <span
      className="inline-flex items-center align-middle ml-1"
      role="img"
      aria-label="儿童不宜"
      style={{ verticalAlign: 'baseline' }}
    >
      <svg width="9" height="9" viewBox="0 0 9 9" fill="currentColor" className="text-white/90">
        <path d="M4.5 0a4.5 4.5 0 100 9 4.5 4.5 0 000-9zm0 .7a3.8 3.8 0 110 7.6 3.8 3.8 0 010-7.6zM2.5 2.5v4h4v-4h-4zm.6.6h2.8v.6H3.8v.9h1.6v.6H3.8v1.1h-.7V3.1z" />
      </svg>
    </span>
  );
}

// ---- Section Header ----
function SectionTitle({ title }: { title: string }) {
  return (
    <h2 className="mb-4 text-[17px] font-bold text-white/90 tracking-tight">{title}</h2>
  );
}

// ---- Horizontal Card Shelf ----
function CardShelf({ items }: { items: { title: string; subtitle: string; cover: string }[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
      {items.map((item) => (
        <div key={item.title} className="group cursor-pointer">
          <div className="mb-2.5 aspect-square overflow-hidden rounded-[8px] bg-white/[0.06] relative shadow-lg shadow-black/20">
            <img src={item.cover} alt={item.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
            <button className="absolute bottom-2 left-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100 hover:!bg-[#fa586a] active:scale-90">
              <Play size={14} fill="white" className="ml-0.5" />
            </button>
            <button className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100 hover:!bg-[#fa586a] active:scale-90">
              <MoreHorizontal size={14} />
            </button>
          </div>
          <div className="truncate text-[13px] font-medium text-white/90">{item.title}</div>
          <div className="truncate text-[12px] text-white/50 mt-0.5">{item.subtitle}</div>
        </div>
      ))}
    </div>
  );
}

// ---- Video Shelf (16:9) ----
function VideoShelf({ items }: { items: { title: string; artist: string; cover: string }[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      {items.map((item) => (
        <div key={item.title} className="group cursor-pointer">
          <div className="mb-2.5 aspect-video overflow-hidden rounded-[10px] bg-white/[0.06] relative shadow-lg shadow-black/20">
            <img src={item.cover} alt={item.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <button className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-lg transition-transform active:scale-90">
                <Play size={20} fill="black" className="ml-0.5" />
              </button>
            </div>
          </div>
          <div className="truncate text-[13px] font-medium text-white/90">{item.title}</div>
          <div className="truncate text-[12px] text-white/50 mt-0.5">{item.artist}</div>
        </div>
      ))}
    </div>
  );
}

// ---- Album Page ----
interface AlbumPageProps {
  album?: AlbumData;
  onClose?: () => void;
}

export default function AlbumPage({ album = OLIVIA_ALBUM, onClose }: AlbumPageProps) {
  const { getAlbumData } = useAlbumSync();
  const syncedAlbum = getAlbumData(album.title);
  const effectiveAlbum = syncedAlbum ?? album;

  const { isPlaying, currentSong, playSongObject } = useMusicStore();
  const [descExpanded, setDescExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('discover');

  const handlePlayTrack = (track: AlbumTrack) => {
    if (track.playable === false) return;
    // 首都专辑的"首都"曲目使用本地音频
    const isShouduTrack = effectiveAlbum.artist === '罗大佑' && track.title === '首都' && track.playable;
    const song: Song = {
      id: track.id + 5000,
      title: track.title,
      artist: track.feat ? `${effectiveAlbum.artist} & ${track.feat}` : effectiveAlbum.artist,
      album: effectiveAlbum.title,
      cover: effectiveAlbum.cover,
      audioUrl: isShouduTrack
        ? import.meta.env.BASE_URL + 'musics/首都/罗大佑 - 首都.mp3'
        : `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${(track.id % 6) + 1}.mp3`,
      duration: track.durationSec,
    };
    playSongObject(song);
  };

  const handlePlayAll = () => {
    const firstPlayable = effectiveAlbum.tracks.find(t => t.playable !== false);
    if (firstPlayable) {
      handlePlayTrack(firstPlayable);
    }
  };

  const isTrackPlaying = (track: AlbumTrack) => {
    return currentSong?.title === track.title && isPlaying;
  };

  return (
    <div className="fixed inset-0 z-[200] flex h-screen w-screen bg-[#1f1f1f] text-white overflow-hidden font-sans">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main content */}
      <main className="flex-1 overflow-hidden md:ml-[260px]">
        <div className="relative h-full overflow-y-auto scrollbar-hide">
          {/* Back button */}
          <div className="sticky top-0 z-10 flex items-center px-6 py-4 md:px-8 bg-[#1f1f1f]/80 backdrop-blur-md">
            <button
              onClick={onClose}
              className="flex items-center gap-1 text-[13px] font-medium text-white/60 transition-colors hover:text-white"
            >
              <ChevronLeft size={18} />
              <span>返回</span>
            </button>
          </div>

          {/* ===== Section 1: Album Header ===== */}
          <section className="px-6 md:px-8 pb-6">
            <div className="flex flex-col md:flex-row gap-6 md:gap-[34px]">
              {/* Album Cover - 270x270, NO border radius */}
              <div className="flex-shrink-0">
                <div
                  className="overflow-hidden border-0"
                  style={{ width: '270px', height: '270px', borderRadius: 0 }}
                >
                  <img
                    src={effectiveAlbum.cover}
                    alt={effectiveAlbum.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>

              {/* Headings + Description + Actions */}
              <div className="flex flex-col min-w-0 flex-1">
                {/* Title with inline E badge */}
                <h1 className="mb-0.5 text-[26px] font-bold leading-[30px] text-white/90 tracking-tight">
                  {effectiveAlbum.title}
                  <ExplicitBadge />
                </h1>

                {/* Artist link - pink, 26px, font-weight 400 */}
                <div className="mb-1">
                  <a className="text-[26px] font-normal text-[#fa586a] hover:underline cursor-pointer">
                    {effectiveAlbum.artist}
                  </a>
                </div>

                {/* Metadata (genre · year) below artist */}
                <div className="mb-3 text-[12px] font-semibold text-white/60">
                  {effectiveAlbum.genre} · {effectiveAlbum.year}
                </div>

                {/* Description - 3 lines truncated with 更多 button */}
                <div className="mb-4 max-w-[440px]">
                  <p
                    className="text-[13px] leading-[18px] text-white/60"
                    style={{
                      display: descExpanded ? 'block' : '-webkit-box',
                      WebkitLineClamp: descExpanded ? 'unset' : 3,
                      WebkitBoxOrient: descExpanded ? 'unset' : 'vertical',
                      overflow: descExpanded ? 'visible' : 'hidden',
                    }}
                  >
                    {effectiveAlbum.description}
                    {!descExpanded && (
                      <button
                        onClick={() => setDescExpanded(true)}
                        className="ml-1 text-[11px] font-semibold text-white/90 hover:text-white"
                      >
                        更多
                      </button>
                    )}
                    {descExpanded && (
                      <button
                        onClick={() => setDescExpanded(false)}
                        className="ml-2 text-[11px] font-semibold text-white/90 hover:text-white"
                    >
                        收起
                      </button>
                    )}
                  </p>
                </div>

                {/* Primary actions: 试听 button + Add to library */}
                <div className="flex items-center gap-3">
                  {/* 试听 button - white bg, black text, pill shape */}
                  <button
                    onClick={handlePlayAll}
                    className="flex items-center gap-2 rounded-full bg-white px-3 text-black transition-transform active:scale-95 hover:bg-white/90"
                    style={{ height: '36px', minWidth: '130px', padding: '0 12px' }}
                  >
                    <Play size={16} fill="black" />
                    <span className="text-[15px] font-semibold">试听</span>
                  </button>

                  {/* Add to library button */}
                  <button className="flex h-9 w-9 items-center justify-center rounded-full text-white/70 transition-colors hover:text-white">
                    <Plus size={20} />
                  </button>

                  {/* Share button */}
                  <button className="flex h-7 w-7 items-center justify-center rounded-full text-white/70 transition-colors hover:text-white">
                    <Share size={16} />
                  </button>

                  {/* More button */}
                  <button className="flex h-7 w-7 items-center justify-center rounded-full text-white/70 transition-colors hover:text-white">
                    <MoreHorizontal size={18} />
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* ===== Section 2: Track List ===== */}
          <section className="px-6 md:px-8 pb-4">
            {/* Column header */}
            <div className="flex items-center border-b border-white/[0.08] pb-2 mb-1 text-[12px] font-semibold text-white/60">
              <span className="w-8" />
              <span className="flex-1">歌曲</span>
              <span className="text-right pr-[18px]" style={{ width: '141px' }}>时长</span>
              <span className="w-8" />
            </div>

            {/* Tracks */}
            {effectiveAlbum.tracks.map((track) => {
              const playing = isTrackPlaying(track);
              const canPlay = track.playable !== false;
              return (
                <div
                  key={track.id}
                  className={`group flex items-center transition-colors ${
                    canPlay ? 'hover:bg-white/[0.06] cursor-pointer' : 'cursor-default'
                  } ${
                    playing ? 'bg-white/[0.04]' : ''
                  }`}
                  style={{ height: '46px' }}
                  onClick={() => canPlay && handlePlayTrack(track)}
                >
                  {/* Column 1: Popular dot / track number / play button */}
                  <div className="w-8 flex items-center justify-center flex-shrink-0">
                    {/* Popular dot - shown when not hovering */}
                    {track.popular && (
                      <span
                        className="group-hover:hidden rounded-full bg-white/60"
                        style={{ width: '6px', height: '6px' }}
                      />
                    )}
                    {/* Track number - shown when not popular and not hovering */}
                    {!track.popular && (
                      <span
                        className={`text-[13px] font-normal group-hover:hidden ${
                          playing ? 'text-[#fa586a]' : canPlay ? 'text-white/60' : 'text-white/25'
                        }`}
                      >
                        {track.id}
                      </span>
                    )}
                    {/* Play button - shown on hover */}
                    {canPlay && (
                      <button className="hidden group-hover:flex items-center justify-center text-white/80">
                        {playing ? (
                          <Pause size={14} fill="currentColor" />
                        ) : (
                          <Play size={14} fill="currentColor" className="ml-0.5" />
                        )}
                      </button>
                    )}
                  </div>

                  {/* Column 2: Song title */}
                  <div className="flex-1 min-w-0 flex items-center">
                    <div className="min-w-0">
                      <div
                        className={`flex items-center gap-1 truncate text-[13px] font-normal ${
                          playing ? 'text-[#fa586a]' : canPlay ? 'text-white/90' : 'text-white/25'
                        }`}
                      >
                        <span className="truncate">{track.title}</span>
                        {track.explicit && <ExplicitBadge />}
                      </div>
                      {track.feat && (
                        <div className="truncate text-[12px] text-white/40">
                          {effectiveAlbum.artist} & {track.feat}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Column 3: 试听 text button + duration + more */}
                  <div className="flex items-center justify-end flex-shrink-0" style={{ width: '141px', paddingRight: '18px' }}>
                    {/* 试听 text button - pink, 10px */}
                    {canPlay && (
                      <button
                        className="text-[10px] font-medium text-[#fa586a] hover:underline mr-3"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlayTrack(track);
                        }}
                      >
                        试听
                      </button>
                    )}

                    {/* Duration */}
                    <span className={`text-[13px] font-normal mr-2 ${canPlay ? 'text-white/60' : 'text-white/25'}`}>
                      {track.duration}
                    </span>

                    {/* More button */}
                    {canPlay && (
                      <button
                        className="flex w-6 items-center justify-center text-white/20 opacity-0 transition-all group-hover:opacity-100 hover:text-white/60"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal size={14} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </section>

          {/* ===== Section 3: Copyright Info ===== */}
          <section className="px-6 md:px-8 py-4">
            <div className="text-[12px] text-white/40 leading-[1.8]">
              <div>{effectiveAlbum.releaseDate}</div>
              <div>{effectiveAlbum.trackCount} 首歌曲、{effectiveAlbum.totalDuration}</div>
              <div>{effectiveAlbum.label}</div>
            </div>
          </section>

          {/* ===== Section 5: Other Versions ===== */}
          {effectiveAlbum.otherVersions && effectiveAlbum.otherVersions.length > 0 && (
            <section className="px-6 md:px-8 py-6 bg-[#2b2b2b]" style={{ marginLeft: '-32px', marginRight: '-32px', paddingLeft: '32px', paddingRight: '32px' }}>
              <SectionTitle title="其他版本" />
              <CardShelf items={effectiveAlbum.otherVersions} />
            </section>
          )}

          {/* ===== Section 6: Music Videos ===== */}
          {effectiveAlbum.videos && effectiveAlbum.videos.length > 0 && (
            <section className="px-6 md:px-8 py-6 bg-[#2b2b2b]" style={{ marginLeft: '-32px', marginRight: '-32px', paddingLeft: '32px', paddingRight: '32px' }}>
              <SectionTitle title="音乐视频" />
              <VideoShelf items={effectiveAlbum.videos} />
            </section>
          )}

          {/* ===== Section 7: More from Artist ===== */}
          {effectiveAlbum.moreFromArtist && effectiveAlbum.moreFromArtist.length > 0 && (
            <section className="px-6 md:px-8 py-6 bg-[#2b2b2b]" style={{ marginLeft: '-32px', marginRight: '-32px', paddingLeft: '32px', paddingRight: '32px' }}>
              <SectionTitle title={`更多${effectiveAlbum.artist}的作品`} />
              <CardShelf items={effectiveAlbum.moreFromArtist} />
            </section>
          )}

          {/* ===== Section 8: Appears In ===== */}
          {effectiveAlbum.appearsIn && effectiveAlbum.appearsIn.length > 0 && (
            <section className="px-6 md:px-8 py-6 bg-[#2b2b2b]" style={{ marginLeft: '-32px', marginRight: '-32px', paddingLeft: '32px', paddingRight: '32px' }}>
              <SectionTitle title="出现在以下内容中" />
              <CardShelf items={effectiveAlbum.appearsIn} />
            </section>
          )}

          {/* ===== Section 9: You May Also Like ===== */}
          {effectiveAlbum.youMayAlsoLike && effectiveAlbum.youMayAlsoLike.length > 0 && (
            <section className="px-6 md:px-8 py-6 bg-[#2b2b2b]" style={{ marginLeft: '-32px', marginRight: '-32px', paddingLeft: '32px', paddingRight: '32px' }}>
              <SectionTitle title="你可能也喜欢" />
              <CardShelf items={effectiveAlbum.youMayAlsoLike} />
            </section>
          )}

          {/* Bottom spacing */}
          <div className="h-24" />
        </div>
      </main>
    </div>
  );
}
