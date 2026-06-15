from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    
    # 测试不同屏幕尺寸
    for width in [1280, 768, 480, 375]:
        page = browser.new_page()
        page.set_viewport_size({'width': width, 'height': 800})
        page.goto('http://localhost:5173')
        page.wait_for_load_state('networkidle')
        page.wait_for_timeout(1000)
        
        # 截图
        page.screenshot(path=f'/tmp/player_{width}.png', full_page=False)
        print(f'Screenshot saved: player_{width}.png')
        page.close()
    
    browser.close()
    print('Done!')