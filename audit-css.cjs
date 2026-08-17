const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Intercept requests to debug
  page.on('response', response => {
    if (response.url().includes('.css')) {
      console.log('CSS Response:', response.url(), response.status(), response.headers()['content-type']);
    }
  });
  
  await page.goto('https://teal-kangaroo-518905.hostingersite.com/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  
  // Check document.styleSheets content
  const audit = await page.evaluate(() => {
    const sheets = Array.from(document.styleSheets);
    const sheetInfo = sheets.map((s, i) => {
      let ruleCount = 0;
      let heroRules = [];
      try {
        ruleCount = s.cssRules.length;
        for (const rule of s.cssRules) {
          if (rule.cssText && rule.cssText.includes('hero__content')) {
            heroRules.push(rule.cssText.substring(0, 150));
          }
        }
      } catch(e) {
        return { index: i, href: s.href, error: e.message };
      }
      return { index: i, href: s.href, ruleCount, heroRules };
    });
    
    // Check computed style manually
    const el = document.querySelector('.hero__content');
    const allStyles = el ? window.getComputedStyle(el) : null;
    return {
      sheets: sheetInfo,
      heroContentPosition: allStyles ? allStyles.position : 'no element',
    };
  });
  
  console.log('=== STYLESHEET AUDIT ===');
  console.log(JSON.stringify(audit, null, 2));
  
  await browser.close();
})();
