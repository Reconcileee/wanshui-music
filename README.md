# Apple Music 液态玻璃播放器

一个仿 Apple Music 界面风格的 Web 音乐播放器，核心亮点是**从零实现了 iOS 26 Liquid Glass（液态玻璃）视觉效果**——不是简单的 CSS 模糊，而是基于物理折射模型，通过 Canvas 生成位移贴图和高光贴图，组装 SVG 滤镜链，实现真实的玻璃折射、边缘高光和镜面反射。

> **技术栈**: React 19 + TypeScript + Vite + Zustand + Tailwind CSS

---

## 这个项目能做什么？

### 音乐播放

- **完整播放控制** — 播放/暂停、上一首/下一首、进度条、循环播放
- **歌曲列表** — 内置 6 首 Mock 歌曲，点击即可播放（音频来自 SoundHelix 公共资源）
- **歌词页面** — 全屏歌词展示，自动滚动高亮当前行，专辑封面模糊背景

### Apple Music 风格界面

- **发现页** — 精选推荐卡片、瞩目之星、新歌精选、本周新发行、新发布等多个内容区块
- **侧栏导航** — 桌面端左侧固定侧栏（毛玻璃背景），包含探索、资料库、歌单管理
- **底部导航** — 手机端液态玻璃底部导航栏（主页/新发现/广播/资料库/搜索）
- **播放控制栏** — 底部悬浮液态玻璃播放栏，桌面端完整布局，手机端极简布局

### 用户系统

- **登录/注册** — 弹窗式登录界面，管理员需验证密码，普通用户输入任意用户名即可
- **歌单管理** — 登录后可创建/重命名/删除自定义歌单，将歌曲添加到歌单
- **数据持久化** — 用户状态和歌单数据保存在 localStorage，刷新不丢失

### 液态玻璃效果

- **物理折射** — 基于折射率(IOR)计算光线偏折，生成真实的玻璃扭曲效果
- **边缘高光** — 模拟光线在玻璃边缘的镜面反射
- **参数可调** — 内置控制面板，16 个参数实时调节（圆角、厚度、折射率、模糊、阴影、着色等）
- **两种模式** — `clear`（透明玻璃）和 `regular`（标准磨砂玻璃）
- **两种形状** — `squircle`（方圆角）和 `superellipse`（超椭圆，Apple 风格）
- **按压交互** — 支持按下缩放反馈，模拟真实按钮触感

### 响应式设计

| 场景 | 手机端 (<768px) | 桌面端 (>=768px) |
|------|----------------|-----------------|
| 导航 | 底部液态玻璃导航栏 | 左侧固定毛玻璃侧栏 |
| 卡片布局 | 横向滚动 | 网格排列 |
| 播放栏 | 极简布局（封面+歌名+播放/下一首） | 完整布局（控制+封面+进度+音量等） |
| 歌单管理 | 侧栏隐藏 | 侧栏内操作 |

---

## 快速开始

### 环境要求

- Node.js >= 18
- npm >= 9

### 安装与运行

```bash
# 克隆项目
git clone <repository-url>
cd music-player

# 安装依赖
npm install

# 启动开发服务器（默认 http://localhost:5173）
npm run dev
```

打开浏览器访问即可看到效果。点击歌曲可播放音频，点击左上角齿轮图标可打开液态玻璃参数面板。

### 其他命令

```bash
# TypeScript 类型检查
npm run check

# ESLint 代码检查
npm run lint

# 构建生产版本（输出到 dist/）
npm run build

# 预览生产构建
npm run preview

# 构建并部署到 GitHub Pages
npm run deploy
```

---

## 项目架构

