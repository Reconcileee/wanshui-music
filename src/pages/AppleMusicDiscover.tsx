import { useCallback, useState } from 'react';
import {
  Music,
  Search,
  Home,
  Compass,
  Radio,
  ExternalLink,
  Shuffle,
  SkipBack,
  Play,
  Pause,
  SkipForward,
  Repeat,
  ListMusic,
  MoreHorizontal,
  Volume2,
  ChevronRight,
  MoreVertical,
  Clock,
  User,
  Disc,
  PlusCircle,
  X,
  Mic2,
} from 'lucide-react';
import { useMusicStore } from '@/store/useMusicStore';
import { useAuthStore } from '@/store/useAuthStore';
import LiquidGlassBox from '@/components/LiquidGlassBox';
import { useGlassParams } from '@/store/useGlassParams';

// ---- Mock Data ----
const FEATURED = [
  {
    label: '新增专辑',
    title: '太阳之子',
    artist: '周杰伦',
    desc: '周杰伦信手拈来过去 25 年的经典创作元素，分享专辑幕后故事。',
    cover: 'https://is1-ssl.mzstatic.com/image/thumb/Features126/v4/72/8c/72/728c72d9-7c5f-4d0a-8c8f-5c5f5c5f5c5f/source/800x500bb.jpg',
  },
  {
    label: '新专辑',
    title: 'you seem pretty sad for a girl so in love',
    artist: 'Olivia Rodrigo',
    desc: '更成熟也更坦诚的流行创作，以双篇章结构映照爱的甜蜜与不安。',
    cover: 'https://is1-ssl.mzstatic.com/image/thumb/Features126/v4/72/8c/72/728c72d9-7c5f-4d0a-8c8f-5c5f5c5f5c5f/source/800x500bb.jpg',
  },
  {
    label: '歌单已更新',
    title: 'A-List：国语流行',
    artist: 'Apple Music 国语流行',
    desc: '好友戴佩妮执笔，弦乐缓缓铺展，A-Lin 娓娓道来《一个人》的绵长心事。',
    cover: 'https://is1-ssl.mzstatic.com/image/thumb/Features126/v4/72/8c/72/728c72d9-7c5f-4d0a-8c8f-5c5f5c5f5c5f/source/800x500bb.jpg',
  },
];

const STARS = [
  { title: '万能青年旅店现场原声', subtitle: 'Apple Music 现场录音', cover: 'https://picsum.photos/seed/star1/400/400' },
  { title: '滑到海底说爱你', subtitle: 'Single · 万能青年旅店', cover: 'https://picsum.photos/seed/star2/400/400' },
  { title: 'I.God', subtitle: 'XLOV', cover: 'https://picsum.photos/seed/star3/400/400' },
  { title: 'TAB! - Single', subtitle: 'XONARA', cover: 'https://picsum.photos/seed/star4/400/400' },
  { title: 'Nowaveee...', subtitle: 'Single · KACHAIN', cover: 'https://picsum.photos/seed/star5/400/400' },
  { title: 'Terima Kasih', subtitle: 'Single · Naura Ayu', cover: 'https://picsum.photos/seed/star6/400/400' },
];

const SONGS = [
  { title: 'stupid song', artist: 'Olivia Rodrigo', album: 'you seem pretty sad', cover: 'https://picsum.photos/seed/song1/100/100' },
  { title: 'I Knew It, I Knew You', artist: 'Taylor Swift', album: 'Midnights', cover: 'https://picsum.photos/seed/song2/100/100' },
  { title: 'Somewhere In Winter', artist: '火星电台, 娄坚家', album: '失重三部曲', cover: 'https://picsum.photos/seed/song3/100/100' },
  { title: '旋钮', artist: 'Gareth.T', album: '旋钮', cover: 'https://picsum.photos/seed/song4/100/100' },
  { title: '达拉崩吧 - Live', artist: '周深, 五月天', album: '歌手 2026', cover: 'https://picsum.photos/seed/song5/100/100' },
  { title: '遂城梦', artist: '陈依纱', album: '遂城梦', cover: 'https://picsum.photos/seed/song6/100/100' },
  { title: '借过一下 (Live)', artist: '胡彦斌, Jony J', album: '乘风 2026', cover: 'https://picsum.photos/seed/song7/100/100' },
  { title: '水葱', artist: '琥珀', album: '琥珀', cover: 'https://picsum.photos/seed/song8/100/100' },
];

