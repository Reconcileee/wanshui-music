import { useState, useCallback, useRef } from 'react';
import type { TimestampedSegment } from '@/lib/format';
import { transcribeWithWhisper, resetWhisperModel } from '@/lib/transcribe';
import { transcribeWithAzure } from '@/lib/azureTranscribe';

export type EngineType = 'local' | 'azure';
export type TranscriberStatus = 'idle' | 'loading' | 'recognizing' | 'done' | 'error';

export interface TranscriberState {
  status: TranscriberStatus;
  progress: number;
  segments: TimestampedSegment[];
  error: string | null;
  partialText: string;
}

export function useTranscriber() {
  const [state, setState] = useState<TranscriberState>({
    status: 'idle',
    progress: 0,
    segments: [],
    error: null,
    partialText: '',
  });

  const abortRef = useRef(false);

  const reset = useCallback(() => {
    abortRef.current = false;
    setState({
      status: 'idle',
      progress: 0,
      segments: [],
      error: null,
      partialText: '',
    });
  }, []);

  const cancel = useCallback(() => {
    abortRef.current = true;
    setState((prev) => ({ ...prev, status: 'idle', progress: 0 }));
  }, []);

  const startLocal = useCallback(
    async (audioData: Float32Array, model: 'tiny' | 'base' | 'small', language?: string) => {
      abortRef.current = false;
      setState({ status: 'loading', progress: 0, segments: [], error: null, partialText: '' });

      try {
        const segments = await transcribeWithWhisper(audioData, {
          model,
          language,
          onProgress: (p) => {
            if (abortRef.current) return;
            setState((prev) => ({
              ...prev,
              progress: p,
              status: p < 0.35 ? 'loading' : 'recognizing',
            }));
          },
        });

        if (!abortRef.current) {
          setState({ status: 'done', progress: 1, segments, error: null, partialText: '' });
        }
      } catch (err) {
        if (!abortRef.current) {
          setState((prev) => ({
            ...prev,
            status: 'error',
            error: err instanceof Error ? err.message : '识别失败',
          }));
        }
      }
    },
    []
  );

  const startAzure = useCallback(
    async (file: File, subscriptionKey: string, region: string, language?: string) => {
      abortRef.current = false;
      setState({ status: 'recognizing', progress: 0, segments: [], error: null, partialText: '' });

      try {
        const segments = await transcribeWithAzure(file, {
          subscriptionKey,
          region,
          language,
          onProgress: (p) => {
            if (abortRef.current) return;
            setState((prev) => ({ ...prev, progress: p }));
          },
          onPartialResult: (text) => {
            if (abortRef.current) return;
            setState((prev) => ({ ...prev, partialText: text }));
          },
        });

        if (!abortRef.current) {
          setState({ status: 'done', progress: 1, segments, error: null, partialText: '' });
        }
      } catch (err) {
        if (!abortRef.current) {
          setState((prev) => ({
            ...prev,
            status: 'error',
            error: err instanceof Error ? err.message : '识别失败',
          }));
        }
      }
    },
    []
  );

  return { state, startLocal, startAzure, cancel, reset, resetWhisperModel };
}
