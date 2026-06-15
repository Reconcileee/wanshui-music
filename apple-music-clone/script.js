// ============================================================
// Apple Music Clone - 液态玻璃版
// ============================================================

// ---- Mock Data ----
const FEATURED = [
  {
    label: '新增专辑',
    title: '太阳之子',
    artist: '周杰伦',
    desc: '周杰伦联手指过去 25 年的经典创作元素，分享专辑幕后故事。',
    cover: 'https://images.unsplash.com/photo-1516280440614-6697288d5d38?w=800&h=500&fit=crop',
  },
  {
    label: '新专辑',
    title: 'you seem pretty sad for a girl so in love',
    artist: 'Olivia Rodrigo',
    desc: '商店的热衷明星的流行创作，以双括号结构构筑爱的甜蜜与不安。',
    cover: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=800&h=500&fit=crop',
  },
  {
    label: '歌单已更新',
    title: 'A-List: 国语流行',
    artist: 'Apple Music 国语流行',
    desc: '好友赠新新快乐，乐乐部赠能，A-Lin 复叙带来《一个人》的悠长心事。',
    cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&h=500&fit=crop',
  },
];

const STARS = [
  { title: '万能达现场原声', subtitle: 'Apple Music', cover: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=400&fit=crop' },
  { title: '滑到海底说爱你', subtitle: 'Single · 万能达', cover: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=400&fit=crop' },
  { title: 'I.God', subtitle: 'XLOV', cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop' },
  { title: 'TAB! - Single', subtitle: 'XONARA', cover: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&h=400&fit=crop' },
  { title: 'Nowaveee...', subtitle: 'Single · KACHAIN', cover: 'https://images.unsplash.com/photo-1504898770365-3572066630e5?w=400&h=400&fit=crop' },
  { title: 'Terima Kasih', subtitle: 'Single · Naura Ayu', cover: 'https://images.unsplash.com/photo-1525362081668-2b4773d6c368?w=400&h=400&fit=crop' },
];

const SONGS = [
  { title: 'stupid song', artist: 'Olivia Rodrigo', album: 'In love', cover: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=100&h=100&fit=crop' },
  { title: 'I Knew It, I Knew You', artist: 'Taylor Swift', album: 'In love', cover: 'https://images.unsplash.com/photo-1501612780327-45045538702b?w=100&h=100&fit=crop' },
  { title: 'Somewhere In Winter', artist: '火星电台, 娄坚家', album: 'In love', cover: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=100&h=100&fit=crop' },
  { title: '旋钮', artist: 'Gareth.T', album: 'In love', cover: 'https://images.unsplash.com/photo-1496293455970-f8581aae0e3d?w=100&h=100&fit=crop' },
  { title: '达拉崩吧 - Live', artist: '周深, 五月天', album: 'In love', cover: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=100&h=100&fit=crop' },
  { title: '遂城梦', artist: '陈依纱', album: 'In love', cover: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=100&h=100&fit=crop' },
  { title: '借过一下 (Live)', artist: '胡彦斌, Jony J', album: 'In love', cover: 'https://images.unsplash.com/photo-1516280440614-6697288d5d38?w=100&h=100&fit=crop' },
  { title: '水葱', artist: '琥珀', album: 'In love', cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100&h=100&fit=crop' },
  { title: '秋千', artist: '汪川', album: 'In love', cover: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=100&h=100&fit=crop' },
  { title: '主角通道 (feat. 钱正昊)', artist: 'Jins周君怡', album: 'In love', cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=100&h=100&fit=crop' },
  { title: 'As You Lie There', artist: 'Paul McCartney', album: 'In love', cover: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=100&h=100&fit=crop' },
  { title: '可我是真正的快乐', artist: 'CORSAX 如梦', album: 'In love', cover: 'https://images.unsplash.com/photo-1504898770365-3572066630e5?w=100&h=100&fit=crop' },
  { title: 'CHOOM', artist: 'BABYMONSTER', album: 'In love', cover: 'https://images.unsplash.com/photo-1525362081668-2b4773d6c368?w=100&h=100&fit=crop' },
  { title: 'Suddenly', artist: 'I.O.I', album: 'In love', cover: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=100&h=100&fit=crop' },
  { title: 'VIRAL', artist: 'BOYNEXTDOOR', album: 'In love', cover: 'https://images.unsplash.com/photo-1501612780327-45045538702b?w=100&h=100&fit=crop' },
  { title: '樱桃可乐的巧克力', artist: '马余先', album: 'In love', cover: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=100&h=100&fit=crop' },
];

const NEW_RELEASES = [
  { title: 'you seem pretty sad for a girl so in love', subtitle: 'Olivia Rodrigo', cover: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=400&h=400&fit=crop' },
  { title: 'I Knew It, I Knew You - Single', subtitle: 'Taylor Swift', cover: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=400&fit=crop' },
  { title: '乘风2026 (第9期 Live)', subtitle: '乘风2026', cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop' },
  { title: 'Come Over - Single', subtitle: '防弹少年团', cover: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&h=400&fit=crop' },
  { title: '失重三部曲 - Single', subtitle: '火星电台', cover: 'https://images.unsplash.com/photo-1504898770365-3572066630e5?w=400&h=400&fit=crop' },
  { title: '歌手 2026 (第3期 Live)', subtitle: 'EP', cover: 'https://images.unsplash.com/photo-1525362081668-2b4773d6c368?w=400&h=400&fit=crop' },
];

const NEW_POSTS = [
  { title: '每日热歌', subtitle: 'Apple Music', cover: 'https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?w=400&h=400&fit=crop' },
  { title: '独家首发', subtitle: 'Apple Music', cover: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop' },
  { title: '精选歌单', subtitle: 'Apple Music', cover: 'https://images.unsplash.com/photo-1571609825576-622b2619d58e?w=400&h=400&fit=crop' },
  { title: '音乐电影', subtitle: 'Apple Music', cover: 'https://images.unsplash.com/photo-1504626835342-340a95f2a966?w=400&h=400&fit=crop' },
  { title: '经典回顾', subtitle: 'Apple Music', cover: 'https://images.unsplash.com/photo-1506157786151-b8472da7d491?w=400&h=400&fit=crop' },
  { title: '电子音乐', subtitle: 'Apple Music', cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=400&fit=crop' },
];

// ---- 渲染 ----
function initContent() {
  // Featured cards
  document.getElementById('featured-grid').innerHTML = FEATURED.map(item => `
    <div class="featured-card">
      <div class="featured-card-bg" style="background-image: url('${item.cover}')"></div>
      <div class="featured-card-overlay"></div>
      <div class="featured-card-content">
        <div class="featured-card-label">${item.label}</div>
        <div class="featured-card-title">${item.title}</div>
        <div class="featured-card-artist">${item.artist}</div>
        <div class="featured-card-desc">${item.desc}</div>
      </div>
    </div>
  `).join('');

  // Stars grid
  document.getElementById('stars-grid').innerHTML = STARS.map((item, i) => `
    <div class="small-card" onclick="playSong('${item.title}', '${item.subtitle}', '${item.cover}')">
      <div class="small-card-cover"><img src="${item.cover}" alt="${item.title}" loading="lazy" /></div>
      <div class="small-card-title">${item.title}</div>
      <div class="small-card-subtitle">${item.subtitle}</div>
    </div>
  `).join('');

  // Song list
  document.getElementById('song-list').innerHTML = SONGS.map((song, i) => `
    <div class="song-row" onclick="playSong('${song.title}', '${song.artist}', '${song.cover}')">
      <div class="song-row-cover"><img src="${song.cover}" alt="${song.title}" loading="lazy" /></div>
      <div class="song-row-title">${song.title}</div>
      <div class="song-row-artist">${song.artist}</div>
      <div class="song-row-album">${song.album}</div>
      <button class="song-row-more" onclick="event.stopPropagation()">
        <svg viewBox="0 0 24 24" width="16" height="16"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" fill="currentColor"/></svg>
      </button>
    </div>
  `).join('');

  // New releases
  document.getElementById('new-release-grid').innerHTML = NEW_RELEASES.map(item => `
    <div class="small-card" onclick="playSong('${item.title}', '${item.subtitle}', '${item.cover}')">
      <div class="small-card-cover"><img src="${item.cover}" alt="${item.title}" loading="lazy" /></div>
      <div class="small-card-title">${item.title}</div>
      <div class="small-card-subtitle">${item.subtitle}</div>
    </div>
  `).join('');

  // New posts
  document.getElementById('new-posts-grid').innerHTML = NEW_POSTS.map(item => `
    <div class="small-card" onclick="playSong('${item.title}', '${item.subtitle}', '${item.cover}')">
      <div class="small-card-cover"><img src="${item.cover}" alt="${item.title}" loading="lazy" /></div>
      <div class="small-card-title">${item.title}</div>
      <div class="small-card-subtitle">${item.subtitle}</div>
    </div>
  `).join('');
}

// ---- 播放功能 ----
let currentSong = { title: 'THE RULES', artist: 'XLOV - 1.God', cover: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=40&h=40&fit=crop' };
let isPlaying = false;
let progress = 0;
let progressInterval = null;

function playSong(title, artist, cover) {
  currentSong = { title, artist, cover };
  isPlaying = true;
  document.getElementById('track-name').textContent = title;
  document.getElementById('track-artist').textContent = artist;
  document.getElementById('track-cover').innerHTML = `<img src="${cover}" alt="cover" />`;
  updatePlayButton();
  startProgress();
}

function updatePlayButton() {
  const btn = document.getElementById('btn-play');
  btn.innerHTML = isPlaying
    ? '<svg viewBox="0 0 24 24" width="24" height="24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" fill="currentColor"/></svg>'
    : '<svg viewBox="0 0 24 24" width="24" height="24"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>';
}

function togglePlay() {
  isPlaying = !isPlaying;
  updatePlayButton();
  if (isPlaying) startProgress();
  else clearInterval(progressInterval);
}

function startProgress() {
  clearInterval(progressInterval);
  progressInterval = setInterval(() => {
    if (!isPlaying) return;
    progress += 0.5;
    if (progress > 100) progress = 0;
    document.getElementById('progress-fill-mini').style.width = progress + '%';
  }, 100);
}

function nextSong() {
  const all = [...SONGS, ...NEW_RELEASES, ...NEW_POSTS];
  const idx = all.findIndex(s => s.title === currentSong.title);
  const next = all[(idx + 1) % all.length] || all[0];
  playSong(next.title, next.artist || next.subtitle, next.cover);
}

function prevSong() {
  const all = [...SONGS, ...NEW_RELEASES, ...NEW_POSTS];
  const idx = all.findIndex(s => s.title === currentSong.title);
  const prev = all[(idx - 1 + all.length) % all.length] || all[0];
  playSong(prev.title, prev.artist || prev.subtitle, prev.cover);
}

// ---- 液态玻璃核心算法 ----
const SURFACE_FNS = {
  convex_squircle: (x) => Math.pow(1 - Math.pow(1 - x, 4), 0.25),
};

function calculateRefractionProfile(glassThickness, bezelWidth, heightFn, ior, samples) {
  samples = samples || 128;
  const eta = 1 / ior;
  function refract(nx, ny) {
    const dot = ny;
    const k = 1 - eta * eta * (1 - dot * dot);
    if (k < 0) return null;
    const sq = Math.sqrt(k);
    return [-(eta * dot + sq) * nx, eta - (eta * dot + sq) * ny];
  }
  const profile = new Float64Array(samples);
  for (let i = 0; i < samples; i++) {
    const x = i / samples;
    const y = heightFn(x);
    const dx = x < 1 ? 0.0001 : -0.0001;
    const y2 = heightFn(x + dx);
    const deriv = (y2 - y) / dx;
    const mag = Math.sqrt(deriv * deriv + 1);
    const ref = refract(-deriv / mag, -1 / mag);
    if (!ref) { profile[i] = 0; continue; }
    profile[i] = ref[0] * ((y * bezelWidth + glassThickness) / ref[1]);
  }
  return profile;
}

function generateDisplacementMap(w, h, radius, bezelWidth, profile, maxDisp) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const ctx = c.getContext('2d');
  const img = ctx.createImageData(w, h);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) { d[i] = 128; d[i+1] = 128; d[i+2] = 0; d[i+3] = 255; }
  const r = radius, rSq = r * r, r1Sq = (r + 1) ** 2;
  const rBSq = Math.max(r - bezelWidth, 0) ** 2;
  const wB = w - r * 2, hB = h - r * 2, S = profile.length;
  for (let y1 = 0; y1 < h; y1++) {
    for (let x1 = 0; x1 < w; x1++) {
      const x = x1 < r ? x1 - r : x1 >= w - r ? x1 - r - wB : 0;
      const y = y1 < r ? y1 - r : y1 >= h - r ? y1 - r - hB : 0;
      const dSq = x * x + y * y;
      if (dSq > r1Sq || dSq < rBSq) continue;
      const dist = Math.sqrt(dSq);
      const fromSide = r - dist;
      const op = dSq < rSq ? 1 : 1 - (dist - Math.sqrt(rSq)) / (Math.sqrt(r1Sq) - Math.sqrt(rSq));
      if (op <= 0 || dist === 0) continue;
      const cos = x / dist, sin = y / dist;
      const bi = Math.min(((fromSide / bezelWidth) * S) | 0, S - 1);
      const disp = profile[bi] || 0;
      const dX = (-cos * disp) / maxDisp, dY = (-sin * disp) / maxDisp;
      const idx = (y1 * w + x1) * 4;
      d[idx] = (128 + dX * 127 * op + 0.5) | 0;
      d[idx + 1] = (128 + dY * 127 * op + 0.5) | 0;
    }
  }
  ctx.putImageData(img, 0, 0);
  return c.toDataURL();
}

function generateSpecularMap(w, h, radius, bezelWidth, angle) {
  angle = angle != null ? angle : Math.PI / 3;
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const ctx = c.getContext('2d');
  const img = ctx.createImageData(w, h);
  const d = img.data; d.fill(0);
  const r = radius, rSq = r * r, r1Sq = (r + 1) ** 2;
  const rBSq = Math.max(r - bezelWidth, 0) ** 2;
  const wB = w - r * 2, hB = h - r * 2;
  const sv = [Math.cos(angle), Math.sin(angle)];
  for (let y1 = 0; y1 < h; y1++) {
    for (let x1 = 0; x1 < w; x1++) {
      const x = x1 < r ? x1 - r : x1 >= w - r ? x1 - r - wB : 0;
      const y = y1 < r ? y1 - r : y1 >= h - r ? y1 - r - hB : 0;
      const dSq = x * x + y * y;
      if (dSq > r1Sq || dSq < rBSq) continue;
      const dist = Math.sqrt(dSq);
      const fromSide = r - dist;
      const op = dSq < rSq ? 1 : 1 - (dist - Math.sqrt(rSq)) / (Math.sqrt(r1Sq) - Math.sqrt(rSq));
      if (op <= 0 || dist === 0) continue;
      const cos = x / dist, sin = -y / dist;
      const dot = Math.abs(cos * sv[0] + sin * sv[1]);
      const edge = Math.sqrt(Math.max(0, 1 - (1 - fromSide) ** 2));
      const coeff = dot * edge;
      const col = (255 * coeff) | 0;
      const alpha = (col * coeff * op) | 0;
      const idx = (y1 * w + x1) * 4;
      d[idx] = col; d[idx+1] = col; d[idx+2] = col; d[idx+3] = alpha;
    }
  }
  ctx.putImageData(img, 0, 0);
  return c.toDataURL();
}

// ---- 参数状态 ----
let glassParams = {
  radius: 60, thickness: 80, bezel: 60, ior: 3.0, scale: 1.0,
  blur: 0.3, specOpacity: 0.5, specSat: 4,
  shadowBlur: 20, shadowSpread: -5, tint: 6, outerShadow: 24,
};

const FORMATTERS = {
  radius: (v) => Math.round(v) + 'px',
  thickness: (v) => Math.round(v),
  bezel: (v) => Math.round(v),
  ior: (v) => (+v).toFixed(2),
  scale: (v) => (+v).toFixed(2),
  blur: (v) => (+v).toFixed(1),
  specOpacity: (v) => (+v).toFixed(2),
  specSat: (v) => Math.round(v),
  shadowBlur: (v) => Math.round(v) + 'px',
  shadowSpread: (v) => Math.round(v) + 'px',
  tint: (v) => Math.round(v) + '%',
  outerShadow: (v) => Math.round(v) + 'px',
};

let rebuildTimer = null;

function scheduleRebuild() {
  clearTimeout(rebuildTimer);
  rebuildTimer = setTimeout(rebuildLiquidGlass, 30);
}

function rebuildLiquidGlass() {
  const playerBar = document.getElementById('player-bar');
  const w = playerBar ? playerBar.offsetWidth : (window.innerWidth - 240);
  const h = playerBar ? playerBar.offsetHeight : 56;
  if (w < 2 || h < 2) return;

  const heightFn = SURFACE_FNS.convex_squircle;
  const clampedBezel = Math.min(glassParams.bezel, glassParams.radius - 1, Math.min(w, h) / 2 - 1);

  const profile = calculateRefractionProfile(glassParams.thickness, clampedBezel, heightFn, glassParams.ior, 128);
  const maxDisp = Math.max(...Array.from(profile).map(Math.abs)) || 1;
  const dispUrl = generateDisplacementMap(w, h, glassParams.radius, clampedBezel, profile, maxDisp);
  const specUrl = generateSpecularMap(w, h, glassParams.radius, clampedBezel * 2.5);
  const scale = maxDisp * glassParams.scale;

  document.getElementById('svg-defs').innerHTML = `
    <filter id="liquid-glass-filter" x="0%" y="0%" width="100%" height="100%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="${glassParams.blur}" result="blurred_source" />
      <feImage href="${dispUrl}" x="0" y="0" width="${w}" height="${h}" result="disp_map" />
      <feDisplacementMap in="blurred_source" in2="disp_map"
        scale="${scale}" xChannelSelector="R" yChannelSelector="G"
        result="displaced" />
      <feColorMatrix in="displaced" type="saturate" values="${glassParams.specSat}" result="displaced_sat" />
      <feImage href="${specUrl}" x="0" y="0" width="${w}" height="${h}" result="spec_layer" />
      <feComposite in="displaced_sat" in2="spec_layer" operator="in" result="spec_masked" />
      <feComponentTransfer in="spec_layer" result="spec_faded">
        <feFuncA type="linear" slope="${glassParams.specOpacity}" />
      </feComponentTransfer>
      <feBlend in="spec_masked" in2="displaced" mode="normal" result="with_sat" />
      <feBlend in="spec_faded" in2="with_sat" mode="normal" />
    </filter>
  `;

  updateCSS();
}

function updateCSS() {
  const root = document.documentElement.style;
  root.setProperty('--glass-radius', glassParams.radius + 'px');
  root.setProperty('--shadow-blur', glassParams.shadowBlur + 'px');
  root.setProperty('--shadow-spread', glassParams.shadowSpread + 'px');
  root.setProperty('--tint-opacity', (glassParams.tint / 100).toFixed(3));
  root.setProperty('--outer-shadow-blur', glassParams.outerShadow + 'px');
}

// ---- 参数控制面板 ----
const panel = document.getElementById('glass-panel');
const entry = document.getElementById('glass-entry');
const closeBtn = document.getElementById('glass-panel-close');
const resetBtn = document.getElementById('gc-reset');

const MAPPINGS = [
  ['gs-radius', 'gv-radius', 'radius'],
  ['gs-thickness', 'gv-thickness', 'thickness'],
  ['gs-bezel', 'gv-bezel', 'bezel'],
  ['gs-ior', 'gv-ior', 'ior'],
  ['gs-scale', 'gv-scale', 'scale'],
  ['gs-blur', 'gv-blur', 'blur'],
  ['gs-spec-opacity', 'gv-spec-opacity', 'specOpacity'],
  ['gs-spec-sat', 'gv-spec-sat', 'specSat'],
  ['gs-shadow-blur', 'gv-shadow-blur', 'shadowBlur'],
  ['gs-shadow-spread', 'gv-shadow-spread', 'shadowSpread'],
  ['gs-tint', 'gv-tint', 'tint'],
  ['gs-outer-shadow', 'gv-outer-shadow', 'outerShadow'],
];

function initControls() {
  MAPPINGS.forEach(([sliderId, valId, paramKey]) => {
    const slider = document.getElementById(sliderId);
    const valEl = document.getElementById(valId);
    if (!slider || !valEl) return;
    slider.addEventListener('input', () => {
      glassParams[paramKey] = +slider.value;
      valEl.textContent = FORMATTERS[paramKey](glassParams[paramKey]);
      updateCSS();
      scheduleRebuild();
    });
  });

  entry.addEventListener('click', () => panel.classList.toggle('open'));
  closeBtn.addEventListener('click', () => panel.classList.remove('open'));
  resetBtn.addEventListener('click', () => {
    glassParams = { radius: 60, thickness: 80, bezel: 60, ior: 3.0, scale: 1.0, blur: 0.3, specOpacity: 0.5, specSat: 4, shadowBlur: 20, shadowSpread: -5, tint: 6, outerShadow: 24 };
    Object.entries(glassParams).forEach(([key, val]) => {
      const mapped = MAPPINGS.find(m => m[2] === key);
      if (mapped) {
        const slider = document.getElementById(mapped[0]);
        const valEl = document.getElementById(mapped[1]);
        if (slider) slider.value = val;
        if (valEl) valEl.textContent = FORMATTERS[key](val);
      }
    });
    updateCSS();
    scheduleRebuild();
  });
}

// ---- 播放按钮绑定 ----
document.getElementById('btn-play').addEventListener('click', togglePlay);
document.getElementById('btn-next').addEventListener('click', nextSong);
document.getElementById('btn-prev').addEventListener('click', prevSong);

// ---- 进度条点击 ----
document.getElementById('progress-bar-mini').addEventListener('click', (e) => {
  const rect = e.currentTarget.getBoundingClientRect();
  progress = ((e.clientX - rect.left) / rect.width) * 100;
  document.getElementById('progress-fill-mini').style.width = progress + '%';
});

// ---- 导航 ----
document.querySelectorAll('.nav-item').forEach((item) => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelectorAll('.nav-item').forEach((n) => n.classList.remove('active'));
    item.classList.add('active');
  });
});

// ---- 初始化 ----
window.addEventListener('DOMContentLoaded', () => {
  initContent();
  initControls();
  requestAnimationFrame(() => requestAnimationFrame(rebuildLiquidGlass));
});

window.addEventListener('resize', () => {
  clearTimeout(rebuildTimer);
  rebuildTimer = setTimeout(rebuildLiquidGlass, 150);
});
