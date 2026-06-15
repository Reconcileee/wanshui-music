/**
 * 正宗 iOS26 Liquid Glass SVG 滤镜生成器
 * 基于物理折射模型，结合 feSpecularLighting 提供自然高光
 */

const SURFACE_FNS = {
  convex_squircle: (x: number) => Math.pow(1 - Math.pow(1 - x, 4), 0.25),
  convex_circle: (x: number) => Math.sqrt(1 - (1 - x) * (1 - x)),
  concave: (x: number) => 1 - Math.sqrt(1 - (1 - x) * (1 - x)),
  lip: (x: number) => {
    const convex = Math.pow(1 - Math.pow(1 - Math.min(x * 2, 1), 4), 0.25);
    const concave = 1 - Math.sqrt(1 - (1 - x) * (1 - x)) + 0.1;
    const t = 6 * x ** 5 - 15 * x ** 4 + 10 * x ** 3;
    return convex * (1 - t) + concave * t;
  },
};

function calculateRefractionProfile(
  glassThickness: number,
  bezelWidth: number,
  heightFn: (x: number) => number,
  ior: number,
  samples = 128
): Float64Array {
  const eta = 1 / ior;
  function refract(nx: number, ny: number): [number, number] | null {
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
    if (!ref) {
      profile[i] = 0;
      continue;
    }
    profile[i] = ref[0] * ((y * bezelWidth + glassThickness) / ref[1]);
  }
  return profile;
}

/**
 * 超椭圆距离计算 (参考 iyinchao/liquid-glass-studio 的 sdSuperellipse)
 * |x/r|^n + |y/r|^n = t
 * 返回到边缘的有符号距离
 */
function superellipseDist(x: number, y: number, r: number, n: number): number {
  if (r <= 0) return -1;
  const ax = Math.abs(x / r);
  const ay = Math.abs(y / r);
  if (ax >= 1 || ay >= 1) {
    const t = Math.pow(ax, n) + Math.pow(ay, n);
    return -r * (Math.pow(t, 1 / n) - 1);
  }
  const t = Math.pow(ax, n) + Math.pow(ay, n);
  if (t <= 0) return r;
  return r * (1 - Math.pow(t, 1 / n));
}

function generateDisplacementMap(
  w: number,
  h: number,
  radius: number,
  bezelWidth: number,
  profile: Float64Array,
  maxDisp: number,
  shape: 'squircle' | 'superellipse' = 'squircle',
  superellipseN: number = 5
): string | null {
  try {
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    const ctx = c.getContext('2d');
    if (!ctx) return null;

    const img = ctx.createImageData(w, h);
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      d[i] = 128;
      d[i + 1] = 128;
      d[i + 2] = 0;
      d[i + 3] = 255;
    }

    const r = radius;
    const rSq = r * r;
    const r1Sq = (r + 1) ** 2;
    const rBSq = Math.max(r - bezelWidth, 0) ** 2;
    const wB = w - r * 2;
    const hB = h - r * 2;
    const S = profile.length;

    for (let y1 = 0; y1 < h; y1++) {
      for (let x1 = 0; x1 < w; x1++) {
        const x = x1 < r ? x1 - r : x1 >= w - r ? x1 - r - wB : 0;
        const y = y1 < r ? y1 - r : y1 >= h - r ? y1 - r - hB : 0;

        let dSq: number;
        let dist: number;
        let fromSide: number;
        let op: number;
        let cos: number;
        let sin: number;

        if (shape === 'superellipse' && x !== 0 && y !== 0) {
          // 超椭圆角 (参考 iyinchao/liquid-glass-studio)
          const seDist = superellipseDist(x, y, r, superellipseN);
          if (seDist < -1 || seDist > bezelWidth) continue;
          fromSide = seDist;
          dist = r - fromSide;
          op = fromSide > 0 ? 1 : Math.max(0, 1 + fromSide);
          const dFromCenter = Math.sqrt(x * x + y * y);
          cos = dFromCenter > 0 ? x / dFromCenter : 0;
          sin = dFromCenter > 0 ? y / dFromCenter : 0;
        } else {
          // 原始 squircle / 圆角矩形逻辑
          dSq = x * x + y * y;
          if (dSq > r1Sq || dSq < rBSq) continue;
          dist = Math.sqrt(dSq);
          fromSide = r - dist;
          op = dSq < rSq ? 1 : 1 - (dist - Math.sqrt(rSq)) / (Math.sqrt(r1Sq) - Math.sqrt(rSq));
          if (op <= 0 || dist === 0) continue;
          cos = x / dist;
          sin = y / dist;
        }

        if (fromSide <= 0) continue;
        const bi = Math.min(((fromSide / bezelWidth) * S) | 0, S - 1);
        const disp = profile[bi] || 0;
        const dX = (-cos * disp) / maxDisp;
        const dY = (-sin * disp) / maxDisp;
        const idx = (y1 * w + x1) * 4;
        d[idx] = (128 + dX * 127 * op + 0.5) | 0;
        d[idx + 1] = (128 + dY * 127 * op + 0.5) | 0;
      }
    }
    ctx.putImageData(img, 0, 0);
    return c.toDataURL('image/png');
  } catch (e) {
    console.warn('[LiquidGlass] generateDisplacementMap failed:', e);
    return null;
  }
}

