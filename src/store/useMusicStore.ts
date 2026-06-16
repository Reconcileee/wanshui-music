import { create } from 'zustand';
import { Song, TabType } from '@/types';
import { mockSongs } from '@/utils/mockData';

// 用户歌单结构
export interface UserPlaylist {
  id: string;
  name: string;
  songs: Song[];
  createdAt: number;
}

// localStorage key
const PLAYLIST_STORAGE_KEY_PREFIX = 'music-player-playlist-';

interface MusicState {
  isPlaying: boolean;
  currentSong: Song | null;
  currentIndex: number;
  playlist: Song[];
  activeTab: TabType;
  progress: number;
  audioRef: HTMLAudioElement | null;
  
  // 用户歌单
  userPlaylists: UserPlaylist[];
  currentUsername: string | null;

  play: () => void;
  pause: () => void;
  toggle: () => void;
  next: () => void;
  prev: () => void;
  playSong: (index: number) => void;
  setActiveTab: (tab: TabType) => void;
  setProgress: (progress: number) => void;
  initAudio: () => void;
  
  // 用户歌单管理
  loadUserPlaylists: (username: string) => void;
  createPlaylist: (name: string) => void;
  deletePlaylist: (playlistId: string) => void;
  renamePlaylist: (playlistId: string, newName: string) => void;
  addToPlaylist: (playlistId: string, song: Song) => void;
  removeFromPlaylist: (playlistId: string, songId: number) => void;
  getPlaylistSongs: (playlistId: string) => Song[];
  clearUserPlaylists: () => void;
}

// 从 localStorage 加载用户歌单
function loadPlaylistsFromStorage(username: string): UserPlaylist[] {
  try {
    const key = PLAYLIST_STORAGE_KEY_PREFIX + username;
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // ignore
  }
  // 默认歌单
  return [
    {
      id: 'favorites',
      name: '喜欢的歌曲',
      songs: [],
      createdAt: Date.now(),
    },
  ];
}

// 保存用户歌单到 localStorage
function savePlaylistsToStorage(username: string, playlists: UserPlaylist[]) {
  try {
    const key = PLAYLIST_STORAGE_KEY_PREFIX + username;
    localStorage.setItem(key, JSON.stringify(playlists));
  } catch {
    // ignore
  }
}

