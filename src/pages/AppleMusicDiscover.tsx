import { useCallback, useState, useRef, useLayoutEffect } from 'react';
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
  Trash2,
  Edit2,
  Check,
  PlayCircle,
  TrendingUp,
} from 'lucide-react';
import { useMusicStore, UserPlaylist } from '@/store/useMusicStore';
import { useAuthStore } from '@/store/useAuthStore';
import { Song } from '@/types';
import LiquidGlassBox from '@/components/LiquidGlassBox';
import { useGlassParams } from '@/store/useGlassParams';
import BottomNav from '@/components/BottomNav';
import { OLIVIA_ALBUM, SHOUDU_ALBUM, type AlbumData } from '@/pages/AlbumPage';

// ---- Mock Data (Apple Music 风格) ----
const FEATURED = [
  {
    label: '新增专辑',
    title: '太阳之子',
    artist: '周杰伦',
    desc: '周杰伦信手拈来过去 25 年的经典创作元素，分享专辑幕后故事。',
    cover: 'https://is1-ssl.mzstatic.com/image/thumb/Features126/v4/72/8c/72/728c72d9-7c5f-4d0a-8c8f-5c5f5c5f5c5f/source/800x500bb.jpg',
    thumbnail: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/4d/4f/5e/4d4f5e1e-3b7f-7c5f-4d0a-8c8f-5c5f5c5f5c5f/24UM1IM08507.rgb.jpg/120x120bb.webp',
  },
  {
    label: '新专辑',
    title: 'you seem pretty sad for a girl so in love',
    artist: 'Olivia Rodrigo',
    desc: '更成熟也更坦诚的流行创作，以双篇章结构映照爱的甜蜜与不安。',
    cover: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/1d/1b/f9/1d1bf9b1-44c6-9a6c-6ffb-c158488c06ce/26UMGIM39303.rgb.jpg/800x500bb.jpg',
    thumbnail: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/1d/1b/f9/1d1bf9b1-44c6-9a6c-6ffb-c158488c06ce/26UMGIM39303.rgb.jpg/120x120bb.webp',
  },
  {
    label: '歌单已更新',
    title: 'A-List：国语流行',
    artist: 'Apple Music 国语流行',
    desc: '好友戴佩妮执笔，弦乐缓缓铺展，A-Lin 娓娓道来《一个人》的绵长心事。',
    cover: 'https://is1-ssl.mzstatic.com/image/thumb/Features115/v4/d3/0a/d3/d30ad392-142d-2d60-f721-16028ae68ebb/dj.lmoukelr.jpg/800x500bb.jpg',
    thumbnail: 'https://is1-ssl.mzstatic.com/image/thumb/Features115/v4/d3/0a/d3/d30ad392-142d-2d60-f721-16028ae68ebb/dj.lmoukelr.jpg/120x120bb.webp',
  },
];

