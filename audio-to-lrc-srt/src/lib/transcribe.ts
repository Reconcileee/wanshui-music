import { pipeline } from '@huggingface/transformers';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let transcriber: any = null;

const MODEL_MAP: Record<string, string> = {
  tiny: 'onnx-community/whisper-tiny',
  base: 'onnx-community/whisper-base',
  small: 'onnx-community/whisper-small',
};

// 缓存已加载的模型 ID，切换模型时重新加载
let loadedModelId: string | null = null;

export interface WhisperOptions {
  model: 'tiny' | 'base' | 'small';
  language?: string;
  onProgress?: (progress: number) => void;
}

export async function transcribeWithWhisper(
  audioData: Float32Array,
  options: WhisperOptions
): Promise<{ chunks: Array<{ text: string; timestamp: [number, number | null] }> }> {
  const modelId = MODEL_MAP[options.model];

  // 模型切换时重置
  if (loadedModelId && loadedModelId !== modelId) {
    transcriber = null;
    loadedModelId = null;
  }

  // 加载模型
  if (!transcriber) {
    options.onProgress?.(0);
    try {
      transcriber = await pipeline('automatic-speech-recognition', modelId, {
        dtype: {
          encoder_model: 'fp32',
          decoder_model_merged: 'q4',
        },
        device: 'wasm',
        progress_callback: (p: { status: string; progress?: number; file?: string }) => {
          if (p.status === 'progress' && p.progress !== undefined) {
            options.onProgress?.(p.progress / 100 * 0.3);
          } else if (p.status === 'done') {
            // 单个文件下载完成
          }
        },
      });
      loadedModelId = modelId;
    } catch (err) {
      // 如果 q4 失败，回退到 fp32
      console.warn('q4 量化加载失败，回退到 fp32:', err);
      transcriber = await pipeline('automatic-speech-recognition', modelId, {
        dtype: 'fp32',
        device: 'wasm',
        progress_callback: (p: { status: string; progress?: number }) => {
          if (p.status === 'progress' && p.progress !== undefined) {
            options.onProgress?.(p.progress / 100 * 0.3);
          }
        },
      });
      loadedModelId = modelId;
    }
  }

  options.onProgress?.(0.35);

  const result = await transcriber(audioData, {
    return_timestamps: true,
    language: options.language && options.language !== 'auto' ? options.language : undefined,
    task: 'transcribe',
  });

  options.onProgress?.(0.9);

  // 处理结果
  const chunks = (result as { chunks?: Array<{ text: string; timestamp: [number, number | null] }> }).chunks;
  if (!chunks || chunks.length === 0) {
    const text = (result as { text: string }).text;
    if (text) {
      return { chunks: [{ text, timestamp: [0, null] }] };
    }
    throw new Error('识别结果为空，请检查音频是否包含语音内容');
  }

  options.onProgress?.(1);
  return { chunks };
}

export function resetWhisperModel(): void {
  transcriber = null;
  loadedModelId = null;
}
