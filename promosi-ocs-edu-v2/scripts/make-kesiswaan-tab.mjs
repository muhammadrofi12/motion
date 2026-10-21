import { createRequire } from 'node:module';
const require = createRequire('C:/Belajar_Pemograman/Project/landing-page-ocs-edu/package.json');
const puppeteer = require('puppeteer-core');
const sharp = require('sharp');
import fs from 'node:fs';

const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true
});

const page = await browser.newPage();
const fontData = fs.readFileSync('promosi-ocs-edu-v2/assets/jakarta-latin.woff2').toString('base64');

// Render 1x text: 86 x 25
await page.setViewport({ width: 86, height: 25, deviceScaleFactor: 1 });
const html1x = `
<!DOCTYPE html>
<html>
<head>
<style>
  @font-face {
    font-family: 'Plus Jakarta Sans';
    src: url('data:font/woff2;base64,${fontData}') format('woff2');
    font-weight: 500;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: 86px;
    height: 25px;
    background: #ffffff;
    font-family: 'Plus Jakarta Sans', sans-serif;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  span {
    font-size: 11px;
    font-weight: 500;
    color: #64748b;
    letter-spacing: -0.01em;
    line-height: 1;
  }
</style>
</head>
<body>
  <span>Kesiswaan</span>
</body>
</html>
`;
await page.setContent(html1x, { waitUntil: 'load' });
await page.evaluate(async () => { await document.fonts.ready; });
const textBuf1x = await page.screenshot({ omitBackground: false });

// Render 2x text: 172 x 50
await page.setViewport({ width: 172, height: 50, deviceScaleFactor: 1 });
const html2x = html1x.replace('width: 86px;', 'width: 172px;').replace('height: 25px;', 'height: 50px;')
  .replace('font-size: 11px;', 'font-size: 22px;');
await page.setContent(html2x, { waitUntil: 'load' });
await page.evaluate(async () => { await document.fonts.ready; });
const textBuf2x = await page.screenshot({ omitBackground: false });

await browser.close();

// Now composite onto tab-guru-dash-4.png (1x)
// First wipe y = 45 to 70 to white
const wipe1x = Buffer.from(`
<svg width="86" height="30">
  <rect width="86" height="30" fill="#ffffff"/>
</svg>
`);
const tabKesiswaan1x = await sharp('promosi-ocs-edu-v2/review/tab-guru-dash-4.png')
  .composite([
    { input: wipe1x, left: 0, top: 45 },
    { input: textBuf1x, left: 0, top: 46 }
  ])
  .png()
  .toBuffer();

await sharp(tabKesiswaan1x).toFile('promosi-ocs-edu-v2/review/tab-kesiswaan-final-1x.png');

// And for 2x
const wipe2x = Buffer.from(`
<svg width="172" height="60">
  <rect width="172" height="60" fill="#ffffff"/>
</svg>
`);
const tabKesiswaan2x = await sharp('promosi-ocs-edu-v2/review/tab-guru-meng-4.png')
  .composite([
    { input: wipe2x, left: 0, top: 90 },
    { input: textBuf2x, left: 0, top: 92 }
  ])
  .png()
  .toBuffer();

await sharp(tabKesiswaan2x).toFile('promosi-ocs-edu-v2/review/tab-kesiswaan-final-2x.png');

console.log('Created tab-kesiswaan-final 1x and 2x');
