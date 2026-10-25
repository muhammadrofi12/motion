// Full pipeline for OCS EDU Segera Hadir: Export frames + Encode 2K MP4
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const run = (script, args = []) => new Promise((resolve, reject) => {
  const p = spawn(process.execPath, [fileURLToPath(new URL(script, import.meta.url)), ...args], {
    stdio: 'inherit'
  });
  p.on('close', code => {
    if (code === 0) resolve();
    else reject(new Error(`${script} exited with code ${code}`));
  });
  p.on('error', reject);
});

console.log('=== STARTING 2K MP4 RENDER PIPELINE: OCS EDU SEGERA HADIR ===\n');
const forwardArgs = process.argv.slice(2);
await run('export-frames.mjs', forwardArgs);
console.log('\n=== FRAMES EXPORTED, STARTING ENCODING ===\n');
await run('encode-mp4.mjs');
console.log('\n=== PIPELINE COMPLETED SUCCESSFULLY ===');
