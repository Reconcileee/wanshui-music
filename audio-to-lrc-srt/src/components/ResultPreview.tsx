import { useState } from 'react';
import { Download, Copy, Check, FileText, Subtitles } from 'lucide-react';
import type { TimestampedSegment } from '@/lib/format';
import { generateLrc, generateSrt, downloadFile } from '@/lib/format';

interface ResultPreviewProps {
  segments: TimestampedSegment[];
  fileName: string;
}

export default function ResultPreview({ segments, fileName }: ResultPreviewProps) {
  const [activeTab, setActiveTab] = useState<'lrc' | 'srt'>('lrc');
  const [copied, setCopied] = useState(false);

  const baseName = fileName.replace(/\.[^.]+$/, '');
  const lrcContent = generateLrc(segments);
  const srtContent = generateSrt(segments);
  const currentContent = activeTab === 'lrc' ? lrcContent : srtContent;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(currentContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const ext = activeTab === 'lrc' ? '.lrc' : '.srt';
    downloadFile(currentContent, baseName + ext);
  };

  const handleDownloadLrc = () => {
    downloadFile(lrcContent, baseName + '.lrc');
  };

  const handleDownloadSrt = () => {
    downloadFile(srtContent, baseName + '.srt');
  };

  return (
    <div className="glass-panel overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
      {/* 头部：标签页 + 操作按钮 */}
      <div className="flex items-center justify-between p-4 border-b border-[var(--glass-border)]">
        <div className="tab-bar">
          <button
            className={`tab-btn flex items-center gap-1.5 ${activeTab === 'lrc' ? 'active' : ''}`}
            onClick={() => setActiveTab('lrc')}
          >
            <FileText className="w-3.5 h-3.5" />
            LRC
          </button>
          <button
            className={`tab-btn flex items-center gap-1.5 ${activeTab === 'srt' ? 'active' : ''}`}
            onClick={() => setActiveTab('srt')}
          >
            <Subtitles className="w-3.5 h-3.5" />
            SRT
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="btn-secondary !py-1.5 !px-3 !text-[13px]"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-[var(--success)]" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            {copied ? '已复制' : '复制'}
          </button>
          <button
            onClick={handleDownload}
            className="btn-secondary !py-1.5 !px-3 !text-[13px]"
          >
            <Download className="w-3.5 h-3.5" />
            下载
          </button>
        </div>
      </div>

      {/* 预览内容 */}
      <div className="p-4 max-h-[320px] overflow-y-auto custom-scrollbar">
        <pre className="text-[13px] leading-6 font-mono text-[var(--text-secondary)] whitespace-pre-wrap">
          {currentContent}
        </pre>
      </div>

      {/* 底部：双格式下载 */}
      <div className="flex gap-3 p-4 border-t border-[var(--glass-border)]">
        <button onClick={handleDownloadLrc} className="btn-primary flex-1 !text-[14px]">
          <Download className="w-4 h-4" />
          下载 LRC
        </button>
        <button onClick={handleDownloadSrt} className="btn-primary flex-1 !text-[14px]">
          <Download className="w-4 h-4" />
          下载 SRT
        </button>
      </div>
    </div>
  );
}
