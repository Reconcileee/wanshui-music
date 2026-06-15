import { useEffect, useState } from 'react';
import { useMusicStore } from '@/store/useMusicStore';
import { useAuthStore } from '@/store/useAuthStore';
import { GlassParamsProvider } from '@/store/useGlassParams';
import AppleMusicDiscover from '@/pages/AppleMusicDiscover';
import LyricsPage from '@/pages/LyricsPage';
import LoginModal from '@/components/LoginModal';

function AppInner() {
  const initAudio = useMusicStore((s) => s.initAudio);
  const [showLyrics, setShowLyrics] = useState(false);
  const showLoginModal = useAuthStore((s) => s.showLoginModal);

  useEffect(() => {
    initAudio();
  }, [initAudio]);

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
