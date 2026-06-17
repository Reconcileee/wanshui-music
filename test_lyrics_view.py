from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 900, 'height': 600})
    page.goto('http://localhost:5174/wanshui-music/')
    page.wait_for_timeout(5000)

    # 点击一首歌
    result = page.evaluate("""() => {
        const rows = document.querySelectorAll('.group');
        for (const row of rows) {
            if (row.textContent && row.textContent.includes('the cure')) {
                row.click();
                return 'played';
            }
        }
        return 'no song row found';
    }""")
    print('Step 1:', result)
    page.wait_for_timeout(2000)

    # 点击 Mic2 按钮
    result = page.evaluate("""() => {
        const allBtns = Array.from(document.querySelectorAll('button'));
        const lyricsBtn = allBtns.find(b => b.title === '歌词');
        if (lyricsBtn) {
            lyricsBtn.click();
            return 'clicked lyrics';
        }
        return 'no lyrics button found';
    }""")
    print('Step 2:', result)
    page.wait_for_timeout(2500)

    # 截更小的尺寸
    page.screenshot(path='d:/aiide_project/trae_project/music-player/sl.png', clip={'x': 0, 'y': 0, 'width': 900, 'height': 600})
    browser.close()
    print('Done')
