import { useCallback, useRef, useState } from 'react';
import { Upload, FileAudio, X, Music } from 'lucide-react';

const ACCEPTED_FORMATS = ['.wav', '.mp3', '.mp4', '.m4a', '.flac', '.ogg', '.webm'];
const MAX_SIZE_MB = 200;
const MAX_DURATION_HOURS = 2;

export interface AudioFileInfo {
  file: File;
  name: string;
  size: string;
  duration: number;
  audioData: Float32Array;   // 16kHz 单声道，供 Whisper 使用
  audioBuffer: AudioBuffer;  // 原始 AudioBuffer，供 Azure 使用
}

interface UploadZoneProps {
  onFileLoaded: (info: AudioFileInfo) => void;
  currentFile: AudioFileInfo | null;
  onRemoveFile: () => void;
  disabled?: boolean;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${m}:${String(s).padStart(2, '0')}`;
}

/**
 * 将 AudioBuffer 重采样到 16kHz 单声道 Float32Array
 */
function resampleTo16kMono(audioBuffer: AudioBuffer): Float32Array {
  const channelData = audioBuffer.getChannelData(0);
  if (audioBuffer.sampleRate === 16000) {
    return new Float32Array(channelData);
  }
  const ratio = audioBuffer.sampleRate / 16000;
  const newLength = Math.round(channelData.length / ratio);
  const resampled = new Float32Array(newLength);
  for (let i = 0; i < newLength; i++) {
    const srcIdx = i * ratio;
    const idx = Math.floor(srcIdx);
    const frac = srcIdx - idx;
    if (idx + 1 < channelData.length) {
      resampled[i] = channelData[idx] * (1 - frac) + channelData[idx + 1] * frac;
    } else {
      resampled[i] = channelData[idx] || 0;
    }
  }
  return resampled;
}

export default function UploadZone({ onFileLoaded, currentFile, onRemoveFile, disabled }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateAndProcess = useCallback(async (file: File) => {
    setError(null);

    // 格式校验
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!ACCEPTED_FORMATS.includes(ext)) {
      setError(`不支持的格式 ${ext}，请上传 ${ACCEPTED_FORMATS.join('/')} 文件`);
      return;
    }

    // 大小校验
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`文件大小超过 ${MAX_SIZE_MB}MB 限制`);
      return;
    }

    setIsLoading(true);
    try {
      const arrayBuffer = await file.arrayBuffer();

      // 使用默认采样率解码（兼容所有浏览器），然后手动重采样
      const audioContext = new AudioContext();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      const duration = audioBuffer.duration;

      // 时长校验
      if (duration > MAX_DURATION_HOURS * 3600) {
        setError(`音频时长超过 ${MAX_DURATION_HOURS} 小时限制`);
        audioContext.close();
        return;
      }

      // 重采样到 16kHz 单声道
      const audioData = resampleTo16kMono(audioBuffer);

      audioContext.close();

      onFileLoaded({
        file,
        name: file.name,
        size: formatFileSize(file.size),
        duration,
        audioData,
        audioBuffer,
      });
    } catch (err) {
      setError('无法解码音频文件，请检查文件是否损坏');
    } finally {
      setIsLoading(false);
    }
  }, [onFileLoaded]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    const file = e.dataTransfer.files[0];
    if (file) validateAndProcess(file);
  }, [validateAndProcess, disabled]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  }, [disabled]);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleClick = useCallback(() => {
    if (!disabled && inputRef.current) inputRef.current.click();
  }, [disabled]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) validateAndProcess(file);
    e.target.value = '';
  }, [validateAndProcess]);

  // 已上传文件的信息展示
  if (currentFile) {
    return (
      <div className="glass-panel p-5 animate-fade-in-up">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[var(--accent)]/10 flex items-center justify-center flex-shrink-0">
            <Music className="w-6 h-6 text-[var(--accent)]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[15px] font-medium truncate">{currentFile.name}</p>
            <p className="text-[13px] text-[var(--text-secondary)] mt-0.5">
              {currentFile.size} · {formatDuration(currentFile.duration)}
            </p>
          </div>
          {!disabled && (
            <button
              onClick={onRemoveFile}
              className="w-8 h-8 rounded-full bg-[var(--glass-bg)] border border-[var(--glass-border)] flex items-center justify-center hover:bg-[var(--glass-hover)] transition-colors"
            >
              <X className="w-4 h-4 text-[var(--text-secondary)]" />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          glass-panel p-8 cursor-pointer transition-all duration-300
          ${isDragging ? 'border-[var(--accent)] bg-[var(--accent)]/5 scale-[1.01]' : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[var(--glass-hover)]'}
          ${isLoading ? 'pointer-events-none' : ''}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_FORMATS.join(',')}
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-3">
          {isLoading ? (
            <>
              <div className="w-12 h-12 rounded-2xl bg-[var(--accent)]/10 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
              </div>
              <p className="text-[15px] text-[var(--text-secondary)]">正在解码音频...</p>
            </>
          ) : (
            <>
              <div className={`
                w-12 h-12 rounded-2xl flex items-center justify-center transition-colors
                ${isDragging ? 'bg-[var(--accent)]/20' : 'bg-[var(--glass-bg)]'}
              `}>
                {isDragging ? (
                  <FileAudio className="w-6 h-6 text-[var(--accent)]" />
                ) : (
                  <Upload className="w-6 h-6 text-[var(--text-secondary)]" />
                )}
              </div>
              <div className="text-center">
                <p className="text-[15px] font-medium">
                  {isDragging ? '松开以上传文件' : '拖拽音频文件到此处'}
                </p>
                <p className="text-[13px] text-[var(--text-secondary)] mt-1">
                  或点击选择文件
                </p>
              </div>
              <p className="text-[12px] text-[var(--text-tertiary)]">
                支持 WAV / MP3 / MP4 / M4A / FLAC，最大 200MB，时长 ≤ 2 小时
              </p>
            </>
          )}
        </div>
      </div>

      {error && (
        <p className="text-[13px] text-[var(--error)] mt-2 text-center animate-fade-in-up">
          {error}
        </p>
      )}
    </div>
  );
}
