// Original 35-second OCS EDU instrumental. No samples, stock music, or external recordings.
// D major / B minor / G major / A major, 110 BPM, warm keys, arpeggio, soft percussion.
import { writeFile } from 'node:fs/promises';
const rate=22050,seconds=35,N=rate*seconds,L=new Float64Array(N),R=new Float64Array(N),beat=60/110;
const freq=m=>440*2**((m-69)/12),tau=2*Math.PI;
function add(at,duration,fn,pan=0){const start=Math.round(at*rate),len=Math.min(Math.ceil(duration*rate),N-start),lg=Math.sqrt((1-pan)/2),rg=Math.sqrt((1+pan)/2);for(let j=0;j<len;j++){const i=start+j;if(i<0)continue;const v=fn(j/rate,j);L[i]+=v*lg;R[i]+=v*rg;}}
function key(at,note,amp=.1,pan=0,duration=1.35){const f=freq(note);add(at,duration,t=>{const e=(1-Math.exp(-t*150))*Math.exp(-t*4.3);return amp*e*(Math.sin(tau*f*t)+.24*Math.sin(tau*f*2*t)*Math.exp(-t*4)+.08*Math.sin(tau*f*3*t));},pan);}
function pad(at,notes,duration){for(const [i,n]of notes.entries()){const f=freq(n);add(at,duration+.7,t=>{const e=Math.min(1,t/.65)*Math.min(1,Math.max(0,(duration+.7-t)/.85));return .029*e*(Math.sin(tau*f*t)+.28*Math.sin(tau*f*2*t)+.12*Math.sin(tau*f*.998*t));},(i-1)*.32);}}
function noise(i){let n=Math.imul(i+127,374761393);n=(n^(n>>>13));n=Math.imul(n,1274126177);return ((n^(n>>>16))>>>0)/2147483648-1;}
const chords=[[50,54,57,61],[47,50,54,57],[43,47,50,54],[45,49,52,57]];
for(let bar=0;bar<16;bar++){const at=bar*4*beat;if(at>31.5)break;const c=chords[bar%4];pad(at,c,4*beat);key(at,c[0]-12,.13,-.12,1.8);
 for(let k=0;k<8;k++){const t=at+k*beat/2;if(t>31.3)break;key(t,c[[0,2,1,3,2,1,3,2][k]]+12,.095,[-.35,.35,-.15,.2][k%4],1.3);}
}
// Sparse melodic phrase gives the film a memorable, warm motif.
const melody=[74,78,81,78,76,73,74,69];for(let p=0;p<4;p++)for(let k=0;k<8;k++){const t=4.36+p*6.54+k*beat;if(t<30.5)key(t,melody[k],.085,(k%2?.2:-.2),1.6);}
for(let b=0;b<58;b++){const at=b*beat;if(at>31.3)break;
 if(b%2===0)add(at,.32,t=>.17*Math.sin(tau*(48*t+14*(1-Math.exp(-t*32))/32))*Math.exp(-t*18));
 if(b%4===2)add(at,.13,(t,i)=>.027*noise(i+Math.round(at*rate))*Math.exp(-t*38),.1);
 for(let k=0;k<2;k++)add(at+k*beat/2,.065,(t,i)=>.012*(noise(i+31*b)-noise(i+31*b+1))*Math.exp(-t*80),k?.4:-.4);
}
// UI chimes and soft transition swells, anchored to visual beats.
for(const [at,notes]of [[7.15,[81,86]],[11.85,[78]],[20.65,[81]],[27.3,[74,78,81]],[31.35,[74,78,81,86]]])for(let i=0;i<notes.length;i++)key(at+i*.075,notes[i],.08,(i-1)*.18,1.7);
for(const at of [3.3,8.95,14.85,20.9,25.9,30.7])add(at,.55,(t,i)=>.014*noise(i+163)*(Math.sin(Math.PI*t/.55)**2),-.1);
pad(31.1,[50,54,57,62],2.8);key(31.1,38,.11,0,2);key(31.25,74,.11,-.1,2.3);
let peak=0;for(let i=0;i<N;i++){const t=i/rate,fade=Math.min(1,t/.24,Math.max(0,(35-t)/.85));L[i]*=fade;R[i]*=fade;peak=Math.max(peak,Math.abs(L[i]),Math.abs(R[i]));}
const gain=.82/peak,buffer=Buffer.alloc(44+N*4);buffer.write('RIFF',0);buffer.writeUInt32LE(36+N*4,4);buffer.write('WAVEfmt ',8);buffer.writeUInt32LE(16,16);buffer.writeUInt16LE(1,20);buffer.writeUInt16LE(2,22);buffer.writeUInt32LE(rate,24);buffer.writeUInt32LE(rate*4,28);buffer.writeUInt16LE(4,32);buffer.writeUInt16LE(16,34);buffer.write('data',36);buffer.writeUInt32LE(N*4,40);
let energy=0;for(let i=0;i<N;i++){const a=L[i]*gain,b=R[i]*gain;buffer.writeInt16LE(Math.round(a*32767),44+i*4);buffer.writeInt16LE(Math.round(b*32767),46+i*4);energy+=(a*a+b*b)/2;}
await writeFile(new URL('../assets/ocs-edu-original.wav',import.meta.url),buffer);
console.log(JSON.stringify({duration:seconds,sampleRate:rate,channels:2,peak:.82,rms:Math.sqrt(energy/N),bytes:buffer.length}));
