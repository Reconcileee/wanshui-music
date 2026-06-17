import { Song } from '@/types';

// 远程示例歌曲
const remoteSongs: Song[] = [
  {
    id: 1,
    title: 'the cure',
    artist: 'Olivia Rodrigo',
    album: 'you seem pretty sad for a girl so in love',
    cover: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/1d/1b/f9/1d1bf9b1-44c6-9a6c-6ffb-c158488c06ce/26UMGIM39303.rgb.jpg/400x400bb.webp',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    duration: 198,
  },
  {
    id: 2,
    title: 'WDA (Whole Different Animal) [feat. G-DRAGON]',
    artist: 'aespa',
    album: 'WDA',
    cover: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/00/1d/e6/001de64e-c2f1-fd4b-3604-3d2e16641968/888735955211.png/400x400bb.webp',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    duration: 215,
  },
  {
    id: 3,
    title: 'hate that i made you love me',
    artist: 'Ariana Grande',
    album: 'petal',
    cover: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/7e/e6/82/7ee682bd-1b17-6adc-be63-b5af1bdff369/26UMGIM51126.rgb.jpg/400x400bb.webp',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    duration: 203,
  },
  {
    id: 4,
    title: 'BOOMPALA',
    artist: 'LE SSERAFIM',
    album: 'BOOMPALA',
    cover: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/b8/0c/98/b80c980c-52c6-a180-ff3e-2afaaab75fdd/823375107286_Cover.jpg/400x400bb.webp',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    duration: 178,
  },
  {
    id: 5,
    title: '最佳损友',
    artist: '陈奕迅',
    album: '最佳损友',
    cover: 'https://is1-ssl.mzstatic.com/image/thumb/Music118/v4/a4/fa/86/a4fa86d6-c23a-c37f-1251-00376ff144cd/00602498378830.rgb.jpg/400x400bb.webp',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    duration: 258,
  },
  {
    id: 6,
    title: '阴天',
    artist: '莫文蔚',
    album: '阴天',
    cover: 'https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/81/cc/52/81cc5224-3ace-5e3c-468a-17b4b71da831/dj.aqolbuce.jpg/400x400bb.webp',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    duration: 282,
  },
];

// 本地歌曲条目结构
interface LocalSongEntry {
  id: number;
  title: string;
  artist: string;
  album: string;
  cover: string;
  audioUrl: string;
  duration: number;
  lyricsUrl?: string;
  lyricsSrtUrl?: string;
}

const base = import.meta.env.BASE_URL;

// 初始歌曲列表（仅远程）
export const mockSongs: Song[] = [...remoteSongs];

// 异步加载本地歌曲并合并到 store
export async function loadLocalSongs(): Promise<Song[]> {
  try {
    const resp = await fetch(base + 'musics/index.json');
    if (!resp.ok) return [];
    const data: LocalSongEntry[] = await resp.json();
    return data.map(entry => ({
      id: entry.id,
      title: entry.title,
      artist: entry.artist,
      album: entry.album,
      cover: entry.cover.startsWith('http') ? entry.cover : base + entry.cover,
      audioUrl: entry.audioUrl.startsWith('http') ? entry.audioUrl : base + entry.audioUrl,
      duration: entry.duration,
      lyricsUrl: entry.lyricsUrl ? (entry.lyricsUrl.startsWith('http') ? entry.lyricsUrl : base + entry.lyricsUrl) : undefined,
      lyricsSrtUrl: entry.lyricsSrtUrl ? (entry.lyricsSrtUrl.startsWith('http') ? entry.lyricsSrtUrl : base + entry.lyricsSrtUrl) : undefined,
    }));
  } catch {
    return [];
  }
}

export const backgroundUrl = 'https://is1-ssl.mzstatic.com/image/thumb/Features126/v4/72/8c/72/728c72d9-7c5f-4d0a-8c8f-5c5f5c5f5c5f/source/800x500bb.jpg';
