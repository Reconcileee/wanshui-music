import { useEffect, useState } from 'react';
import { Home, LayoutGrid, Radio, Music, Search } from 'lucide-react';
import { useMusicStore } from '@/store/useMusicStore';
import { useGlassParams } from '@/store/useGlassParams';
import LiquidGlassBox from './LiquidGlassBox';
import { TabType } from '@/types';

const tabs: { key: TabType; label: string; icon: typeof Home }[] = [
  { key: 'home', label: '主页', icon: Home },
  { key: 'discover', label: '新发现', icon: LayoutGrid },
  { key: 'radio', label: '广播', icon: Radio },
  { key: 'library', label: '资料库', icon: Music },
];

export default function BottomNav() {
  const activeTab = useMusicStore((s) => s.activeTab);
  const setActiveTab = useMusicStore((s) => s.setActiveTab);
  const { params: glassParams } = useGlassParams();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`fixed bottom-6 left-1/2 z-50 w-[90%] max-w-[400px] -translate-x-1/2 transition-all duration-500 ${
        mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}
    >
      <LiquidGlassBox
        className="w-full"
        style={{ borderRadius: Math.min(glassParams.radius, 32) }}
        options={{
          radius: Math.min(glassParams.radius, 32),
          glassThickness: glassParams.glassThickness,
          bezelWidth: glassParams.bezelWidth,
          ior: glassParams.ior,
          scaleRatio: glassParams.scaleRatio,
          blurAmount: glassParams.blurAmount,
          specularOpacity: glassParams.specularOpacity,
          specularSaturation: glassParams.specularSaturation,
        }}
        visualOptions={{
          shadowBlur: glassParams.shadowBlur,
          shadowSpread: glassParams.shadowSpread,
          outerShadowBlur: glassParams.outerShadowBlur,
          tintOpacity: glassParams.tintOpacity,
        }}
      >
        <div className="flex h-16 items-center justify-between px-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className="group relative flex flex-1 flex-col items-center justify-center gap-0.5 py-1 transition-transform duration-150 active:scale-95"
              >
                {/* 激活指示器背景 */}
                {isActive && (
                  <div
                    className="absolute inset-1 rounded-2xl transition-all duration-300"
                    style={{ background: 'rgba(255, 45, 85, 0.12)' }}
                  />
                )}
                <Icon
                  size={22}
                  strokeWidth={isActive ? 2.5 : 1.5}
                  className={`relative z-10 transition-all duration-200 ${
                    isActive ? 'text-[#FF2D55] scale-105' : 'text-white/70'
                  }`}
                />
                <span
                  className={`relative z-10 text-[10px] font-medium transition-all duration-200 ${
                    isActive ? 'text-[#FF2D55] font-semibold' : 'text-white/60'
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}

          {/* 搜索按钮 - 圆形独立样式 */}
          <button
            onClick={() => setActiveTab('search')}
            className="relative mx-1 flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full transition-all duration-150 active:scale-95"
            style={{
              background: activeTab === 'search' ? 'rgba(255,45,85,0.15)' : 'rgba(255,255,255,0.15)',
              boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.2)',
            }}
          >
            <Search
              size={20}
              strokeWidth={activeTab === 'search' ? 2.5 : 1.5}
              className={`transition-all duration-200 ${
                activeTab === 'search' ? 'text-[#FF2D55] scale-105' : 'text-white/70'
              }`}
            />
          </button>
        </div>
      </LiquidGlassBox>
    </div>
  );
}
