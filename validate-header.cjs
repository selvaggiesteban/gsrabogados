const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const outDir = 'C:\\\\Users\\\\Esteban Selvaggi\\\\Desktop\\\\subagent-driven_development\\\\estudiogsr-astro\\\\screenshots\\\\';
  const url = 'https://teal-kangaroo-518905.hostingersite.com/?t=' + Date.now();

  // Desktop validation
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Test 1: Header transparent at top
  const headerTop = await page.evaluate(() => {
    const h = document.getElementById('site-header');
    return {
      bg: window.getComputedStyle(h).backgroundColor,
      position: window.getComputedStyle(h).position,
      top: window.getComputedStyle(h).top,
      zIndex: window.getComputedStyle(h).zIndex
    };
  });
  console.log('Header at top:', headerTop);

  // Test 2: Scroll down and check color change
  await page.evaluate(() => window.scrollTo(0, 500));
  await page.waitForTimeout(500);
  const headerScrolled = await page.evaluate(() => {
    const h = document.getElementById('site-header');
    return {
      bg: window.getComputedStyle(h).backgroundColor,
      class: h.className
    };
  });
  console.log('Header scrolled:', headerScrolled);

  // Test 3: Scroll back up
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
  const headerTopAgain = await page.evaluate(() => {
    const h = document.getElementById('site-header');
    return { bg: window.getComputedStyle(h).backgroundColor, class: h.className };
  });
  console.log('Header back at top:', headerTopAgain);

  // Test 4: Mobile hamburger menu
  const mCtx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const mPage = await mCtx.newPage();
  await mPage.goto(url, { waitUntil: 'networkidle' });
  await mPage.waitForTimeout(2000);

  // Check hamburger button visible
  const mobileHeader = await mPage.evaluate(() => {
    const toggle = document.getElementById('header-toggle');
    const nav = document.getElementById('header-nav');
    return {
      toggleVisible: toggle ? window.getComputedStyle(toggle).display : 'none',
      navVisible: nav ? window.getComputedStyle(nav).display : 'none',
      toggleDisplay: toggle ? window.getComputedStyle(toggle).display : 'none'
    };
  });
  console.log('Mobile header:', mobileHeader);

  // Click hamburger
  await mPage.click('#header-toggle');
  await mPage.waitForTimeout(300);
  const mobileMenuOpen = await mPage.evaluate(() => {
    const nav = document.getElementById('header-nav');
    const toggle = document.getElementById('header-toggle');
    return {
      navOpen: nav?.classList.contains('header__nav--open'),
      ariaExpanded: toggle?.getAttribute('aria-expanded'),
      navTransform: nav ? window.getComputedStyle(nav).transform : 'none'
    };
  });
  console.log('Mobile menu open:', mobileMenuOpen);

  // Screenshot mobile menu
  await mPage.screenshot({ path: outDir + 'mobile-menu-open.png' });
  console.log('Mobile menu screenshot saved');

  // Close menu
  await mPage.click('#header-toggle');
  await mPage.waitForTimeout(300);
  await mPage.screenshot({ path: outDir + 'mobile-hero.png' });
  console.log('Mobile hero saved');

  // Desktop full page
  await page.screenshot({ path: outDir + 'header-desktop-full.png', fullPage: true });
  console.log('Desktop full saved');

  await browser.close();
  console.log('\\nDONE');
})();
