import { create } from 'zustand';

interface AuthState {
  isLoggedIn: boolean;
  showLoginModal: boolean;
  username: string;
  isAdmin: boolean;
  loginError: string;
  
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  openLoginModal: () => void;
  closeLoginModal: () => void;
}

// 管理员账户配置
const ADMIN_ACCOUNT = {
  username: 'Fennmoo',
  password: '////////5056',
};

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  showLoginModal: false,
  username: '',
  isAdmin: false,
  loginError: '',
  
  login: async (username: string, password: string) => {
    // 模拟网络延迟
    await new Promise((resolve) => setTimeout(resolve, 100));
    
    // 验证管理员账户
    if (username === ADMIN_ACCOUNT.username && password === ADMIN_ACCOUNT.password) {
      set({ 
        isLoggedIn: true, 
        username, 
        isAdmin: true,
        showLoginModal: false,
        loginError: ''
      });
      return true;
    }
    
    // 普通用户登录（仅验证用户名不为空）
    if (username.trim()) {
      set({ 
        isLoggedIn: true, 
        username: username.trim(),
        isAdmin: false,
        showLoginModal: false,
        loginError: ''
      });
      return true;
    }
    
    set({ loginError: '用户名或密码错误' });
    return false;
  },
  
  logout: () => {
    set({ isLoggedIn: false, username: '', isAdmin: false });
  },
  
  openLoginModal: () => {
    set({ showLoginModal: true, loginError: '' });
  },
  
  closeLoginModal: () => {
    set({ showLoginModal: false, loginError: '' });
  },
}));