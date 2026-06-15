from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 430, 'height': 932})
    page.goto('http://localhost:5173/')
    page.wait_for_timeout(6000)

    svg_html = page.evaluate("""() => {
        const svg = document.getElementById('liquid-glass-svg-root');
        return svg ? svg.innerHTML.length : 0;
    }""")
    print('SVG defs length:', svg_html)

    # 使用更可靠的选择器
    transform = page.evaluate("""() => {
        const els = document.querySelectorAll('div');
        for (const el of els) {
            if (el.style.transform && el.style.transform.includes('translate')) {
                return el.style.transform;
            }
        }
        return 'not found';
    }""")
    print('Transform found:', transform)

    # 检查 MiniPlayer 是否存在
    mini = page.evaluate("""() => {
        const els = document.querySelectorAll('div');
        for (const el of els) {
            if (el.textContent && el.textContent.includes('Blest') && el.textContent.includes('Yuno')) {
                return { found: true, transform: el.style.transform, className: el.className };
            }
        }
        return { found: false };
    }""")
    print('MiniPlayer:', mini)

    page.screenshot(path='d:/aiide_project/trae_project/music-player/screenshot2.png')
    browser.close()
    print('Screenshot saved')
