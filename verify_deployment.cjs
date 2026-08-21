const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    console.log('Navigating to site...');
    // Use /es/ to avoid redirect issues
    await page.goto('https://gsrabogados.com.ar/es/');

    // 1. Verify WhatsApp button
    const waButton = page.locator('.whatsapp-float');
    await waButton.waitFor({ state: 'visible' });
    const svgCount = await waButton.locator('svg').count();
    console.log(`WhatsApp button SVG count: ${svgCount}`);

    // 2. Verify Monogram scroll size
    const monogram = page.locator('.header__monogram-img');
    const initialWidth = await monogram.evaluate(el => el.getBoundingClientRect().width);
    console.log(`Initial monogram width: ${initialWidth}px`);

    console.log('Scrolling down...');
    await page.evaluate(() => window.scrollTo(0, 300));
    await page.waitForTimeout(1000); // give time for transition and JS to fire

    const scrolledWidth = await monogram.evaluate(el => el.getBoundingClientRect().width);
    console.log(`Scrolled monogram width: ${scrolledWidth}px`);

    if (Math.abs(scrolledWidth - 60) < 5) {
      console.log('SUCCESS: Monogram width is approximately 60px on scroll.');
    } else {
      console.log(`FAILURE: Monogram width is ${scrolledWidth}px, expected ~60px.`);
    }

    // 3. Verify Socios mobile order
    await page.setViewportSize({ width: 375, height: 812 }); // Mobile viewport
    const sociosMobile = page.locator('.socio__mobile-item .socio__nombre');
    const sociosCount = await sociosMobile.count();
    const sociosNames = [];
    for (let i = 0; i < sociosCount; i++) {
      sociosNames.push(await sociosMobile.nth(i).innerText());
    }
    console.log(`Socios mobile order: ${sociosNames.join(', ')}`);

    const expectedOrder = ['MATÍAS ALEJANDRO GARCETE SUÁREZ', 'BENJAMÍN RONCO'];
    if (JSON.stringify(sociosNames) === JSON.stringify(expectedOrder)) {
      console.log('SUCCESS: Socios mobile order is correct.');
    } else {
      console.log(`FAILURE: Socios mobile order is incorrect. Expected ${expectedOrder.join(', ')}, got ${sociosNames.join(', ')}.`);
    }

  } catch (e) {
    console.error('Error during verification:', e);
  } finally {
    await browser.close();
  }
})();
