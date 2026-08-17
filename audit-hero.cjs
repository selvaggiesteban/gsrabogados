const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://teal-kangaroo-518905.hostingersite.com/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  
  // Check applied CSS rules for .hero__content
  const audit = await page.evaluate(() => {
    const el = document.querySelector('.hero__content');
    if (!el) return { error: '.hero__content not found' };
    
    const cs = window.getComputedStyle(el);
    
    // Also check the parent .hero
    const hero = document.querySelector('.hero');
    const heroCs = hero ? window.getComputedStyle(hero) : null;
    
    // Check the CSS rules from the stylesheet
    const rules = [];
    for (const sheet of document.styleSheets) {
      try {
        for (const rule of sheet.cssRules) {
          if (rule.cssText && rule.cssText.includes('hero__content')) {
            rules.push(rule.cssText.substring(0, 200));
          }
        }
      } catch(e) {
        rules.push('Error reading sheet: ' + e.message);
      }
    }
    
    return {
      heroContent: {
        position: cs.position,
        zIndex: cs.zIndex,
        color: cs.color,
        opacity: cs.opacity,
        display: cs.display,
        padding: cs.padding
      },
      hero: heroCs ? {
        position: heroCs.position,
        minHeight: heroCs.minHeight,
        display: heroCs.display,
        background: heroCs.backgroundColor
      } : null,
      matchingRules: rules
    };
  });
  
  console.log('=== HERO AUDIT ===');
  console.log(JSON.stringify(audit, null, 2));
  
  await browser.close();
})();
