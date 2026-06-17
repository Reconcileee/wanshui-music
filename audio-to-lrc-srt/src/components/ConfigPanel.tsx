import { Key, Globe, Cpu, Server } from 'lucide-react';
import type { EngineType } from '@/hooks/useTranscriber';

export interface ConfigState {
  engine: EngineType;
  language: string;
  whisperModel: 'tiny' | 'base' | 'small';
  azureKey: string;
  azureRegion: string;
}

interface ConfigPanelProps {
  config: ConfigState;
  onChange: (config: ConfigState) => void;
  disabled?: boolean;
}

const LANGUAGES = [
  { value: 'auto', label: '自动检测' },
  { value: 'zh', label: '中文（简体）' },
  { value: 'en', label: '英语（美国）' },
  { value: 'en-GB', label: '英语（英国）' },
  { value: 'en-IN', label: '英语（印度）' },
  { value: 'ja', label: '日语' },
  { value: 'ko', label: '韩语' },
  { value: 'de', label: '德语' },
  { value: 'fr', label: '法语' },
  { value: 'es', label: '西班牙语（西班牙）' },
  { value: 'es-MX', label: '西班牙语（墨西哥）' },
  { value: 'it', label: '意大利语' },
  { value: 'pt', label: '葡萄牙语（巴西）' },
  { value: 'hi', label: '印地语' },
];

const WHISPER_MODELS = [
  { value: 'tiny' as const, label: 'Tiny', desc: '最快' },
  { value: 'base' as const, label: 'Base', desc: '均衡' },
  { value: 'small' as const, label: 'Small', desc: '最准' },
];

const AZURE_REGIONS = [
  'eastasia', 'southeastasia', 'eastus', 'eastus2', 'westus',
  'westus2', 'centralus', 'northeurope', 'westeurope', 'japaneast',
  'japanwest', 'koreacentral', 'chinanorth', 'chinaeast',
];

export default function ConfigPanel({ config, onChange, disabled }: ConfigPanelProps) {
  const update = (partial: Partial<ConfigState>) => {
    onChange({ ...config, ...partial });
  };

  return (
    <div className="glass-panel p-5 space-y-5 animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
      {/* 识别引擎选择 */}
      <div>
        <label className="flex items-center gap-2 text-[13px] font-medium text-[var(--text-secondary)] mb-2.5">
          <Cpu className="w-3.5 h-3.5" />
          识别引擎
        </label>
        <div className="segment-control w-full">
          <button
            className={`segment-btn flex-1 flex items-center justify-center gap-1.5 ${config.engine === 'local' ? 'active' : ''}`}
            onClick={() => update({ engine: 'local' })}
            disabled={disabled}
          >
            <Server className="w-3.5 h-3.5" />
            本地 Whisper
          </button>
          <button
            className={`segment-btn flex-1 flex items-center justify-center gap-1.5 ${config.engine === 'azure' ? 'active' : ''}`}
            onClick={() => update({ engine: 'azure' })}
            disabled={disabled}
          >
            <Key className="w-3.5 h-3.5" />
            在线 Azure
          </button>
        </div>
      </div>

      {/* 语言选择 */}
      <div>
        <label className="flex items-center gap-2 text-[13px] font-medium text-[var(--text-secondary)] mb-2.5">
          <Globe className="w-3.5 h-3.5" />
          源语言
        </label>
        <select
          className="glass-select w-full"
          value={config.language}
          onChange={(e) => update({ language: e.target.value })}
          disabled={disabled}
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.value} value={lang.value}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>

      {/* 本地模式：模型选择 */}
      {config.engine === 'local' && (
        <div>
          <label className="flex items-center gap-2 text-[13px] font-medium text-[var(--text-secondary)] mb-2.5">
            <Cpu className="w-3.5 h-3.5" />
            模型大小
          </label>
          <div className="segment-control w-full">
            {WHISPER_MODELS.map((m) => (
              <button
                key={m.value}
                className={`segment-btn flex-1 text-center ${config.whisperModel === m.value ? 'active' : ''}`}
                onClick={() => update({ whisperModel: m.value })}
                disabled={disabled}
              >
                <span>{m.label}</span>
                <span className="text-[11px] opacity-60 ml-1">{m.desc}</span>
              </button>
            ))}
          </div>
          <p className="text-[12px] text-[var(--text-tertiary)] mt-2">
            首次使用需下载模型，之后浏览器自动缓存
          </p>
        </div>
      )}

      {/* Azure 模式：密钥和区域 */}
      {config.engine === 'azure' && (
        <div className="space-y-3">
          <div>
            <label className="flex items-center gap-2 text-[13px] font-medium text-[var(--text-secondary)] mb-2">
              <Key className="w-3.5 h-3.5" />
              订阅密钥
            </label>
            <input
              type="password"
              className="glass-input"
              placeholder="输入 Azure Speech 订阅密钥"
              value={config.azureKey}
              onChange={(e) => update({ azureKey: e.target.value })}
              disabled={disabled}
            />
          </div>
          <div>
            <label className="text-[13px] font-medium text-[var(--text-secondary)] mb-2 block">
              服务区域
            </label>
            <select
              className="glass-select w-full"
              value={config.azureRegion}
              onChange={(e) => update({ azureRegion: e.target.value })}
              disabled={disabled}
            >
              <option value="">选择区域</option>
              {AZURE_REGIONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          <p className="text-[12px] text-[var(--text-tertiary)]">
            使用与 text-to-speech.cn 相同的 Azure 语音技术，需提供您自己的 Azure 订阅密钥
          </p>
        </div>
      )}
    </div>
  );
}
