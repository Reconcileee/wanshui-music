from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1280, 'height': 800})
    page.goto('http://localhost:5173/')
    page.wait_for_load_state('load')
    page.wait_for_timeout(6000)
    page.screenshot(path='d:/aiide_project/trae_project/music-player/screenshot_react.png', full_page=False)
    print('Screenshot saved')
    browser.close()