```
music-player/
├── src/                              # 主应用源码
│   ├── main.tsx                      # 应用入口，挂载 React 根节点到 #root
│   ├── App.tsx                       # 根组件，组合 GlassParamsProvider 与页面
│   ├── index.css                     # 全局样式：Tailwind 指令、液态玻璃 CSS 变量、动画关键帧、控制面板样式
│   ├── vite-env.d.ts                 # Vite 类型声明
│   │
│   ├── components/                   # UI 组件
│   │   ├── LiquidGlassBox.tsx        # 液态玻璃核心组件（五层结构，详见下方）
│   │   ├── LiquidGlassControls.tsx   # 液态玻璃参数控制面板（滑块+模式切换）
│   │   ├── AppleLiquidGlass.tsx      # 基于 liquid-glass-react 第三方库的封装（备用方案）
│   │   ├── GlassSurface.tsx          # 简易玻璃表面组件（纯 CSS backdrop-filter，轻量版）
│   │   ├── BottomNav.tsx             # 手机端底部导航栏（液态玻璃外壳 + 5 个 Tab）
│   │   ├── MiniPlayer.tsx            # 可拖拽迷你播放器（封面旋转 + 进度条 + 播放控制）
│   │   ├── LoginModal.tsx            # 登录弹窗（毛玻璃背景 + 表单 + 加载动画）
│   │   ├── AlbumCard.tsx             # 专辑卡片（封面 + 歌曲信息 + 播放状态指示）
│   │   ├── AlbumGrid.tsx             # 专辑横向滚动列表
│   │   └── Empty.tsx                 # 空状态占位组件
│   │
│   ├── pages/                        # 页面组件
│   │   ├── AppleMusicDiscover.tsx    # 主页面（发现页 + 侧栏 + 播放栏，项目最复杂的组件）
│   │   ├── LyricsPage.tsx            # 歌词全屏页面（模糊背景 + 自动滚动 + 液态玻璃播放器）
│   │   └── Home.tsx                  # 主页（空占位，待开发）
│   │
│   ├── store/                        # Zustand 状态管理
│   │   ├── useMusicStore.ts          # 音乐播放状态 + 歌单管理 + Audio 元素控制
│   │   ├── useAuthStore.ts           # 用户认证状态 + 登录/退出 + localStorage 持久化
│   │   └── useGlassParams.tsx        # 液态玻璃参数 Context（全局共享参数）
│   │
│   ├── hooks/                        # 自定义 Hooks
│   │   ├── useDraggable.ts           # 可拖拽交互（惯性物理 + 边界反弹 + Pointer Events）
│   │   ├── useLiquidGlass.ts         # 液态玻璃滤镜 Hook（ResizeObserver 自动重建）
│   │   └── useTheme.ts               # 主题切换 Hook（light/dark，localStorage 持久化）
│   │
│   ├── utils/                        # 工具函数
│   │   ├── liquidGlassFilter.ts      # SVG 滤镜生成器（物理折射模型，核心算法）
│   │   ├── liquidGlassManager.ts     # 全局 SVG Defs 管理器（安装/移除/验证滤镜）
│   │   └── mockData.ts               # Mock 歌曲数据（6 首歌曲 + 背景图 URL）
│   │
│   ├── types/                        # TypeScript 类型定义
│   │   └── index.ts                  # Song、TabType 等核心类型
│   │
│   ├── lib/                          # 通用库
│   │   └── utils.ts                  # cn() 工具函数（clsx + tailwind-merge 合并类名）
│   │
│   └── assets/                       # 静态资源
│       └── react.svg                 # React Logo
│
├── apple-music-clone/                # 早期纯 HTML/CSS/JS 原型（非主应用）
│   ├── index.html                    # 原型页面
│   ├── style.css                     # 原型样式
│   └── script.js                     # 原型脚本
│
├── liquid-glass/                     # 液态玻璃效果 Git 子模块（参考实现）
│
├── public/                           # 静态文件（直接复制到构建输出）
│   └── favicon.svg                   # 网站图标
│
├── index.html                        # Vite 入口 HTML（加载 Google Fonts + 热更新脚本）
├── package.json                      # 项目依赖与脚本
├── vite.config.ts                    # Vite 构建配置（路径别名、Trae 角标、sourcemap）
├── tsconfig.json                     # TypeScript 配置（路径别名 @/ → ./src/*）
├── tailwind.config.js                # Tailwind CSS 配置（暗色模式、字体栈）
├── postcss.config.js                 # PostCSS 配置
└── eslint.config.js                  # ESLint 配置
```

---

## 核心模块详解

### 1. 液态玻璃引擎

这是项目最核心的技术模块，实现了 iOS 26 风格的液态玻璃视觉效果。与简单的 `backdrop-filter: blur()` 不同，这里通过**物理折射模型**生成 SVG 滤镜，实现真实的玻璃光学效果。

#### 工作原理

```
用户设置参数（厚度、折射率、圆角等）
       │
       ▼
calculateRefractionProfile()  ── 计算折射位移剖面
       │                            根据表面函数 + IOR + 玻璃厚度
       │                            计算每个采样点的光线偏折方向
       ▼
generateDisplacementMap()     ── 生成折射位移贴图
       │                            Canvas 逐像素计算
       │                            支持 squircle / superellipse 形状
       ▼
generateSpecularMap()         ── 生成高光贴图
       │                            模拟光线在玻璃边缘的镜面反射
       ▼
buildLiquidGlassFilter()      ── 组装 SVG 滤镜链
                                    模糊 → 折射位移 → 饱和度增强
                                    → 高光叠加 → 镜面光照
       │
       ▼
installFilter()               ── 安装到全局 SVG <defs>
       │
       ▼
CSS backdrop-filter: url(#filterId)  ── 浏览器渲染
```

#### `liquidGlassFilter.ts` — SVG 滤镜生成器

