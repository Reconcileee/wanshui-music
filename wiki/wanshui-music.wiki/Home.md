# Wanshui Music Wiki

Apple Music 风格的 Web 音乐播放器，基于 React 19 + Vite + Zustand 构建，采用液态玻璃（Liquid Glass）视觉效果。

## 文档索引

| 文档 | 说明 |
|------|------|
| [[架构概览]] | 项目整体架构、技术栈选型与目录结构 |
| [[状态管理]] | Zustand Store 设计、数据流向与持久化策略 |
| [[页面与组件]] | 页面路由、组件层级与交互关系 |
| [[液态玻璃效果]] | Liquid Glass SVG 滤镜原理与参数控制 |
| [[音频与歌词]] | 播放引擎、LRC/SRT 歌词解析与同步滚动 |

## 快速开始

```bash
npm install
npm run dev      # 启动开发服务器
npm run build    # 构建生产版本
npm run preview  # 预览构建结果
```

## 部署

项目通过 `gh-pages` 部署到 GitHub Pages，base 路径为 `/wanshui-music/`。

```bash
npm run deploy
```
