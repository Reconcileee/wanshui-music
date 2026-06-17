## 1. 架构设计

```mermaid
flowchart TD
    "A[浏览器前端 React + Vite]" --> "B[音频文件上传与解码]"
    "B --> C[Transformers.js 加载 Whisper WASM 模型]"
    "C --> D[Whisper 语音识别 + 时间戳]"
    "D --> E[LRC/SRT 格式生成器]"
    "E --> F[预览与下载]"
    "G[CDN: Hugging Face 模型仓库]" --> "C"
```

纯前端架构，无后端服务。Whisper 模型从 Hugging Face CDN 加载，首次使用后浏览器缓存。

## 2. 技术说明

- **前端**：React 19 + TypeScript + Tailwind CSS 3 + Vite 6
- **初始化工具**：vite-init (react-ts 模板)
- **语音识别**：@huggingface/transformers (Transformers.js) + Whisper 模型
- **图标**：lucide-react
- **后端**：无（纯客户端）
- **数据库**：无

## 3. 路由定义

| 路由 | 用途 |
|-------|---------|
| / | 主页，包含上传、识别、预览、下载全部功能（单页） |

## 4. 核心模块设计

### 4.1 音频处理模块

- 使用 Web Audio API 解码音频文件为 Float32Array
- 采样率转换为 16kHz（Whisper 要求）
- 单声道处理

### 4.2 语音识别模块

- 使用 `pipeline('automatic-speech-recognition', 'Xenova/whisper-base')`
- 支持 `return_timestamps: true` 获取时间戳
- 支持 `language` 参数指定源语言
- 模型选项：tiny / base / small（对应不同精度和速度）

### 4.3 格式生成模块

- **LRC 格式**：`[mm:ss.xx] 歌词文本`
- **SRT 格式**：序号 + `hh:mm:ss,ms --> hh:mm:ss,ms` + 文本

## 5. 项目结构

```
audio-to-lrc-srt/
├── src/
│   ├── components/
│   │   ├── UploadZone.tsx       # 上传区域
│   │   ├── ConfigPanel.tsx      # 语言/模型配置
│   │   ├── ProgressView.tsx     # 识别进度
│   │   ├── ResultPreview.tsx    # 结果预览
│   │   └── Background.tsx       # 背景光晕
│   ├── hooks/
│   │   └── useTranscriber.ts    # 识别逻辑 Hook
│   ├── lib/
│   │   ├── transcribe.ts        # Transformers.js 封装
│   │   └── format.ts            # LRC/SRT 格式生成
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

## 6. 关键技术约束

- **COOP/COEP 头**：Transformers.js 使用 WASM 多线程，Vite 需配置跨源隔离头
- **模型缓存**：浏览器 IndexedDB 自动缓存模型，首次加载较慢
- **内存限制**：大音频文件需分块处理，避免 OOM
- **浏览器兼容**：需支持 Web Audio API、WASM、IndexedDB（Chrome 90+/Firefox 88+/Safari 14+）