| 函数 | 参数 | 返回值 | 说明 |
|------|------|--------|------|
| `calculateRefractionProfile(glassThickness, bezelWidth, heightFn, ior, samples)` | 玻璃厚度、边框宽度、表面函数、折射率、采样数 | `Float64Array` | 根据斯涅尔定律计算折射位移剖面，每个采样点输出光线偏折量 |
| `generateDisplacementMap(w, h, radius, bezelWidth, profile, maxDisp, shape, superellipseN)` | 尺寸、圆角、剖面数据、形状参数 | `string (DataURL)` | Canvas 逐像素生成 R/G 通道位移贴图，用于 `feDisplacementMap` |
| `generateSpecularMap(w, h, radius, bezelWidth, angle, shape, superellipseN)` | 尺寸、圆角、光照角度、形状参数 | `string (DataURL)` | Canvas 生成高光贴图，模拟边缘镜面反射强度 |
| `superellipseDist(x, y, r, n)` | 坐标、半径、指数 | `number` | 超椭圆有符号距离函数，Apple 使用 n≈5 |
| `buildLiquidGlassFilter(filterId, opts)` | 滤镜 ID、完整选项 | `string (SVG)` | 组装 10 步 SVG 滤镜链（完整版） |
| `buildSimpleLiquidGlassFilter(filterId, opts)` | 滤镜 ID、简化选项 | `string (SVG)` | 简化版 fallback 滤镜（纯 SVG feTurbulence，不依赖 Canvas） |

支持的表面函数（`SURFACE_FNS`）：

| 名称 | 函数 | 效果 |
|------|------|------|
| `convex_squircle` | `(1-(1-x)^4)^0.25` | 凸面方圆角（默认，Apple 风格） |
| `convex_circle` | `sqrt(1-(1-x)^2)` | 凸面圆形 |
| `concave` | `1-sqrt(1-(1-x)^2)` | 凹面（内凹效果） |
| `lip` | convex→concave 平滑过渡 | 唇形（边缘凸起+中心凹陷） |

SVG 滤镜链（10 步）：

```
1. feGaussianBlur         → 背景模糊
2. feImage (位移贴图)      → 加载折射位移图
3. feDisplacementMap      → 应用折射扭曲
4. feColorMatrix(saturate) → 饱和度增强
5. feImage (高光贴图)      → 加载高光贴图
6. feComposite            → 高光遮罩饱和度层
7. feComponentTransfer    → 降低高光透明度
8. feBlend(normal)        → 合并饱和度增强
9. feBlend(normal)        → 叠加白色高光层
10. feSpecularLighting + feComposite + feBlend(screen) → 顶部镜面光照
```

#### `liquidGlassManager.ts` — 全局 SVG 管理器

管理页面中唯一的 `<svg id="liquid-glass-svg-root">` 根节点及其 `<defs>`，所有液态玻璃滤镜共享这个 defs。

| 函数 | 说明 |
|------|------|
| `getGlobalSvgDefs()` | 获取/创建全局 SVG defs 元素（懒初始化，首次调用时创建） |
| `installFilter(filterId, filterHtml)` | 安装 SVG 滤镜到全局 defs，使用 DOMParser 正确解析 SVG namespace，安装后验证 |
| `removeFilter(filterId)` | 移除指定 ID 的滤镜（组件卸载时清理） |

#### `LiquidGlassBox.tsx` — 液态玻璃组件

这是面向业务代码的核心组件，采用五层结构实现液态玻璃效果：

```
┌─────────────────────────────────┐
│  Layer 3: 边缘层                │  内阴影 + 1px 边框 + 顶部高光线 + 底部微光
├─────────────────────────────────┤
│  Layer 2: 着色层                │  线性渐变 + tint 颜色（顶部浓→底部淡）
├─────────────────────────────────┤
│  Layer 1: 折射效果层            │  SVG filter 物理折射（backdrop-filter: url(#id)）
├─────────────────────────────────┤
│  Layer 0: 基础模糊层            │  backdrop-filter: blur() saturate()
├─────────────────────────────────┤
│  (背景内容)                     │  被以上四层覆盖/处理的底层内容
├─────────────────────────────────┤
│  Layer 4: 内容层                │  children（用户实际看到的内容）
└─────────────────────────────────┘
```

Props 说明：

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `children` | `ReactNode` | — | 内容 |
| `className` | `string` | `''` | 外层容器类名 |
| `style` | `CSSProperties` | `{}` | 外层容器样式 |
| `options` | `LiquidGlassOptions` | `{}` | 玻璃参数（圆角、厚度、折射率等） |
| `visualOptions` | `object` | `{}` | 视觉参数（阴影、着色等） |
| `effect` | `'clear' \| 'regular' \| 'none'` | `'regular'` | 效果模式 |
| `interactive` | `boolean` | `false` | 是否启用按压交互（按下缩放至 0.97） |
| `animated` | `boolean` | `true` | 是否动画化效果变化 |
| `animationDuration` | `number` | `300` | 动画持续时间(ms) |
| `tintColor` | `string` | — | 着色颜色（支持 hex 和 rgb 格式） |
| `colorScheme` | `'light' \| 'dark' \| 'system'` | `'system'` | 颜色方案 |

