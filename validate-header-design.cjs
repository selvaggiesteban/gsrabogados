const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const outDir = 'C:\\\\Users\\\\Esteban Selvaggi\\\\Desktop\\\\subagent-driven_development\\\\estudiogsr-astro\\\\screenshots\\\\';
  const url = 'https://teal-kangaroo-518905.hostingersite.com/?t=' + Date.now();

  // Desktop - capture only the header area (first ~120px)
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 200 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Header area only
  await page.screenshot({ path: outDir + 'header-reference-desktop.png', clip: { x: 0, y: 0, width: 1920, height: 120 } });
  console.log('1. Header desktop captured');

  // Full top section with hero
  const ctx2 = await browser.newContext({ viewport: { width: 1920, height: 800 }, deviceScaleFactor: 1 });
  const page2 = await ctx2.newPage();
  await page2.goto(url, { waitUntil: 'networkidle' });
  await page2.waitForTimeout(2000);
  await page2.screenshot({ path: outDir + 'header-with-hero.png' });
  console.log('2. Header with hero captured');

  // Mobile - hamburger only
  const mCtx = await browser.newContext({ viewport: { width: 390, height: 200 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const mPage = await mCtx.newPage();
  await mPage.goto(url, { waitUntil: 'networkidle' });
  await mPage.waitForTimeout(2000);
  await mPage.screenshot({ path: outDir + 'header-mobile.png' });
  console.log('3. Mobile header captured');

  // Design audit
  const audit = await page.evaluate(() => {
    const monogram = document.querySelector('.header__monogram-text');
    const navLinks = document.querySelectorAll('.header__nav-link');
    const langLinks = document.querySelectorAll('.header__lang-link');
    const activeLang = document.querySelector('.header__lang-link--active');
    const header = document.getElementById('site-header');

    const monogramCs = monogram ? window.getComputedStyle(monogram) : null;
    const linkCs = navLinks[0] ? window.getComputedStyle(navLinks[0]) : null;
    const langCs = langLinks[0] ? window.getComputedStyle(langLinks[0]) : null;
    const activeLangCs = activeLang ? window.getComputedStyle(activeLang) : null;

    return {
      monogram: monogramCs ? {
        text: monogram.textContent,
        fontFamily: monogramCs.fontFamily,
        fontSize: monogramCs.fontSize,
        color: monogramCs.color,
        textTransform: monogramCs.textTransform,
        letterSpacing: monogramCs.letterSpacing
      } : null,
      navLink: linkCs ? {
        text: navLinks[0].textContent,
        fontFamily: linkCs.fontFamily,
        fontSize: linkCs.fontSize,
        textTransform: linkCs.textTransform,
        letterSpacing: linkCs.letterSpacing,
        color: linkCs.color
      } : null,
      langLink: langCs ? {
        text: langLinks[0].textContent,
        fontFamily: langCs.fontFamily,
        fontSize: langCs.fontSize,
        color: langCs.color
      } : null,
      activeLang: activeLangCs ? {
        text: activeLang.textContent,
        textDecoration: activeLangCs.textDecoration,
        opacity: activeLangCs.opacity
      } : null,
      headerBg: window.getComputedStyle(header).backgroundColor
    };
  });

  console.log('\\n=== HEADER DESIGN AUDIT ===');
  console.log('Header bg:', audit.headerBg);
  console.log('Monogram:', JSON.stringify(audit.monogram, null, 2));
  console.log('Nav link:', JSON.stringify(audit.navLink, null, 2));
  console.log('Lang link:', JSON.stringify(audit.langLink, null, 2));
  console.log('Active lang:', JSON.stringify(audit.activeLang, null, 2));

  await browser.close();
  console.log('\\nDONE');
})();
