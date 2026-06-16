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

// localStorage key
const AUTH_STORAGE_KEY = 'music-player-auth';

// 从 localStorage 加载用户状态
function loadAuthFromStorage(): Partial<AuthState> {
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        isLoggedIn: parsed.isLoggedIn || false,
        username: parsed.username || '',
        isAdmin: parsed.isAdmin || false,
      };
    }
  } catch {
    // ignore
  }
  return {};
}

// 保存用户状态到 localStorage
function saveAuthToStorage(state: Partial<AuthState>) {
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
      isLoggedIn: state.isLoggedIn,
      username: state.username,
      isAdmin: state.isAdmin,
    }));
  } catch {
    // ignore
  }
}

// 初始化状态
const initialState = loadAuthFromStorage();

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: initialState.isLoggedIn || false,
  showLoginModal: false,
  username: initialState.username || '',
  isAdmin: initialState.isAdmin || false,
  loginError: '',
  
  login: async (username: string, password: string) => {
    // 模拟网络延迟
    await new Promise((resolve) => setTimeout(resolve, 100));
    
    // 验证管理员账户
    if (username === ADMIN_ACCOUNT.username && password === ADMIN_ACCOUNT.password) {
      const newState = { 
        isLoggedIn: true, 
        username, 
        isAdmin: true,
        showLoginModal: false,
        loginError: ''
      };
      set(newState);
      saveAuthToStorage(newState);
      return true;
    }
    
    // 普通用户登录（仅验证用户名不为空）
    if (username.trim()) {
      const newState = { 
        isLoggedIn: true, 
        username: username.trim(),
        isAdmin: false,
        showLoginModal: false,
        loginError: ''
      };
      set(newState);
      saveAuthToStorage(newState);
      return true;
    }
    
    set({ loginError: '用户名或密码错误' });
    return false;
  },
  
  logout: () => {
    const newState = { isLoggedIn: false, username: '', isAdmin: false };
    set(newState);
    saveAuthToStorage(newState);
  },
  
  openLoginModal: () => {
    set({ showLoginModal: true, loginError: '' });
  },
  
  closeLoginModal: () => {
    set({ showLoginModal: false, loginError: '' });
  },
}));