效果模式差异：

| 参数 | `clear` | `regular` | `none` |
|------|---------|-----------|--------|
| 模糊量 | 0.3 | 0.5 | 0 |
| 高光透明度 | 0.3 | 0.5 | 0 |
| 着色透明度 | 0.02 | 0.06 | 0 |
| backdrop 模糊 | 16px | 24px | 0 |
| backdrop 饱和度 | 1.3 | 1.6 | 1 |

内部机制：
- 参数变化时通过 `scheduleRebuild` 防抖 150ms 重建滤镜
- 使用 `requestAnimationFrame` 双帧延迟确保元素尺寸正确
- 最多重试 60 次获取有效尺寸
- 滤镜构建失败时自动 fallback 到 `buildSimpleLiquidGlassFilter`
- 组件卸载时自动清理 SVG 滤镜

---

### 2. 状态管理

项目使用 Zustand 管理全局状态，共有 3 个 Store：

#### `useMusicStore.ts` — 音乐播放状态

管理音频播放、播放列表和用户歌单，是项目中最复杂的 Store。

**状态字段：**

| 字段 | 类型 | 初始值 | 说明 |
|------|------|--------|------|
| `isPlaying` | `boolean` | `false` | 是否正在播放 |
| `currentSong` | `Song \| null` | `null` | 当前播放歌曲 |
| `currentIndex` | `number` | `0` | 当前播放索引 |
| `playlist` | `Song[]` | `mockSongs` | 播放列表 |
| `activeTab` | `TabType` | `'library'` | 当前激活的导航标签 |
| `progress` | `number` | `0` | 播放进度（0-1） |
| `audioRef` | `HTMLAudioElement \| null` | `null` | Audio 元素引用 |
| `userPlaylists` | `UserPlaylist[]` | `[]` | 用户自定义歌单列表 |
| `currentUsername` | `string \| null` | `null` | 当前登录用户名 |

**方法：**

| 方法 | 参数 | 说明 |
|------|------|------|
| `initAudio()` | — | 创建 Audio 元素，绑定 `ended`（自动下一首）和 `timeupdate`（更新进度）事件 |
| `play()` | — | 播放当前歌曲，若 Audio src 不匹配则更新 |
| `pause()` | — | 暂停播放 |
| `toggle()` | — | 切换播放/暂停（若 Audio 未初始化则先初始化） |
| `next()` | — | 下一首（循环，到末尾回到第一首） |
| `prev()` | — | 上一首（循环，到开头跳到末尾） |
| `playSong(index)` | `index: number` | 播放指定索引的歌曲 |
| `setActiveTab(tab)` | `tab: TabType` | 切换导航标签 |
| `setProgress(progress)` | `progress: number` | 设置播放进度 |
| `loadUserPlaylists(username)` | `username: string` | 从 localStorage 加载用户歌单，若无则创建默认"喜欢的歌曲"歌单 |
| `createPlaylist(name)` | `name: string` | 创建新歌单（ID 格式：`playlist-{timestamp}`） |
| `deletePlaylist(playlistId)` | `playlistId: string` | 删除歌单（不可删除 ID 为 `favorites` 的默认歌单） |
| `renamePlaylist(playlistId, newName)` | — | 重命名歌单 |
| `addToPlaylist(playlistId, song)` | — | 添加歌曲到歌单（自动去重，同一首歌不会重复添加） |
| `removeFromPlaylist(playlistId, songId)` | — | 从歌单移除歌曲 |
| `getPlaylistSongs(playlistId)` | — | 获取歌单中的歌曲列表 |
| `clearUserPlaylists()` | — | 清空用户歌单（退出登录时调用） |

**持久化策略：**
- 歌单数据保存在 `localStorage`，key 格式：`music-player-playlist-{username}`
- 每次增删改操作后立即保存
- 新用户默认创建"喜欢的歌曲"歌单

#### `useAuthStore.ts` — 认证状态

| 字段 | 类型 | 初始值 | 说明 |
|------|------|--------|------|
| `isLoggedIn` | `boolean` | 从 localStorage 恢复 | 是否已登录 |
| `showLoginModal` | `boolean` | `false` | 是否显示登录弹窗 |
| `username` | `string` | 从 localStorage 恢复 | 当前用户名 |
| `isAdmin` | `boolean` | 从 localStorage 恢复 | 是否管理员 |
| `loginError` | `string` | `''` | 登录错误信息 |

| 方法 | 说明 |
|------|------|
| `login(username, password)` | 异步登录。管理员账户验证用户名+密码；普通用户仅需非空用户名。模拟 100ms 网络延迟 |
| `logout()` | 退出登录，清空用户信息 |
| `openLoginModal()` | 打开登录弹窗 |
| `closeLoginModal()` | 关闭登录弹窗，清空错误信息 |

**持久化：** key 为 `music-player-auth`，保存 `isLoggedIn`、`username`、`isAdmin`。

