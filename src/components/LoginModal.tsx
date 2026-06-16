import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

export default function LoginModal() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCloseButton, setShowCloseButton] = useState(false);
  
  const login = useAuthStore((s) => s.login);
  const closeLoginModal = useAuthStore((s) => s.closeLoginModal);
  const loginError = useAuthStore((s) => s.loginError);

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
        className="absolute inset-0 bg-black/60 backdrop-blur-md animate-fade-in"
        onClick={handleClose}
      />
      
      {/* 登录弹窗 - Apple Music 风格 */}
      <div 
        className="relative z-[301] w-[400px] rounded-2xl animate-slide-up overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, rgba(50, 50, 52, 0.98) 0%, rgba(30, 30, 32, 0.98) 100%)',
          backdropFilter: 'blur(40px) saturate(1.4)',
          WebkitBackdropFilter: 'blur(40px) saturate(1.4)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 24px 80px rgba(0, 0, 0, 0.5), 0 0 0 0.5px rgba(255, 255, 255, 0.1)',
        }}
      >
        {/* 关闭按钮 */}
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white/50 transition-colors hover:bg-white/20 hover:text-white z-[302]"
        >
          <X size={14} />
        </button>
        
        {/* 内容 */}
        <div className="p-8 pt-10">
          {/* Apple Music Logo */}
          <div className="mb-2 flex items-center justify-center gap-2.5">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#fa2d48">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.21-1.96 1.07-3.11-1.05.05-2.31.71-3.06 1.64-.68.84-1.27 2.18-1.11 3.29 1.19.09 2.38-.6 3.1-1.82z" />
            </svg>
            <span className="text-[22px] font-bold text-white tracking-tight">Music</span>
          </div>
          
          {/* 副标题 */}
          <p className="mb-6 text-center text-[13px] text-white/40">
            使用您的 Apple ID 登录
          </p>
          
          {/* 加载动画 */}
          {isLoading && (
            <div className="mb-6 flex items-center justify-center">
              <Loader2 size={28} className="text-[#fa2d48] animate-spin" />
            </div>
          )}
          
          {/* 错误提示 */}
          {loginError && !isLoading && (
            <div className="mb-4 rounded-xl bg-[#fa2d48]/10 border border-[#fa2d48]/20 px-4 py-3 text-[13px] text-[#fa2d48]">
              {loginError}
            </div>
          )}
          
          {/* 表单 */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Apple ID 输入 */}
            <div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Apple ID"
                className="w-full rounded-xl px-4 py-3.5 text-[14px] text-white placeholder:text-white/35 outline-none transition-all duration-300 focus:ring-2 focus:ring-[#fa2d48]/40"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
                autoFocus
                disabled={isLoading}
              />
            </div>
            
            {/* 密码 */}
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="密码"
                className="w-full rounded-xl px-4 py-3.5 text-[14px] text-white placeholder:text-white/35 outline-none transition-all duration-300 focus:ring-2 focus:ring-[#fa2d48]/40"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
                disabled={isLoading}
              />
            </div>
            
            {/* 登录按钮 - Apple Music 红色风格 */}
            <button
              type="submit"
              className="w-full rounded-xl bg-[#fa2d48] px-4 py-3.5 text-[15px] font-semibold text-white transition-all duration-200 hover:bg-[#e0263f] hover:shadow-lg hover:shadow-[#fa2d48]/20 disabled:bg-[#fa2d48]/40 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-5"
              disabled={!username.trim() || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>正在登录...</span>
                </>
              ) : (
                <span>登录</span>
              )}
            </button>
          </form>
          
          {/* 底部链接 */}
          <div className="mt-5 flex items-center justify-center gap-4 text-[12px]">
            <a href="#" className="text-[#4a9eff] hover:underline">忘记 Apple ID？</a>
            <span className="text-white/20">|</span>
            <a href="#" className="text-[#4a9eff] hover:underline">创建 Apple ID</a>
          </div>
          
          {/* 隐私提示 */}
          <p className="mt-4 text-center text-[11px] text-white/30 leading-relaxed">
            您的 Apple ID 信息将按照 Apple 的隐私政策进行处理。
          </p>
        </div>
      </div>
      
      {/* 加载超时关闭按钮 */}
      {showCloseButton && (
        <button
          onClick={handleClose}
          className="absolute bottom-8 z-[302] text-[13px] text-white/40 hover:text-white transition-colors"
        >
          取消
        </button>
      )}
    </div>
  );
}
