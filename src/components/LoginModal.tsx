import { useState, useEffect } from 'react';
import { X, Music, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

export default function LoginModal() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCloseButton, setShowCloseButton] = useState(false);
  
  const login = useAuthStore((s) => s.login);
  const closeLoginModal = useAuthStore((s) => s.closeLoginModal);
  const loginError = useAuthStore((s) => s.loginError);

  // 加载超过5秒后显示关闭按钮
  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setShowCloseButton(true);
      }, 5000);
      return () => clearTimeout(timer);
    } else {
      setShowCloseButton(false);
    }
  }, [isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    
    setIsLoading(true);
    try {
      await login(username.trim(), password);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    closeLoginModal();
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center">
      {/* 遮罩层 */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={handleClose}
      />
      
      {/* 登录弹窗 */}
      <div 
        className="relative z-[301] w-[420px] rounded-2xl animate-slide-up"
        style={{
          background: 'rgba(35, 35, 36, 0.95)',
          backdropFilter: 'blur(40px) saturate(1.4)',
          WebkitBackdropFilter: 'blur(40px) saturate(1.4)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25)',
        }}
      >
        {/* 内部阴影层 */}
        <div 
          className="absolute inset-0 pointer-events-none rounded-2xl"
          style={{
            boxShadow: 'inset 0 0 20px -5px rgba(255, 255, 255, 0.08)',
          }}
        />
        
        {/* 左上角关闭按钮 - 加载超过5秒后显示 */}
        {showCloseButton && (
          <button 
            onClick={handleClose}
            className="absolute top-4 left-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/50 transition-colors hover:bg-white/18 hover:text-white z-[302]"
          >
            <X size={16} />
          </button>
        )}
        
        {/* 右上角关闭按钮 */}
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/50 transition-colors hover:bg-white/18 hover:text-white z-[302]"
        >
          <X size={16} />
        </button>
        
        {/* 内容 */}
        <div className="relative p-8">
          {/* Logo */}
          <div className="mb-8 flex items-center justify-center gap-3">
            <Music size={32} className="text-[#fa2d48]" />
            <span className="text-[24px] font-bold text-white tracking-tight">Music</span>
          </div>
          
          {/* 标题 */}
          <h2 className="mb-6 text-center text-[20px] font-semibold text-white">
            登录以享受完整体验
          </h2>
          
          {/* 加载动画 */}
          {isLoading && (
            <div className="mb-6 flex items-center justify-center">
              <Loader2 size={32} className="text-[#fa2d48] animate-spin" />
            </div>
          )}
          
          {/* 错误提示 */}
          {loginError && !isLoading && (
            <div className="mb-4 rounded-lg bg-[#fa2d48]/10 border border-[#fa2d48]/20 px-4 py-3 text-[13px] text-[#fa2d48]">
              {loginError}
            </div>
          )}
          
          {/* 表单 */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 用户名 */}
            <div>
              <label className="mb-2 block text-[13px] font-medium text-white/60">
                用户名
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="请输入用户名"
                className="w-full rounded-xl px-4 py-3 text-[14px] text-white placeholder:text-white/40 outline-none transition-all duration-300 focus:bg-white/[0.12]"
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
                autoFocus
                disabled={isLoading}
              />
            </div>
            
            {/* 密码 */}
            <div>
              <label className="mb-2 block text-[13px] font-medium text-white/60">
                密码
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="请输入密码"
                className="w-full rounded-xl px-4 py-3 text-[14px] text-white placeholder:text-white/40 outline-none transition-all duration-300 focus:bg-white/[0.12]"
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
                disabled={isLoading}
              />
            </div>
            
            {/* 登录按钮 */}
            <button
              type="submit"
              className="w-full rounded-xl bg-[#fa2d48] px-4 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-[#e0263f] disabled:bg-[#fa2d48]/50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              disabled={!username.trim() || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>登录中...</span>
                </>
              ) : (
                <span>登录</span>
              )}
            </button>
          </form>
          
          {/* 提示 */}
          <p className="mt-6 text-center text-[12px] text-white/40">
            登录后可访问您的音乐库和个性化推荐
          </p>
        </div>
      </div>
    </div>
  );
}