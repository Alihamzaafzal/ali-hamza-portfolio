import { chromium } from 'playwright';
import { mkdirSync } from 'fs';

mkdirSync('public/projects', { recursive: true });

async function shot(name, url, out, wait = 18000) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 120000 });
    await page.waitForTimeout(wait);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({
      path: out,
      type: out.endsWith('.png') ? 'png' : 'jpeg',
      quality: 90,
      fullPage: false,
    });
    console.log('OK', name, out);
  } catch (e) {
    console.error('FAIL', name, e.message);
  } finally {
    await browser.close();
  }
}

await shot('pazvese', 'https://www.pazvese.com/', 'public/projects/pazvese.jpg', 15000);
await shot('flame-grill', 'https://flamegrill.leadlife.net/', 'public/projects/flame-grill.png', 22000);
