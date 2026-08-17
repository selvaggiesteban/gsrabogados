const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const outDir = 'C:\\\\Users\\\\Esteban Selvaggi\\\\Desktop\\\\subagent-driven_development\\\\estudiogsr-astro\\\\screenshots\\\\';
  const url = 'https://teal-kangaroo-518905.hostingersite.com/?t=' + Date.now();

  // Desktop
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(3500);

  // Hero
  await page.screenshot({ path: outDir + 'hero-desktop.png' });
  console.log('1. Hero desktop');

  // Full page
  await page.screenshot({ path: outDir + 'full-desktop.png', fullPage: true });
  console.log('2. Full desktop');

  // El Estudio
  await page.evaluate(() => document.querySelector('#el-estudio')?.scrollIntoView({block:'start'}));
  await page.waitForTimeout(1500);
  await page.screenshot({ path: outDir + 'estudio.png' });
  console.log('3. El Estudio');

  // Areas
  await page.evaluate(() => document.querySelector('#areas')?.scrollIntoView({block:'start'}));
  await page.waitForTimeout(1500);
  await page.screenshot({ path: outDir + 'areas.png' });
  console.log('4. Areas');

  // Socios
  await page.evaluate(() => document.querySelector('#socios')?.scrollIntoView({block:'start'}));
  await page.waitForTimeout(1500);
  await page.screenshot({ path: outDir + 'socios.png' });
  console.log('5. Socios');

  // Equipo
  await page.evaluate(() => document.querySelector('#equipo')?.scrollIntoView({block:'start'}));
  await page.waitForTimeout(1500);
  await page.screenshot({ path: outDir + 'equipo.png' });
  console.log('6. Equipo');

  // Cierre
  await page.evaluate(() => document.querySelector('#cierre')?.scrollIntoView({block:'start'}));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: outDir + 'cierre.png' });
  console.log('7. Cierre');

  // Contacto
  await page.evaluate(() => document.querySelector('#contacto')?.scrollIntoView({block:'start'}));
  await page.waitForTimeout(1500);
  await page.screenshot({ path: outDir + 'contacto.png' });
  console.log('8. Contacto');

  // Design audit
  const audit = await page.evaluate(() => {
    const sections = Array.from(document.querySelectorAll('section'));
    const body = document.body;
    const bodyCs = window.getComputedStyle(body);
    const heroContent = document.querySelector('.hero__content');
    const heroCs = heroContent ? window.getComputedStyle(heroContent) : null;
    const cta = document.querySelector('.hero__cta');
    const ctaCs = cta ? window.getComputedStyle(cta) : null;
    
    return {
      body: { bg: bodyCs.backgroundColor, color: bodyCs.color },
      heroContent: heroCs ? { position: heroCs.position, zIndex: heroCs.zIndex, color: heroCs.color } : null,
      cta: ctaCs ? { bg: ctaCs.backgroundColor, color: ctaCs.color, display: ctaCs.display, padding: ctaCs.padding } : null,
      sections: sections.map(s => ({ id: s.id, bg: window.getComputedStyle(s).backgroundColor, color: window.getComputedStyle(s).color })),
      images: document.querySelectorAll('img').length,
      brokenImages: Array.from(document.querySelectorAll('img')).filter(i => !i.complete || i.naturalWidth === 0).length
    };
  });
  
  console.log('\\n=== DESIGN AUDIT ===');
  console.log('Body:', JSON.stringify(audit.body));
  console.log('Hero content:', JSON.stringify(audit.heroContent));
  console.log('CTA:', JSON.stringify(audit.cta));
  console.log('Images:', audit.images - audit.brokenImages + '/' + audit.images, 'loaded');
  audit.sections.forEach(s => console.log('Section:', s.id || '(hero)', 'bg:', s.bg, 'color:', s.color));

  // Mobile
  const mCtx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const mPage = await mCtx.newPage();
  await mPage.goto(url, { waitUntil: 'networkidle' });
  await mPage.waitForTimeout(3000);
  await mPage.screenshot({ path: outDir + 'hero-mobile.png' });
  console.log('9. Hero mobile');
  await mPage.screenshot({ path: outDir + 'full-mobile.png', fullPage: true });
  console.log('10. Full mobile');

  await browser.close();
  console.log('\\nDONE');
})();
