import {readFile,writeFile} from 'node:fs/promises';
import {defs,use,label,floor} from '../src/props.mjs';
const root=new URL('../',import.meta.url);
const css=await readFile(new URL('src/styles.css',root),'utf8'),js=await readFile(new URL('src/animation.js',root),'utf8');
const camera=(id,type,x,y,w=200)=>`<g id="${id}" transform="translate(${x} ${y})">${use(type,0,0,w,w*1.2)}</g>`;
const miniPhone=(id,x,y,color)=>`<g id="${id}" transform="translate(${x} ${y})"><rect x="-88" y="-155" width="176" height="310" rx="26" fill="#fff" stroke="#182f4c" stroke-width="8"/><rect x="-70" y="-117" width="140" height="127" rx="12" fill="${color}"/><path d="m-55-31 38-34 25 20 39-43" fill="none" stroke="white" stroke-width="6"/><path d="M-54 45h108M-54 72h75M-54 100h92" stroke="#c4d3e4" stroke-width="9" stroke-linecap="round"/><circle cx="58" cy="-117" r="21" fill="#ea580c"/>${label('!',58,-106,29,'white')}</g>`;
const frame=(id,x,y,w,h,color='#0066ff')=>`<g id="${id}" class="detection"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="${color}" fill-opacity=".035" stroke="${color}" stroke-width="4"/><path d="M${x} ${y+25}v-25h25M${x+w-25} ${y}h25v25M${x} ${y+h-25}v25h25M${x+w-25} ${y+h}h25v-25" fill="none" stroke="${color}" stroke-width="8"/></g>`;
const title=(id,n,s)=>`<g id="${id}" class="layer-title"><rect x="-283" y="463" width="566" height="73" rx="35" fill="white" stroke="#b9d3ef" stroke-width="2"/><circle cx="-238" cy="500" r="25" fill="#0066ff"/>${label(n,-238,511,29,'white')}${label(s,30,512,31,'#18344f','font-weight="700"')}</g>`;
const html=`<!doctype html><html lang="id"><!-- Adapted from bang-motion starter-explainer-kartun.html: shared world/camera, look/home/into/settle, deterministic timeline and offline player. MIT https://github.com/bangtutorial/bang-motion --><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>SmartHome Vision — Empat Lapisan Sistem</title><style>${css}</style></head><body>
<main id="stage" aria-label="Video explainer SmartHome Vision, visi sistem empat lapisan">
 <div id="ambient"></div><div id="grid"></div><div id="grain"></div>
 <div id="brand"><svg viewBox="0 0 100 100"><use href="#mark"/></svg><span>SmartHome<span>Vision</span></span></div>
 <div id="heading"><div id="headline">Banyak kamera.<br><em>Banyak aplikasi?</em></div></div>
 <svg id="film" width="1080" height="1920" viewBox="0 0 1080 1920" aria-hidden="true"><defs>${defs}</defs><g id="world">
 <g id="intro" transform="translate(540 1020)"><image href="assets/house-cutout.png" x="-475" y="-325" width="950" height="634"/>
  <g id="introMotor">${use('motor',0,223,240,150)}</g>
  <path id="tangle" d="M-300-270C-500-150 400 290-290 490M0-300C450 60-400 190 0 510M300-270C420-100-500 340 290 490" fill="none" stroke="#7c9cc5" stroke-width="4" stroke-dasharray="9 9"/>
  ${camera('introCam1','cam',-300,-330,150)}${camera('introCam2','cam',0,-390,150)}${camera('introCam3','bullet',300,-330,210)}
  ${miniPhone('appA',-270,500,'#709db8')}${miniPhone('appB',0,550,'#7d87bd')}${miniPhone('appC',270,500,'#61a8a0')}
 </g>
 <g id="spines" fill="none" stroke="#72aafa" stroke-width="4"><path id="spineA"/><path id="spineB" stroke-dasharray="9 12"/></g><g id="flowDots" fill="#0066ff">${Array.from({length:12},(_,i)=>`<circle id="flow${i}" r="8"/>`).join('')}</g>
 <g id="layer1" class="layer">${floor()}<g id="content1" class="content">
  ${camera('deviceX','cam',-295,-180,188)}${camera('deviceT','cam',0,-230,188)}${camera('deviceR','bullet',295,-180,240)}
  ${label('Xiaomi',-295,13,35)}${label('Tapo',0,-37,35)}${label('RTSP',295,13,35)}
  <g id="ingestPipes" fill="none" stroke="#6daaff" stroke-width="7"><path d="M-295 52v58q0 45 65 45H-70M0 10v170M295 52v58q0 45-65 45H70"/></g>
  <g id="videoPackets">${Array.from({length:9},(_,i)=>`<rect id="packet${i}" x="-16" y="-11" width="32" height="22" rx="5" fill="#0066ff" stroke="white" stroke-width="3"/>`).join('')}</g>
  <g id="bridge"><path d="m-172 166 174-52 170 52v91L0 309-172 257Z" fill="#daeaff" stroke="#6b98d0" stroke-width="3"/><path d="m-172 166 174-52 170 52-172 52Z" fill="#f9fcff" stroke="#9cbfe9" stroke-width="3"/><path d="M-172 166 0 218v91l-172-52Z" fill="#9dc4f6"/><g transform="translate(0 177)">${label('go2rtc',0,0,45,'#0066ff','font-weight="800"')}</g><circle cx="47" cy="245" r="6" fill="#16a34a"/><path d="M72 238l55-17m-55 33 55-17" stroke="#5184bb" stroke-width="5"/></g>
  <g id="freshFrame"><rect x="-230" y="338" width="460" height="76" rx="19" fill="#fff" stroke="#bdd5ef" stroke-width="2"/>${label('Frame terbaru → AI',0,386,35,'#285b92')}</g>
 </g>${title('label1','01','Ingestion Layer')}</g>
 <g id="layer2" class="layer">${floor('#c8e3de')}<g id="content2" class="content">
  <image href="assets/house-cutout.png" x="-393" y="-335" width="786" height="524"/>
  <path id="houseZone" d="m-221 47 117-42 195 90-113 49Z" fill="#ea580c" fill-opacity=".12" stroke="#ea580c" stroke-width="6" stroke-linejoin="round"/>
  <path id="gateZone" d="m-335 158 267-85 327 158-254 93Z" fill="#16a34a" fill-opacity=".06" stroke="#16a34a" stroke-width="6" stroke-linejoin="round"/>
  <path id="trackPath" d="M-230 190Q-84 141 15 198T271 245" fill="none" stroke="#0066ff" stroke-width="5" stroke-dasharray="8 9"/>
  <g id="aiMotor">${use('motor',0,0,210,130)}${frame('motorBox',-116,-78,236,151)}<rect x="-116" y="-112" width="136" height="36" rx="7" fill="#0066ff"/>${label('Motor',-48,-85,25,'white')}</g>
  <g id="aiCar">${use('car',0,0,245,150)}${frame('carBox',-130,-85,260,170)}</g>
  <g id="aiPerson">${use('person',0,0,100,250)}${frame('personBox',-62,-144,124,282,'#0f766e')}</g>
  <g id="aiParcel">${use('parcel',0,0,105,110)}${frame('parcelBox',-64,-70,128,143,'#ea580c')}</g>
  <g id="aiChip">${use('chip',-300,340,130)}${label('YOLO + tracking',0,365,35,'#0066ff','font-weight="700"')}</g>
  <g id="facePanel"><rect x="80" y="-358" width="300" height="275" rx="28" fill="#fff" stroke="#b7d8cc" stroke-width="3"/><circle cx="230" cy="-254" r="61" fill="#dcfce7"/><path d="M182-199q6-35 48-35t48 35" fill="#e7ac5f"/><rect x="219" y="-249" width="22" height="26" rx="8" fill="#bd8558"/><ellipse cx="230" cy="-268" rx="31" ry="39" fill="#d9a578"/><path d="M199-266q-5-48 31-48t32 41q-25-2-38-20-7 18-25 27" fill="#203343"/><circle cx="219" cy="-267" r="3" fill="#203343"/><circle cx="241" cy="-267" r="3" fill="#203343"/><path d="M221-247q9 7 18 0" stroke="#9d583c" stroke-width="3" fill="none" stroke-linecap="round"/><path id="faceScan" d="M147-294h166" stroke="#16a34a" stroke-width="4"/><path d="M153-290v-29h29M278-319h29v29M153-210v29h29M278-181h29v-29" fill="none" stroke="#16a34a" stroke-width="5"/>${label('Profil keluarga',230,-123,30,'#166534')}</g>
 </g>${title('label2','02','AI Vision Engine')}</g>
 <g id="layer3" class="layer">${floor('#cbdbe9')}<g id="content3" class="content">
  <path id="dataPipes" d="M-325 55H-80M80 55H300" fill="none" stroke="#70a8ec" stroke-width="6" stroke-dasharray="10 12"/>
  <g id="ledger"><rect x="-420" y="-267" width="290" height="465" rx="26" fill="white" stroke="#b8cde5" stroke-width="3"/>${label('Event store',-275,-204,34,'#18344f','font-weight="700"')}
  ${['Motor keluar','Mobil tiba','Di teras'].map((s,i)=>`<g id="event${i}"><rect x="-399" y="${-166+i*105}" width="248" height="85" rx="14" fill="${i%2?'#edf9f0':'#edf5ff'}"/>${label(s,-275,-113+i*105,27,'#274462')}</g>`).join('')}</g>
  <g id="database">${use('db',0,0,245,310)}${label('SQLite',0,216,39,'#255488','font-weight="700"')}</g>
  <g id="security">${use('shield',292,-52,208,255)}${label('Akses pemilik',292,133,32,'#0f766e')}<rect x="196" y="158" width="192" height="59" rx="18" fill="white" stroke="#b4d9cf" stroke-width="2"/>${label('• • • •',292,202,41,'#0f766e')}</g>
  <g id="localHost"><rect x="-233" y="272" width="466" height="127" rx="23" fill="#173c66"/><path d="M-189 314h270M-189 344H22" stroke="#5f8cba" stroke-width="9" stroke-linecap="round"/><circle cx="179" cy="334" r="12" fill="#7ce4bf"/>${label('Komputer lokal',0,452,35,'#294e78')}</g>
 </g>${title('label3','03','Data & Security Core')}</g>
 <g id="layer4" class="layer">${floor()}<g id="content4" class="content">
  <g id="phone"><rect x="-287" y="-552" width="574" height="1070" rx="66" fill="#10253d" filter="url(#softShadow)"/><rect x="-271" y="-535" width="542" height="1037" rx="54" fill="#f8fafc"/><rect x="-69" y="-525" width="138" height="24" rx="12" fill="#10253d"/>
   ${label('SmartHome Vision',-1,-449,36,'#0f172a','font-weight="800"')}${label('Pantauan rumah',-116,-394,29,'#475569')}
   <rect x="-243" y="-365" width="486" height="304" rx="25" fill="#e4eef6"/>
   <image href="assets/house-cutout.png" x="-231" y="-357" width="462" height="308"/>
   <g id="uiZones"><path d="m-121-150 79-28 82 38-67 33Z" fill="#ea580c" fill-opacity=".12" stroke="#ea580c" stroke-width="5"/><path d="m-176-91 120-42 176 72" fill="none" stroke="#16a34a" stroke-width="6"/></g>
   <rect x="-223" y="-346" width="92" height="35" rx="13" fill="#dc2626"/>${label('DEMO',-177,-321,22,'white','font-weight="700"')}
   <g id="uiStatus"><rect x="-243" y="-36" width="234" height="103" rx="19" fill="#ebf5ff"/><rect x="9" y="-36" width="234" height="103" rx="19" fill="#eaf8ec"/>${label('Kamera',-126,1,27,'#355779')}${label('1 online',-126,40,32,'#0066ff','font-weight="700"')}${label('Kendaraan',126,1,27,'#3a6750')}${label('2 terdaftar',126,40,30,'#15803d','font-weight="700"')}</g>
   <g id="uiPlate"><rect x="-243" y="91" width="486" height="106" rx="19" fill="#0f172a"/>${label('B 1234 CD',0,153,51,'white','font-weight="700" letter-spacing="5"')}${label('Data demonstrasi',0,181,18,'#aabbd1')}</g>
   <g id="uiTimeline">${label('Aktivitas terbaru',-103,253,29,'#0f172a','font-weight="700"')}<circle cx="-211" cy="303" r="8" fill="#ea580c"/><path d="M-211 317v45" stroke="#d3deec" stroke-width="3"/>${label('Motor keluar rumah',21,310,27,'#334155')}<circle cx="-211" cy="383" r="8" fill="#16a34a"/>${label('Mobil tiba di teras',6,390,27,'#334155')}</g>
   <path d="M-247 426h494" stroke="#e2e8f0" stroke-width="2"/>${label('Beranda',-166,467,22,'#0066ff')}${label('Kendaraan',0,467,22,'#64748b')}${label('Aktivitas',166,467,22,'#64748b')}
  </g>
  <g id="semanticHouse"><path d="M-286-170H-412v-99" fill="none" stroke="#ea580c" stroke-width="4"/><rect x="-466" y="-350" width="250" height="91" rx="18" fill="#fff4e6" stroke="#ea580c" stroke-width="3"/>${label('HOUSE',-341,-291,37,'#c2410c','font-weight="700"')}</g>
  <g id="semanticGate"><path d="M287-82h122v-76" fill="none" stroke="#16a34a" stroke-width="4"/><rect x="222" y="-250" width="249" height="91" rx="18" fill="#eaf8ec" stroke="#16a34a" stroke-width="3"/>${label('GATE',346,-192,37,'#15803d','font-weight="700"')}</g>
  <g id="plateFocus"><rect x="-374" y="78" width="748" height="163" rx="30" fill="#0f172a" stroke="#71809a" stroke-width="3"/>${label('B 1234 CD',0,182,82,'white','font-weight="700" letter-spacing="8"')}</g>
  <g id="controlPanel"><rect x="-258" y="79" width="516" height="329" rx="29" fill="#fff" stroke="#c0d5ed" stroke-width="3"/>${label('Kontrol kamera',0,125,30,'#193b62','font-weight="700"')}<circle cx="-93" cy="255" r="102" fill="#eff6ff" stroke="#b2d3fc" stroke-width="3"/><circle cx="-93" cy="255" r="39" fill="#0066ff"/>
    <path d="m-93 170-16 23h32Zm0 170-16-23h32Zm-85-85 23-16v32Zm170 0-23-16v32Z" fill="#3673ba"/>
    ${label('⌂',-93,267,37,'white')}<rect x="66" y="183" width="151" height="64" rx="26" fill="#e2e8f0" id="lampToggle"/><circle id="lampKnob" cx="100" cy="215" r="24" fill="white"/>${label('Lampu',140,283,30,'#385572')}${label('Posisi jaga',0,377,27,'#475569')}
  </g>
  <g id="controlCam">${use('cam',355,-194,230,300)}</g><path id="lightBeam" d="M348-242 440 164 72 120Z" fill="url(#beam)"/>
  <g id="touch"><circle r="42" fill="#0066ff" fill-opacity=".14" stroke="#0066ff" stroke-width="3"/><circle r="11" fill="#0066ff"/></g>
 </g>${title('label4','04','Presentation Layer')}</g>
 </g></svg>
 <div id="note">Ilustrasi sistem</div><div id="status">Visi pengembangan <span>•</span> Prototipe pribadi</div>
 <div id="outro"><svg viewBox="0 0 100 100"><use href="#mark"/></svg><div>SmartHome<br><em>Vision</em></div><p>Cek SmartHome Vision</p></div>
 <div id="endnote">Pengujian dan pengembangan berlanjut</div>
</main><audio id="vo" src="assets/soundtrack.wav" preload="auto"></audio>
<div id="dbg"><button id="dPlay">Putar / jeda</button><button id="dRestart">Ulang</button><input id="dScrub" aria-label="Waktu video" type="range" min="0" max="78.73140625" step=".01"><span id="dClock"></span></div>
<script src="assets/gsap.min.js"></script><script>${js}</script></body></html>`;
await writeFile(new URL('index.html',root),html);console.log('Built offline explainer: index.html');
