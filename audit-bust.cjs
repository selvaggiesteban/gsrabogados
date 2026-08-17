const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Add cache-busting query param to force CSS reload
  const url = 'https://teal-kangaroo-518905.hostingersite.com/?t=' + Date.now();
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  
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
      return { index: i, href: s.href, ruleCount, hasHeroRules: heroRules.length > 0 };
    });
    
    const el = document.querySelector('.hero__content');
    const cs = el ? window.getComputedStyle(el) : null;
    return {
      sheets: sheetInfo,
      heroContentPosition: cs ? cs.position : 'no element',
      heroContentColor: cs ? cs.color : 'no element'
    };
  });
  
  console.log('=== AUDIT WITH CACHE BUSTING ===');
  console.log(JSON.stringify(audit, null, 2));
  
  // Now take a screenshot
  await page.screenshot({ path: 'C:\\\\Users\\\\Esteban Selvaggi\\\\Desktop\\\\subagent-driven_development\\\\estudiogsr-astro\\\\screenshots\\\\desktop-hero-fixed.png' });
  console.log('Screenshot saved');
  
  await browser.close();
})();
