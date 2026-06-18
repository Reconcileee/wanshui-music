import * as SpeechSDK from 'microsoft-cognitiveservices-speech-sdk';
import type { TimestampedSegment } from './format';

export interface AzureOptions {
  subscriptionKey: string;
  region: string;
  language?: string;
  onProgress?: (progress: number) => void;
  onPartialResult?: (text: string) => void;
}

const LANGUAGE_MAP: Record<string, string> = {
  auto: 'zh-CN',
  zh: 'zh-CN',
  en: 'en-US',
  ja: 'ja-JP',
  ko: 'ko-KR',
  de: 'de-DE',
  fr: 'fr-FR',
  es: 'es-ES',
  it: 'it-IT',
  pt: 'pt-BR',
  hi: 'hi-IN',
  'en-GB': 'en-GB',
  'en-IN': 'en-IN',
  'es-MX': 'es-MX',
};

/**
 * 将 AudioBuffer 编码为 WAV 格式的 ArrayBuffer
 */
function audioBufferToWav(audioBuffer: AudioBuffer): ArrayBuffer {
  const numChannels = 1; // 单声道
  const sampleRate = 16000;
  const channelData = audioBuffer.getChannelData(0);
  // 重采样到 16kHz
  const ratio = audioBuffer.sampleRate / sampleRate;
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

  const bytesPerSample = 2; // 16-bit
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataSize = newLength * bytesPerSample;
  const bufferSize = 44 + dataSize;
  const buffer = new ArrayBuffer(bufferSize);
  const view = new DataView(buffer);

  // WAV 文件头
  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
  };
  writeString(0, 'RIFF');
  view.setUint32(4, bufferSize - 8, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true); // PCM
  view.setUint16(20, 1, true); // PCM format
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bytesPerSample * 8, true);
  writeString(36, 'data');
  view.setUint32(40, dataSize, true);

  // 写入 PCM 数据
  let offset = 44;
  for (let i = 0; i < newLength; i++) {
    const s = Math.max(-1, Math.min(1, resampled[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    offset += 2;
  }

  return buffer;
}

export async function transcribeWithAzure(
  audioBuffer: AudioBuffer,
  options: AzureOptions
): Promise<TimestampedSegment[]> {
  const lang = LANGUAGE_MAP[options.language || 'auto'] || 'zh-CN';

  const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(
    options.subscriptionKey,
    options.region
  );
  speechConfig.speechRecognitionLanguage = lang;
  speechConfig.outputFormat = SpeechSDK.OutputFormat.Detailed;

  // 将 AudioBuffer 转为 WAV 格式
  const wavBuffer = audioBufferToWav(audioBuffer);

  // 使用 PushAudioInputStream 支持所有音频格式
  const audioFormat = SpeechSDK.AudioStreamFormat.getWaveFormatPCM(16000, 16, 1);
  const pushStream = SpeechSDK.AudioInputStream.createPushStream(audioFormat);
  pushStream.write(wavBuffer);
  pushStream.close();

  const audioConfig = SpeechSDK.AudioConfig.fromStreamInput(pushStream);
  const recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);

  return new Promise<TimestampedSegment[]>((resolve, reject) => {
    const segments: TimestampedSegment[] = [];
    let currentTime = 0;

    recognizer.recognizing = (_s, e) => {
      options.onPartialResult?.(e.result.text);
    };

    recognizer.recognized = (_s, e) => {
      if (e.result.reason === SpeechSDK.ResultReason.RecognizedSpeech) {
        const duration = (e.result.duration / 10000); // ticks to seconds
        segments.push({
          text: e.result.text,
          start: currentTime,
          end: currentTime + duration,
        });
        currentTime += duration;
        options.onProgress?.(Math.min(0.9, segments.length * 0.05));
      }
    };

    recognizer.canceled = (_s, e) => {
      if (e.reason === SpeechSDK.CancellationReason.Error) {
        reject(new Error(`Azure Speech 识别失败: ${e.errorDetails}`));
      } else {
        resolve(segments);
      }
      recognizer.close();
    };

    recognizer.sessionStopped = (_s, _e) => {
      options.onProgress?.(1);
      resolve(segments);
      recognizer.close();
    };

    recognizer.startContinuousRecognitionAsync(
      () => {
        options.onProgress?.(0.1);
      },
      (error) => {
        reject(new Error(`启动识别失败: ${error}`));
        recognizer.close();
      }
    );
  });
}
