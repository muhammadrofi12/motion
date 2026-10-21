import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const require = createRequire('C:/Belajar_Pemograman/Project/landing-page-ocs-edu/package.json');
const sharp = require('sharp');

const assetsDir = resolve(fileURLToPath(new URL('../assets/', import.meta.url)));
const reviewDir = resolve(fileURLToPath(new URL('../review/', import.meta.url)));

async function updateGuru4Tabs() {
  console.log('--- Updating Guru 4 Tabs ---');

  // 1. guru-dashboard-430.png (1x: 430 x 932)
  {
    const W = 430;
    const H = 932;
    const navH = 80;
    const navY = H - navH; // 852
    const oldColW = 86; // 430 / 5
    const newColW = W / 4; // 107.5
    const offset = Math.round((newColW - oldColW) / 2); // 11

    const tab0 = await sharp(resolve(reviewDir, 'guru-full.png'))
      .extract({ left: 0 * oldColW, top: navY, width: oldColW, height: navH })
      .toBuffer();
    const tab1 = await sharp(resolve(reviewDir, 'guru-full.png'))
      .extract({ left: 1 * oldColW, top: navY, width: oldColW, height: navH })
      .toBuffer();
    const tab2 = await sharp(resolve(reviewDir, 'guru-full.png'))
      .extract({ left: 2 * oldColW, top: navY, width: oldColW, height: navH })
      .toBuffer();
    const tab3 = await sharp(resolve(reviewDir, 'tab-kesiswaan-final-1x.png'))
      .toBuffer();

    const bgSvg = Buffer.from(`
      <svg width="${W}" height="${navH}">
        <rect width="${W}" height="${navH}" fill="#ffffff"/>
        <line x1="0" y1="0" x2="${W}" y2="0" stroke="#e2e8f0" stroke-width="1.5"/>
      </svg>
    `);

    const newNavbar = await sharp(bgSvg)
      .composite([
        { input: tab0, left: Math.round(0 * newColW + offset), top: 0 },
        { input: tab1, left: Math.round(1 * newColW + offset), top: 0 },
        { input: tab2, left: Math.round(2 * newColW + offset), top: 0 },
        { input: tab3, left: Math.round(3 * newColW + offset), top: 0 },
      ])
      .png()
      .toBuffer();

    await sharp(newNavbar).toFile(resolve(reviewDir, 'test-guru-nav-4tabs-1x.png'));

    const filePath = resolve(assetsDir, 'guru-dashboard-430.png');
    const finalImg = await sharp(filePath)
      .composite([{ input: newNavbar, left: 0, top: navY }])
      .png()
      .toBuffer();
    await sharp(finalImg).toFile(filePath);
    console.log('guru-dashboard-430.png updated with 4 tabs!');
  }

  // 2. guru-mengajar-430.png (2x: 860 x 1864)
  {
    const W = 860;
    const H = 1864;
    const navH = 160;
    const navY = H - navH; // 1704
    const oldColW = 172; // 860 / 5
    const newColW = W / 4; // 215
    const offset = Math.round((newColW - oldColW) / 2); // 22

    // Original navbar in nav-guru-mengajar.png was cropped with top: 1664 (40px above navbar)
    // So navbar starts at y = 40
    const tab0 = await sharp(resolve(reviewDir, 'nav-guru-mengajar.png'))
      .extract({ left: 0 * oldColW, top: 40, width: oldColW, height: navH })
      .toBuffer();
    const tab1 = await sharp(resolve(reviewDir, 'nav-guru-mengajar.png'))
      .extract({ left: 1 * oldColW, top: 40, width: oldColW, height: navH })
      .toBuffer();
    const tab2 = await sharp(resolve(reviewDir, 'nav-guru-mengajar.png'))
      .extract({ left: 2 * oldColW, top: 40, width: oldColW, height: navH })
      .toBuffer();
    const tab3 = await sharp(resolve(reviewDir, 'tab-kesiswaan-final-2x.png'))
      .toBuffer();

    const bgSvg = Buffer.from(`
      <svg width="${W}" height="${navH}">
        <rect width="${W}" height="${navH}" fill="#ffffff"/>
        <line x1="0" y1="0" x2="${W}" y2="0" stroke="#e2e8f0" stroke-width="2"/>
      </svg>
    `);

    const newNavbar = await sharp(bgSvg)
      .composite([
        { input: tab0, left: Math.round(0 * newColW + offset), top: 0 },
        { input: tab1, left: Math.round(1 * newColW + offset), top: 0 },
        { input: tab2, left: Math.round(2 * newColW + offset), top: 0 },
        { input: tab3, left: Math.round(3 * newColW + offset), top: 0 },
      ])
      .png()
      .toBuffer();

    await sharp(newNavbar).toFile(resolve(reviewDir, 'test-guru-nav-4tabs-2x.png'));

    const filePath = resolve(assetsDir, 'guru-mengajar-430.png');
    const finalImg = await sharp(filePath)
      .composite([{ input: newNavbar, left: 0, top: navY }])
      .png()
      .toBuffer();
    await sharp(finalImg).toFile(filePath);
    console.log('guru-mengajar-430.png updated with 4 tabs!');
  }
}

await updateGuru4Tabs();
