export interface LyricLine {
  time: number;
  text: string;
}

// 解析 LRC 格式歌词
// 格式: [mm:ss.xx] 歌词文本
export function parseLRC(content: string): LyricLine[] {
  const lines = content.split(/\r?\n/);
  const result: LyricLine[] = [];

  for (const line of lines) {
    const match = line.match(/\[(\d{1,2}):(\d{1,2})(?:\.(\d{1,3}))?\]/);
    if (!match) continue;

    const minutes = parseInt(match[1], 10);
    const seconds = parseInt(match[2], 10);
    const fractionStr = match[3] || '0';
    const fraction = parseInt(fractionStr, 10) / Math.pow(10, fractionStr.length);

    const time = minutes * 60 + seconds + fraction;
    const text = line.replace(/\[\d{1,2}:\d{1,2}(?:\.\d{1,3})?\]/g, '').trim();

    result.push({ time, text });
  }

  // 按时间排序
  result.sort((a, b) => a.time - b.time);
  return result;
}

// 解析 SRT 格式字幕
// 格式:
// 1
// 00:00:22,670 --> 00:00:30,530
// 歌词文本
export function parseSRT(content: string): LyricLine[] {
  const blocks = content.split(/\r?\n\r?\n/);
  const result: LyricLine[] = [];

  for (const block of blocks) {
    const lines = block.trim().split(/\r?\n/);
    if (lines.length < 2) continue;

    const timeMatch = lines[0].match(/(\d{2}):(\d{2}):(\d{2}),(\d{3})\s*-->\s*(\d{2}):(\d{2}):(\d{2}),(\d{3})/);
    if (!timeMatch) continue;

    const hours = parseInt(timeMatch[1], 10);
    const minutes = parseInt(timeMatch[2], 10);
    const seconds = parseInt(timeMatch[3], 10);
    const time = hours * 3600 + minutes * 60 + seconds;

    const text = lines.slice(1).join(' ').trim();
    result.push({ time, text });
  }

  result.sort((a, b) => a.time - b.time);
  return result;
}

// 根据当前播放时间查找当前歌词行索引
export function findCurrentLineIndex(lyrics: LyricLine[], currentTime: number): number {
  if (lyrics.length === 0) return -1;

  let index = 0;
  for (let i = 0; i < lyrics.length; i++) {
    if (currentTime >= lyrics[i].time) {
      index = i;
    } else {
      break;
    }
  }
  return index;
}
