const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://teal-kangaroo-518905.hostingersite.com/', { waitUntil: 'networkidle' });
  
  const headContent = await page.evaluate(() => {
    return document.head.innerHTML;
  });
  console.log('=== HEAD ===');
  console.log(headContent.substring(0, 1500));
  
  await browser.close();
})();
