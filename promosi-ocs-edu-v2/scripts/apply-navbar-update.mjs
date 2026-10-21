// apply-navbar-update.mjs
// Updates the bottom navbar across all 6 mobile screens in promosi-ocs-edu-v2
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const require = createRequire('C:/Belajar_Pemograman/Project/landing-page-ocs-edu/package.json');
const sharp = require('sharp');

const assetsDir = resolve(fileURLToPath(new URL('../assets/', import.meta.url)));

async function update3Tabs(filename, keptTabIndices, strokeWidth = 1.5) {
  const filePath = resolve(assetsDir, filename);
  const meta = await sharp(filePath).metadata();
  const W = meta.width;
  const H = meta.height;
  const navH = W === 430 ? 80 : 160;
  const navY = H - navH;
  const oldColW = W / 5;

  const tabs = await Promise.all(
    keptTabIndices.map(async idx => {
      return await sharp(filePath)
        .extract({
          left: Math.round(idx * oldColW),
          top: navY,
          width: Math.round(oldColW),
          height: navH
        })
        .toBuffer();
    })
  );

  const newColW = W / 3;
  const offset = Math.round((newColW - oldColW) / 2);

  const bgSvg = Buffer.from(`
    <svg width="${W}" height="${navH}">
      <rect width="${W}" height="${navH}" fill="#ffffff"/>
      <line x1="0" y1="0" x2="${W}" y2="0" stroke="#f1f5f9" stroke-width="${strokeWidth}"/>
    </svg>
  `);

  const composites = tabs.map((tabBuf, i) => ({
    input: tabBuf,
    left: Math.round(i * newColW + offset),
    top: 0
  }));

  const newNavbar = await sharp(bgSvg)
    .composite(composites)
    .png()
    .toBuffer();

  const finalImg = await sharp(filePath)
    .composite([{ input: newNavbar, left: 0, top: navY }])
    .png()
    .toBuffer();

  await sharp(finalImg).toFile(filePath);
  console.log(`[Update Navbar] ${filename}: updated to 3 tabs`);
}

async function update4Tabs(filename, keptTabIndices, strokeWidth = 2) {
  const filePath = resolve(assetsDir, filename);
  const meta = await sharp(filePath).metadata();
  const W = meta.width;
  const H = meta.height;
  const navH = 160;
  const navY = H - navH;
  const oldColW = W / 5;

  const tabs = await Promise.all(
    keptTabIndices.map(async idx => {
      return await sharp(filePath)
        .extract({
          left: Math.round(idx * oldColW),
          top: navY,
          width: Math.round(oldColW),
          height: navH
        })
        .toBuffer();
    })
  );

  const newColW = W / 4;
  const offset = Math.round((newColW - oldColW) / 2);

  const bgSvg = Buffer.from(`
    <svg width="${W}" height="${navH}">
      <rect width="${W}" height="${navH}" fill="#ffffff"/>
      <line x1="0" y1="0" x2="${W}" y2="0" stroke="#f1f5f9" stroke-width="${strokeWidth}"/>
    </svg>
  `);

  const composites = tabs.map((tabBuf, i) => ({
    input: tabBuf,
    left: Math.round(i * newColW + offset),
    top: 0
  }));

  const newNavbar = await sharp(bgSvg)
    .composite(composites)
    .png()
    .toBuffer();

  const finalImg = await sharp(filePath)
    .composite([{ input: newNavbar, left: 0, top: navY }])
    .png()
    .toBuffer();

  await sharp(finalImg).toFile(filePath);
  console.log(`[Update Navbar] ${filename}: updated to 4 tabs`);
}

console.log('--- Applying Navbar Updates ---');
// 1. Guru views: keep [0: Beranda, 1: Akademik, 2: E-Learning]
await update3Tabs('guru-dashboard-430.png', [0, 1, 2], 1.5);
await update3Tabs('guru-mengajar-430.png', [0, 1, 2], 2);

// 2. Siswa views: keep [0: Beranda, 1: Akademik, 2: LMS, 3: Tagihan]
await update4Tabs('siswa-lms-430.png', [0, 1, 2, 3], 2);
await update4Tabs('siswa-materi-430.png', [0, 1, 2, 3], 2);

// 3. Ortu views: keep [0: Beranda, 1: Anak Saya, 2: Tagihan]
await update3Tabs('ortu-dashboard-430.png', [0, 1, 2], 1.5);
await update3Tabs('ortu-rapor-430.png', [0, 1, 2], 2);

console.log('All 6 assets successfully updated!');
