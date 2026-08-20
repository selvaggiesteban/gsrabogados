import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('CONSOLE:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

  try {
    await page.goto('https://gsrabogados.com.ar/', { waitUntil: 'networkidle' });
    
    console.log('--- Initial State ---');
    const initialInvisible = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('*'))
        .filter(el => window.getComputedStyle(el).opacity === '0')
        .map(el => `${el.tagName}.${el.className}`);
    });
    console.log('Initially invisible elements count:', initialInvisible.length);

    console.log('--- Scrolling to trigger animations ---');
    // Scroll to the bottom slowly to trigger all IntersectionObservers
    await page.evaluate(async () => {
      await new Promise((resolve) => {
        let totalHeight = 0;
        let distance = 100;
        let timer = setInterval(() => {
          let scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;

          if (totalHeight >= scrollHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 100);
      });
    });

    // Wait for animations to finish
    await page.waitForTimeout(2000);

    console.log('--- Final State ---');
    const finalInvisible = await page.evaluate(() => {
      const all = Array.from(document.querySelectorAll('*'));
      const invisible = all.filter(el => {
        const style = window.getComputedStyle(el);
        return style.opacity === '0' || style.display === 'none' || style.visibility === 'hidden';
      });
      
      return invisible.map(el => {
        return {
          tag: el.tagName,
          class: el.className,
          text: el.innerText?.substring(0, 30) || '',
          opacity: window.getComputedStyle(el).opacity,
          display: window.getComputedStyle(el).display,
          visibility: window.getComputedStyle(el).visibility
        };
      });
    });

    console.log('Elements still invisible/hidden after scroll:');
    console.table(finalInvisible);

    if (finalInvisible.length === 0) {
      console.log('SUCCESS: All elements are visible!');
    } else {
      console.log(`FAILURE: ${finalInvisible.length} elements are still invisible.`);
    }

    await page.screenshot({ path: 'final_debug.png', fullPage: true });

  } catch (e) {
    console.error('ERROR:', e);
  } finally {
    await browser.close();
  }
})();
