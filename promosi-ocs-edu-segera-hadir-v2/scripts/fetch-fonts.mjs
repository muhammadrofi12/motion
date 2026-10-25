import {writeFile} from 'node:fs/promises';
const assets=new URL('../assets/',import.meta.url);
const fonts=[['Fraunces','Fraunces:opsz,wght@9..144,500..700'],['Caveat','Caveat:wght@400..700']];
const sources=[];
for(const [name,family] of fonts){
 const cssURL='https://fonts.googleapis.com/css2?family='+family+'&display=block';
 const response=await fetch(cssURL,{headers:{'User-Agent':'Mozilla/5.0 Chrome/130.0.0.0 Safari/537.36'}});if(!response.ok)throw Error(`${name}: ${response.status}`);
 const css=await response.text();const url=[...css.matchAll(/url\((https:[^)]+)\)/g)].at(-1)?.[1];if(!url)throw Error('Font URL missing');
 const font=await fetch(url);if(!font.ok)throw Error('Font download failed');const bytes=Buffer.from(await font.arrayBuffer());if(bytes.readUInt32BE(0)!==0x00010000)throw Error('Expected TrueType font; check provider format before replacing local assets');await writeFile(new URL(name.toLowerCase()+'-latin.ttf',assets),bytes);
 const licenseURL=`https://raw.githubusercontent.com/google/fonts/main/ofl/${name.toLowerCase()}/OFL.txt`,license=await fetch(licenseURL);if(!license.ok)throw Error('Font license missing');await writeFile(new URL(`OFL-${name}.txt`,assets),await license.text());sources.push({name,cssURL,url,licenseURL});
}
await writeFile(new URL('font-sources.json',assets),JSON.stringify(sources,null,2));console.log('Fraunces, Caveat, and licenses saved locally');
