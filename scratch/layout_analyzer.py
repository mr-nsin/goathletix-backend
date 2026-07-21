from playwright.sync_api import sync_playwright
import json

def analyze_layout():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.set_viewport_size({"width": 1440, "height": 900})
        page.goto("https://www.fixturecalendar.com", wait_until="networkidle")
        
        # Extract visual layout
        layout_data = page.evaluate('''() => {
            const elements = Array.from(document.querySelectorAll('header, footer, main, div, a, button, h1, h2, h3, p'));
            const data = [];
            for (const el of elements) {
                const rect = el.getBoundingClientRect();
                if (rect.width > 50 && rect.height > 20 && rect.top < 2000) {
                    let type = el.tagName;
                    let text = el.innerText.substring(0, 50).replace(/\\n/g, ' ');
                    data.push({
                        type: type,
                        class: el.className,
                        text: text,
                        x: Math.round(rect.x),
                        y: Math.round(rect.y),
                        w: Math.round(rect.width),
                        h: Math.round(rect.height)
                    });
                }
            }
            return data;
        }''')
        
        # Group and filter to see the major structural blocks
        major_blocks = [d for d in layout_data if d['w'] > 300]
        
        with open('layout_results.json', 'w') as f:
            json.dump(major_blocks, f, indent=2)
            
        print(f"Extracted {len(major_blocks)} major layout blocks.")
        browser.close()

if __name__ == "__main__":
    analyze_layout()
