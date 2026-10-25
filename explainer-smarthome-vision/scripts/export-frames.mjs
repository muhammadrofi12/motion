// Deterministic, resumable 60 fps 2K (1440x2560) frame export for SmartHome Vision.
import {createRequire} from 'node:module';
import {mkdir,readdir,writeFile,readFile,unlink,rm,stat} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import os from 'node:os';

const require = createRequire('C:/Belajar_Pemograman/Project/landing-page-ocs-edu/package.json');
const puppeteer = require('puppeteer-core');

const root = new URL('../', import.meta.url);
const renderDir = new URL('.render-2k/', root);
const framesDir = new URL('frames/', renderDir);
const manifestURL = new URL('manifest.json', renderDir);
const completeURL = new URL('complete.json', renderDir);

const FPS = 60;
const CSS_W = 1080;
const CSS_H = 1920;
const SCALE = 4 / 3; // 1080 * (4/3) = 1440, 1920 * (4/3) = 2560 (2K Vertical / QHD)
const OUT_W = 1440;
const OUT_H = 2560;
const WORKERS = 4;
const QUALITY = 98;
const FORMAT = 'jpeg';

await mkdir(framesDir, { recursive: true });

const htmlPath = new URL('index.html', root);
const sourceHTML = await readFile(htmlPath);
const hash = createHash('sha256').update(sourceHTML).digest('hex');

let oldManifest;
try {
  oldManifest = JSON.parse(await readFile(manifestURL, 'utf8'));
} catch {}

const force = process.argv.includes('--force');
const existingFiles = new Set(await readdir(framesDir));

if (force || !oldManifest || oldManifest.sourceSHA256 !== hash || oldManifest.fps !== FPS || oldManifest.width !== OUT_W) {
  console.log('[Export 2K] Resetting frame cache for full re-render...');
  for (const name of existingFiles) {
    if (/^f\d{5}\.(png|jpg|jpeg)$/.test(name)) {
      await unlink(new URL(name, framesDir));
    }
  }
  existingFiles.clear();
}

await unlink(completeURL).catch(e => { if (e.code !== 'ENOENT') throw e; });

// Filter only valid existing frames (> 1000 bytes)
const validFrames = new Set();
for (const name of existingFiles) {
  if (/^f\d{5}\.jpg$/.test(name)) {
    try {
      const s = await stat(new URL(name, framesDir));
      if (s.size > 1000) validFrames.add(name);
    } catch {}
  }
}

console.log(`[Export 2K] Found ${validFrames.size} existing rendered frames.`);

// Launch worker instances with separate temporary user data directories to prevent profile contention
const workers = [];
const tempDirs = [];

const launchWorker = async (id) => {
  const profileDir = path.join(os.tmpdir(), `puppeteer_profile_smarthome_${id}_${Date.now()}`);
  tempDirs.push(profileDir);
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true,
    args: [
      '--autoplay-policy=no-user-gesture-required',
      '--allow-file-access-from-files',
      '--disable-background-timer-throttling',
      '--disable-renderer-backgrounding',
      '--disable-backgrounding-occluded-windows',
      '--force-color-profile=srgb',
      `--user-data-dir=${profileDir}`
    ]
  });
  const page = await browser.newPage();
  await page.setViewport({ width: CSS_W, height: CSS_H, deviceScaleFactor: SCALE });
  await page.goto(new URL('index.html?clean=1', root).href, { waitUntil: 'load' });
  await page.waitForFunction('window.OPENER?.ready');
  await page.evaluate(() => {
    OPENER.pause();
    document.querySelector('audio')?.removeAttribute('src');
  });
  return { id, browser, page };
};

const cleanup = async () => {
  for (const w of workers) {
    try { await w.browser.close(); } catch {}
  }
  for (const dir of tempDirs) {
    try { await rm(dir, { recursive: true, force: true }); } catch {}
  }
};

process.on('SIGINT', async () => {
  console.log('\n[Export 2K] Interrupted. Cleaning up...');
  await cleanup();
  process.exit(1);
});

try {
  console.log(`[Export 2K] Launching ${WORKERS} isolated Chrome workers...`);
  for (let i = 0; i < WORKERS; i++) {
    workers.push(await launchWorker(i + 1));
  }

  const duration = await workers[0].page.evaluate(() => window.OPENER.DURATION);
  const total = Math.round(duration * FPS);

  const manifest = {
    sourceSHA256: hash,
    fps: FPS,
    width: OUT_W,
    height: OUT_H,
    cssWidth: CSS_W,
    cssHeight: CSS_H,
    scale: SCALE,
    duration,
    total,
    format: FORMAT.toUpperCase(),
    quality: QUALITY
  };
  await writeFile(manifestURL, JSON.stringify(manifest, null, 2));

  console.log(`[Export 2K] Rendering ${total} frames: ${OUT_W}x${OUT_H} (2K vertical), ${FPS} fps, ${duration.toFixed(2)}s`);
  console.log(`[Export 2K] Quality: JPEG q${QUALITY} | Format: ${manifest.format}`);

  let next = 0;
  let done = validFrames.size;
  let lastLog = done;
  const started = performance.now();

  await Promise.all(workers.map(async ({ page }) => {
    while (next < total) {
      const i = next++;
      const name = `f${String(i).padStart(5, '0')}.jpg`;
      const framePath = fileURLToPath(new URL(name, framesDir));

      if (!validFrames.has(name)) {
        const time = i / FPS;
        await page.evaluate(async (t) => {
          OPENER.seek(t);
          await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
        }, time);

        await page.screenshot({
          path: framePath,
          type: 'jpeg',
          quality: QUALITY
        });
        validFrames.add(name);
      }

      done++;
      if (done - lastLog >= 120 || done >= total) {
        lastLog = done;
        const elapsed = (performance.now() - started) / 1000;
        const percent = ((done / total) * 100).toFixed(1);
        const fpsRate = (done - validFrames.size + (done > validFrames.size ? 0 : 1)) / (elapsed || 1);
        const remainingFrames = total - done;
        const eta = fpsRate > 0 ? (remainingFrames / fpsRate).toFixed(0) + 's' : 'calc...';
        console.log(`[Export 2K] ${done}/${total} (${percent}%) | ${(done / (elapsed || 1)).toFixed(1)} fps avg | ${elapsed.toFixed(0)}s elapsed | ETA: ${eta}`);
      }
    }
  }));

  const totalElapsed = (performance.now() - started) / 1000;
  const completeManifest = {
    ...manifest,
    completed: done,
    elapsedSeconds: totalElapsed
  };
  await writeFile(completeURL, JSON.stringify(completeManifest, null, 2));

  console.log(`[Export 2K] All ${total} frames exported in ${totalElapsed.toFixed(1)}s!`);
} finally {
  await cleanup();
}
