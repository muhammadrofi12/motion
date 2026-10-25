// Encode exported frames into pristine 2K MP4 (1440x2560 @ 60fps) for OCS EDU Segera Hadir
import {readFile, readdir, writeFile, rename} from 'node:fs/promises';
import {spawn, execSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
import {createHash} from 'node:crypto';

const root = new URL('../', import.meta.url);
const render = new URL('.render-2k/', root);

const completePath = new URL('complete.json', render);
const manifest = JSON.parse(await readFile(completePath, 'utf8'));

const currentHash = createHash('sha256').update(await readFile(new URL('index.html', root))).digest('hex');
if (manifest.sourceSHA256 !== currentHash) {
  console.warn('[Encode MP4] Warning: Source HTML modified since frame export.');
}

const files = new Set(await readdir(new URL('frames/', render)));
for (let i = 0; i < manifest.total; i++) {
  const frameName = `f${String(i).padStart(5, '0')}.jpg`;
  if (!files.has(frameName)) {
    throw new Error(`Missing frame: ${frameName}`);
  }
}

// Locate FFmpeg
const candidates = [
  process.env.FFMPEG,
  'C:/Belajar_Pemograman/Project/motion/.render-tools/imageio/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v7.1.exe',
  'C:/Program Files/Softdeluxe/Free Download Manager/ffmpeg.exe',
  'ffmpeg'
].filter(Boolean);

let ffmpegCmd = null;
for (const cand of candidates) {
  try {
    execSync(`"${cand}" -version`, { stdio: 'ignore' });
    ffmpegCmd = cand;
    break;
  } catch {}
}

if (!ffmpegCmd) {
  throw new Error('FFmpeg executable not found among candidates.');
}

// Check encoder capability
let hasLibx264 = false;
try {
  const encoders = execSync(`"${ffmpegCmd}" -encoders`, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
  hasLibx264 = encoders.includes('libx264');
} catch {}

const tmpOut = fileURLToPath(new URL('encoding-2k.mp4', render));
const finalOut = fileURLToPath(new URL('promosi-ocs-edu-segera-hadir-2k.mp4', root));
const aliasOut = fileURLToPath(new URL('promosi-ocs-edu-segera-hadir.mp4', root));
const framesPattern = join(fileURLToPath(render), 'frames', 'f%05d.jpg');
const audioFile = fileURLToPath(new URL('assets/teaser-music.wav', root));

const videoCodecArgs = hasLibx264
  ? ['-c:v', 'libx264', '-preset', 'slow', '-crf', '16', '-threads', '0', '-profile:v', 'high', '-level:v', '5.1']
  : ['-c:v', 'h264_mf', '-b:v', '24M'];

const args = [
  '-y', '-hide_banner',
  '-framerate', String(manifest.fps),
  '-start_number', '0',
  '-i', framesPattern,
  '-i', audioFile,
  '-map', '0:v:0',
  '-map', '1:a:0',
  ...videoCodecArgs,
  '-pix_fmt', 'yuv420p',
  '-vf', 'scale=in_range=full:out_range=tv:out_color_matrix=bt709,setsar=1',
  '-color_range', 'tv',
  '-colorspace', 'bt709',
  '-color_primaries', 'bt709',
  '-color_trc', 'bt709',
  '-c:a', 'aac',
  '-b:a', '320k',
  '-ar', '48000',
  '-ac', '2',
  '-t', String(manifest.duration),
  '-movflags', '+faststart',
  '-metadata', 'title=OCS EDU — Segera Hadir (2K QHD)',
  tmpOut
];

console.log(`[Encode MP4] Using ffmpeg: ${ffmpegCmd}`);
console.log(`[Encode MP4] Resolution: ${manifest.width}x${manifest.height} @ ${manifest.fps}fps`);
console.log(`[Encode MP4] Video encoder: ${hasLibx264 ? 'libx264 (CRF 16 - Pristine 2K)' : 'h264_mf (24 Mbps)'}`);
console.log(`[Encode MP4] Audio: AAC 320 kbps, 48 kHz stereo`);

const started = performance.now();
const proc = spawn(ffmpegCmd, args, { windowsHide: true, stdio: ['ignore', 'ignore', 'pipe'] });

let log = '';
proc.stderr.on('data', chunk => {
  const text = chunk.toString();
  log += text;
  const lines = text.split(/[\r\n]/).filter(l => l.includes('frame='));
  if (lines.length) {
    console.log('[Encode MP4] ' + lines.at(-1).trim());
  }
});

const exit = await new Promise((resolve, reject) => {
  proc.on('error', reject);
  proc.on('close', resolve);
});

await writeFile(new URL('encode.log', render), log);

if (exit !== 0) {
  throw new Error(`FFmpeg failed with exit code ${exit}: ${log.slice(-2500)}`);
}

await rename(tmpOut, finalOut);
// Create alias
const {copyFile} = await import('node:fs/promises');
await copyFile(finalOut, aliasOut);

const elapsedSeconds = (performance.now() - started) / 1000;
console.log(`\n[Encode MP4] Successfully encoded in ${elapsedSeconds.toFixed(1)}s!`);
console.log(`[Encode MP4] File saved to: ${finalOut}`);

const exportReport = {
  ...manifest,
  videoCodec: hasLibx264 ? 'H.264 High (libx264)' : 'H.264 (h264_mf)',
  crf: hasLibx264 ? 16 : null,
  bitrate: hasLibx264 ? 'CRF 16' : '24M',
  audioCodec: 'AAC',
  audioBitrate: '320k',
  audioSampleRate: 48000,
  encodeSeconds: elapsedSeconds,
  output: finalOut
};

await writeFile(new URL('review/mp4-export.json', root), JSON.stringify(exportReport, null, 2));
