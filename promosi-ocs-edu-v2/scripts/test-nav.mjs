import { createRequire } from 'node:module';
const require = createRequire('C:/Belajar_Pemograman/Project/landing-page-ocs-edu/package.json');
const sharp = require('sharp');

async function testTeacher4Tabs() {
  const meta = await sharp('promosi-ocs-edu-v2/assets/guru-dashboard-430.png').metadata();
  const W = meta.width; // 430
  const H = meta.height; // 932
  const navH = 80;
  const navY = H - navH;
  const oldColW = W / 5; // 86

  // Extract Tab 0 (Beranda), Tab 1 (Akademik), Tab 2 (E-Learning)
  const tab0 = await sharp('promosi-ocs-edu-v2/assets/guru-dashboard-430.png')
    .extract({ left: Math.round(0 * oldColW), top: navY, width: Math.round(oldColW), height: navH })
    .toBuffer();
  const tab1 = await sharp('promosi-ocs-edu-v2/assets/guru-dashboard-430.png')
    .extract({ left: Math.round(1 * oldColW), top: navY, width: Math.round(oldColW), height: navH })
    .toBuffer();
  const tab2 = await sharp('promosi-ocs-edu-v2/assets/guru-dashboard-430.png')
    .extract({ left: Math.round(2 * oldColW), top: navY, width: Math.round(oldColW), height: navH })
    .toBuffer();

  const newColW = W / 4; // 107.5
  const offset = Math.round((newColW - oldColW) / 2); // (107.5 - 86)/2 = 10.75 -> 11

  // SVG for Kesiswaan tab (Tab 3) with Lucide Users icon & label
  const kesiswaanSvg = Buffer.from(`
    <svg width="${Math.round(oldColW)}" height="${navH}" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(${Math.round(oldColW / 2 - 12)}, 14)">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#74829c" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      </g>
      <text x="${Math.round(oldColW / 2)}" y="54" font-family="Inter, sans-serif" font-size="11" font-weight="500" fill="#74829c" text-anchor="middle">Kesiswaan</text>
    </svg>
  `);

  const tab3 = await sharp(kesiswaanSvg).png().toBuffer();

  const bgSvg = Buffer.from(`
    <svg width="${W}" height="${navH}">
      <rect width="${W}" height="${navH}" fill="#ffffff"/>
      <line x1="0" y1="0" x2="${W}" y2="0" stroke="#f1f5f9" stroke-width="1.5"/>
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

  await sharp('promosi-ocs-edu-v2/assets/guru-dashboard-430.png')
    .composite([{ input: newNavbar, left: 0, top: navY }])
    .toFile('promosi-ocs-edu-v2/review/test-guru-dash-4tabs.png');
}

await testTeacher4Tabs();
console.log('Guru 4 tabs complete');
