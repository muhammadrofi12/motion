(()=>{'use strict';
// The shared camera rig comes from bang-motion's cartoon-collage explainer starter.
// Everything on screen is a pure function of timeline time; audio is the live master clock.
const W=1080,H=1920,DURATION=78.73140625,$=id=>document.getElementById(id);
const clamp=v=>Math.max(0,Math.min(1,v)),p=(t,a,b)=>clamp((t-a)/(b-a)),ease=v=>v*v*(3-2*v),out=v=>1-(1-v)**3,mix=(a,b,v)=>a+(b-a)*v;
const S=(t,a,b)=>ease(p(t,a,b)),E=(t,a,b)=>out(p(t,a,b)),visible=(t,a,b)=>E(t,a,a+.6)*(1-S(t,b-.35,b));
const cache={},node=id=>cache[id]||(cache[id]=$(id));
function pose(id,x=0,y=0,s=1,r=0,o=1){const n=node(id);n.setAttribute('transform',`translate(${x.toFixed(3)} ${y.toFixed(3)}) rotate(${r.toFixed(3)}) scale(${s.toFixed(5)})`);n.setAttribute('opacity',o.toFixed(5));n.style.visibility=o>.00001?'visible':'hidden'}
function alpha(id,o){const n=node(id);n.setAttribute('opacity',o.toFixed(5));n.style.visibility=o>.00001?'visible':'hidden'}
const C={x:540,y:960,z:1},rig=$('world');
function applyCam(){rig.setAttribute('transform',`translate(${(W/2-C.x*C.z).toFixed(4)} ${(H/2-C.y*C.z).toFixed(4)}) scale(${C.z.toFixed(6)})`)}
// look/home/into/settle are expressed as deterministic interpolations so direct seeking is exact.
function look(a,b,v){return{x:mix(a.x,b.x,v),y:mix(a.y,b.y,v),z:mix(a.z,b.z,v)}}
const headings=[
 [0,7.05,'Banyak kamera.<br><em>Banyak aplikasi?</em>','Ilustrasi sistem'],
 [7.05,10.4,'Satu rumah.<br><em>Satu sistem.</em>','SmartHome Vision'],
 [10.4,15.38,'Empat lapisan.<br><em>Saling terhubung.</em>','Dari video menjadi informasi'],
 [15.38,24.39,'Ingestion<br><em>Layer</em>','Target integrasi • sesuai kompatibilitas'],
 [24.39,37.45,'AI Vision<br><em>Engine</em>','Deteksi → lintasan → informasi'],
 [37.45,46.56,'Data &amp;<br><em>Security Core</em>','Penyimpanan lokal • akses pemilik'],
 [46.56,50.95,'Presentation<br><em>Layer</em>','Antarmuka dengan data demonstrasi'],
 [50.95,54.41,'Area privat.<br><em>Batas yang jelas.</em>','Oranye • pintu rumah / HOUSE'],
 [54.41,58.17,'Pantau akses<br><em>di gerbang.</em>','Hijau • batas gerbang / GATE'],
 [58.17,64.01,'Informasi penting.<br><em>Terbaca jelas.</em>','Hitam arang • plat kendaraan'],
 [64.01,72.15,'Kendali dari<br><em>genggaman.</em>','Target kontrol • perangkat kompatibel'],
 [72.15,76.7,'Satu sistem.<br><em>Semua terhubung.</em>','Visi SmartHome Vision'],
 [76.7,DURATION,'','']
];let headingIndex=-1;
const grain=document.createElement('canvas');grain.width=grain.height=192;const gc=grain.getContext('2d'),gd=gc.createImageData(192,192);let seed=10242026;for(let i=0;i<192*192;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const v=seed>>>24;gd.data[i*4]=gd.data[i*4+1]=gd.data[i*4+2]=v;gd.data[i*4+3]=255}gc.putImageData(gd,0,0);$('grain').style.backgroundImage=`url(${grain.toDataURL()})`;
function render(t){
 const reveal=S(t,7,10.1),spread=S(t,14.9,16.5),collapse=S(t,72.15,73.6),q=spread*(1-collapse);
 const ys=[1320+6000*q,1070+4200*q,820+2400*q,570+600*q];
 // Start at the home, reveal the stack, then physically travel between its four levels.
 let cam=look({x:540,y:1090,z:1},{x:540,y:1065,z:1.01},reveal);
 cam=look(cam,{x:540,y:ys[0]+80,z:1},spread);
 cam=look(cam,{x:540,y:ys[1]+80,z:1.03},S(t,23.95,25.25));
 cam=look(cam,{x:540,y:ys[2]+100,z:1.02},S(t,37.02,38.15));
 cam=look(cam,{x:540,y:ys[3]+25,z:1.03},S(t,46.08,47.25));
 const uiFocus=S(t,50.6,51.6)*(1-S(t,63.7,64.7));cam.x+=mix(35,-35,S(t,54,55))*uiFocus;cam.z+=.035*uiFocus;
 cam=look(cam,{x:540,y:1090,z:.97},collapse);
 const finish=S(t,75.7,77.25);cam=look(cam,{x:540,y:690,z:.70},finish);
 C.x=cam.x+3*Math.sin(t*.43);C.y=cam.y+4*Math.sin(t*.35);C.z=cam.z;applyCam();
 $('ambient').style.transform=`translate(${(22*Math.sin(t*.09)).toFixed(3)}px,${(17*Math.cos(t*.1)).toFixed(3)}px)`;
 $('grid').style.transform=`translate(${(8*Math.sin(t*.1)).toFixed(3)}px,${(8*Math.cos(t*.13)).toFixed(3)}px) rotate(-14deg)`;
 $('grain').style.transform=`translate(${(3*Math.sin(t*.4)).toFixed(3)}px,${(3*Math.cos(t*.3)).toFixed(3)}px)`;
 const introExit=E(t,7,9.2);pose('intro',540,1020-introExit*240,mix(1,.32,introExit),-4*introExit,1-introExit);
 pose('introMotor',mix(-165,125,S(t,.5,6.2)),0,1,0,1);
 ['introCam1','introCam2','introCam3'].forEach((id,i)=>pose(id,[-300,0,300][i],[-330,-390,-330][i]+Math.sin(t*1.3+i)*9,1,Math.sin(t*.7+i)*3,E(t,i*.2,.8+i*.2)));
 ['appA','appB','appC'].forEach((id,i)=>pose(id,[-270,0,270][i], [500,550,500][i]+Math.sin(t*1.9+i*2)*8,1,Math.sin(t*1.1+i)*3,E(t,1.3+i*.35,2+i*.35)));
 $('tangle').style.strokeDashoffset=(-t*25).toFixed(3);
 for(let i=0;i<4;i++){
  const bob=Math.sin(t*.9+i)*4*(1-q);pose('layer'+(i+1),540,ys[i]+bob,mix(.86,1,q),0,E(t,7.45+i*.18,8.4+i*.18));
  const contentScale=mix(.36,1,q);pose('content'+(i+1),0,mix(140,0,q),contentScale,0,1);
  pose('label'+(i+1),0,mix(-52,0,q),mix(.89,1,q),0,(1-q)*(1-finish));
 }
 // Two visibly connected data trunks bind the exploded levels into one physical system.
 $('spineA').setAttribute('d',`M175 ${ys[0]+160}C80 ${ys[0]+30} 80 ${ys[3]+140} 175 ${ys[3]+30}`);
 $('spineB').setAttribute('d',`M905 ${ys[0]+160}C1000 ${ys[0]+30} 1000 ${ys[3]+140} 905 ${ys[3]+30}`);
 alpha('spines',reveal*(1-finish)*.6);alpha('flowDots',reveal*(1-finish));
 for(let i=0;i<12;i++){const k=(t*.17+i/12)%1;pose('flow'+i,i%2?944:136,mix(ys[0]+150,ys[3]+60,k),.7+Math.sin(k*Math.PI)*.4,0,1)}
 // Ingestion: packets come from three devices and merge into the bridge.
 ['deviceX','deviceT','deviceR'].forEach((id,i)=>pose(id,[-295,0,295][i],[-180,-230,-180][i]+Math.sin(t*1.2+i)*5,1,Math.sin(t*.65+i)*2,1));
 for(let i=0;i<9;i++){const lane=i%3,k=(t*.6+Math.floor(i/3)/3)%1;pose('packet'+i,mix([-295,0,295][lane],0,k),mix([53,10,53][lane],186,k),mix(1,.65,k),0,.9)}
 pose('bridge',0,Math.sin(t*.9)*3,1);pose('freshFrame',0,0,1,0,.72+.28*Math.sin(t*2)**2);
 // AI: the house remains the world; detections build in the order spoken in the VO.
 const aiTime=Math.max(0,t-29.05),mv=S(aiTime,0,7);pose('aiMotor',mix(-185,220,mv),mix(185,243,mv),1,0,1);
 pose('aiCar',120,43,1,0,E(t,29.05,29.7));pose('aiPerson',-248,21,1,0,E(t,30.1,30.65));pose('aiParcel',285,138,1,0,E(t,30.65,31.2));
 alpha('houseZone',E(t,32.15,32.7));alpha('gateZone',E(t,32.45,33));alpha('trackPath',E(t,32.6,33.2));$('trackPath').style.strokeDashoffset=(-t*22).toFixed(3);
 const face=E(t,34.4,35.1);pose('facePanel',50*(1-face),-30*(1-face),mix(.82,1,face),0,face);
 $('faceScan').setAttribute('transform',`translate(0 ${(48+38*Math.sin(t*2)).toFixed(3)})`);pose('aiChip',0,0,1,Math.sin(t*.65)*2);
 // Backend: event cards write one at a time into a local database, next to owner access.
 for(let i=0;i<3;i++)pose('event'+i,-30*(1-E(t,39+i*.65,39.6+i*.65)),0,1,0,E(t,39+i*.65,39.6+i*.65));
 pose('database',0,Math.sin(t)*4,1);pose('security',0,Math.sin(t*.85+1)*5,1,Math.sin(t*.8)*2);$('dataPipes').style.strokeDashoffset=(-t*26).toFixed(3);
 // Presentation: the same phone reveals zone semantics and then its hardware controls.
 const control=E(t,64.01,64.9)*(1-S(t,71.8,72.6));const phoneScale=mix(.88,.78,control);
 pose('phone',-82*control,mix(65,15,control),phoneScale,-3*control,1);
 alpha('uiZones',E(t,50.65,51.2));alpha('semanticHouse',visible(t,50.95,54.4));alpha('semanticGate',visible(t,54.41,58.1));
 const plate=visible(t,58.17,63.9);pose('plateFocus',0,0,mix(.65,1,plate),-2*plate,plate);
 alpha('uiTimeline',1-control);alpha('uiPlate',1-control);alpha('uiStatus',1-control*.6);
 pose('controlPanel',-65,0,.91,0,control);pose('controlCam',0,0,1,Math.sin((t-64)*1.6)*12*visible(t,65,70.4),control);
 const lamp=S(t,67.45,67.8)*(1-S(t,71.7,72.1));$('lampToggle').setAttribute('fill',lamp>.5?'#16a34a':'#e2e8f0');$('lampKnob').setAttribute('cx',mix(100,182,lamp).toFixed(3));alpha('lightBeam',lamp*control*.7);
 const touch=visible(t,64.9,68.45);pose('touch',mix(-70,64,S(t,66.8,67.4)),mix(232,196,S(t,66.8,67.4)),.8+.14*Math.sin(t*9),0,touch);
 // Type lives in screen space; it never shrinks into the overview diagrams.
 const idx=headings.findIndex(h=>t>=h[0]&&t<h[1]);const h=headings[Math.max(0,idx)];
 if(headingIndex!==idx){$('headline').innerHTML=h[2];$('headline').className=idx===9?'compact':'';headingIndex=idx}
 let note=h[3];if(t>=30.1&&t<37.45)note='Orang, paket & wajah • target pengembangan';
 $('note').textContent=note;
 const hin=E(t,h[0],h[0]+.65),hout=S(t,h[1]-.3,h[1]);const ho=hin*(1-hout)*(1-finish);
 $('heading').style.opacity=ho.toFixed(5);$('headline').style.transform=`translateY(${(34*(1-hin)-23*hout).toFixed(3)}px)`;
 const blur=Math.max(1-hin,hout)*9;$('blurAmount').setAttribute('stdDeviation',`0 ${blur.toFixed(3)}`);$('headline').style.filter=blur>.05?'url(#textBlur)':'none';
 $('note').style.opacity=(E(t,h[0]+.4,h[0]+.9)*(1-hout)*(1-finish)).toFixed(5);
 $('status').style.opacity=E(t,7.05,8).toFixed(5);
 const outro=E(t,76.4,77.4);$('outro').style.opacity=outro.toFixed(5);$('outro').style.visibility=outro>.001?'visible':'hidden';$('outro').style.transform=`translateY(${(50*(1-outro)).toFixed(3)}px)`;
 $('endnote').style.opacity=E(t,74.5,76).toFixed(5);
 $('dScrub').value=t.toFixed(3);$('dClock').textContent=t.toFixed(2)+' / '+DURATION.toFixed(2);
}
const vo=$('vo'),state={time:0},intent={playing:false};let pending=null;
const tl=gsap.timeline({paused:true,onUpdate(){if(intent.playing&&!vo.paused&&Math.abs(state.time-vo.currentTime)>.04)tl.time(Math.min(DURATION,vo.currentTime),true);render(state.time)},onComplete(){if(intent.playing){vo.currentTime=0;tl.play(0);vo.play().catch(pause)}}});tl.to(state,{time:DURATION,duration:DURATION,ease:'none'});
function pause(){intent.playing=false;tl.pause();vo.pause()}
function seek(time){pause();const t=Math.max(0,Math.min(DURATION,Number(time)||0));tl.time(t,false);render(t);if(Number.isFinite(vo.duration))vo.currentTime=Math.min(t,vo.duration)}
async function play(){if(pending)return pending;pending=(async()=>{if(state.time>=DURATION-.01){tl.time(0);vo.currentTime=0}intent.playing=true;vo.currentTime=state.time;try{await vo.play();if(intent.playing)tl.play();else vo.pause();return intent.playing}catch{pause();return false}})();try{return await pending}finally{pending=null}}
async function restart(){seek(0);return play()}
function fit(){$('stage').style.transform=`translate(-50%,-50%) scale(${Math.min(innerWidth/W,innerHeight/H)})`}addEventListener('resize',fit);fit();
$('stage').addEventListener('click',()=>intent.playing?pause():play());$('dPlay').onclick=()=>intent.playing?pause():play();$('dRestart').onclick=restart;$('dScrub').addEventListener('input',e=>seek(e.target.value));
document.addEventListener('keydown',e=>{if(e.target instanceof HTMLInputElement)return;if(e.code==='Space'){e.preventDefault();intent.playing?pause():play()}if(e.code==='KeyR')restart()});
const params=new URLSearchParams(location.search);if(params.has('debug'))$('dbg').style.display='flex';
window.OPENER={W,H,DURATION,tl,seek,seekFrame:async t=>{seek(t);await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))},play,pause,restart,ready:false,render};render(0);
const soundReady=new Promise((resolve,reject)=>{if(vo.readyState>=1)return resolve();vo.addEventListener('loadedmetadata',resolve,{once:true});vo.addEventListener('error',()=>reject(Error('Soundtrack tidak dapat dimuat')),{once:true})});
const house=new Image();house.src='assets/house-cutout.png';
Promise.all([document.fonts.ready,house.decode(),soundReady]).then(()=>{render(0);window.OPENER.ready=true;if(!params.has('clean')&&!params.has('debug'))play()}).catch(e=>{window.OPENER.error=e.message;console.error(e)});
})();