function generateSpecularMap(
  w: number,
  h: number,
  radius: number,
  bezelWidth: number,
  angle = Math.PI / 3,
  shape: 'squircle' | 'superellipse' = 'squircle',
  superellipseN: number = 5
): string | null {
  try {
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    const ctx = c.getContext('2d');
    if (!ctx) return null;

    const img = ctx.createImageData(w, h);
    const d = img.data;
    d.fill(0);

    const r = radius;
    const rSq = r * r;
    const r1Sq = (r + 1) ** 2;
    const rBSq = Math.max(r - bezelWidth, 0) ** 2;
    const wB = w - r * 2;
    const hB = h - r * 2;
    const sv = [Math.cos(angle), Math.sin(angle)];

    for (let y1 = 0; y1 < h; y1++) {
      for (let x1 = 0; x1 < w; x1++) {
        const x = x1 < r ? x1 - r : x1 >= w - r ? x1 - r - wB : 0;
        const y = y1 < r ? y1 - r : y1 >= h - r ? y1 - r - hB : 0;

        let dist: number;
        let fromSide: number;
        let op: number;
        let cos: number;
        let sin: number;

        if (shape === 'superellipse' && x !== 0 && y !== 0) {
          const seDist = superellipseDist(x, y, r, superellipseN);
          if (seDist < -1 || seDist > bezelWidth) continue;
          fromSide = seDist;
          dist = r - fromSide;
          op = fromSide > 0 ? 1 : Math.max(0, 1 + fromSide);
          const dFromCenter = Math.sqrt(x * x + y * y);
          cos = dFromCenter > 0 ? x / dFromCenter : 0;
          sin = dFromCenter > 0 ? -y / dFromCenter : 0;
        } else {
          const dSq = x * x + y * y;
          if (dSq > r1Sq || dSq < rBSq) continue;
          dist = Math.sqrt(dSq);
          fromSide = r - dist;
          op = dSq < rSq ? 1 : 1 - (dist - Math.sqrt(rSq)) / (Math.sqrt(r1Sq) - Math.sqrt(rSq));
          if (op <= 0 || dist === 0) continue;
          cos = x / dist;
          sin = -y / dist;
        }

        if (fromSide <= 0) continue;
        const dot = Math.abs(cos * sv[0] + sin * sv[1]);
        const edge = Math.sqrt(Math.max(0, 1 - (1 - fromSide) ** 2));
        const coeff = dot * edge;
        const col = (255 * coeff) | 0;
        const alpha = (col * coeff * op) | 0;
        const idx = (y1 * w + x1) * 4;
        d[idx] = col;
        d[idx + 1] = col;
        d[idx + 2] = col;
        d[idx + 3] = alpha;
      }
    }
    ctx.putImageData(img, 0, 0);
    return c.toDataURL('image/png');
  } catch (e) {
    console.warn('[LiquidGlass] generateSpecularMap failed:', e);
    return null;
  }
}

export interface LiquidGlassOptions {
  width: number;
  height: number;
  radius?: number;
  glassThickness?: number;
  bezelWidth?: number;
  ior?: number;
  scaleRatio?: number;
  blurAmount?: number;
  specularOpacity?: number;
  specularSaturation?: number;
  /** 是否启用静态 fallback filter（当 Canvas 生成失败时） */
  enableFallback?: boolean;
  /** 形状类型: squircle 或 superellipse (参考 iyinchao/liquid-glass-studio) */
  shape?: 'squircle' | 'superellipse';
  /** 超椭圆指数 n, 默认 5 (Apple 使用 n≈5 的超椭圆) */
  superellipseN?: number;
  /** 效果模式: clear (更透明) 或 regular (标准) (参考 callstack/liquid-glass) */
  effect?: 'clear' | 'regular';
}

/**
 * 构建完整液态玻璃滤镜（基于物理折射 + 高光）
 */
