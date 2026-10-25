import {createRequire} from 'node:module';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
const require=createRequire('C:/Belajar_Pemograman/Project/landing-page-ocs-edu/package.json');
const puppeteer=require('puppeteer-core'),sharp=require('sharp');
const root=new URL('../',import.meta.url),review=new URL('review/',root);await mkdir(review,{recursive:true});
const browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--autoplay-policy=no-user-gesture-required','--force-color-profile=srgb']});
const settle=page=>page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
try{
 const page=await browser.newPage();await page.setViewport({width:1080,height:1920,deviceScaleFactor:1});const errors=[],failed=[];let mediaAborts=0;
 page.on('pageerror',e=>errors.push(e.message));page.on('requestfailed',r=>{if(r.failure()?.errorText==='net::ERR_ABORTED'&&r.url().endsWith('.wav'))mediaAborts++;else failed.push({url:r.url(),failure:r.failure()})});
 await page.goto(new URL('index.html?clean=1',root).href,{waitUntil:'networkidle0'});await page.waitForFunction('OPENER.ready');
 const info=await page.evaluate(()=>({duration:OPENER.tl.duration(),audio:document.querySelector('audio').duration,fonts:[document.fonts.check('600 110px Fraunces'),document.fonts.check('600 70px Caveat'),document.fonts.check('700 54px Jakarta')],images:[...document.images].every(i=>i.complete&&i.naturalWidth),debug:getComputedStyle(document.getElementById('debug')).display}));
 assert.equal(info.duration,18);assert.equal(info.audio,18);assert.ok(info.fonts.every(Boolean)&&info.images);assert.equal(info.debug,'none');
 const times=[0,.7,1.7,3.35,4.8,6.3,7.9,9.5,10.9,11.55,11.9,12.8,14.3,15.6,16.6,17.55],shots=[];
 for(const t of times){await page.evaluate(t=>OPENER.seek(t),t);await settle(page);const data=await page.screenshot({path:fileURLToPath(new URL(`t${String(t).replace('.','_')}.png`,review))});shots.push({t,data:data.toString('base64')})}
 const bounds=[];
 for(const [time,selectors] of [[1.7,['#hook']],[6.3,['#recipient-note p']],[16.6,['.wordmark','#stamp-ink span','#cta-text','#recipient-note p']]]){
  await page.evaluate(t=>OPENER.seek(t),time);await settle(page);
  const bs=await page.evaluate(selectors=>selectors.flatMap(selector=>[...document.querySelectorAll(selector)].map(e=>{const range=document.createRange();range.selectNodeContents(e);const r=range.getBoundingClientRect();return{selector,text:e.textContent,left:r.left,right:r.right,top:r.top,bottom:r.bottom}})),selectors);
  for(const b of bs)assert.ok(b.left>=65&&b.right<=1015&&b.top>=120&&b.bottom<=1740,`Text outside safe area: ${JSON.stringify(b)}`);bounds.push({time,items:bs});
 }
 await page.evaluate(()=>OPENER.seek(11.5));assert.equal(await page.$eval('#stamp-ink',e=>getComputedStyle(e).opacity),'0');await page.evaluate(()=>OPENER.seek(11.75));assert.equal(await page.$eval('#stamp-ink',e=>getComputedStyle(e).opacity),'1');
 await page.evaluate(()=>OPENER.seek(16.6));await settle(page);const a=await page.screenshot(),sa=await page.evaluate(()=>[...document.querySelectorAll('*')].map(e=>e.getAttribute('style')));
 await page.evaluate(()=>{OPENER.seek(1);OPENER.seek(17.8);OPENER.seek(8);OPENER.seek(16.6)});await settle(page);const b=await page.screenshot(),sb=await page.evaluate(()=>[...document.querySelectorAll('*')].map(e=>e.getAttribute('style')));assert.deepEqual(sa,sb);const pa=await sharp(a).raw().toBuffer(),pb=await sharp(b).raw().toBuffer();let maxDelta=0;for(let i=0;i<pa.length;i++)maxDelta=Math.max(maxDelta,Math.abs(pa[i]-pb[i]));assert.ok(maxDelta<=1);
 await page.setViewport({width:390,height:844,deviceScaleFactor:1});await settle(page);await page.screenshot({path:fileURLToPath(new URL('mobile-preview.png',review))});const mobile=await page.evaluate(()=>{const r=document.getElementById('stage').getBoundingClientRect();return{left:r.left,right:r.right,top:r.top,bottom:r.bottom,overflow:document.documentElement.scrollWidth>innerWidth}});assert.ok(mobile.left>=-1&&mobile.right<=391&&mobile.top>=0&&mobile.bottom<=845&&!mobile.overflow);
 await page.evaluate(async()=>{OPENER.seek(10.8);await OPENER.play()});await new Promise(r=>setTimeout(r,900));const playback=await page.evaluate(()=>({t:OPENER.tl.time(),audio:document.querySelector('audio').currentTime,paused:OPENER.tl.paused()}));assert.ok(!playback.paused&&playback.t>11.4&&Math.abs(playback.t-playback.audio)<.25);
 await page.keyboard.press('Space');const stopped=await page.evaluate(()=>OPENER.tl.time());await new Promise(r=>setTimeout(r,100));assert.equal(await page.evaluate(()=>OPENER.tl.time()),stopped);
 await page.evaluate(async()=>{OPENER.seek(17.7);await OPENER.play()});await new Promise(r=>setTimeout(r,750));const loop=await page.evaluate(()=>({t:OPENER.tl.time(),audio:document.querySelector('audio').currentTime,paused:OPENER.tl.paused()}));assert.ok(!loop.paused&&loop.t<1&&Math.abs(loop.t-loop.audio)<.25);await page.evaluate(()=>OPENER.pause());
 await page.setOfflineMode(true);await page.goto(new URL('index.html?clean=1',root).href,{waitUntil:'load'});await page.waitForFunction('OPENER.ready');await page.setOfflineMode(false);assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);
 const sheet=`<!doctype html><html><body style="margin:0;background:#e8ddf8;display:grid;grid-template-columns:repeat(4,270px);font:18px Arial;color:#292235">${shots.map(s=>`<div style="padding:10px"><div style="padding:4px 0 10px">${s.t.toFixed(2)} s</div><img style="display:block;width:250px" src="data:image/png;base64,${s.data}"></div>`).join('')}</body></html>`;await page.setViewport({width:1080,height:2100,deviceScaleFactor:1});await page.setContent(sheet);await page.screenshot({path:fileURLToPath(new URL('contact-sheet.jpg',review)),fullPage:true,type:'jpeg',quality:92});
 const strict=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--autoplay-policy=document-user-activation-required']});try{const p=await strict.newPage();await p.goto(new URL('index.html',root).href,{waitUntil:'networkidle0'});await p.waitForFunction('OPENER.ready');assert.ok(await p.evaluate(()=>OPENER.tl.paused()&&document.querySelector('audio').paused&&OPENER.tl.time()===0));await p.keyboard.press('Space');await new Promise(r=>setTimeout(r,300));assert.ok(await p.evaluate(()=>!OPENER.tl.paused()&&!document.querySelector('audio').paused))}finally{await strict.close()}
 const report={status:'passed',info,keyframes:times,bounds,stamp:{soundAt:11.55,inkAppearsAt:11.55},deterministicSeek:{identicalStyles:true,maxDelta},mobile,playback,loop,offline:true,autoplayGate:true,mediaAborts,errors,failed};await writeFile(new URL('verification.json',review),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
}finally{await browser.close()}
