const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const outDir = 'C:\\\\Users\\\\Esteban Selvaggi\\\\Desktop\\\\subagent-driven_development\\\\estudiogsr-astro\\\\screenshots\\\\';
  const url = 'https://teal-kangaroo-518905.hostingersite.com/?t=' + Date.now();

  const ctx = await browser.newContext({ viewport: { width: 1920, height: 200 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  await page.screenshot({ path: outDir + 'header-v3-desktop.png', clip: { x: 0, y: 0, width: 1920, height: 120 } });
  console.log('Desktop captured');

  await browser.close();
})();
