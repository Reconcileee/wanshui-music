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

export async function transcribeWithAzure(
  audioFile: File,
  options: AzureOptions
): Promise<TimestampedSegment[]> {
  const lang = LANGUAGE_MAP[options.language || 'auto'] || 'zh-CN';

  const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(
    options.subscriptionKey,
    options.region
  );
  speechConfig.speechRecognitionLanguage = lang;
  speechConfig.outputFormat = SpeechSDK.OutputFormat.Detailed;

  // 从文件创建音频配置
  const audioConfig = SpeechSDK.AudioConfig.fromWavFileInput(audioFile as any);

  const recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);

  return new Promise<TimestampedSegment[]>((resolve, reject) => {
    const segments: TimestampedSegment[] = [];
    let offsetAccumulator = 0;

    recognizer.recognizing = (_s, e) => {
      options.onPartialResult?.(e.result.text);
    };

    recognizer.recognized = (_s, e) => {
      if (e.result.reason === SpeechSDK.ResultReason.RecognizedSpeech) {
        const detail = e.result as any;
        const offset = (detail.offset / 10000); // ticks to seconds
        const duration = (detail.duration / 10000);
        segments.push({
          text: e.result.text,
          start: offsetAccumulator,
          end: offsetAccumulator + duration,
        });
        offsetAccumulator += duration;
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
