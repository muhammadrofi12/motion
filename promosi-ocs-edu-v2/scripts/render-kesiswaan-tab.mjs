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
await page.setViewport({ width: 86, height: 80, deviceScaleFactor: 1 });

const fontData = fs.readFileSync('promosi-ocs-edu-v2/assets/jakarta-latin.woff2').toString('base64');

// Exact HTML from AppLayout.jsx for an inactive tab:
// className="flex flex-col items-center justify-center py-1 px-2 rounded-xl text-center min-w-0 flex-1 select-none text-neutral-500 font-medium"
// div className="p-1 rounded-lg text-neutral-400"
// Icon className="w-5 h-5 shrink-0"
// span className="text-xs leading-tight mt-0.5 tracking-tight"
const html = `
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
    height: 80px;
    background: #ffffff;
    font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding-top: 6px;
  }
  .btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4px 8px;
    width: 100%;
  }
  .icon-wrap {
    padding: 4px;
    color: #94a3b8;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .icon {
    width: 20px;
    height: 20px;
    stroke: #94a3b8;
    stroke-width: 2;
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
  .label {
    font-size: 12px;
    line-height: 1.25;
    margin-top: 2px;
    font-weight: 500;
    color: #64748b;
    letter-spacing: -0.02em;
    text-align: center;
    white-space: nowrap;
  }
</style>
</head>
<body>
  <div class="btn">
    <div class="icon-wrap">
      <svg class="icon" viewBox="0 0 24 24">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    </div>
    <span class="label">Kesiswaan</span>
  </div>
</body>
</html>
`;

await page.setContent(html, { waitUntil: 'load' });
await page.evaluate(async () => { await document.fonts.ready; });
await page.screenshot({ path: 'promosi-ocs-edu-v2/review/tab-kesiswaan-1x.png' });

// Now 2x
await page.setViewport({ width: 172, height: 160, deviceScaleFactor: 2 });
const html2x = html.replace('width: 86px;', 'width: 172px;').replace('height: 80px;', 'height: 160px;').replace('padding-top: 6px;', 'padding-top: 12px;')
  .replace('padding: 4px 8px;', 'padding: 8px 16px;')
  .replace('padding: 4px;', 'padding: 8px;')
  .replace('width: 20px;', 'width: 40px;').replace('height: 20px;', 'height: 40px;')
  .replace('font-size: 12px;', 'font-size: 24px;').replace('margin-top: 2px;', 'margin-top: 4px;');
await page.setContent(html2x, { waitUntil: 'load' });
await page.evaluate(async () => { await document.fonts.ready; });
await page.screenshot({ path: 'promosi-ocs-edu-v2/review/tab-kesiswaan-2x.png' });

await browser.close();
console.log('Rendered tab-kesiswaan 1x and 2x');