**登录逻辑：**
1. 管理员账户（硬编码用户名 `Fennmoo` + 密码）→ `isAdmin: true`
2. 任意非空用户名 → `isAdmin: false`
3. 空用户名 → 显示"用户名或密码错误"

#### `useGlassParams.tsx` — 液态玻璃参数 Context

使用 React Context + useState 管理全局液态玻璃参数，供所有 `LiquidGlassBox` 实例共享。

| 导出 | 类型 | 说明 |
|------|------|------|
| `GlassParamsProvider` | Component | Context Provider，包裹在 App 外层 |
| `useGlassParams()` | Hook | 返回 `{ params, setParams }` |

默认参数定义在 `LiquidGlassControls.tsx` 的 `DEFAULT_GLASS_PARAMS` 中。

---

### 3. 页面组件

#### `AppleMusicDiscover.tsx` — 主页面

项目最复杂最大的组件（约 845 行），包含完整的发现页布局。内部定义了以下子组件：

| 子组件 | 说明 | 关键特性 |
|--------|------|----------|
| `Sidebar` | 桌面端侧栏导航 | fixed 定位 + 毛玻璃背景（`backdrop-filter: blur(40px)`），包含 Logo、搜索、主导航（主页/新发现/广播）、资料库（最近添加/艺人/专辑/歌曲）、歌单管理（新建/重命名/删除）、登录/退出 |
| `FeaturedCard` | 精选推荐大卡片 | 16:10（桌面）或 1:1（手机）比例，渐变遮罩，悬停放大+播放按钮 |
| `SmallCard` | 小型卡片 | 1:1 比例，用于专辑/歌单展示，悬停上浮+播放按钮 |
| `SongRow` | 歌曲行 | 封面缩略图 + 标题 + 艺人 + 专辑 + 更多菜单（三点按钮→添加到歌单） |
| `AddToPlaylistMenu` | 添加到歌单弹出菜单 | 未登录显示"请先登录"，已登录显示歌单列表 |
| `SectionHeader` | 区块标题 | 标题文字 + 右箭头 |
| `SearchBar` | 搜索栏 | 聚焦时背景变亮，支持清除输入 |
| `PlayerBar` | 底部播放控制栏 | 液态玻璃外壳，桌面端：完整控制（随机/上一首/播放/下一首/循环 + 封面+歌名 + 进度条 + 歌词/音量/更多）；手机端：封面+歌名+播放/下一首 |

页面内容区块（从上到下）：
1. **搜索栏** — 全宽搜索输入
2. **精选推荐** — 3 张大卡片
3. **瞩目之星** — 6 张小卡片
4. **新歌精选** — 8 首歌曲列表
5. **本周新发行** — 6 张小卡片
6. **新发布** — 6 张小卡片

#### `LyricsPage.tsx` — 歌词全屏页面

| 特性 | 实现方式 |
|------|----------|
| 模糊背景 | 当前歌曲封面 + `filter: blur(60px) brightness(0.4)` + `scale(1.2)` |
| 渐变遮罩 | `bg-gradient-to-b from-black/60 via-black/40 to-black/70` |
| 歌词同步 | `setInterval(100ms)` 模拟播放进度，根据时间匹配当前歌词行 |
| 自动滚动 | `container.scrollTo()` 平滑滚动到当前行居中位置 |
| 行高亮 | 当前行：白色 + 22px + 加粗 + 放大 1.05；已播放：30% 透明度；未播放：50% 透明度 |
| 底部播放器 | 液态玻璃外壳 + 播放控制 + 实时进度条 |

歌词数据格式：
```typescript
interface LyricLine {
  time: number;  // 秒
  text: string;  // 歌词文本，空字符串表示间奏
}
```

---

### 4. UI 组件

#### `BottomNav.tsx` — 手机端底部导航

- 液态玻璃外壳（`LiquidGlassBox`）
- 5 个 Tab：主页(Home)、新发现(LayoutGrid)、广播(Radio)、资料库(Music)、搜索(Search)
- 激活 Tab 显示红色高亮背景 + 红色图标
- 搜索按钮为独立圆形样式
- 入场动画：延迟 200ms 后从下方滑入

#### `MiniPlayer.tsx` — 可拖拽迷你播放器

- 使用 `useDraggable` Hook 实现拖拽（含惯性物理）
- 封面旋转动画：播放时以 `delta * 0.045` 角速度旋转，暂停时停止
- 进度条：白色填充 + 发光圆点指示器
- 播放/暂停 + 下一首按钮

#### `LoginModal.tsx` — 登录弹窗

- 全屏遮罩 + 居中弹窗
- 毛玻璃背景（`backdrop-filter: blur(40px)`）
- Music Logo + 标题 + 用户名/密码表单
- 加载动画（Loader2 旋转）
- 加载超过 5 秒后显示左上角关闭按钮
- 错误提示（红色边框）

