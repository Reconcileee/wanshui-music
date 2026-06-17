import { useEffect, useState } from 'react';
import { useMusicStore } from '@/store/useMusicStore';
import { useAuthStore } from '@/store/useAuthStore';
import { GlassParamsProvider } from '@/store/useGlassParams';
import AppleMusicDiscover from '@/pages/AppleMusicDiscover';
import LyricsPage from '@/pages/LyricsPage';
import LoginModal from '@/components/LoginModal';
import { loadLocalSongs } from '@/utils/mockData';

function AppInner() {
  const initAudio = useMusicStore((s) => s.initAudio);
  const loadUserPlaylists = useMusicStore((s) => s.loadUserPlaylists);
  const clearUserPlaylists = useMusicStore((s) => s.clearUserPlaylists);
  const addSongsToPlaylist = useMusicStore((s) => s.addSongsToPlaylist);
  const [showLyrics, setShowLyrics] = useState(false);
  const showLoginModal = useAuthStore((s) => s.showLoginModal);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const username = useAuthStore((s) => s.username);

  useEffect(() => {
    initAudio();
  }, [initAudio]);

  // 加载本地歌曲
  useEffect(() => {
    loadLocalSongs().then(songs => {
      if (songs.length > 0) addSongsToPlaylist(songs);
    });
  }, [addSongsToPlaylist]);

  // 用户登录状态变化时加载/清除歌单
  useEffect(() => {
    if (isLoggedIn && username) {
      loadUserPlaylists(username);
    } else {
      clearUserPlaylists();
    }
  }, [isLoggedIn, username, loadUserPlaylists, clearUserPlaylists]);

  return (
    <>
      <AppleMusicDiscover onOpenLyrics={() => setShowLyrics(true)} />
      {showLyrics && <LyricsPage onClose={() => setShowLyrics(false)} />}
      {showLoginModal && <LoginModal />}
    </>
  );
}

export default function App() {
  return (
    <GlassParamsProvider>
      <AppInner />
    </GlassParamsProvider>
  );
}
