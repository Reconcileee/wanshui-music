export interface Song {
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

export type TabType = 'home' | 'discover' | 'radio' | 'library' | 'search';