const NEW_RELEASES = [
  { title: 'you seem pretty sad for a girl so in love', subtitle: 'Olivia Rodrigo', cover: 'https://picsum.photos/seed/new1/400/400' },
  { title: 'I Knew It, I Knew You - Single', subtitle: 'Taylor Swift', cover: 'https://picsum.photos/seed/new2/400/400' },
  { title: '乘风2026 (第9期 Live)', subtitle: '乘风2026', cover: 'https://picsum.photos/seed/new3/400/400' },
  { title: 'Come Over - Single', subtitle: '防弹少年团', cover: 'https://picsum.photos/seed/new4/400/400' },
  { title: '失重三部曲 - Single', subtitle: '火星电台', cover: 'https://picsum.photos/seed/new5/400/400' },
  { title: '歌手 2026 (第3期 Live)', subtitle: 'EP', cover: 'https://picsum.photos/seed/new6/400/400' },
];

const NEW_POSTS = [
  { title: '每日热歌', subtitle: 'Apple Music', cover: 'https://picsum.photos/seed/post1/400/400' },
  { title: '独家首发', subtitle: 'Apple Music', cover: 'https://picsum.photos/seed/post2/400/400' },
  { title: '精选歌单', subtitle: 'Apple Music', cover: 'https://picsum.photos/seed/post3/400/400' },
  { title: '音乐电影', subtitle: 'Apple Music', cover: 'https://picsum.photos/seed/post4/400/400' },
  { title: '经典回顾', subtitle: 'Apple Music', cover: 'https://picsum.photos/seed/post5/400/400' },
  { title: '电子音乐', subtitle: 'Apple Music', cover: 'https://picsum.photos/seed/post6/400/400' },
];

