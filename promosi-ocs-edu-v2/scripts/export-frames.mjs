// Adapted from bang-motion/scripts/export-frames.mjs.
// Deterministic, resumable 60 fps export. No realtime recording/frame drops.
import {createRequire} from 'node:module';
import {mkdir,readdir,writeFile,readFile,unlink} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
const require=createRequire('C:/Belajar_Pemograman/Project/landing-page-ocs-edu/package.json');
const puppeteer=require('puppeteer-core');
const root=new URL('../',import.meta.url),out=new URL('.render/frames/',root);
const FPS=60,W=1080,H=1920,WORKERS=1;
await mkdir(out,{recursive:true});
const hash=createHash('sha256').update(await readFile(new URL('index.html',root))).digest('hex');
const manifestURL=new URL('.render/manifest.json',root);
let old;try{old=JSON.parse(await readFile(manifestURL,'utf8'))}catch{}
let existing=new Set(await readdir(out));
if(process.argv.includes('--force')||!old||old.sourceSHA256!==hash||old.fps!==FPS){
 console.log('Resetting frame cache for full re-render...');
 for(const name of existing)if(/^f\d{5}\.png$/.test(name))await unlink(new URL(name,out));
 existing.clear();
}
await unlink(new URL('.render/complete.json',root)).catch(e=>{if(e.code!=='ENOENT')throw e});
let next=0,done=0,lastLog=0;
const started=performance.now();
const browser=await puppeteer.launch({
 executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',
 headless:true,
 args:[
  '--autoplay-policy=no-user-gesture-required',
  '--allow-file-access-from-files',
  '--disable-background-timer-throttling',
  '--disable-renderer-backgrounding',
  '--disable-backgrounding-occluded-windows',
  '--force-color-profile=srgb'
 ]
});
try{
 const pages=await Promise.all(Array.from({length:WORKERS},async()=>{const page=await browser.newPage();await page.setViewport({width:W,height:H,deviceScaleFactor:1});await page.goto(new URL('index.html?clean=1',root).href,{waitUntil:'networkidle0'});await page.waitForFunction('window.OPENER?.ready');await page.evaluate(()=>{OPENER.pause();document.querySelector('audio').removeAttribute('src');});return page}));
 const duration=await pages[0].evaluate(()=>OPENER.DURATION),total=Math.round(duration*FPS);
 const manifest={sourceSHA256:hash,fps:FPS,width:W,height:H,duration,total,format:'PNG'};
 await writeFile(manifestURL,JSON.stringify(manifest,null,2));
 console.log(`Rendering ${total} frames: ${W}x${H}, ${FPS} fps, ${duration}s`);
 await Promise.all(pages.map(async page=>{while(next<total){const i=next++,name=`f${String(i).padStart(5,'0')}.png`;if(!existing.has(name)){
  await page.evaluate(async t=>{OPENER.seek(t);await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));},i/FPS);
  await page.screenshot({path:fileURLToPath(new URL(name,out)),type:'png',optimizeForSpeed:true});
 }
 done++;if(done-lastLog>=120||done===total){lastLog=done;const seconds=(performance.now()-started)/1000;console.log(`${done}/${total} (${(done/total*100).toFixed(1)}%) | ${seconds.toFixed(0)}s elapsed`)}
 }}));
 await writeFile(new URL('.render/complete.json',root),JSON.stringify({...manifest,completed:done,elapsedSeconds:(performance.now()-started)/1000},null,2));
 console.log('All frames complete');
}finally{await browser.close()}
