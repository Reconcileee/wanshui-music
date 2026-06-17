import { useState, useCallback } from 'react';
import { Sparkles, Zap } from 'lucide-react';
import Background from '@/components/Background';
import UploadZone, { type AudioFileInfo } from '@/components/UploadZone';
import ConfigPanel, { type ConfigState } from '@/components/ConfigPanel';
import ProgressView from '@/components/ProgressView';
import ResultPreview from '@/components/ResultPreview';
import { useTranscriber } from '@/hooks/useTranscriber';

const DEFAULT_CONFIG: ConfigState = {
  engine: 'local',
  language: 'auto',
  whisperModel: 'base',
  azureKey: '',
  azureRegion: '',
};

export default function App() {
  const [audioFile, setAudioFile] = useState<AudioFileInfo | null>(null);
  const [config, setConfig] = useState<ConfigState>(DEFAULT_CONFIG);
  const transcriber = useTranscriber();

  const isActive = transcriber.state.status === 'loading' || transcriber.state.status === 'recognizing';

  const handleStart = useCallback(() => {
    if (!audioFile) return;

    if (config.engine === 'local') {
      transcriber.startLocal(audioFile.audioData, config.whisperModel, config.language);
    } else {
      if (!config.azureKey || !config.azureRegion) return;
      transcriber.startAzure(audioFile.file, config.azureKey, config.azureRegion, config.language);
    }
  }, [audioFile, config, transcriber]);

  const handleRemoveFile = useCallback(() => {
    setAudioFile(null);
    transcriber.reset();
  }, [transcriber]);

  const canStart = (() => {
    if (!audioFile) return false;
    if (isActive) return false;
    if (config.engine === 'azure' && (!config.azureKey || !config.azureRegion)) return false;
    return true;
  })();

  return (
    <div className="relative min-h-screen">
      <Background />

      <main className="relative z-10 max-w-[720px] mx-auto px-5 py-12 md:py-20">
        {/* 标题区 */}
        <header className="text-center mb-10 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/20 mb-5">
            <Sparkles className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span className="text-[13px] font-medium text-[var(--accent)]">AI 驱动</span>
          </div>
          <h1 className="text-[32px] md:text-[40px] font-bold tracking-tight leading-tight">
            音频转字幕
          </h1>
          <p className="text-[15px] text-[var(--text-secondary)] mt-3 max-w-[480px] mx-auto leading-relaxed">
            上传音频文件，自动识别语音并生成带时间戳的 LRC 歌词和 SRT 字幕文件
          </p>
        </header>

        {/* 内容区 */}
        <div className="space-y-4">
          {/* 上传区 */}
          <UploadZone
            onFileLoaded={setAudioFile}
            currentFile={audioFile}
            onRemoveFile={handleRemoveFile}
            disabled={isActive}
          />

          {/* 配置面板 */}
          {audioFile && (
            <ConfigPanel
              config={config}
              onChange={setConfig}
              disabled={isActive}
            />
          )}

          {/* 开始识别按钮 */}
          {audioFile && transcriber.state.status === 'idle' && (
            <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <button
                onClick={handleStart}
                disabled={!canStart}
                className="btn-primary w-full"
              >
                <Zap className="w-5 h-5" />
                生成字幕
              </button>
            </div>
          )}

          {/* 进度展示 */}
          <ProgressView
            state={transcriber.state}
            onCancel={transcriber.cancel}
          />

          {/* 结果预览 */}
          {transcriber.state.status === 'done' && transcriber.state.segments.length > 0 && (
            <ResultPreview
              segments={transcriber.state.segments}
              fileName={audioFile?.name || 'audio'}
            />
          )}
        </div>

        {/* 底部信息 */}
        <footer className="text-center mt-12 text-[12px] text-[var(--text-tertiary)]">
          <p>所有音频处理均在浏览器本地完成，不会上传至服务器</p>
        </footer>
      </main>
    </div>
  );
}
