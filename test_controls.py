from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 430, 'height': 900})
    page.goto('http://localhost:5173')
    page.wait_for_load_state('networkidle')
    page.wait_for_timeout(2000)
    page.screenshot(path='d:/aiide_project/trae_project/music-player/test_screenshot_before.png', full_page=False)

    # Open controls panel
    page.click('.lg-ctrl-toggle')
    page.wait_for_timeout(500)
    page.screenshot(path='d:/aiide_project/trae_project/music-player/test_screenshot_panel.png', full_page=False)

    # Record initial filter ID
    initial_filter = page.evaluate('''() => {
        const mp = document.querySelector('.fixed.z-50');
        if (!mp) return 'no miniplayer';
        const effectLayer = mp.querySelector('div[style*="z-index: 1"]');
        return effectLayer ? effectLayer.style.backdropFilter : 'not found';
    }''')
    print('Initial filter:', initial_filter)

    # Use Playwright's fill on range input and dispatch input event properly
    slider = page.locator('input.lg-ctrl-slider').nth(5)
    slider.fill('5')
    page.evaluate('''(selector) => {
        const el = document.querySelector(selector);
        if (el) {
            el.value = '5';
            el.dispatchEvent(new InputEvent('input', { bubbles: true }));
        }
    }''', 'input.lg-ctrl-slider:nth-of-type(6)')
    page.wait_for_timeout(2000)
    page.screenshot(path='d:/aiide_project/trae_project/music-player/test_screenshot_after.png', full_page=False)

    # Check if filter rebuilt
    after_filter = page.evaluate('''() => {
        const mp = document.querySelector('.fixed.z-50');
        if (!mp) return 'no miniplayer';
        const effectLayer = mp.querySelector('div[style*="z-index: 1"]');
        return effectLayer ? effectLayer.style.backdropFilter : 'not found';
    }''')
    print('After filter:', after_filter)

    # Check SVG filters count and IDs
    filters = page.evaluate('''() => {
        const defs = document.querySelector('#liquid-glass-svg-root defs');
        return defs ? Array.from(defs.children).map(f => f.id) : 'no defs';
    }''')
    print('SVG filters:', filters)

    # Check if new filter has different blur value
    filterContent = page.evaluate('''() => {
        const defs = document.querySelector('#liquid-glass-svg-root defs');
        if (!defs) return 'no defs';
        const lastFilter = defs.lastElementChild;
        if (!lastFilter) return 'no filter';
        const blur = lastFilter.querySelector('feGaussianBlur');
        return blur ? blur.getAttribute('stdDeviation') : 'no blur';
    }''')
    print('Last filter blur:', filterContent)

    browser.close()
