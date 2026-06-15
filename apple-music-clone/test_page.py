from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1200, 'height': 800})
    page.goto('http://localhost:8081/')
    page.wait_for_load_state('networkidle')
    page.wait_for_timeout(3000)
    page.screenshot(path='d:/aiide_project/trae_project/music-player/apple-music-clone/screenshot.png', full_page=False)

    # Open glass controls
    page.click('#toggle-glass-controls')
    page.wait_for_timeout(500)
    page.screenshot(path='d:/aiide_project/trae_project/music-player/apple-music-clone/screenshot_controls.png', full_page=False)

    # Adjust blur
    page.evaluate('''() => {
        document.getElementById('slider-blur').value = '5';
        document.getElementById('slider-blur').dispatchEvent(new InputEvent('input', { bubbles: true }));
    }''')
    page.wait_for_timeout(1000)
    page.screenshot(path='d:/aiide_project/trae_project/music-player/apple-music-clone/screenshot_after_blur.png', full_page=False)

    # Check filter
    blurVal = page.evaluate('''() => {
        const defs = document.querySelector('#svg-defs');
        if (!defs) return 'no defs';
        const blur = defs.querySelector('feGaussianBlur');
        return blur ? blur.getAttribute('stdDeviation') : 'no blur';
    }''')
    print('Blur value:', blurVal)

    browser.close()
