import { Loader2, X } from 'lucide-react';
import type { TranscriberState } from '@/hooks/useTranscriber';

interface ProgressViewProps {
  state: TranscriberState;
  onCancel: () => void;
}

const STATUS_TEXT: Record<string, string> = {
  loading: '正在加载模型...',
  recognizing: '正在识别语音...',
  done: '识别完成',
  error: '识别失败',
};

export default function ProgressView({ state, onCancel }: ProgressViewProps) {
  if (state.status === 'idle') return null;

  const isActive = state.status === 'loading' || state.status === 'recognizing';
  const isDone = state.status === 'done';
  const isError = state.status === 'error';

  return (
    <div className="glass-panel p-5 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          {isActive && (
            <div className="w-8 h-8 rounded-full bg-[var(--accent)]/10 flex items-center justify-center">
              <Loader2 className="w-4 h-4 text-[var(--accent)] animate-spin" />
            </div>
          )}
          {isDone && (
            <div className="w-8 h-8 rounded-full bg-[var(--success)]/10 flex items-center justify-center">
              <svg className="w-4 h-4 text-[var(--success)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
          {isError && (
            <div className="w-8 h-8 rounded-full bg-[var(--error)]/10 flex items-center justify-center">
              <svg className="w-4 h-4 text-[var(--error)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          )}
          <div>
            <p className="text-[15px] font-medium">
              {STATUS_TEXT[state.status]}
            </p>
            {state.partialText && isActive && (
              <p className="text-[13px] text-[var(--text-secondary)] mt-0.5 truncate max-w-[400px]">
                {state.partialText}
              </p>
            )}
          </div>
        </div>

        {isActive && (
          <button
            onClick={onCancel}
            className="w-8 h-8 rounded-full bg-[var(--glass-bg)] border border-[var(--glass-border)] flex items-center justify-center hover:bg-[var(--glass-hover)] transition-colors"
          >
            <X className="w-4 h-4 text-[var(--text-secondary)]" />
          </button>
        )}
      </div>

      {/* 进度条 */}
      {(isActive || isDone) && (
        <div className="progress-track">
          <div
            className={`progress-fill ${isDone ? '!bg-[var(--success)]' : ''}`}
            style={{ width: `${Math.round(state.progress * 100)}%` }}
          />
        </div>
      )}

      <p className="text-[12px] text-[var(--text-tertiary)] mt-2">
        {Math.round(state.progress * 100)}%
      </p>

      {isError && state.error && (
        <p className="text-[13px] text-[var(--error)] mt-2">
          {state.error}
        </p>
      )}
    </div>
  );
}
