import fs from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire('C:/Belajar_Pemograman/Project/landing-page-ocs-edu/package.json');
const sharp = require('sharp');

const fontBase64 = fs.readFileSync('promosi-ocs-edu-v2/assets/jakarta-latin.woff2').toString('base64');

const svg = `
<svg width="86" height="80" xmlns="http://www.w3.org/2000/svg">
  <style>
    @font-face {
      font-family: 'Plus Jakarta Sans';
      src: url('data:font/woff2;base64,${fontBase64}') format('woff2');
      font-weight: 500;
      font-style: normal;
    }
    text {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 11px;
      font-weight: 500;
      fill: #64748b;
    }
  </style>
  <rect width="86" height="80" fill="#ffffff"/>
  <text x="43" y="58" text-anchor="middle">Kesiswaan</text>
</svg>
`;

await sharp(Buffer.from(svg)).png().toFile('promosi-ocs-edu-v2/review/test-font.png');
console.log('Rendered test-font.png');
