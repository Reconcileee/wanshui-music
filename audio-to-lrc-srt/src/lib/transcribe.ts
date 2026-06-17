import { pipeline } from '@huggingface/transformers';
import type { TimestampedSegment } from './format';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let transcriber: any = null;

export interface WhisperOptions {
  model: 'tiny' | 'base' | 'small';
  language?: string;
  onProgress?: (progress: number) => void;
}

const MODEL_MAP = {
  tiny: 'onnx-community/whisper-tiny',
  base: 'onnx-community/whisper-base',
  small: 'onnx-community/whisper-small',
};

export async function transcribeWithWhisper(
  audioData: Float32Array,
  options: WhisperOptions
): Promise<TimestampedSegment[]> {
  const modelId = MODEL_MAP[options.model];

  // 加载模型
  if (!transcriber) {
    options.onProgress?.(0);
    transcriber = await pipeline('automatic-speech-recognition', modelId, {
      dtype: 'q4',
      progress_callback: (p: { status: string; progress?: number }) => {
        if (p.status === 'progress' && p.progress !== undefined) {
          options.onProgress?.(p.progress / 100 * 0.3); // 模型加载占 30%
        }
      },
    });
  }

  options.onProgress?.(0.35);

  const result = await transcriber(audioData, {
    return_timestamps: true,
    language: options.language && options.language !== 'auto' ? options.language : undefined,
    task: 'transcribe',
  });

  options.onProgress?.(0.9);

  const chunks = (result as { chunks?: Array<{ text: string; timestamp: [number, number] }> }).chunks;
  if (!chunks) {
    // fallback: 无时间戳分段
    const text = (result as { text: string }).text;
    return [{ text, start: 0, end: 0 }];
  }

  const segments: TimestampedSegment[] = chunks.map((chunk) => ({
    text: chunk.text,
    start: chunk.timestamp[0] ?? 0,
    end: chunk.timestamp[1] ?? chunk.timestamp[0] ?? 0,
  }));

  options.onProgress?.(1);
  return segments;
}

export function resetWhisperModel(): void {
  transcriber = null;
}