export function buildLiquidGlassFilter(
  filterId: string,
  opts: LiquidGlassOptions
): string {
  const {
    width: w,
    height: h,
    radius = 60,
    glassThickness = 60,
    bezelWidth = 40,
    ior = 2.5,
    scaleRatio = 1.0,
    blurAmount = 0.5,
    specularOpacity = 0.6,
    specularSaturation = 5,
    shape = 'squircle',
    superellipseN = 5,
    effect = 'regular',
  } = opts;

  if (w < 2 || h < 2) return '';

  // effect 模式调整 (参考 callstack/liquid-glass)
  const isClear = effect === 'clear';
  const adjustedBlur = isClear ? blurAmount * 0.6 : blurAmount;
  const adjustedSpecOpacity = isClear ? specularOpacity * 0.5 : specularOpacity;
  const adjustedSpecSat = isClear ? Math.max(1, specularSaturation * 0.7) : specularSaturation;

  const heightFn = SURFACE_FNS.convex_squircle;
  const clampedBezel = Math.min(bezelWidth, radius - 1, Math.min(w, h) / 2 - 1);

  const profile = calculateRefractionProfile(glassThickness, clampedBezel, heightFn, ior, 128);
  const maxDisp = Math.max(...Array.from(profile).map(Math.abs)) || 1;
  const dispUrl = generateDisplacementMap(w, h, radius, clampedBezel, profile, maxDisp, shape, superellipseN);
  const specUrl = generateSpecularMap(w, h, radius, clampedBezel * 2.5, Math.PI / 3, shape, superellipseN);
  const scale = maxDisp * scaleRatio;

  // 如果 Canvas 生成失败，返回空字符串让调用方处理
  if (!dispUrl || !specUrl) return '';

  return `
    <filter id="${filterId}" x="0%" y="0%" width="100%" height="100%" filterUnits="objectBoundingBox">
      <!-- 1. 背景模糊 -->
      <feGaussianBlur in="SourceGraphic" stdDeviation="${adjustedBlur}" result="blurred_source" />
      <!-- 2. 加载折射位移图 -->
      <feImage href="${dispUrl}" x="0" y="0" width="${w}" height="${h}" result="disp_map" />
      <!-- 3. 应用折射扭曲 -->
      <feDisplacementMap in="blurred_source" in2="disp_map"
        scale="${scale}" xChannelSelector="R" yChannelSelector="G"
        result="displaced" />
      <!-- 4. 饱和度增强（让透过玻璃的颜色更鲜艳） -->
      <feColorMatrix in="displaced" type="saturate" values="${adjustedSpecSat}" result="displaced_sat" />
      <!-- 5. 加载高光贴图 -->
      <feImage href="${specUrl}" x="0" y="0" width="${w}" height="${h}" result="spec_layer" />
      <!-- 6. 用高光遮罩饱和度层（只在边缘高光区域增强饱和度） -->
      <feComposite in="displaced_sat" in2="spec_layer" operator="in" result="spec_masked" />
      <!-- 7. 降低高光整体透明度 -->
      <feComponentTransfer in="spec_layer" result="spec_faded">
        <feFuncA type="linear" slope="${adjustedSpecOpacity}" />
      </feComponentTransfer>
      <!-- 8. 合并饱和度增强到主图像 -->
      <feBlend in="spec_masked" in2="displaced" mode="normal" result="with_sat" />
      <!-- 9. 叠加白色高光层 -->
      <feBlend in="spec_faded" in2="with_sat" mode="normal" result="final" />
      <!-- 10. 额外：顶部镜面光照（增加玻璃厚度感） -->
      <feSpecularLighting in="displaced" surfaceScale="2" specularConstant="0.8" specularExponent="60" lighting-color="white" result="top_light">
        <fePointLight x="${w * 0.3}" y="${-h * 0.2}" z="${Math.max(w, h) * 0.8}" />
      </feSpecularLighting>
      <feComposite in="top_light" in2="final" operator="arithmetic" k1="0" k2="1" k3="0.3" k4="0" result="with_light" />
      <feBlend in="with_light" in2="final" mode="screen" />
    </filter>
  `;
}

/**
 * 构建简化版液态玻璃滤镜（纯 SVG，不依赖 Canvas）
 * 作为 fallback 使用，效果稍弱但保证可用
 */
export function buildSimpleLiquidGlassFilter(
  filterId: string,
  opts: Pick<LiquidGlassOptions, 'blurAmount' | 'specularOpacity'>
): string {
  const {
    blurAmount = 0.5,
    specularOpacity = 0.5,
  } = opts;

  return `
    <filter id="${filterId}" x="-20%" y="-20%" width="140%" height="140%" filterUnits="objectBoundingBox">
      <feGaussianBlur in="SourceGraphic" stdDeviation="${blurAmount}" result="blurred" />
      <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="1" seed="5" result="noise" />
      <feGaussianBlur in="noise" stdDeviation="3" result="softNoise" />
      <feDisplacementMap in="blurred" in2="softNoise" scale="30" xChannelSelector="R" yChannelSelector="G" result="displaced" />
      <feColorMatrix in="displaced" type="saturate" values="1.8" result="saturated" />
      <feSpecularLighting in="softNoise" surfaceScale="3" specularConstant="0.9" specularExponent="80" lighting-color="white" result="specular">
        <fePointLight x="-100" y="-100" z="200" />
      </feSpecularLighting>
      <feComponentTransfer in="specular" result="specular_faded">
        <feFuncA type="linear" slope="${specularOpacity}" />
      </feComponentTransfer>
      <feBlend in="specular_faded" in2="saturated" mode="screen" />
    </filter>
  `;
}
