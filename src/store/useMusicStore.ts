import { create } from 'zustand';
import { Song, TabType } from '@/types';
import { mockSongs } from '@/utils/mockData';

interface MusicState {
  isPlaying: boolean;
  currentSong: Song | null;
  currentIndex: number;
  playlist: Song[];
  activeTab: TabType;
  progress: number;
  audioRef: HTMLAudioElement | null;

  play: () => void;
  pause: () => void;
  toggle: () => void;
  next: () => void;
  prev: () => void;
  playSong: (index: number) => void;
  setActiveTab: (tab: TabType) => void;
  setProgress: (progress: number) => void;
  initAudio: () => void;
}

export const useMusicStore = create<MusicState>((set, get) => ({
  isPlaying: false,
  currentSong: mockSongs[0] || null,
  currentIndex: 0,
  playlist: mockSongs,
  activeTab: 'library',
  progress: 0,
  audioRef: null,

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
}));
