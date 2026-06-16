import { useEffect, useState } from 'react';
import { Home, LayoutGrid, Radio, Music, Search } from 'lucide-react';
import { useMusicStore } from '@/store/useMusicStore';
import { TabType } from '@/types';

const tabs: { key: TabType; label: string; icon: typeof Home }[] = [
  { key: 'home', label: '主页', icon: Home },
  { key: 'discover', label: '新发现', icon: LayoutGrid },
  { key: 'radio', label: '广播', icon: Radio },
  { key: 'library', label: '资料库', icon: Music },
  { key: 'search', label: '搜索', icon: Search },
];

export default function BottomNav() {
  const activeTab = useMusicStore((s) => s.activeTab);
  const setActiveTab = useMusicStore((s) => s.setActiveTab);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 transition-all duration-500 ${
        mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}
    >
      {/* 毛玻璃背景 */}
      <div 
        className="w-full"
        style={{
          background: 'rgba(28, 28, 30, 0.85)',
          backdropFilter: 'blur(40px) saturate(1.4)',
          WebkitBackdropFilter: 'blur(40px) saturate(1.4)',
          borderTop: '0.5px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <div className="flex h-[50px] items-center justify-around px-2 max-w-[500px] mx-auto">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className="group relative flex flex-1 flex-col items-center justify-center gap-0.5 py-1 transition-transform duration-100 active:scale-[0.92] min-w-0"
              >
                <Icon
                  size={22}
                  strokeWidth={isActive ? 2.2 : 1.5}
                  className={`transition-all duration-200 ${
                    isActive ? 'text-white' : 'text-white/40'
                  }`}
                />
                <span
                  className={`text-[10px] font-medium transition-all duration-200 ${
                    isActive ? 'text-white' : 'text-white/40'
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
        {/* iOS 风格底部安全区域 */}
        <div className="h-[env(safe-area-inset-bottom,8px)]" />
      </div>
    </div>
  );
}