// ---- Sidebar ----
function Sidebar({ activeTab }: { activeTab: string }) {
  const openLoginModal = useAuthStore((s) => s.openLoginModal);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const username = useAuthStore((s) => s.username);
  const logout = useAuthStore((s) => s.logout);
  
  const mainNavItems = [
    { id: 'home', label: '主页', icon: Home },
    { id: 'discover', label: '新发现', icon: Compass },
    { id: 'radio', label: '广播', icon: Radio },
  ];

  const libraryItems = [
    { id: 'recent', label: '最近添加', icon: Clock },
    { id: 'artists', label: '艺人', icon: User },
    { id: 'albums', label: '专辑', icon: Disc },
    { id: 'songs', label: '歌曲', icon: ListMusic },
  ];

  return (
    // 侧栏悬浮在背景之上，四周留白，圆角
    <aside 
      className="flex flex-col overflow-hidden"
      style={{
        position: 'fixed',
        top: '12px',
        left: '12px',
        bottom: '12px',
        width: '232px',
        borderRadius: '20px',
        // 使用 #232324 颜色，有一点透明度
        background: 'rgba(35, 35, 36, 0.85)',
        // backdrop-filter 模糊和饱和度
        backdropFilter: 'blur(40px) saturate(1.4)',
        WebkitBackdropFilter: 'blur(40px) saturate(1.4)',
        // 边框
        border: '1px solid rgba(255, 255, 255, 0.08)',
        // 外部阴影
        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.18)',
        // 防止内容溢出
        isolation: 'isolate',
        zIndex: 10,
      }}
    >
      {/* 内部阴影层 - 模拟玻璃边缘 */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          borderRadius: 'inherit',
          boxShadow: 'inset 0 0 20px -5px rgba(255, 255, 255, 0.08)',
        }}
      />
      
      {/* 内容区域 */}
      <div className="relative flex-1 overflow-y-auto scrollbar-hide pt-5 px-3 pb-4">
        {/* Logo */}
        <div className="mb-6 flex items-center gap-2.5 px-3">
          <Music size={24} className="text-[#fa2d48]" />
          <span className="text-[17px] font-bold text-white tracking-tight">Music</span>
        </div>

        {/* Search */}
        <div className="mb-5 flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13px] text-white/50 transition-colors hover:bg-white/[0.06] hover:text-white">
          <Search size={16} />
          <span>搜索</span>
        </div>

        {/* Main Navigation */}
        <nav className="mb-6">
          <div className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.06em] text-white/30">探索</div>
          {mainNavItems.map((item) => (
            <a
              key={item.id}
              href="#"
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-colors ${
                activeTab === item.id
                  ? 'bg-[#fa2d48]/15 text-[#fa2d48]'
                  : 'text-white/60 hover:bg-white/[0.04] hover:text-white'
              }`}
            >
              <item.icon size={16} />
              <span>{item.label}</span>
            </a>
          ))}
        </nav>

        {/* Library */}
        <nav className="mb-6">
          <div className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.06em] text-white/30">资料库</div>
          {libraryItems.map((item) => (
            <a
              key={item.id}
              href="#"
              className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13px] font-medium text-white/60 transition-colors hover:bg-white/[0.04] hover:text-white"
            >
              <item.icon size={16} />
              <span>{item.label}</span>
            </a>
          ))}
        </nav>

        {/* Playlists */}
        <nav>
          <div className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.06em] text-white/30">歌单</div>
          <a href="#" className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13px] font-medium text-white/60 transition-colors hover:bg-white/[0.04] hover:text-white">
            <PlusCircle size={16} />
            <span>新建歌单</span>
          </a>
          {/* 示例歌单 */}
          <a href="#" className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium text-white/50 transition-colors hover:bg-white/[0.04] hover:text-white/70">
            <span className="ml-6">喜欢的歌曲</span>
          </a>
          <a href="#" className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium text-white/50 transition-colors hover:bg-white/[0.04] hover:text-white/70">
            <span className="ml-6">我的最爱</span>
          </a>
        </nav>
      </div>

      {/* Footer */}
      <div className="relative flex-shrink-0 pt-3 px-3 border-t border-[rgba(255,255,255,0.08)]">
        <a href="#" className="mb-2.5 flex items-center gap-1.5 rounded-lg px-3 py-2 text-[12px] text-white/50 transition-colors hover:text-white">
          <ExternalLink size={14} />
          <span>在"音乐"中打开</span>
        </a>
        {isLoggedIn ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 px-4 py-2.5 text-[13px] text-white/80">
              <User size={16} />
              <span>{username}</span>
            </div>
            <button 
              onClick={logout}
              className="rounded-lg bg-white/10 px-3 py-2 text-[12px] font-medium text-white/70 transition-colors hover:bg-white/15 hover:text-white"
            >
              退出
            </button>
          </div>
        ) : (
          <button 
            onClick={openLoginModal}
            className="w-full rounded-lg bg-[#fa2d48] px-4 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#e0263f]"
          >
            登录
          </button>
        )}
      </div>
    </aside>
  );
}

// ---- Featured Card ----
function FeaturedCard({ item }: { item: (typeof FEATURED)[0] }) {
  return (
    <div className="group relative cursor-pointer overflow-hidden rounded-xl" style={{ aspectRatio: '16/10' }}>
      {/* 背景图片 */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-[transform,filter] duration-500 group-hover:scale-[1.02] group-hover:brightness-[0.9]"
        style={{ backgroundImage: `url('${item.cover}')` }}
      />
      {/* 渐变遮罩 */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/80" />
      {/* 悬停时的播放按钮 */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <button className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-lg transition-transform hover:scale-105 active:scale-95">
          <Play size={24} fill="black" className="ml-0.5" />
        </button>
      </div>
      {/* 底部信息 */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#fa2d48]">{item.label}</div>
        <div className="mb-1 text-[17px] font-bold leading-tight text-white">{item.title}</div>
        <div className="mb-2 text-[14px] text-white/80">{item.artist}</div>
        <div className="line-clamp-2 text-[13px] leading-[1.4] text-white/60">{item.desc}</div>
      </div>
    </div>
  );
}

// ---- Small Card ----
function SmallCard({ item, onClick }: { item: { title: string; subtitle: string; cover: string }; onClick?: () => void }) {
  return (
    <div className="group cursor-pointer transition-transform duration-200 hover:-translate-y-1" onClick={onClick}>
      <div className="mb-2.5 aspect-square overflow-hidden rounded-[12px] bg-white/[0.06] relative">
        <img src={item.cover} alt={item.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-400 group-hover:scale-[1.08]" />
        {/* 悬停播放按钮 */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-md transition-transform hover:scale-110 active:scale-90">
            <Play size={18} fill="black" className="ml-0.5" />
          </button>
        </div>
      </div>
      <div className="truncate text-[13px] font-semibold text-white">{item.title}</div>
      <div className="truncate text-[12px] text-white/50">{item.subtitle}</div>
    </div>
  );
}

// ---- Song Row ----
function SongRow({ song, onClick }: { song: (typeof SONGS)[0]; onClick?: () => void }) {
  return (
    <div className="group grid cursor-pointer grid-cols-[44px_1fr_1fr_1fr_32px] items-center gap-4 rounded-lg px-4 py-2.5 transition-colors hover:bg-white/[0.06]" onClick={onClick}>
      <div className="h-11 w-11 overflow-hidden rounded-lg relative">
        <img src={song.cover} alt={song.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.05]" />
        {/* 悬停播放按钮 */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <Play size={14} fill="white" className="ml-0.5" />
        </div>
      </div>
      <div className="truncate text-[14px] font-medium text-white">{song.title}</div>
      <div className="truncate text-[13px] text-white/60">{song.artist}</div>
      <div className="truncate text-[13px] text-white/40">{song.album}</div>
      <button className="flex h-7 w-7 items-center justify-center rounded-full text-white/30 transition-colors hover:bg-white/[0.1] hover:text-white" onClick={(e) => e.stopPropagation()}>
        <MoreVertical size={16} />
      </button>
    </div>
  );
}

// ---- Section Header ----
function SectionHeader({ title }: { title: string }) {
  return (
    <div className="mb-3.5 flex items-center justify-between">
      <h2 className="text-lg font-bold tracking-tight">{title}</h2>
      <a href="#" className="text-xl text-white/50 transition-colors hover:text-white">
        <ChevronRight size={20} />
      </a>
    </div>
  );
}

// ---- Search Bar ----
function SearchBar() {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);

  return (
    <div className={`relative flex items-center gap-2 rounded-xl px-4 py-3 transition-all duration-300 ${focused ? 'bg-white/[0.12]' : 'bg-white/[0.06]'}`}>
      <Search size={18} className="text-white/50" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="搜索歌曲、艺人、专辑..."
        className="flex-1 bg-transparent text-[14px] text-white placeholder:text-white/40 outline-none"
      />
      {query && (
        <button onClick={() => setQuery('')} className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-white/50 hover:bg-white/20 hover:text-white">
          <X size={12} />
        </button>
      )}
    </div>
  );
}

// ---- Player Bar ----
function PlayerBar({ onOpenLyrics }: { onOpenLyrics?: () => void }) {
  const { isPlaying, currentSong, toggle, next, prev } = useMusicStore();
  const { params } = useGlassParams();

  return (
    <div className="fixed bottom-4 left-1/2 z-[100] -translate-x-1/2 w-[calc(100%-32px)] max-w-[720px]">
      <LiquidGlassBox
        className="w-full"
        style={{ height: '72px', borderRadius: 20 }}
        effect="clear"
        interactive
        animated
        animationDuration={300}
        options={{
          radius: 20,
          glassThickness: params.glassThickness,
          bezelWidth: params.bezelWidth,
          ior: params.ior,
          scaleRatio: params.scaleRatio,
          blurAmount: 0.3,
          specularOpacity: 0.3,
          shape: params.shape,
          superellipseN: params.superellipseN,
        }}
        visualOptions={{
          shadowBlur: params.shadowBlur,
          shadowSpread: params.shadowSpread,
          outerShadowBlur: params.outerShadowBlur,
          tintOpacity: 0.02,
        }}
      >
        <div className="flex h-full items-center px-3 sm:px-5 min-w-0">
          {/* Left Controls */}
          <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
            <button className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full text-white/50 transition-colors hover:bg-white/[0.08] hover:text-white" onClick={() => {}}>
              <Shuffle size={16} />
            </button>
            <button className="flex h-8 sm:h-9 w-8 sm:w-9 items-center justify-center rounded-full text-white/50 transition-colors hover:bg-white/[0.08] hover:text-white" onClick={prev}>
              <SkipBack size={16} fill="currentColor" />
            </button>
            <button
              className="flex h-10 sm:h-11 w-10 sm:w-11 items-center justify-center rounded-full bg-white text-black shadow-lg transition-transform hover:scale-[1.08] active:scale-[0.95]"
              onClick={toggle}
            >
              {isPlaying ? <Pause size={18} fill="black" /> : <Play size={18} fill="black" className="ml-0.5" />}
            </button>
            <button className="flex h-8 sm:h-9 w-8 sm:w-9 items-center justify-center rounded-full text-white/50 transition-colors hover:bg-white/[0.08] hover:text-white" onClick={next}>
              <SkipForward size={16} fill="currentColor" />
            </button>
            <button className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full text-white/50 transition-colors hover:bg-white/[0.08] hover:text-white" onClick={() => {}}>
              <Repeat size={16} />
            </button>
          </div>

          {/* Album + Track Info */}
          <div className="flex items-center gap-2 sm:gap-3.5 ml-2 sm:ml-6 flex-shrink-0 min-w-0">
            <div className="h-10 sm:h-12 w-10 sm:w-12 overflow-hidden rounded-lg flex-shrink-0 shadow-md">
              <img src={currentSong?.cover || 'https://picsum.photos/seed/default/100/100'} alt="cover" className="h-full w-full object-cover" />
            </div>
            <div className="overflow-hidden min-w-0">
              <div className="truncate text-[13px] sm:text-[14px] font-semibold text-white leading-tight">{currentSong?.title || 'THE RULES'}</div>
              <div className="truncate text-[11px] sm:text-[12px] text-white/60 leading-tight">{currentSong?.artist || 'XLOV — I,God'}</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="flex-1 min-w-[40px] sm:min-w-[80px] mx-2 sm:mx-6">
            <div className="flex items-center gap-1 sm:gap-2">
              <span className="hidden sm:block text-[11px] text-white/40 font-medium w-[36px]">0:00</span>
              <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full w-[35%] bg-white/60 rounded-full"></div>
              </div>
              <span className="hidden sm:block text-[11px] text-white/40 font-medium w-[36px]">3:45</span>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
            {/* 歌词按钮 */}
            <button 
              className="flex h-8 sm:h-9 w-8 sm:w-9 items-center justify-center rounded-full text-white/50 transition-colors hover:bg-white/[0.08] hover:text-white"
              onClick={onOpenLyrics}
              title="歌词"
            >
              <Mic2 size={16} />
            </button>
            <span className="hidden sm:block px-2.5 py-1 rounded-full bg-[#fa2d48]/20 text-[11px] text-[#fa2d48] font-semibold">试听</span>
            <button className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full text-white/50 transition-colors hover:bg-white/[0.08] hover:text-white">
              <MoreHorizontal size={18} />
            </button>
            <button className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full text-white/50 transition-colors hover:bg-white/[0.08] hover:text-white">
              <ListMusic size={18} />
            </button>
            <button className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full text-white/50 transition-colors hover:bg-white/[0.08] hover:text-white">
              <Volume2 size={18} />
            </button>
          </div>
        </div>
      </LiquidGlassBox>
    </div>
  );
}

// ---- Main Page ----
export default function AppleMusicDiscover({ onOpenLyrics }: { onOpenLyrics?: () => void }) {
  const playSong = useMusicStore((s) => s.playSong);
  const playlist = useMusicStore((s) => s.playlist);

  const handlePlay = useCallback(
    (index: number) => {
      if (index < playlist.length) {
        playSong(index);
      }
    },
    [playSong, playlist]
  );

  return (
    <div className="flex h-screen w-screen bg-[#1F1F1F] text-white overflow-hidden font-sans">
      {/* 侧栏现在是 fixed 定位，悬浮在背景之上 */}
      <Sidebar activeTab="discover" />

      {/* 主内容区域 - 需要留出侧栏的空间 */}
      <main className="flex-1 overflow-hidden pb-20 animate-page-enter" style={{ marginLeft: '256px' }}>
        <div className="h-full overflow-y-auto px-8 py-7 pb-12 scrollbar-hide">
          <h1 className="mb-4 text-[30px] font-bold tracking-tight">新发现</h1>
          
          {/* Search Bar */}
          <div className="mb-8">
            <SearchBar />
          </div>

          {/* Featured */}
          <section className="mb-10">
            <div className="grid grid-cols-3 gap-5">
              {FEATURED.map((item, i) => (
                <div key={item.title} className={`animate-card-enter animate-stagger-${i + 1}`}>
                  <FeaturedCard item={item} />
                </div>
              ))}
            </div>
          </section>

          {/* Stars */}
          <section className="mb-10">
            <SectionHeader title="瞩目之星" />
            <div className="grid grid-cols-6 gap-4">
              {STARS.map((item, i) => (
                <div key={item.title} className={`animate-card-enter animate-stagger-${i + 1}`}>
                  <SmallCard item={item} onClick={() => handlePlay(0)} />
                </div>
              ))}
            </div>
          </section>

          {/* Song List */}
          <section className="mb-10">
            <SectionHeader title="新歌精选" />
            <div className="flex flex-col">
              {SONGS.map((song, i) => (
                <div key={song.title} className={`animate-card-enter animate-stagger-${(i % 6) + 1}`}>
                  <SongRow song={song} onClick={() => handlePlay(i % playlist.length)} />
                </div>
              ))}
            </div>
          </section>

          {/* New Releases */}
          <section className="mb-10">
            <SectionHeader title="本周新发行" />
            <div className="grid grid-cols-6 gap-4">
              {NEW_RELEASES.map((item, i) => (
                <div key={item.title} className={`animate-card-enter animate-stagger-${i + 1}`}>
                  <SmallCard item={item} onClick={() => handlePlay(0)} />
                </div>
              ))}
            </div>
          </section>

          {/* New Posts */}
          <section className="mb-10">
            <SectionHeader title="新发布" />
            <div className="grid grid-cols-6 gap-4">
              {NEW_POSTS.map((item, i) => (
                <div key={item.title} className={`animate-card-enter animate-stagger-${i + 1}`}>
                  <SmallCard item={item} onClick={() => handlePlay(0)} />
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <PlayerBar onOpenLyrics={onOpenLyrics} />
    </div>
  );
}
