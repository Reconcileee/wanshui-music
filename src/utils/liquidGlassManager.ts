/**
 * 全局 SVG Defs 管理器
 * 修复：使用 DOMParser 正确解析 SVG namespace，避免 div.innerHTML 导致的问题
 */

let svgDefs: SVGDefsElement | null = null;

export function getGlobalSvgDefs(): SVGDefsElement {
  if (svgDefs) return svgDefs;

  let svg = document.getElementById('liquid-glass-svg-root') as unknown as SVGSVGElement | null;
  if (!svg) {
    svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('id', 'liquid-glass-svg-root');
    svg.setAttribute('width', '0');
    svg.setAttribute('height', '0');
    svg.style.position = 'absolute';
    svg.style.overflow = 'hidden';
    svg.setAttribute('color-interpolation-filters', 'sRGB');
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    svg.appendChild(defs);
    document.body.appendChild(svg);
    svgDefs = defs;
  } else {
    svgDefs = svg.querySelector('defs');
  }

  return svgDefs!;
}

export function installFilter(filterId: string, filterHtml: string): boolean {
  try {
    const defs = getGlobalSvgDefs();
    const existing = defs.querySelector(`#${CSS.escape(filterId)}`);
    if (existing) existing.remove();

    // 使用 DOMParser 正确解析 SVG namespace
    const parser = new DOMParser();
    const doc = parser.parseFromString(filterHtml.trim(), 'image/svg+xml');
    const filterEl = doc.querySelector('filter');

    if (!filterEl) {
      console.warn('[LiquidGlass] Failed to parse filter element');
      return false;
    }

    // 确保 ID 正确
    filterEl.setAttribute('id', filterId);
    defs.appendChild(filterEl);

    // 验证安装
    const installed = defs.querySelector(`#${CSS.escape(filterId)}`);
    if (!installed) {
      console.warn('[LiquidGlass] Filter installation verification failed');
      return false;
    }

    return true;
  } catch (e) {
    console.error('[LiquidGlass] installFilter error:', e);
    return false;
  }
}

export function removeFilter(filterId: string): void {
  try {
    const defs = getGlobalSvgDefs();
    const existing = defs.querySelector(`#${CSS.escape(filterId)}`);
    existing?.remove();
  } catch {
    // 静默处理清理错误
  }
}