#### `AlbumCard.tsx` — 专辑卡片

- 3:4 比例封面图
- 当前播放歌曲：红色边框 + 均衡器动画
- 悬停：封面放大 + 播放按钮遮罩
- Apple Music Logo 角标

#### `AlbumGrid.tsx` — 专辑横向列表

- 使用 `mockSongs` 数据渲染 `AlbumCard` 列表
- 横向滚动 + 入场交错动画（每张卡片延迟 80ms）

#### `GlassSurface.tsx` — 简易玻璃表面

- 纯 CSS 实现的轻量玻璃效果
- `backdrop-filter: blur(20px) saturate(1.4)` + 半透明白色背景 + 内阴影
- 适用于不需要物理折射的简单场景

#### `AppleLiquidGlass.tsx` — 第三方库封装

- 封装 `liquid-glass-react` 库
- 支持 4 种模式：standard / polar / prominent / shader
- 可配置位移强度、模糊、饱和度、色散、弹性、圆角等
- 作为 `LiquidGlassBox` 的备选方案

---

### 5. 自定义 Hooks

#### `useDraggable<T>` — 可拖拽交互

```typescript
function useDraggable<T extends HTMLElement>(options?: {
  initialPosition?: { x: number; y: number };  // 初始位置
  boundaryPadding?: number;                      // 边界留白（默认 16px）
  inertia?: boolean;                             // 是否启用惯性（默认 true）
}): React.RefObject<T>;
```

特性：
- **Pointer Events** — 同时支持鼠标和触摸
- **惯性物理** — 释放后按速度继续滑动，摩擦系数 0.92
- **边界碰撞** — 碰到边界反弹（速度乘以 -0.3）
- **速度计算** — 基于 `performance.now()` 计算拖拽速度
- **释放过渡** — 无惯性时使用 `cubic-bezier(0.32, 0.72, 0, 1)` 缓动

#### `useLiquidGlass<T>` — 液态玻璃滤镜 Hook

```typescript
function useLiquidGlass<T extends HTMLElement>(
  options?: Omit<LiquidGlassOptions, 'width' | 'height'>
): { ref: RefObject<T>; filterId: string; glassClass: string };
```

特性：
- 自动监听元素尺寸变化（`ResizeObserver`）
- 尺寸变化时 150ms 防抖重建滤镜
- 初始化延迟 300ms 确保元素已渲染
- 通过 CSS 自定义属性 `--lg-filter` 传递滤镜 URL

#### `useTheme` — 主题切换

```typescript
function useTheme(): {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  isDark: boolean;
};
```

- 初始值优先从 `localStorage` 读取，其次使用 `prefers-color-scheme` 媒体查询
- 切换时更新 `document.documentElement` 的 class
- 持久化到 `localStorage`

---

### 6. 类型定义

```typescript
// 歌曲数据结构
interface Song {
  id: number;
  title: string;      // 歌曲标题
  artist: string;     // 艺人名称
  album: string;      // 专辑名称
  cover: string;      // 封面图片 URL
  audioUrl: string;   // 音频文件 URL
  duration: number;   // 时长（秒）
}

// 导航标签类型
type TabType = 'home' | 'discover' | 'radio' | 'library' | 'search';

// 用户歌单结构
interface UserPlaylist {
  id: string;         // 歌单 ID（默认歌单为 'favorites'）
  name: string;       // 歌单名称
  songs: Song[];      // 歌曲列表
  createdAt: number;  // 创建时间戳
}

// 液态玻璃选项
interface LiquidGlassOptions {
  width: number;              // 元素宽度
  height: number;             // 元素高度
  radius?: number;            // 圆角半径（默认 60）
  glassThickness?: number;    // 玻璃厚度（默认 60）
  bezelWidth?: number;        // 边框宽度（默认 40）
  ior?: number;               // 折射率（默认 2.5）
  scaleRatio?: number;        // 缩放比（默认 1.0）
  blurAmount?: number;        // 模糊量（默认 0.5）
  specularOpacity?: number;   // 高光透明度（默认 0.6）
  specularSaturation?: number;// 高光饱和度（默认 5）
  enableFallback?: boolean;   // 是否启用 fallback 滤镜
  shape?: 'squircle' | 'superellipse';  // 形状类型
  superellipseN?: number;     // 超椭圆指数（默认 5）
  effect?: 'clear' | 'regular';         // 效果模式
}
```

---

## 数据流

