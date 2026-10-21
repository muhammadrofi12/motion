import {createRequire} from 'node:module';
import {writeFile,mkdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
const require=createRequire('C:/Belajar_Pemograman/Project/landing-page-ocs-edu/package.json');
const puppeteer=require('puppeteer-core'),sharp=require('sharp');
const root=new URL('../',import.meta.url),review=new URL('review/',root);await mkdir(review,{recursive:true});
const browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--autoplay-policy=no-user-gesture-required','--allow-file-access-from-files']});
const settle=p=>p.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
try{
 const page=await browser.newPage();await page.setViewport({width:1080,height:1920,deviceScaleFactor:1});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const url=new URL('index.html?clean=1',root).href;await page.goto(url,{waitUntil:'networkidle0'});await page.waitForFunction('window.OPENER?.ready');
 const info=await page.evaluate(()=>({duration:OPENER.tl.duration(),audioDuration:document.querySelector('audio').duration,fonts:[document.fonts.check('700 40px Jakarta'),document.fonts.check('500 30px Inter')],images:[...document.images].every(i=>i.complete&&i.naturalWidth>0),debug:getComputedStyle(document.querySelector('#debug')).display}));
 assert.equal(info.duration,35);assert.equal(info.audioDuration,35);assert.ok(info.images);assert.ok(info.fonts.every(Boolean));assert.equal(info.debug,'none');
 const times=[0,2.3,4.6,6.4,8.2,10.9,12.9,15.35,16.8,19.3,22.3,24.3,26.6,28.3,30.5,32.6,34.3];const shots=[],bounds=[];
 for(const t of times){await page.evaluate(t=>OPENER.seek(t),t);await settle(page);const png=await page.screenshot({path:fileURLToPath(new URL(`t${String(t).replace('.','_')}.png`,review))});shots.push({t,data:png.toString('base64')});
 bounds.push(...await page.evaluate(()=>[...document.querySelectorAll('.headline')].filter(e=>getComputedStyle(e).visibility==='visible'&&Number(getComputedStyle(e).opacity)>.5).map(e=>{const walker=document.createTreeWalker(e,NodeFilter.SHOW_TEXT),rects=[];while(walker.nextNode()){if(!walker.currentNode.textContent.trim())continue;const range=document.createRange();range.selectNodeContents(walker.currentNode);rects.push(range.getBoundingClientRect())}return{id:e.id,left:Math.min(...rects.map(r=>r.left)),right:Math.max(...rects.map(r=>r.right)),top:Math.min(...rects.map(r=>r.top)),bottom:Math.max(...rects.map(r=>r.bottom))}})));
 }
 const navigation=[];
 for(const [time,role,labels,active] of [[6.4,'teacher',['Beranda','Akademik','E-Learning','Kesiswaan'],'Beranda'],[16.8,'student',['Beranda','Akademik','LMS','Tagihan'],'LMS'],[24.3,'parent',['Beranda','Anak Saya','Tagihan'],'Beranda']]){
  await page.evaluate(t=>OPENER.seek(t),time);await settle(page);
  const nav=await page.evaluate(()=>{const n=document.querySelector('#nav-main'),s=getComputedStyle(n);return{role:n.dataset.role,labels:[...n.querySelectorAll('.mobile-nav-item')].map(e=>e.textContent),active:n.querySelector('[aria-current="page"]').textContent,background:s.backgroundColor,shadow:s.boxShadow,filter:s.filter}});
  assert.equal(nav.role,role);assert.deepEqual(nav.labels,labels);assert.equal(nav.active,active);assert.equal(nav.background,'rgb(255, 255, 255)');assert.equal(nav.shadow,'none');assert.equal(nav.filter,'none');navigation.push({time,...nav});
 }
 await page.evaluate(()=>OPENER.seek(30.5));await settle(page);
 const ending=await page.evaluate(()=>['echo-teacher','echo-student','device'].map(id=>{const r=document.getElementById(id).getBoundingClientRect();return{id,bottom:r.bottom,left:r.left,right:r.right}}));
 assert.ok(Math.max(...ending.map(r=>r.bottom))-Math.min(...ending.map(r=>r.bottom))<1,'Ending phones must share a bottom edge');
 await page.evaluate(()=>OPENER.seek(26.6));await settle(page);const first=await page.screenshot();const stylesA=await page.evaluate(()=>[...document.querySelectorAll('*')].map(e=>e.getAttribute('style')));
 await page.evaluate(()=>{OPENER.seek(3);OPENER.seek(33);OPENER.seek(26.6)});await settle(page);const second=await page.screenshot();const stylesB=await page.evaluate(()=>[...document.querySelectorAll('*')].map(e=>e.getAttribute('style')));assert.deepEqual(stylesA,stylesB);
 const rawA=await sharp(first).raw().toBuffer(),rawB=await sharp(second).raw().toBuffer();let maxDelta=0,changedChannels=0;for(let i=0;i<rawA.length;i++){const d=Math.abs(rawA[i]-rawB[i]);maxDelta=Math.max(maxDelta,d);if(d)changedChannels++}assert.ok(maxDelta<=1&&changedChannels/rawA.length<.0001);
 const interaction=await page.evaluate(()=>{OPENER.seek(15.35);const b=document.querySelector('#learn-button').getBoundingClientRect(),c=document.querySelector('#touch').getBoundingClientRect();return{button:{x:b.x,y:b.y,w:b.width,h:b.height},touch:{x:c.x+c.width/2,y:c.y+c.height/2}}});
 await page.setViewport({width:390,height:844,deviceScaleFactor:1});await settle(page);await page.evaluate(()=>OPENER.seek(26.6));const mobile=await page.evaluate(()=>{const r=document.querySelector('#stage').getBoundingClientRect();return{x:r.x,y:r.y,w:r.width,h:r.height,overflow:document.documentElement.scrollWidth>innerWidth}});assert.ok(mobile.x>=-1&&mobile.y>=-1&&mobile.x+mobile.w<=391&&mobile.y+mobile.h<=845&&!mobile.overflow);await page.screenshot({path:fileURLToPath(new URL('mobile-preview.png',review))});
 await page.goto(new URL('index.html?debug=1',root).href,{waitUntil:'networkidle0'});await page.waitForFunction('OPENER.ready');await page.click('#play');await new Promise(r=>setTimeout(r,1000));const playing=await page.evaluate(()=>({t:OPENER.tl.time(),audio:document.querySelector('audio').currentTime,paused:OPENER.tl.paused(),audioPaused:document.querySelector('audio').paused}));assert.ok(!playing.paused&&!playing.audioPaused&&playing.t>.5&&Math.abs(playing.t-playing.audio)<.25);
 await page.keyboard.press('Space');const paused=await page.evaluate(()=>OPENER.tl.time());await new Promise(r=>setTimeout(r,150));assert.equal(await page.evaluate(()=>OPENER.tl.time()),paused);await page.keyboard.press('KeyR');assert.ok(await page.evaluate(()=>OPENER.tl.time()<.5));
 await page.evaluate(async()=>{OPENER.seek(34.8);await OPENER.play()});await new Promise(r=>setTimeout(r,650));const loop=await page.evaluate(()=>({t:OPENER.tl.time(),audio:document.querySelector('audio').currentTime,paused:OPENER.tl.paused()}));console.log('LOOP',JSON.stringify(loop));assert.ok(loop.t<1.2&&!loop.paused&&Math.abs(loop.t-loop.audio)<.25);await page.evaluate(()=>OPENER.pause());
 await page.setOfflineMode(true);await page.goto(url,{waitUntil:'load'});await page.waitForFunction('OPENER.ready');assert.ok(await page.evaluate(()=>[...document.images].every(i=>i.naturalWidth>0)));await page.setOfflineMode(false);
 const sheet=`<!doctype html><html><body style="margin:0;background:#201234;display:grid;grid-template-columns:repeat(6,270px);font:18px Arial;color:white">${shots.map(s=>`<div style="padding:10px"><div style="padding:4px 0 10px">${s.t.toFixed(2)} s</div><img style="display:block;width:250px;border-radius:8px" src="data:image/png;base64,${s.data}"></div>`).join('')}</body></html>`;await page.setViewport({width:1620,height:1590,deviceScaleFactor:1});await page.setContent(sheet);await page.screenshot({path:fileURLToPath(new URL('contact-sheet.jpg',review)),fullPage:true,type:'jpeg',quality:90});
 const strict=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--autoplay-policy=document-user-activation-required']});
 try{const p=await strict.newPage();await p.goto(new URL('index.html',root).href,{waitUntil:'networkidle0'});await p.waitForFunction('OPENER.ready');assert.ok(await p.evaluate(()=>OPENER.tl.paused()&&OPENER.tl.time()<.01&&document.querySelector('audio').paused));await p.keyboard.press('Space');await new Promise(r=>setTimeout(r,350));assert.ok(await p.evaluate(()=>!OPENER.tl.paused()&&!document.querySelector('audio').paused));}finally{await strict.close()}
 for(const b of bounds)assert.ok(b.left>=60&&b.right<=1020,`Headline outside safe bounds: ${JSON.stringify(b)}`);
 assert.ok(interaction.touch.x>=interaction.button.x&&interaction.touch.x<=interaction.button.x+interaction.button.w&&interaction.touch.y>=interaction.button.y&&interaction.touch.y<=interaction.button.y+interaction.button.h,'Touch must land inside Lanjutkan Belajar');assert.deepEqual(errors,[]);
 const report={status:'passed',info,snapshots:times.length,navigation,ending,bounds,interaction,mobile,playing,loop,deterministicSeek:{identicalDOM:true,maxDelta,changedChannels},offline:true,autoplayGate:true,errors};await writeFile(new URL('verification.json',review),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
}finally{await browser.close()}