export const useMusicStore = create<MusicState>((set, get) => ({
  isPlaying: false,
  currentSong: null,
  currentIndex: 0,
  playlist: mockSongs,
  activeTab: 'discover',
  progress: 0,
  audioRef: null,
  
  // 用户歌单
  userPlaylists: [],
  currentUsername: null,

  initAudio: () => {
    const audio = new Audio();
    audio.crossOrigin = 'anonymous';
    audio.addEventListener('ended', () => {
      get().next();
    });
    audio.addEventListener('timeupdate', () => {
      if (audio.duration) {
        set({ progress: audio.currentTime / audio.duration });
      }
    });
    set({ audioRef: audio });
    const { currentSong } = get();
    if (currentSong) {
      audio.src = currentSong.audioUrl;
    }
  },

  play: () => {
    const { audioRef, currentSong } = get();
    if (!audioRef) return;
    if (currentSong && audioRef.src !== currentSong.audioUrl) {
      audioRef.src = currentSong.audioUrl;
    }
    audioRef.play().catch(() => {});
    set({ isPlaying: true });
  },

  pause: () => {
    const { audioRef } = get();
    if (!audioRef) return;
    audioRef.pause();
    set({ isPlaying: false });
  },

  toggle: () => {
    const { isPlaying, audioRef } = get();
    if (!audioRef) {
      get().initAudio();
      setTimeout(() => get().play(), 0);
      return;
    }
    if (isPlaying) {
      get().pause();
    } else {
      get().play();
    }
  },

  next: () => {
    const { playlist, currentIndex } = get();
    const nextIndex = (currentIndex + 1) % playlist.length;
    const nextSong = playlist[nextIndex];
    set({ currentIndex: nextIndex, currentSong: nextSong, isPlaying: true });
    const { audioRef } = get();
    if (audioRef) {
      audioRef.src = nextSong.audioUrl;
      audioRef.play().catch(() => {});
    }
  },

  prev: () => {
    const { playlist, currentIndex } = get();
    const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    const prevSong = playlist[prevIndex];
    set({ currentIndex: prevIndex, currentSong: prevSong, isPlaying: true });
    const { audioRef } = get();
    if (audioRef) {
      audioRef.src = prevSong.audioUrl;
      audioRef.play().catch(() => {});
    }
  },

  playSong: (index: number) => {
    const { playlist } = get();
    const song = playlist[index];
    if (!song) return;
    set({ currentIndex: index, currentSong: song, isPlaying: true });
    const { audioRef } = get();
    if (audioRef) {
      audioRef.src = song.audioUrl;
      audioRef.play().catch(() => {});
    }
  },

  setActiveTab: (tab: TabType) => set({ activeTab: tab }),
  setProgress: (progress: number) => set({ progress }),
  
  // 用户歌单管理
  loadUserPlaylists: (username: string) => {
    const playlists = loadPlaylistsFromStorage(username);
    set({ userPlaylists: playlists, currentUsername: username });
  },
  
  createPlaylist: (name: string) => {
    const { currentUsername, userPlaylists } = get();
    if (!currentUsername) return;
    
    const newPlaylist: UserPlaylist = {
      id: `playlist-${Date.now()}`,
      name,
      songs: [],
      createdAt: Date.now(),
    };
    
    const updated = [...userPlaylists, newPlaylist];
    set({ userPlaylists: updated });
    savePlaylistsToStorage(currentUsername, updated);
  },
  
  deletePlaylist: (playlistId: string) => {
    const { currentUsername, userPlaylists } = get();
    if (!currentUsername) return;
    
    // 不能删除默认的"喜欢的歌曲"歌单
    if (playlistId === 'favorites') return;
    
    const updated = userPlaylists.filter(p => p.id !== playlistId);
    set({ userPlaylists: updated });
    savePlaylistsToStorage(currentUsername, updated);
  },
  
  renamePlaylist: (playlistId: string, newName: string) => {
    const { currentUsername, userPlaylists } = get();
    if (!currentUsername) return;
    
    const updated = userPlaylists.map(p => 
      p.id === playlistId ? { ...p, name: newName } : p
    );
    set({ userPlaylists: updated });
    savePlaylistsToStorage(currentUsername, updated);
  },
  
  addToPlaylist: (playlistId: string, song: Song) => {
    const { currentUsername, userPlaylists } = get();
    if (!currentUsername) return;
    
    const updated = userPlaylists.map(p => {
      if (p.id === playlistId) {
        // 检查是否已存在
        if (p.songs.some(s => s.id === song.id)) return p;
        return { ...p, songs: [...p.songs, song] };
      }
      return p;
    });
    set({ userPlaylists: updated });
    savePlaylistsToStorage(currentUsername, updated);
  },
  
  removeFromPlaylist: (playlistId: string, songId: number) => {
    const { currentUsername, userPlaylists } = get();
    if (!currentUsername) return;
    
    const updated = userPlaylists.map(p => {
      if (p.id === playlistId) {
        return { ...p, songs: p.songs.filter(s => s.id !== songId) };
      }
      return p;
    });
    set({ userPlaylists: updated });
    savePlaylistsToStorage(currentUsername, updated);
  },
  
  getPlaylistSongs: (playlistId: string) => {
    const { userPlaylists } = get();
    const playlist = userPlaylists.find(p => p.id === playlistId);
    return playlist?.songs || [];
  },
  
  clearUserPlaylists: () => {
    set({ userPlaylists: [], currentUsername: null });
  },
}));
