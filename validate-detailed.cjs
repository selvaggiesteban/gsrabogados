const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const page = await context.newPage();

  const url = 'https://teal-kangaroo-518905.hostingersite.com/';
  const outDir = 'C:\\Users\\Esteban Selvaggi\\Desktop\\subagent-driven_development\\estudiogsr-astro\\screenshots\\';

  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  // Screenshot hero desktop
  await page.screenshot({ path: outDir + 'desktop-hero.png' });
  console.log('Hero captured');

  // Detailed design audit
  const audit = await page.evaluate(() => {
    const results = {};
    
    // Check CSS loaded
    const styleSheets = Array.from(document.styleSheets);
    results.styleSheets = styleSheets.length;
    
    // Check each section's background
    const sections = Array.from(document.querySelectorAll('section'));
    results.sections = sections.map((s, i) => {
      const cs = window.getComputedStyle(s);
      // Also check the whole element including inherited
      const bg = cs.backgroundColor;
      const bgImg = cs.backgroundImage;
      const color = cs.color;
      let ancestorBg = 'none';
      let el = s.parentElement;
      while (el && (ancestorBg === 'none' || ancestorBg === 'rgba(0, 0, 0, 0)' || ancestorBg === 'transparent')) {
        const aBg = window.getComputedStyle(el).backgroundColor;
        if (aBg !== 'rgba(0, 0, 0, 0)' && aBg !== 'transparent') {
          ancestorBg = aBg;
          break;
        }
        el = el.parentElement;
      }
      return {
        index: i,
        id: s.id,
        className: s.className,
        bg,
        bgImg: bgImg.substring(0, 50),
        textNeedsLight: window.getComputedStyle(s).color === 'rgb(246, 230, 212)',
        ancestorBg
      };
    });
    
    // Check hero content visible
    const heroContent = document.querySelector('.hero__content');
    if (heroContent) {
      const cs = window.getComputedStyle(heroContent);
      results.heroContent = {
        opacity: cs.opacity,
        zIndex: cs.zIndex,
        position: cs.position,
        color: cs.color,
        text: heroContent.textContent.trim().substring(0, 60)
      };
    }
    
    // Check button visible
    const cta = document.querySelector('.hero__cta');
    if (cta) {
      const cs = window.getComputedStyle(cta);
      results.cta = {
        opacity: cs.opacity,
        bg: cs.backgroundColor,
        color: cs.color,
        text: cta.textContent
      };
    }
    
    return results;
  });
  console.log('\n=== DETAILED AUDIT ===');
  console.log('Style sheets loaded:', audit.styleSheets);
  console.log('Hero content:', JSON.stringify(audit.heroContent, null, 2));
  console.log('CTA:', JSON.stringify(audit.cta, null, 2));
  console.log('Sections:');
  audit.sections.forEach(s => {
    console.log('  ' + s.index + ': id=' + s.id + ' class=' + s.className.substring(0, 50) + ' bg=' + s.bg + ' color=' + (window.getComputedStyle ? s.textNeedsLight : ''));
  });

  await browser.close();
})();