```
用户交互
  │
  ├─ 播放控制 ──→ useMusicStore.play/pause/toggle/next/prev
  │                    │
  │                    ├─ 更新 isPlaying / currentSong / currentIndex 状态
  │                    │
  │                    └─ 操作 HTMLAudioElement ──→ 浏览器音频输出
  │                                                      │
  │                                                      └─ timeupdate 事件
  │                                                           └─ 更新 progress 状态
  │                                                               └─ UI 进度条更新
  │
  ├─ 登录/退出 ──→ useAuthStore.login/logout
  │                    │
  │                    ├─ 更新 isLoggedIn / username / isAdmin 状态
  │                    │
  │                    ├─ 保存到 localStorage（music-player-auth）
  │                    │
  │                    └─ App.tsx useEffect 监听 isLoggedIn 变化
  │                         ├─ 登录 → useMusicStore.loadUserPlaylists(username)
  │                         └─ 退出 → useMusicStore.clearUserPlaylists()
  │
  ├─ 歌单操作 ──→ useMusicStore.createPlaylist/addToPlaylist/...
  │                    │
  │                    ├─ 更新 userPlaylists 状态
  │                    │
  │                    └─ 保存到 localStorage（music-player-playlist-{username}）
  │
  └─ 玻璃参数调节 ──→ LiquidGlassControls.onChange
                         │
                         └─ GlassParamsContext.setParams
                              │
                              └─ 所有 LiquidGlassBox 实例接收新参数
                                   │
                                   └─ scheduleRebuild (150ms 防抖)
                                        │
                                        ├─ buildLiquidGlassFilter() ──→ SVG 滤镜 HTML
                                        │     │
                                        │     ├─ calculateRefractionProfile() ──→ 折射剖面
                                        │     ├─ generateDisplacementMap() ──→ 位移贴图 DataURL
                                        │     └─ generateSpecularMap() ──→ 高光贴图 DataURL
                                        │
                                        ├─ installFilter() ──→ 全局 SVG <defs>
                                        │
                                        └─ CSS backdrop-filter: url(#filterId) ──→ 浏览器渲染
```

---

## 依赖关系

### 运行时依赖

| 包名 | 版本 | 用途 | 使用位置 |
|------|------|------|----------|
| `react` | ^19.2.7 | UI 框架 | 全局 |
| `react-dom` | ^19.2.7 | React DOM 渲染 | main.tsx |
| `react-router-dom` | ^7.3.0 | 路由管理 | 已引入，待深度使用 |
| `zustand` | ^5.0.14 | 轻量状态管理 | useMusicStore, useAuthStore |
| `liquid-glass-react` | ^1.1.1 | 第三方液态玻璃效果库 | AppleLiquidGlass 组件 |
| `lucide-react` | ^0.511.0 | 图标库 | 全局（30+ 图标） |
| `clsx` | ^2.1.1 | 条件类名合并 | cn() 工具函数 |
| `tailwind-merge` | ^3.0.2 | Tailwind 类名智能去重 | cn() 工具函数 |

### 开发依赖

| 包名 | 用途 |
|------|------|
| `vite` | 构建工具，开发服务器 |
| `@vitejs/plugin-react` | React Fast Refresh（Babel 方案） |
| `vite-tsconfig-paths` | 支持 tsconfig paths 别名（`@/` → `./src/*`） |
| `vite-plugin-trae-solo-badge` | Trae Solo 角标插件（生产环境右下角） |
| `typescript` | 类型检查 |
| `tailwindcss` | 原子化 CSS 框架 |
| `postcss` | CSS 处理器 |
| `autoprefixer` | 自动添加浏览器前缀 |
| `eslint` | 代码检查 |
| `typescript-eslint` | TypeScript ESLint 规则 |
| `eslint-plugin-react-hooks` | React Hooks 规则 |
| `eslint-plugin-react-refresh` | React Refresh 规则 |
| `gh-pages` | GitHub Pages 部署工具 |
| `babel-plugin-react-dev-locator` | 开发时点击定位组件源码 |

---

## 构建配置要点

| 配置项 | 值 | 说明 |
|--------|-----|------|
| Base Path | `/wanshui-music/` | GitHub Pages 部署子路径 |
| 路径别名 | `@/` → `./src/*` | tsconfig.json + vite-tsconfig-paths |
| Sourcemap | `hidden` | 构建时生成但不暴露给用户 |
| 字体 | Inter + Noto Sans SC | Google Fonts CDN，支持中英文 |
| Tailwind darkMode | `class` | 通过 HTML class 切换暗色模式 |
| TypeScript target | ES2020 | 现代浏览器支持 |
| TypeScript strict | `false` | 未启用严格模式 |

---

## 液态玻璃参数参考

通过 `LiquidGlassControls` 控制面板（左上角齿轮图标）可实时调节以下参数：

### 形状参数

| 参数 | 默认值 | 范围 | 说明 |
|------|--------|------|------|
| `radius` | 60 | 8-100 | 圆角半径（px），值越大越圆 |
| `superellipseN` | 5 | 2-10 | 超椭圆指数，Apple 使用 n≈5；n=2 为椭圆，n→∞ 为矩形 |

### 折射参数

