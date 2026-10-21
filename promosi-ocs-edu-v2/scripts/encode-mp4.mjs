// Run after export-frames.mjs. FFMPEG may point to a portable executable.
import {readFile,readdir,writeFile,rename} from 'node:fs/promises';
import {spawn,execSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
import {createHash} from 'node:crypto';
const root=new URL('../',import.meta.url),render=new URL('.render/',root);
const manifest=JSON.parse(await readFile(new URL('complete.json',render),'utf8'));
const currentHash=createHash('sha256').update(await readFile(new URL('index.html',root))).digest('hex');
if(manifest.sourceSHA256!==currentHash)throw Error('Source changed since frame export');
const files=new Set(await readdir(new URL('frames/',render)));
for(let i=0;i<manifest.total;i++)if(!files.has(`f${String(i).padStart(5,'0')}.png`))throw Error(`Missing frame ${i}`);

// Determine available ffmpeg executable
let ffmpegCmd=process.env.FFMPEG||'ffmpeg';
const candidates=[process.env.FFMPEG,'C:/Program Files/Softdeluxe/Free Download Manager/ffmpeg.exe','ffmpeg'].filter(Boolean);
for(const cand of candidates){
  try{
    execSync(`"${cand}" -version`,{stdio:'ignore'});
    ffmpegCmd=cand;
    break;
  }catch{}
}

// Check if libx264 is supported, otherwise fallback to h264_mf (Windows Media Foundation)
let hasLibx264=false;
try{
  const encoders=execSync(`"${ffmpegCmd}" -encoders`,{encoding:'utf8',stdio:['ignore','pipe','ignore']});
  hasLibx264=encoders.includes('libx264');
}catch{}

const tmp=fileURLToPath(new URL('encoding.mp4',render));
const videoCodecArgs=hasLibx264
  ? ['-c:v','libx264','-preset','medium','-crf','18','-threads','4','-profile:v','high','-level:v','4.2']
  : ['-c:v','h264_mf','-b:v','14M'];

const framesPattern=join(fileURLToPath(render),'frames','f%05d.png');

const args=[
  '-y','-hide_banner',
  '-framerate',String(manifest.fps),
  '-start_number','0',
  '-i',framesPattern,
  '-i',fileURLToPath(new URL('assets/ocs-edu-original.wav',root)),
  '-map','0:v:0',
  '-map','1:a:0',
  ...videoCodecArgs,
  '-pix_fmt','yuv420p',
  '-vf','scale=in_range=full:out_range=tv:out_color_matrix=bt709,setsar=1',
  '-color_range','tv',
  '-colorspace','bt709',
  '-color_primaries','bt709',
  '-color_trc','bt709',
  '-c:a','aac',
  '-b:a','192k',
  '-ar','48000',
  '-ac','2',
  '-t',String(manifest.duration),
  '-movflags','+faststart',
  '-metadata','title=OCS EDU - Terhubung untuk tumbuh - V2',
  tmp
];

console.log(`[Encode MP4] Using ffmpeg: ${ffmpegCmd}`);
console.log(`[Encode MP4] Video encoder: ${hasLibx264 ? 'libx264 (CRF 18)' : 'h264_mf (14 Mbps)'}`);

const proc=spawn(ffmpegCmd,args,{windowsHide:true,stdio:['ignore','ignore','pipe']});
let log='';proc.stderr.on('data',chunk=>{log+=chunk;const lines=chunk.toString().split(/[\r\n]/).filter(l=>l.includes('frame='));if(lines.length)console.log(lines.at(-1).trim())});
const exit=await new Promise((resolve,reject)=>{proc.on('error',reject);proc.on('close',resolve)});
await writeFile(new URL('encode.log',render),log);
if(exit!==0)throw Error(`ffmpeg failed (${exit}): ${log.slice(-2500)}`);
const final=new URL('promosi-ocs-edu-v2.mp4',root);await rename(tmp,final);
await writeFile(new URL('review/mp4-export.json',root),JSON.stringify({...manifest,videoCodec:hasLibx264?'H.264 High (libx264)':'H.264 (h264_mf)',bitrate:hasLibx264?'CRF 18':'14M',audioCodec:'AAC',audioSampleRate:48000,output:fileURLToPath(final)},null,2));
console.log(`MP4 ready: ${fileURLToPath(final)}`);