const NEW_SONGS = [
  { title: 'the cure', artist: 'Olivia Rodrigo', cover: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/1d/1b/f9/1d1bf9b1-44c6-9a6c-6ffb-c158488c06ce/26UMGIM39303.rgb.jpg/96x96bb.webp' },
  { title: 'WDA (Whole Different Animal) [feat. G-DRAGON]', artist: 'aespa', cover: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/00/1d/e6/001de64e-c2f1-fd4b-3604-3d2e16641968/888735955211.png/96x96bb.webp' },
  { title: 'hate that i made you love me', artist: 'Ariana Grande', cover: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/56/f4/96/56f49612-02dd-83f4-44fe-d2118cc70707/26UMGIM51129.rgb.jpg/96x96bb.webp' },
  { title: 'BOOMPALA', artist: 'LE SSERAFIM', cover: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/b8/0c/98/b80c980c-52c6-a180-ff3e-2afaaab75fdd/823375107286_Cover.jpg/96x96bb.webp' },
  { title: 'Janice STFU', artist: 'Drake', cover: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/35/b9/06/35b90629-a873-14f8-4789-ffc324960038/26UMGIM63614.rgb.jpg/96x96bb.webp' },
  { title: 'Don\'t Break My Heart', artist: '黑豹乐队', cover: 'https://is1-ssl.mzstatic.com/image/thumb/Features115/v4/d3/0a/d3/d30ad392-142d-2d60-f721-16028ae68ebb/dj.lmoukelr.jpg/96x96bb.webp' },
  { title: '最佳损友', artist: '陈奕迅', cover: 'https://is1-ssl.mzstatic.com/image/thumb/Music118/v4/a4/fa/86/a4fa86d6-c23a-c37f-1251-00376ff144cd/00602498378830.rgb.jpg/96x96bb.webp' },
  { title: '阴天', artist: '莫文蔚', cover: 'https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/81/cc/52/81cc5224-3ace-5e3c-468a-17b4b71da831/dj.aqolbuce.jpg/96x96bb.webp' },
  { title: '连名带姓', artist: '张惠妹', cover: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/4a/ea/32/4aea3283-2bcf-c075-ad2d-c48bf6e19dcd/cover.jpg/96x96bb.webp' },
  { title: '首都', artist: '罗大佑', cover: import.meta.env.BASE_URL + 'musics/首都/首都_cover.jpg' },
  { title: '一样的月光', artist: '徐佳莹', cover: 'https://is1-ssl.mzstatic.com/image/thumb/Music6/v4/43/52/5e/43525e86-9c47-cb57-5ca5-a374aa7afa40/LaLa.jpg/96x96bb.webp' },
];

const NEW_ALBUMS = [
  { title: 'Official FIFA World Cup 2026™ Album', subtitle: 'Various Artists', cover: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/68/4a/84/684a84c9-f6e3-ca17-d516-ee01a88c32ca/26UMGIM68511.rgb.jpg/632x632bf.webp' },
  { title: '首都', subtitle: '罗大佑', cover: import.meta.env.BASE_URL + 'musics/albums/罗大佑/首都_cover.jpg' },
  { title: '4WARD - EP', subtitle: 'MAMAMOO', cover: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/56/ca/63/56ca63e3-7b54-5953-2d8c-c5bd745e0d93/cover_KM0024723_1.jpg/632x632bf.webp' },
  { title: 'petal', subtitle: 'Ariana Grande', cover: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/7e/e6/82/7ee682bd-1b17-6adc-be63-b5af1bdff369/26UMGIM51126.rgb.jpg/632x632bf.webp' },
  { title: 'Oh yeah?', subtitle: 'Steve Lacy', cover: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/1c/b2/46/1cb246db-afae-a599-d377-44a7ea7267fa/196874346976.jpg/632x632bf.webp' },
  { title: 'Daughter from Hell', subtitle: 'Gracie Abrams', cover: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/4f/13/47/4f1347cf-9564-e8b6-523a-386202f4d265/26UMGIM54147.rgb.jpg/632x632bf.webp' },
];

const PLAYLISTS = [
  { title: 'Teen Pop 金曲', subtitle: 'Apple Music', cover: 'https://is1-ssl.mzstatic.com/image/thumb/Features115/v4/bc/95/4b/bc954b7e-be33-8f66-5679-9fd65b3af65b/U0MtTVMtV1ctVGVlbl9Qb3BfSGl0c18tQURBTV9JRD05NzY0NjUzNjAucG5n.png/632x632SC.DN01.webp?l=zh-Hans' },
  { title: '温习经典：K-Pop', subtitle: 'Apple Music K-Pop', cover: 'https://is1-ssl.mzstatic.com/image/thumb/Features115/v4/65/a7/ea/65a7ea35-4c90-389d-27d6-1b3f6937cee4/U0MtTVMtV1ctSy1Qb3BfVGhyb3ViYWNrLUFEQU1fSUQ9MTM3MjQxMTUyNC5wbmc.png/632x632SC.DN01.webp?l=zh-Hans' },
  { title: '欢乐流行', subtitle: 'Apple Music 愉快', cover: 'https://is1-ssl.mzstatic.com/image/thumb/Features122/v4/0a/da/f6/0adaf638-daba-b86c-51c9-2e24d16f6ae8/aa9d358d-5ab5-4e83-83d1-af4cc92f29db.png/632x632SC.DN01.webp?l=zh-Hans' },
  { title: '网络热播：R&B', subtitle: 'Apple Music', cover: 'https://is1-ssl.mzstatic.com/image/thumb/Features221/v4/b7/07/24/b707244c-d4ad-a0c7-d85b-7db81ebe1e0a/31764784-336b-44e7-8827-74ead3ae456c.png/632x632SC.DN01.webp?l=zh-Hans' },
  { title: '每日热歌', subtitle: 'Apple Music', cover: 'https://is1-ssl.mzstatic.com/image/thumb/Features126/v4/ac/40/b3/ac40b331-c407-1190-ea71-a9d088ff01f1/c19db56b-dfc8-4250-9e48-ddcbc9a4df41.png/632x632cc.webp' },
  { title: '独家首发', subtitle: 'Apple Music', cover: 'https://is1-ssl.mzstatic.com/image/thumb/Features/v4/23/97/b1/2397b12a-8edd-b5ff-ad5b-97ce074d9a47/fea1deed-c7c4-48fc-b8f0-f4a3b8c39174.png/632x632cc.webp' },
];

const CHARTS = [
  { title: '每周热门 100 首：全球', subtitle: 'Apple Music', cover: 'https://is1-ssl.mzstatic.com/image/thumb/Features126/v4/ac/40/b3/ac40b331-c407-1190-ea71-a9d088ff01f1/c19db56b-dfc8-4250-9e48-ddcbc9a4df41.png/632x632cc.webp' },
  { title: '每周热门 100 首：中国大陆', subtitle: 'Apple Music', cover: 'https://is1-ssl.mzstatic.com/image/thumb/Features/v4/23/97/b1/2397b12a-8edd-b5ff-ad5b-97ce074d9a47/fea1deed-c7c4-48fc-b8f0-f4a3b8c39174.png/632x632cc.webp' },
  { title: '每周热门 100 首：中国香港', subtitle: 'Apple Music', cover: 'https://is1-ssl.mzstatic.com/image/thumb/Features/v4/3a/47/05/3a4705c5-dc1f-b0d7-feac-38b351b2be6a/b6c81967-3c2f-42b5-a6a2-d6cca14d1d4d.png/632x632cc.webp' },
  { title: '每周热门 100 首：韩国', subtitle: 'Apple Music', cover: 'https://is1-ssl.mzstatic.com/image/thumb/Features126/v4/4b/04/1d/4b041d75-374a-3e76-c2dd-7aed9289739f/a86f1cd5-76b4-4f25-af33-f87ca5b5e112.png/632x632cc.webp' },
  { title: '每周热门 100 首：日本', subtitle: 'Apple Music', cover: 'https://is1-ssl.mzstatic.com/image/thumb/Features116/v4/75/f8/11/75f811ec-b420-af7e-12ec-b3139b573639/443d2e19-68bb-4596-a773-2f18a267eb89.png/632x632cc.webp' },
  { title: '每周热门 100 首：美国', subtitle: 'Apple Music', cover: 'https://is1-ssl.mzstatic.com/image/thumb/Features126/v4/2d/e5/fa/2de5faac-f5a8-c5e9-3ef6-0aa05a3923c2/414a7981-3bdb-449d-ab6c-cbbce892ac54.png/632x632cc.webp' },
];

const CITY_CHARTS = [
  { title: 'Top 25：北京', subtitle: 'Apple Music', cover: 'https://is1-ssl.mzstatic.com/image/thumb/Features/v4/fa/41/53/fa41535f-eb69-f828-e24a-9328c6f391c6/41b11cc0-277f-4e4b-973c-d4919d720854.png/632x632cc.webp' },
  { title: 'Top 25：上海', subtitle: 'Apple Music', cover: 'https://is1-ssl.mzstatic.com/image/thumb/Features125/v4/c0/ea/bf/c0eabf98-2e09-098b-646a-7b12aa6bcde4/U0MtTVMtV1ctVG9wXzI1LVNoYW5nYWktQURBTV9JRD0xNTU1OTk0MTUzLnBuZw.png/632x632cc.webp' },
  { title: 'Top 25：广州', subtitle: 'Apple Music', cover: 'https://is1-ssl.mzstatic.com/image/thumb/Features126/v4/e0/9e/4d/e09e4d14-b7e2-ed33-09c1-25b7f8da7b05/U0MtTVMtV1ctVG9wXzI1LUd1YW5nemhvdS1BREFNX0lEPTE1NTU5OTQyNjMucG5n.png/632x632cc.webp' },
  { title: 'Top 25：成都', subtitle: 'Apple Music', cover: 'https://is1-ssl.mzstatic.com/image/thumb/Features/v4/dc/31/eb/dc31eba1-74e2-bdb3-924a-86b8b286904d/7f78ddd8-5242-41b0-b5d7-55c35032bb45.png/632x632cc.webp' },
  { title: 'Top 25：武汉', subtitle: 'Apple Music', cover: 'https://is1-ssl.mzstatic.com/image/thumb/Features/v4/dc/9a/bc/dc9abcf8-c1a9-1abf-aa2d-e0348e0c5a0e/c65fef24-fa68-498a-8990-16f79b181664.png/632x632cc.webp' },
];

const RADIO_STATIONS = [
  { title: 'Ariana Grande', cover: 'https://is1-ssl.mzstatic.com/image/thumb/Features211/v4/81/74/44/817444f8-2ecd-1fe9-2aa5-ed2c97abd473/54c6f259-1e5a-43f8-8bb7-f8b477af2207.png/632x632cc.webp' },
  { title: 'Paul McCartney: The Zane Lowe Interview', cover: 'https://is1-ssl.mzstatic.com/image/thumb/Features211/v4/3a/8c/53/3a8c5357-778c-3d94-7496-65ba606ba3f6/e0be5731-54fc-4315-8f18-d1bd6c531b51.png/632x632cc.webp' },
  { title: 'Lola Young', cover: 'https://is1-ssl.mzstatic.com/image/thumb/Features221/v4/7f/3a/fb/7f3afbdc-90bf-3571-ebe5-b496a9b162fe/1df4d513-7416-4176-848d-b66380cde1bc.png/632x632cc.webp' },
  { title: 'GIVĒON', cover: 'https://is1-ssl.mzstatic.com/image/thumb/Features221/v4/b0/26/1f/b0261fe6-d0c8-295e-4b28-2710ba641ee4/5e0a1c86-41fe-4e35-97d6-50ef71a385c6.png/632x632cc.webp' },
  { title: 'これ聴いてます：Ayase', cover: 'https://is1-ssl.mzstatic.com/image/thumb/Features/v4/8f/da/52/8fda52ae-1a86-2f12-927a-90feb66fa13c/41c8b600-f590-4d01-a7cd-1d4386855266.png/632x632cc.webp' },
  { title: 'Jungle', cover: 'https://is1-ssl.mzstatic.com/image/thumb/Features211/v4/f7/45/49/f74549c2-29ff-8c9a-6214-09c40de8e7f1/3770dc17-8833-4e38-ba36-6073f2e68644.png/632x632cc.webp' },
];

const MUSIC_VIDEOS = [
  { title: 'KUN on His Self-Titled Album, Tour and Influences', artist: '蔡徐坤 · Zane Lowe', cover: 'https://is1-ssl.mzstatic.com/image/thumb/Video221/v4/69/cd/c1/69cdc165-1b9d-a9f7-5ddf-e59e977101d4/TN-MS-WW-Zane_KUN_20260324-AUC_Episode.png/680x382mv.webp' },
  { title: 'BTS: The Zane Lowe Interview', artist: '立即观看', cover: 'https://is1-ssl.mzstatic.com/image/thumb/Video211/v4/48/20/27/482027ab-9e5b-5e96-7119-1aa275d58b46/TN-MS-WW-Zane_BTS-20260117-AUC_Episode.png/680x382mv.webp' },
  { title: 'Lady Gaga on MAYHEM, Harlequin, Tour & New Music', artist: '25 分钟 41 秒', cover: 'https://is1-ssl.mzstatic.com/image/thumb/FuseSocial221/v4/da/72/a6/da72a6b6-16f7-222c-4efc-2bdedbc8b98b/7d60acc21ac9161cb36e53ddbe712570_Preview_Image_Intermediate_nonvideo_421758035_2537429084.png/680x382mv.webp' },
  { title: 'Ariana and Cynthia on the film\'s sensational second act', artist: '10 分钟 38 秒', cover: 'https://is1-ssl.mzstatic.com/image/thumb/FuseSocial221/v4/e8/75/f1/e875f1f5-0080-365e-f132-128a63bb8d2f/8cbe05c0c1a458284fbd04eb3469fe5b_Preview_Image_Intermediate_nonvideo_421740354_2537224923.png/680x382mv.webp' },
];

const SONGS = [
  { title: 'the cure', artist: 'Olivia Rodrigo', album: 'you seem pretty sad', cover: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/1d/1b/f9/1d1bf9b1-44c6-9a6c-6ffb-c158488c06ce/26UMGIM39303.rgb.jpg/96x96bb.webp' },
  { title: 'WDA (Whole Different Animal)', artist: 'aespa', album: 'WDA', cover: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/00/1d/e6/001de64e-c2f1-fd4b-3604-3d2e16641968/888735955211.png/96x96bb.webp' },
  { title: 'hate that i made you love me', artist: 'Ariana Grande', album: 'petal', cover: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/56/f4/96/56f49612-02dd-83f4-44fe-d2118cc70707/26UMGIM51129.rgb.jpg/96x96bb.webp' },
  { title: 'BOOMPALA', artist: 'LE SSERAFIM', album: 'BOOMPALA', cover: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/b8/0c/98/b80c980c-52c6-a180-ff3e-2afaaab75fdd/823375107286_Cover.jpg/96x96bb.webp' },
  { title: '最佳损友', artist: '陈奕迅', album: '最佳损友', cover: 'https://is1-ssl.mzstatic.com/image/thumb/Music118/v4/a4/fa/86/a4fa86d6-c23a-c37f-1251-00376ff144cd/00602498378830.rgb.jpg/96x96bb.webp' },
  { title: '阴天', artist: '莫文蔚', album: '阴天', cover: 'https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/81/cc/52/81cc5224-3ace-5e3c-468a-17b4b71da831/dj.aqolbuce.jpg/96x96bb.webp' },
  { title: '连名带姓', artist: '张惠妹', album: '连名带姓', cover: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/4a/ea/32/4aea3283-2bcf-c075-ad2d-c48bf6e19dcd/cover.jpg/96x96bb.webp' },
  { title: '一样的月光', artist: '徐佳莹', album: '一样的月光', cover: 'https://is1-ssl.mzstatic.com/image/thumb/Music6/v4/43/52/5e/43525e86-9c47-cb57-5ca5-a374aa7afa40/LaLa.jpg/96x96bb.webp' },
];

// ---- Sidebar ----
function Sidebar({ activeTab, onTabChange }: { activeTab: string; onTabChange: (tab: string) => void }) {
  const openLoginModal = useAuthStore((s) => s.openLoginModal);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const username = useAuthStore((s) => s.username);
  const logout = useAuthStore((s) => s.logout);
  
  const userPlaylists = useMusicStore((s) => s.userPlaylists);
  const createPlaylist = useMusicStore((s) => s.createPlaylist);
  const deletePlaylist = useMusicStore((s) => s.deletePlaylist);
  const renamePlaylist = useMusicStore((s) => s.renamePlaylist);
  
  const [showNewPlaylistInput, setShowNewPlaylistInput] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [editingPlaylistId, setEditingPlaylistId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  
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
  
  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim()) {
      createPlaylist(newPlaylistName.trim());
      setNewPlaylistName('');
      setShowNewPlaylistInput(false);
    }
  };
  
  const handleRenamePlaylist = (playlistId: string) => {
    if (editingName.trim()) {
      renamePlaylist(playlistId, editingName.trim());
      setEditingPlaylistId(null);
      setEditingName('');
    }
  };
  
  const handleDeletePlaylist = (playlistId: string) => {
    deletePlaylist(playlistId);
  };

  return (
    <aside 
      className="hidden md:flex flex-col overflow-hidden"
      style={{
        position: 'fixed',
        top: '12px',
        left: '12px',
        bottom: '12px',
        width: '232px',
        borderRadius: '20px',
        background: 'rgba(35, 35, 36, 0.85)',
        backdropFilter: 'blur(40px) saturate(1.4)',
        WebkitBackdropFilter: 'blur(40px) saturate(1.4)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.18)',
        isolation: 'isolate',
        zIndex: 10,
      }}
    >
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          borderRadius: 'inherit',
          boxShadow: 'inset 0 0 20px -5px rgba(255, 255, 255, 0.08)',
        }}
      />
      
      <div className="relative flex-1 overflow-y-auto scrollbar-hide pt-5 px-3 pb-4">
        {/* Logo - Apple Music 风格 */}
        <div className="mb-6 flex items-center gap-2.5 px-3">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="#fa2d48">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.21-1.96 1.07-3.11-1.05.05-2.31.71-3.06 1.64-.68.84-1.27 2.18-1.11 3.29 1.19.09 2.38-.6 3.1-1.82z" />
          </svg>
          <span className="text-[17px] font-bold text-white tracking-tight">Music</span>
        </div>

        {/* Search */}
        <button
          onClick={() => onTabChange('search')}
          className={`mb-5 flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13px] transition-colors ${
            activeTab === 'search' ? 'bg-[#fa2d48]/15 text-[#fa2d48]' : 'text-white hover:bg-white/[0.06]'
          }`}
        >
          <Search size={16} />
          <span>搜索</span>
        </button>

        {/* Main Navigation */}
        <nav className="mb-6">
          {mainNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-colors w-full ${
                activeTab === item.id
                  ? 'bg-[#fa2d48]/15 text-[#fa2d48]'
                  : 'text-white hover:bg-white/[0.04]'
              }`}
            >
              <item.icon size={16} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Library */}
        <nav className="mb-6">
          <div className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.06em] text-white/30">资料库</div>
          {libraryItems.map((item) => (
            <a
              key={item.id}
              href="#"
              className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-white/[0.04]"
            >
              <item.icon size={16} />
              <span>{item.label}</span>
            </a>
          ))}
        </nav>

        {/* Playlists */}
        <nav>
          <div className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.06em] text-white/30">歌单</div>
          
          {isLoggedIn && (
            <>
              {showNewPlaylistInput ? (
                <div className="mb-1 px-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newPlaylistName}
                      onChange={(e) => setNewPlaylistName(e.target.value)}
                      placeholder="歌单名称"
                      className="flex-1 rounded-lg px-2 py-1.5 text-[13px] text-white bg-white/[0.08] outline-none"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleCreatePlaylist();
                        if (e.key === 'Escape') {
                          setShowNewPlaylistInput(false);
                          setNewPlaylistName('');
                        }
                      }}
                    />
                    <button
                      onClick={handleCreatePlaylist}
                      className="flex h-6 w-6 items-center justify-center rounded-full bg-[#fa2d48] text-white"
                    >
                      <Check size={12} />
                    </button>
                    <button
                      onClick={() => {
                        setShowNewPlaylistInput(false);
                        setNewPlaylistName('');
                      }}
                      className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-white/60"
                    >
                      <X size={12} />
                    </button>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => setShowNewPlaylistInput(true)}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-white/[0.04] w-full"
                >
                  <PlusCircle size={16} />
                  <span>新建歌单</span>
                </button>
              )}
            </>
          )}
          
          {isLoggedIn && userPlaylists.map((playlist: UserPlaylist) => (
            <div key={playlist.id} className="group flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/[0.04]">
              {editingPlaylistId === playlist.id ? (
                <div className="flex items-center gap-2 flex-1">
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="flex-1 rounded px-2 py-1 text-[13px] text-white bg-white/[0.08] outline-none"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleRenamePlaylist(playlist.id);
                      if (e.key === 'Escape') {
                        setEditingPlaylistId(null);
                        setEditingName('');
                      }
                    }}
                  />
                  <button
                    onClick={() => handleRenamePlaylist(playlist.id)}
                    className="flex h-5 w-5 items-center justify-center rounded-full bg-[#fa2d48] text-white"
                  >
                    <Check size={10} />
                  </button>
                </div>
              ) : (
                <>
                  <a href="#" className="flex-1 text-[13px] font-medium text-white/70 transition-colors hover:text-white truncate">
                    <span className="ml-6">{playlist.name}</span>
                  </a>
                  {playlist.id !== 'favorites' && (
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          setEditingPlaylistId(playlist.id);
                          setEditingName(playlist.name);
                        }}
                        className="flex h-5 w-5 items-center justify-center rounded-full text-white/40 hover:text-white"
                      >
                        <Edit2 size={10} />
                      </button>
                      <button
                        onClick={() => handleDeletePlaylist(playlist.id)}
                        className="flex h-5 w-5 items-center justify-center rounded-full text-white/40 hover:text-[#fa2d48]"
                      >
                        <Trash2 size={10} />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
          
          {!isLoggedIn && (
            <div className="px-3 py-2 text-[12px] text-white/40">
              登录后可管理歌单
            </div>
          )}
        </nav>
      </div>

      {/* Footer */}
      <div className="relative flex-shrink-0 pt-3 px-3 border-t border-[rgba(255,255,255,0.08)]">
        <a href="#" className="mb-2.5 flex items-center gap-1.5 rounded-lg px-3 py-2 text-[12px] text-white/60 transition-colors hover:text-white">
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

// ---- Featured Card (Apple Music 大横幅风格) ----
function FeaturedCard({ item, compact = false, onPlay, onClick }: { item: (typeof FEATURED)[0]; compact?: boolean; onPlay?: () => void; onClick?: () => void }) {
  if (compact) {
    return (
      <div
        className="group relative cursor-pointer overflow-hidden rounded-2xl flex-shrink-0 ring-1 ring-inset ring-white/20"
        style={{
          aspectRatio: '4/3',
          width: '320px'
        }}
        onClick={onClick}
      >
        <div
          className="absolute inset-0 bg-cover bg-center transition-[transform,filter] duration-700 group-hover:scale-[1.03]"
          style={{ backgroundImage: `url('${item.cover}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <button className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-xl transition-transform active:scale-95" onClick={(e) => { e.stopPropagation(); onPlay?.(); onClick?.(); }}>
            <Play size={24} fill="black" className="ml-1" />
          </button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="mb-1 text-[15px] font-bold leading-tight text-white">{item.title}</div>
          <div className="text-[12px] text-white/70">{item.artist}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="group cursor-pointer" onClick={onClick}>
      {/* 顶部文字区：label / title / artist */}
      <div className="mb-3 min-h-[78px]">
        <div className="mb-1.5 text-[12px] sm:text-[13px] font-medium text-white/55">{item.label}</div>
        <div className="mb-1 line-clamp-1 text-[18px] sm:text-[20px] font-bold leading-tight text-white">{item.title}</div>
        <div className="line-clamp-1 text-[13px] sm:text-[14px] text-white/65">{item.artist}</div>
      </div>

      {/* 大图卡片 */}
      <div
        className="relative overflow-hidden rounded-2xl ring-1 ring-inset ring-white/20"
        style={{ aspectRatio: '16/9' }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center transition-[transform,filter] duration-700 group-hover:scale-[1.03]"
          style={{ backgroundImage: `url('${item.cover}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
        {/* 液态玻璃边缘高光 */}
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl"
          style={{
            boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.18), inset 0 -1px 0 0 rgba(255,255,255,0.06)',
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <button className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-xl transition-transform active:scale-95" onClick={(e) => { e.stopPropagation(); onPlay?.(); onClick?.(); }}>
            <Play size={24} fill="black" className="ml-1" />
          </button>
        </div>
        {/* 描述：左下 */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 pr-[88px] sm:pr-[100px]">
          <div className="line-clamp-2 text-[12px] sm:text-[13px] leading-[1.5] text-white/70">{item.desc}</div>
        </div>
        {/* 缩略图：右下 */}
        <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 h-[56px] w-[56px] sm:h-[68px] sm:w-[68px] overflow-hidden rounded-[10px] shadow-lg shadow-black/40 ring-1 ring-white/10">
          <img src={item.thumbnail} alt="" loading="lazy" className="h-full w-full object-cover" />
        </div>
      </div>
    </div>
  );
}

// ---- Small Card (专辑/歌单) ----
function SmallCard({ item, onClick, compact = false }: { item: { title: string; subtitle: string; cover: string }; onClick?: () => void; compact?: boolean }) {
  return (
    <div
      className={`group cursor-pointer transition-transform duration-200 hover:-translate-y-1 ${compact ? 'flex-shrink-0 w-[150px]' : ''}`}
      onClick={onClick}
    >
      <div className="mb-2.5 aspect-square overflow-hidden rounded-[12px] bg-white/[0.06] relative shadow-lg shadow-black/20">
        <img src={item.cover} alt={item.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.06]" />
        {/* 悬停灰度遮罩 - 带有入场和出场动画 */}
        <div className="cover-hover-overlay pointer-events-none absolute inset-0 bg-black/25" style={{ backdropFilter: 'grayscale(0.6)' }} />
        {/* 左右按钮 */}
        <button
          className="absolute bottom-2 left-2 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100 hover:!bg-[#fa586a] active:scale-90"
          onClick={(e) => { e.stopPropagation(); onClick?.(); }}
        >
          <Play size={16} fill="white" className="ml-0.5" />
        </button>
        <button
          className="absolute bottom-2 right-2 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100 hover:!bg-[#fa586a] active:scale-90"
          onClick={(e) => { e.stopPropagation(); }}
        >
          <MoreHorizontal size={16} />
        </button>
      </div>
      <div className="truncate text-[13px] font-semibold text-white">{item.title}</div>
      <div className="truncate text-[12px] text-white/50 mt-0.5">{item.subtitle}</div>
    </div>
  );
}

// ---- Radio Station Card (圆形封面) ----
function RadioCard({ item, onPlay }: { item: { title: string; cover: string }; onPlay?: () => void }) {
  return (
    <div className="group cursor-pointer flex-shrink-0 w-[140px] transition-transform duration-200 hover:-translate-y-1">
      <div className="mb-2.5 aspect-square overflow-hidden rounded-full bg-white/[0.06] relative shadow-lg shadow-black/20">
        <img src={item.cover} alt={item.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.06]" />
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-md transition-transform active:scale-90" onClick={(e) => { e.stopPropagation(); onPlay?.(); }}>
            <Play size={18} fill="black" className="ml-0.5" />
          </button>
        </div>
      </div>
      <div className="truncate text-[12px] font-medium text-white/80 text-center">{item.title}</div>
    </div>
  );
}

// ---- Music Video Card (16:9 横幅) ----
function VideoCard({ item }: { item: (typeof MUSIC_VIDEOS)[0] }) {
  return (
    <div className="group cursor-pointer flex-shrink-0 w-[300px] sm:w-[360px] transition-transform duration-200 hover:-translate-y-1">
      <div className="mb-2.5 aspect-video overflow-hidden rounded-[12px] bg-white/[0.06] relative shadow-lg shadow-black/20">
        <img src={item.cover} alt={item.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        {/* 播放按钮 */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <button className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-lg transition-transform active:scale-90">
            <PlayCircle size={28} className="text-black" />
          </button>
        </div>
        {/* 底部信息 */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <div className="text-[14px] font-semibold text-white leading-tight line-clamp-2">{item.title}</div>
          <div className="text-[12px] text-white/60 mt-0.5">{item.artist}</div>
        </div>
      </div>
    </div>
  );
}

// ---- New Song Row (Apple Music 列表风格) ----
function NewSongRow({ song, index, onPlay }: { song: (typeof NEW_SONGS)[0]; index: number; onPlay?: () => void }) {
  return (
    <div className="group flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-white/[0.06] cursor-pointer" onClick={onPlay}>
      {/* 序号 */}
      <span className="w-5 text-center text-[13px] font-medium text-white/30 group-hover:hidden">{index + 1}</span>
      <button className="hidden group-hover:flex w-5 items-center justify-center text-white/70">
        <Play size={12} fill="currentColor" className="ml-0.5" />
      </button>
      {/* 封面 */}
      <div className="h-10 w-10 overflow-hidden rounded-md flex-shrink-0">
        <img src={song.cover} alt={song.title} loading="lazy" className="h-full w-full object-cover" />
      </div>
      {/* 信息 */}
      <div className="flex-1 min-w-0">
        <div className="truncate text-[14px] font-medium text-white">{song.title}</div>
        <div className="truncate text-[12px] text-white/50">{song.artist}</div>
      </div>
      {/* 更多 */}
      <button className="flex h-7 w-7 items-center justify-center rounded-full text-white/20 transition-colors hover:bg-white/[0.1] hover:text-white/60">
        <MoreVertical size={14} />
      </button>
    </div>
  );
}

// ---- Add to Playlist Menu ----
function AddToPlaylistMenu({ song, onClose }: { song: Song; onClose: () => void }) {
  const userPlaylists = useMusicStore((s) => s.userPlaylists);
  const addToPlaylist = useMusicStore((s) => s.addToPlaylist);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  
  const handleAdd = (playlistId: string) => {
    addToPlaylist(playlistId, song);
    onClose();
  };
  
  if (!isLoggedIn) {
    return (
      <div className="absolute right-0 top-full mt-1 w-[180px] rounded-xl bg-[#232324] border border-white/10 shadow-lg z-50 p-3">
        <p className="text-[12px] text-white/50">请先登录</p>
      </div>
    );
  }
  
  return (
    <div className="absolute right-0 top-full mt-1 w-[180px] rounded-xl bg-[#232324] border border-white/10 shadow-lg z-50 overflow-hidden animate-fade-in">
      <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-white/40 border-b border-white/5">
        添加到歌单
      </div>
      <div className="py-1">
        {userPlaylists.map((playlist) => (
          <button
            key={playlist.id}
            onClick={() => handleAdd(playlist.id)}
            className="w-full px-3 py-2 text-[13px] text-white/70 hover:bg-white/[0.06] hover:text-white transition-colors text-left truncate"
          >
            {playlist.name}
          </button>
        ))}
      </div>
    </div>
  );
}

// ---- Song Row ----
function SongRow({ song, onClick }: { song: (typeof SONGS)[0]; onClick?: () => void }) {
  const [showMenu, setShowMenu] = useState(false);

  const fullSong: Song = {
    id: song.title.charCodeAt(0) + song.artist.charCodeAt(0),
    title: song.title,
    artist: song.artist,
    album: song.album,
    cover: song.cover,
    audioUrl: `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${(song.title.charCodeAt(0) % 6) + 1}.mp3`,
    duration: 180,
  };
  
  return (
    <div className="group grid cursor-pointer grid-cols-[36px_1fr_32px] sm:grid-cols-[44px_1fr_1fr_1fr_32px] items-center gap-2 sm:gap-4 rounded-lg px-2 sm:px-4 py-2 sm:py-2.5 transition-colors hover:bg-white/[0.06]" onClick={onClick}>
      <div className="h-9 sm:h-11 w-9 sm:w-11 overflow-hidden rounded-lg relative">
        <img src={song.cover} alt={song.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.05]" />
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <Play size={14} fill="white" className="ml-0.5" />
        </div>
      </div>
      <div className="truncate text-[13px] sm:text-[14px] font-medium text-white">{song.title}</div>
      <div className="hidden sm:block truncate text-[13px] text-white/60">{song.artist}</div>
      <div className="hidden sm:block truncate text-[13px] text-white/40">{song.album}</div>
      <div className="relative">
        <button 
          className="flex h-7 w-7 items-center justify-center rounded-full text-white/30 transition-colors hover:bg-white/[0.1] hover:text-white" 
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu(!showMenu);
          }}
        >
          <MoreVertical size={16} />
        </button>
        {showMenu && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
            <AddToPlaylistMenu song={fullSong} onClose={() => setShowMenu(false)} />
          </>
        )}
      </div>
    </div>
  );
}

// ---- Section Header (Apple Music 风格) ----
function SectionHeader({ title, showSeeAll = true }: { title: string; showSeeAll?: boolean }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-[18px] sm:text-[20px] font-bold tracking-tight text-white">{title}</h2>
      {showSeeAll && (
        <a href="#" className="flex items-center gap-0.5 text-[13px] font-medium text-[#fa2d48] transition-colors hover:text-[#ff4d66]">
          查看全部
          <ChevronRight size={14} />
        </a>
      )}
    </div>
  );
}

// ---- Horizontal Scroll Section ----
function HorizontalScroll({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <>
      {/* 手机端：横向滚动 */}
      <div className="md:hidden overflow-x-auto scrollbar-hide -mx-4 px-4">
        <div className={`flex gap-3 ${className}`}>
          {children}
        </div>
      </div>
      {/* 桌面端：网格布局 */}
      <div className="hidden md:block">
        {children}
      </div>
    </>
  );
}

// ---- Marquee Title (自动判断是否需要滚动 + 渐隐) ----
function MarqueeTitle({
  text,
  isPlaying,
  className = '',
}: {
  text: string;
  isPlaying: boolean;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const [overflows, setOverflows] = useState(false);

  useLayoutEffect(() => {
    const measure = () => {
      const container = containerRef.current;
      const measureEl = measureRef.current;
      if (!container || !measureEl) return;
      setOverflows(measureEl.scrollWidth > container.clientWidth + 1);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    if (measureRef.current) ro.observe(measureRef.current);
    return () => ro.disconnect();
  }, [text]);

  const shouldAnimate = overflows && !isPlaying;
  const shouldFade = overflows;

  let maskStyle: React.CSSProperties = {};
  if (shouldFade) {
    if (shouldAnimate) {
      maskStyle = {
        maskImage:
          'linear-gradient(to right, transparent 0, black 24px, black calc(100% - 24px), transparent 100%)',
        WebkitMaskImage:
          'linear-gradient(to right, transparent 0, black 24px, black calc(100% - 24px), transparent 100%)',
      };
    } else {
      maskStyle = {
        maskImage:
          'linear-gradient(to right, black calc(100% - 24px), transparent 100%)',
        WebkitMaskImage:
          'linear-gradient(to right, black calc(100% - 24px), transparent 100%)',
      };
    }
  }

  return (
    <div ref={containerRef} className="relative overflow-hidden">
      {/* 用于测量真实宽度的不可见副本（无 padding） */}
      <span
        ref={measureRef}
        className={`${className} invisible whitespace-nowrap inline-block`}
        style={{ position: 'absolute', left: 0, top: 0 }}
      >
        {text}
      </span>
      {/* 实际显示区域 */}
      <div
        className={`${className} whitespace-nowrap inline-flex ${shouldAnimate ? 'animate-marquee' : ''}`}
        style={{ willChange: 'transform', ...maskStyle }}
      >
        <span className="pr-8">{text}</span>
        {shouldAnimate && <span className="pr-8">{text}</span>}
      </div>
    </div>
  );
}

// ---- Hoverable Progress Bar ----
function ProgressBar({
  progress,
  duration,
  onSeek,
}: {
  progress: number;
  duration: number;
  onSeek?: (progress: number) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState(false);
  const [hoverPct, setHoverPct] = useState(0);

  const updateFromEvent = (clientX: number) => {
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    setHoverPct(pct);
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    onSeek?.(pct);
  };

  const fmt = (sec: number) =>
    `${Math.floor(sec / 60)}:${String(Math.floor(sec) % 60).padStart(2, '0')}`;

  const currentTime = progress * duration;
  const remaining = duration - currentTime;

  return (
    <div
      className="group/prog relative cursor-pointer"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onMouseMove={(e) => updateFromEvent(e.clientX)}
      onClick={handleClick}
    >
      {/* hover 时背景模糊区域 —— 不占空间，absolute 定位 */}
      <div
        className={`absolute -left-4 -right-4 -top-14 -bottom-3 rounded-2xl transition-opacity duration-200 pointer-events-none ${
          hover ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ backdropFilter: 'blur(24px) saturate(180%)', WebkitBackdropFilter: 'blur(24px) saturate(180%)', backgroundColor: 'rgba(0,0,0,0.35)' }}
      />

      {/* 左上方：当前播放时间 —— absolute 不占空间 */}
      <div
        className={`absolute left-0 bottom-full mb-2 text-[11px] font-medium text-white/80 transition-opacity duration-200 pointer-events-none ${
          hover ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {fmt(currentTime)}
      </div>

      {/* 进度条轨道 —— 始终可见 */}
      <div
        ref={trackRef}
        className={`relative w-full rounded-full transition-all duration-200 ${
          hover ? 'h-[5px] bg-white/20' : 'h-[2px] bg-white/20'
        }`}
      >
        {/* 进度填充 */}
        <div
          className="absolute left-0 top-0 h-full rounded-full transition-all duration-100"
          style={{
            width: `${progress * 100}%`,
            backgroundColor: hover ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.5)',
          }}
        />
        {/* hover 时白色圆点在已播放末端 */}
        {hover && (
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-[14px] w-[14px] rounded-full bg-white shadow-lg pointer-events-none transition-transform duration-100"
            style={{ left: `${progress * 100}%` }}
          />
        )}
      </div>

      {/* 右上方：剩余时间 —— absolute 不占空间 */}
      <div
        className={`absolute right-0 bottom-full mb-2 text-[11px] font-medium text-white/80 transition-opacity duration-200 pointer-events-none ${
          hover ? 'opacity-100' : 'opacity-0'
        }`}
      >
        -{fmt(remaining)}
      </div>
    </div>
  );
}

// ---- Player Bar ----
function PlayerBar({ onOpenLyrics }: { onOpenLyrics?: () => void }) {
  const { isPlaying, currentSong, toggle, next, prev, progress, seek } = useMusicStore();
  const { params } = useGlassParams();
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  return (
    <div className="fixed bottom-[88px] md:bottom-4 left-1/2 z-[100] -translate-x-1/2 w-[calc(100%-24px)] md:w-[calc(100%-32px)] max-w-[720px]">
      <LiquidGlassBox
        className="w-full"
        style={{ height: '56px', borderRadius: 28 }}
        effect="clear"
        interactive
        animated
        animationDuration={300}
        options={{
          radius: 14,
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
        }}
      >
        {/* 桌面端布局 */}
        <div className="relative hidden md:flex h-full items-center px-3 sm:px-5 min-w-0">
          {currentSong ? (
            <>
              {/* 播放控制 */}
              <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
                {currentSong && (
                  <button className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/[0.08]" onClick={() => {}}>
                    <Shuffle size={18} strokeWidth={2.5} />
                  </button>
                )}
                <button className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/[0.08]" onClick={prev}>
                  <SkipBack size={20} fill="currentColor" strokeWidth={1} />
                </button>
                <button
                  className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white text-black shadow-lg transition-transform active:scale-[0.95]"
                  onClick={toggle}
                >
                  {isPlaying ? <Pause size={22} fill="black" /> : <Play size={22} fill="black" className="ml-1" />}
                </button>
                <button className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/[0.08]" onClick={next}>
                  <SkipForward size={20} fill="currentColor" strokeWidth={1} />
                </button>
                {currentSong && (
                  <button className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/[0.08]" onClick={() => {}}>
                    <Repeat size={18} strokeWidth={2.5} />
                  </button>
                )}
              </div>

              {/* 中间区域：封面 → 三个点（含进度条） + 右侧音量控制 */}
              <div className="flex-1 flex items-stretch ml-2 sm:ml-6 min-w-0 gap-2">
                {/* 左侧：内容 + 进度条 */}
                <div className="relative flex-1 flex flex-col min-w-0">
                  {/* 上方内容行 */}
                  <div className="flex items-center gap-2 sm:gap-3.5 flex-1 min-w-0">
                    {/* 封面 */}
                    <div className="h-8 sm:h-10 w-8 sm:w-10 overflow-hidden rounded-lg flex-shrink-0 shadow-md">
                      <img src={currentSong.cover} alt="cover" className="h-full w-full object-cover" />
                    </div>
                    {/* 歌曲信息 */}
                    <div className="min-w-0 flex-1 max-w-[200px]">
                      <MarqueeTitle
                        text={currentSong.title}
                        isPlaying={isPlaying}
                        className="text-[12px] sm:text-[14px] font-semibold text-white leading-tight"
                      />
                      <div className="truncate text-[10px] sm:text-[12px] text-white/60 leading-tight mt-0.5">{currentSong.artist} — {currentSong.album}</div>
                    </div>

                    {/* 时间显示 */}
                    <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0 text-[11px] text-white/40 font-medium ml-auto">
                      <span>{`${Math.floor(progress * currentSong.duration / 60)}:${String(Math.floor(progress * currentSong.duration) % 60).padStart(2, '0')}`}</span>
                      <span>/</span>
                      <span>{`${Math.floor(currentSong.duration / 60)}:${String(Math.floor(currentSong.duration) % 60).padStart(2, '0')}`}</span>
                    </div>

                    {/* 歌词、试听、三个点 */}
                    <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0 ml-2">
                      <button
                        className="flex h-9 w-9 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/[0.08]"
                        onClick={onOpenLyrics}
                        title="歌词"
                      >
                        <Mic2 size={18} strokeWidth={2} />
                      </button>
                      {!isLoggedIn && (
                        <span className="hidden sm:block px-2.5 py-1 rounded-full bg-[#fa2d48]/20 text-[11px] text-[#fa2d48] font-semibold">试听</span>
                      )}
                      <button className="flex h-9 w-9 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/[0.08]">
                        <MoreHorizontal size={18} strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>

                  {/* 进度条：从封面到三个点底部 */}
                  <div className="pointer-events-auto mt-0.5">
                    <ProgressBar
                      progress={progress}
                      duration={currentSong.duration}
                      onSeek={seek}
                    />
                  </div>
                </div>

                {/* 右侧：列表、音量（无进度条） */}
                <div className="hidden sm:flex items-center gap-0.5 flex-shrink-0 self-center">
                  <button className="flex h-9 w-9 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/[0.08]">
                    <ListMusic size={18} strokeWidth={2.5} />
                  </button>
                  <button className="flex h-9 w-9 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/[0.08]">
                    <Volume2 size={18} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* 未播放：极简样式 */}
              {/* 左侧控件 */}
              <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                <button className="hidden sm:flex h-9 w-9 items-center justify-center text-white/40 transition-colors hover:text-white/70" onClick={() => {}}>
                  <Shuffle size={16} />
                </button>
                <button className="flex h-9 w-9 items-center justify-center text-white/40 transition-colors hover:text-white/70" onClick={prev}>
                  <SkipBack size={20} fill="currentColor" />
                </button>
                <button
                  className="flex h-10 w-10 items-center justify-center text-white/40 transition-colors hover:text-white/70 active:scale-95"
                  onClick={toggle}
                >
                  <Play size={26} fill="currentColor" className="ml-0.5" />
                </button>
                <button className="flex h-9 w-9 items-center justify-center text-white/40 transition-colors hover:text-white/70" onClick={next}>
                  <SkipForward size={20} fill="currentColor" />
                </button>
                <button className="hidden sm:flex h-9 w-9 items-center justify-center text-white/40 transition-colors hover:text-white/70" onClick={() => {}}>
                  <Repeat size={16} />
                </button>
              </div>

              {/* 中间 Apple 标志 - 使用绝对定位真正居中 */}
              <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <svg viewBox="0 0 24 24" className="h-7 w-7 fill-white/50">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
              </div>

              {/* 右侧控件 */}
              <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0 ml-auto">
                <button className="flex h-9 w-9 items-center justify-center text-white/40 transition-colors hover:text-white/70">
                  <ListMusic size={18} />
                </button>
                <button className="flex h-9 w-9 items-center justify-center text-white/40 transition-colors hover:text-white/70">
                  <Volume2 size={18} />
                </button>
              </div>
            </>
          )}
        </div>

        {/* 手机端布局 */}
        <div className="md:hidden flex h-full items-center px-3 min-w-0 gap-2">
          {currentSong && (
            <div className="flex-1 flex flex-col min-w-0">
              {/* 上方内容行 */}
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div className="h-[36px] w-[36px] overflow-hidden rounded-md flex-shrink-0 shadow-sm">
                  <img src={currentSong.cover} alt="cover" className="h-full w-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <MarqueeTitle
                    text={currentSong.title}
                    isPlaying={isPlaying}
                    className="text-[13px] font-semibold text-white leading-tight"
                  />
                  <div className="truncate text-[11px] text-white/50 leading-tight mt-0.5">{currentSong.artist}</div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-white text-black shadow-md transition-transform active:scale-[0.92]"
                    onClick={toggle}
                  >
                    {isPlaying ? <Pause size={20} fill="black" /> : <Play size={20} fill="black" className="ml-0.5" />}
                  </button>
                  <button
                    className="flex h-[36px] w-[36px] items-center justify-center rounded-full text-white/80 transition-colors active:bg-white/[0.1]"
                    onClick={next}
                  >
                    <SkipForward size={20} fill="currentColor" strokeWidth={1} />
                  </button>
                </div>
              </div>
              {/* 进度条：横跨底部 */}
              <div className="pointer-events-auto mt-0.5">
                <ProgressBar
                  progress={progress}
                  duration={currentSong.duration}
                  onSeek={seek}
                />
              </div>
            </div>
          )}
        </div>
      </LiquidGlassBox>
    </div>
  );
}

// ---- Main Page ----
export default function AppleMusicDiscover({ onOpenLyrics, onOpenAlbum }: { onOpenLyrics?: () => void; onOpenAlbum?: (album?: AlbumData) => void }) {
  const playSong = useMusicStore((s) => s.playSong);
  const playSongObject = useMusicStore((s) => s.playSongObject);
  const playlist = useMusicStore((s) => s.playlist);
  const activeTab = useMusicStore((s) => s.activeTab);
  const setActiveTab = useMusicStore((s) => s.setActiveTab);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handlePlay = useCallback(
    (index: number) => {
      if (index < playlist.length) {
        playSong(index);
      }
    },
    [playSong, playlist]
  );

  // 搜索过滤
  const searchResults = searchQuery.trim()
    ? playlist.filter(
        (s) =>
          s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.album.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // 搜索页
  if (activeTab === 'search') {
    return (
      <div className="flex h-screen w-screen bg-[#1a1a1a] text-white overflow-hidden font-sans">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

        <main className="flex-1 overflow-hidden pb-[160px] md:pb-20 animate-page-enter md:ml-[256px]">
          <div className="relative h-full overflow-y-auto px-4 py-5 pb-[160px] md:px-8 md:py-7 md:pb-12 scrollbar-hide">
            <h1 className="mb-6 text-[28px] md:text-[34px] font-bold tracking-tight">搜索</h1>

            {/* 搜索输入框 */}
            <div className="relative mb-6">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="歌曲、艺人、专辑"
                className="w-full rounded-xl bg-white/[0.08] py-3.5 pl-12 pr-10 text-[15px] text-white placeholder-white/30 outline-none transition-colors focus:bg-white/[0.12]"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => { setSearchQuery(''); searchInputRef.current?.focus(); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-white/50 hover:bg-white/20"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* 搜索结果 */}
            {searchQuery.trim() ? (
              searchResults.length > 0 ? (
                <div>
                  <div className="mb-3 text-[13px] text-white/40">找到 {searchResults.length} 首</div>
                  <div className="flex flex-col">
                    {searchResults.map((song) => {
                      const originalIndex = playlist.indexOf(song);
                      return (
                        <SongRow
                          key={song.id}
                          song={{ title: song.title, artist: song.artist, album: song.album, cover: song.cover }}
                          onClick={() => handlePlay(originalIndex)}
                        />
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center">
                  <div className="text-[15px] text-white/40">未找到"{searchQuery}"的相关结果</div>
                </div>
              )
            ) : (
              <div className="py-12 text-center">
                <Search size={48} className="mx-auto mb-4 text-white/10" strokeWidth={1} />
                <div className="text-[15px] text-white/30">输入关键词搜索歌曲、艺人或专辑</div>
              </div>
            )}
          </div>
        </main>

        <PlayerBar onOpenLyrics={onOpenLyrics} />
        <div className="md:hidden">
          <BottomNav />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen bg-[#1a1a1a] text-white overflow-hidden font-sans">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="flex-1 overflow-hidden pb-[160px] md:pb-20 animate-page-enter md:ml-[256px]">
        <div className="relative h-full overflow-y-auto px-4 py-5 pb-[160px] md:px-8 md:py-7 md:pb-12 scrollbar-hide">

          {/* 页面标题 - Apple Music 风格 */}
          <h1 className="mb-6 text-[28px] md:text-[34px] font-bold tracking-tight">新发现</h1>

          {/* ===== 特色大卡片 ===== */}
          <section className="mb-8 sm:mb-12">
            {/* 手机端：横向滚动 */}
            <div className="md:hidden overflow-x-auto scrollbar-hide -mx-4 px-4">
              <div className="flex gap-4">
                {FEATURED.map((item, i) => (
                  <div key={item.title} className={`animate-card-enter animate-stagger-${i + 1}`}>
                    <FeaturedCard
                      item={item}
                      compact
                      onPlay={() => handlePlay(i % playlist.length)}
                      onClick={item.artist === 'Olivia Rodrigo' ? () => onOpenAlbum?.() : undefined}
                    />
                  </div>
                ))}
              </div>
            </div>
            {/* 桌面端：三栏网格 */}
            <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-5">
              {FEATURED.map((item, i) => (
                <div key={item.title} className={`animate-card-enter animate-stagger-${i + 1}`}>
                  <FeaturedCard
                    item={item}
                    onPlay={() => handlePlay(i % playlist.length)}
                    onClick={item.artist === 'Olivia Rodrigo' ? () => onOpenAlbum?.() : undefined}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* ===== 新歌速递 - 列表风格 ===== */}
          <section className="mb-8 sm:mb-12">
            <SectionHeader title="新歌速递" />
            {/* 手机端：横向滚动 */}
            <div className="md:hidden overflow-x-auto scrollbar-hide -mx-4 px-4">
              <div className="flex gap-3">
                {NEW_SONGS.map((item, i) => {
                  const matched = playlist.find(s => s.artist === item.artist && s.title === item.title);
                  const songObj: Song = matched || {
                    id: 100 + i,
                    title: item.title,
                    artist: item.artist,
                    album: item.title,
                    cover: item.cover,
                    audioUrl: `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${(i % 6) + 1}.mp3`,
                    duration: 200,
                  };
                  return (
                    <div key={item.title} className={`animate-card-enter animate-stagger-${(i % 6) + 1} flex-shrink-0 w-[140px]`}>
                      <SmallCard item={{ title: item.title, subtitle: item.artist, cover: item.cover }} onClick={() => playSongObject(songObj)} compact />
                    </div>
                  );
                })}
              </div>
            </div>
            {/* 桌面端：列表风格 */}
            <div className="hidden md:block rounded-xl bg-white/[0.03] p-2">
              {NEW_SONGS.map((song, i) => {
                const matched = playlist.find(s => s.artist === song.artist && s.title === song.title);
                const songObj: Song = matched || {
                  id: 100 + i,
                  title: song.title,
                  artist: song.artist,
                  album: song.title,
                  cover: song.cover,
                  audioUrl: `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${(i % 6) + 1}.mp3`,
                  duration: 200,
                };
                return (
                  <div key={song.title} className={`animate-card-enter animate-stagger-${(i % 6) + 1}`}>
                    <NewSongRow song={song} index={i} onPlay={() => playSongObject(songObj)} />
                  </div>
                );
              })}
            </div>
          </section>

          {/* ===== 新专辑 ===== */}
          <section className="mb-8 sm:mb-12">
            <SectionHeader title="新专辑" />
            <div className="md:hidden overflow-x-auto scrollbar-hide -mx-4 px-4">
              <div className="flex gap-3">
                {NEW_ALBUMS.map((item, i) => (
                  <div key={item.title} className={`animate-card-enter animate-stagger-${i + 1}`}>
                    <SmallCard item={item} onClick={item.title === '首都' ? () => onOpenAlbum?.(SHOUDU_ALBUM) : () => handlePlay(0)} compact />
                  </div>
                ))}
              </div>
            </div>
            <div className="hidden md:grid grid-cols-3 lg:grid-cols-6 gap-5">
              {NEW_ALBUMS.map((item, i) => (
                <div key={item.title} className={`animate-card-enter animate-stagger-${i + 1}`}>
                  <SmallCard item={item} onClick={item.title === '首都' ? () => onOpenAlbum?.(SHOUDU_ALBUM) : () => handlePlay(0)} />
                </div>
              ))}
            </div>
          </section>

          {/* ===== 热门歌单 ===== */}
          <section className="mb-8 sm:mb-12">
            <SectionHeader title="热门歌单" />
            <div className="md:hidden overflow-x-auto scrollbar-hide -mx-4 px-4">
              <div className="flex gap-3">
                {PLAYLISTS.map((item, i) => (
                  <div key={item.title} className={`animate-card-enter animate-stagger-${i + 1}`}>
                    <SmallCard item={item} onClick={() => handlePlay(0)} compact />
                  </div>
                ))}
              </div>
            </div>
            <div className="hidden md:grid grid-cols-3 lg:grid-cols-6 gap-5">
              {PLAYLISTS.map((item, i) => (
                <div key={item.title} className={`animate-card-enter animate-stagger-${i + 1}`}>
                  <SmallCard item={item} onClick={() => handlePlay(0)} />
                </div>
              ))}
            </div>
          </section>

          {/* ===== 排行榜 ===== */}
          <section className="mb-8 sm:mb-12">
            <SectionHeader title="排行榜" />
            <div className="md:hidden overflow-x-auto scrollbar-hide -mx-4 px-4">
              <div className="flex gap-3">
                {CHARTS.map((item, i) => (
                  <div key={item.title} className={`animate-card-enter animate-stagger-${i + 1}`}>
                    <SmallCard item={item} onClick={() => handlePlay(0)} compact />
                  </div>
                ))}
              </div>
            </div>
            <div className="hidden md:grid grid-cols-3 lg:grid-cols-6 gap-5">
              {CHARTS.map((item, i) => (
                <div key={item.title} className={`animate-card-enter animate-stagger-${i + 1}`}>
                  <SmallCard item={item} onClick={() => handlePlay(0)} />
                </div>
              ))}
            </div>
          </section>

          {/* ===== 城市排行榜 ===== */}
          <section className="mb-8 sm:mb-12">
            <SectionHeader title="城市排行榜" />
            <div className="md:hidden overflow-x-auto scrollbar-hide -mx-4 px-4">
              <div className="flex gap-3">
                {CITY_CHARTS.map((item, i) => (
                  <div key={item.title} className={`animate-card-enter animate-stagger-${i + 1}`}>
                    <SmallCard item={item} onClick={() => handlePlay(0)} compact />
                  </div>
                ))}
              </div>
            </div>
            <div className="hidden md:grid grid-cols-3 lg:grid-cols-5 gap-5">
              {CITY_CHARTS.map((item, i) => (
                <div key={item.title} className={`animate-card-enter animate-stagger-${i + 1}`}>
                  <SmallCard item={item} onClick={() => handlePlay(0)} />
                </div>
              ))}
            </div>
          </section>

          {/* ===== 广播电台 - 圆形封面 ===== */}
          <section className="mb-8 sm:mb-12">
            <SectionHeader title="广播电台" />
            <div className="md:hidden overflow-x-auto scrollbar-hide -mx-4 px-4">
              <div className="flex gap-4">
                {RADIO_STATIONS.map((item, i) => (
                  <div key={item.title} className={`animate-card-enter animate-stagger-${i + 1}`}>
                    <RadioCard item={item} onPlay={() => handlePlay(i % playlist.length)} />
                  </div>
                ))}
              </div>
            </div>
            <div className="hidden md:grid grid-cols-3 lg:grid-cols-6 gap-5">
              {RADIO_STATIONS.map((item, i) => (
                <div key={item.title} className={`animate-card-enter animate-stagger-${i + 1}`}>
                  <RadioCard item={item} onPlay={() => handlePlay(i % playlist.length)} />
                </div>
              ))}
            </div>
          </section>

          {/* ===== 音乐视频 ===== */}
          <section className="mb-8 sm:mb-12">
            <SectionHeader title="音乐视频" />
            <div className="md:hidden overflow-x-auto scrollbar-hide -mx-4 px-4">
              <div className="flex gap-4">
                {MUSIC_VIDEOS.map((item, i) => (
                  <div key={item.title} className={`animate-card-enter animate-stagger-${i + 1}`}>
                    <VideoCard item={item} />
                  </div>
                ))}
              </div>
            </div>
            <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-5">
              {MUSIC_VIDEOS.map((item, i) => (
                <div key={item.title} className={`animate-card-enter animate-stagger-${i + 1}`}>
                  <VideoCard item={item} />
                </div>
              ))}
            </div>
          </section>

          {/* ===== 新歌精选 - 传统列表 ===== */}
          <section className="mb-8 sm:mb-12">
            <SectionHeader title="歌曲列表" />
            <div className="flex flex-col">
              {SONGS.map((song, i) => (
                <div key={song.title} className={`animate-card-enter animate-stagger-${(i % 6) + 1}`}>
                  <SongRow song={song} onClick={() => handlePlay(i % playlist.length)} />
                </div>
              ))}
            </div>
          </section>

        </div>
      </main>

      <PlayerBar onOpenLyrics={onOpenLyrics} />
      
      <div className="md:hidden">
        <BottomNav />
      </div>
    </div>
  );
}