| 参数 | 默认值 | 范围 | 说明 |
|------|--------|------|------|
| `glassThickness` | 80 | 10-200 | 玻璃厚度，影响折射位移量 |
| `bezelWidth` | 60 | 2-60 | 边框宽度，影响折射区域宽度 |
| `ior` | 3.0 | 1.0-3.0 | 折射率(Index of Refraction)，玻璃约 1.5，钻石 2.4，值越大扭曲越强 |
| `scaleRatio` | 1.0 | 0.0-2.0 | 位移缩放比，整体放大/缩小折射效果 |

### 外观参数

| 参数 | 默认值 | 范围 | 说明 |
|------|--------|------|------|
| `blurAmount` | 0.3 | 0-8 | 背景模糊量，值越大越模糊 |
| `specularOpacity` | 0.5 | 0-1 | 高光透明度，0=无高光，1=最强高光 |
| `specularSaturation` | 4 | 0-12 | 高光区域饱和度增强，让透过玻璃的颜色更鲜艳 |

### 阴影参数

| 参数 | 默认值 | 范围 | 说明 |
|------|--------|------|------|
| `shadowBlur` | 20 | 0-40 | 内阴影模糊半径 |
| `shadowSpread` | -5 | -15~10 | 内阴影扩散，负值=收缩 |
| `outerShadowBlur` | 24 | 0-50 | 外阴影模糊半径，营造悬浮感 |

### 着色参数

| 参数 | 默认值 | 范围 | 说明 |
|------|--------|------|------|
| `tintOpacity` | 0.06 | 0-0.4 | 着色透明度，0=完全透明，0.4=明显着色 |
| `tintR` | 255 | 0-255 | 着色颜色 R 分量 |
| `tintG` | 255 | 0-255 | 着色颜色 G 分量 |
| `tintB` | 255 | 0-255 | 着色颜色 B 分量 |

---

## 全局样式与动画

`index.css` 中定义了以下关键样式和动画：

### 液态玻璃 CSS

| 类名 | 说明 |
|------|------|
| `.liquid-glass-surface` | 三层液态玻璃表面（外阴影 + `::before`内阴影/着色 + `::after` SVG 滤镜折射） |
| `.liquid-glass-surface-dark` | 深色模式变体（调整阴影和着色参数） |

### 动画

| 类名 | 效果 | 时长 |
|------|------|------|
| `.animate-pulse-glow` | 播放按钮脉冲发光 | 2s infinite |
| `.animate-spin-slow` | 封面慢速旋转 | 8s linear infinite |
| `.animate-slide-up` | 从底部滑入 | 0.5s |
| `.animate-fade-in` | 淡入 | 0.6s |
| `.animate-card-enter` | 卡片入场（上移+缩放） | 0.5s |
| `.animate-page-enter` | 页面入场（轻微上移） | 0.4s |
| `.animate-stagger-1~6` | 卡片交错延迟 | 0.05s~0.3s |
| `.animate-hover-glow` | 悬停红色发光 | 1.5s infinite |

### 控制面板样式

| 类名 | 说明 |
|------|------|
| `.lg-ctrl-toggle` | 控制面板切换按钮（fixed 定位，毛玻璃背景） |
| `.lg-ctrl-panel` | 控制面板（侧滑抽屉，桌面端左侧，手机端底部） |
| `.lg-ctrl-slider` | 参数滑块（紫色主题 `accent-color: #8b7cf7`） |

---

## 常见问题

### 为什么液态玻璃效果没有显示？

1. 确保浏览器支持 `backdrop-filter`（Chrome 76+, Safari 9+, Firefox 103+）
2. 液态玻璃需要元素下方有内容才能看到效果（模糊和折射作用于背景）
3. 如果 Canvas 生成失败，会自动 fallback 到简化版滤镜

### 如何修改默认歌曲数据？

编辑 `src/utils/mockData.ts`，修改 `mockSongs` 数组中的歌曲信息。每首歌需要提供 `id`、`title`、`artist`、`album`、`cover`（图片URL）、`audioUrl`（音频URL）、`duration`（秒）。

### 如何调整液态玻璃效果？

1. 点击左上角齿轮图标打开控制面板
2. 调节滑块实时预览效果
3. 点击"重置"恢复默认参数
4. 修改 `LiquidGlassControls.tsx` 中的 `DEFAULT_GLASS_PARAMS` 可永久更改默认值

### 如何部署到 GitHub Pages？

```bash
# 1. 修改 vite.config.ts 中的 base 为你的仓库名
base: '/your-repo-name/',

# 2. 构建并部署
npm run deploy
```

### 手机端和桌面端有什么区别？

| 功能 | 手机端 | 桌面端 |
|------|--------|--------|
| 导航方式 | 底部导航栏 | 左侧侧栏 |
| 卡片布局 | 横向滚动 | 网格排列 |
| 播放栏 | 极简（封面+歌名+2按钮） | 完整（所有控制） |
| 歌单管理 | 需展开侧栏 | 侧栏直接操作 |
| 控制面板 | 底部抽屉 | 左侧抽屉 |
