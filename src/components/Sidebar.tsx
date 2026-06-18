import { useState } from 'react';
import {
  Search,
  Home,
  Compass,
  Radio,
  ExternalLink,
  ListMusic,
  Clock,
  User,
  Disc,
  PlusCircle,
  X,
  Trash2,
  Edit2,
  Check,
} from 'lucide-react';
import { useMusicStore, UserPlaylist } from '@/store/useMusicStore';
import { useAuthStore } from '@/store/useAuthStore';

export default function Sidebar({ activeTab, onTabChange }: { activeTab: string; onTabChange: (tab: string) => void }) {
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
