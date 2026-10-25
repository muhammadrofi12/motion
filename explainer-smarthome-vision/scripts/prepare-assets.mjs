import {writeFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
const require=createRequire('C:/Belajar_Pemograman/Project/landing-page-ocs-edu/package.json');
const sharp=require('sharp'),assets=new URL('../assets/',import.meta.url);
const sources=[];
for(const [name,family,dir] of [['bricolage','Bricolage+Grotesque:opsz,wght@12..96,500..800','bricolagegrotesque'],['caveat','Caveat:wght@400..700','caveat'],['jakarta','Plus+Jakarta+Sans:wght@400..800','plusjakartasans']]){
 const cssURL='https://fonts.googleapis.com/css2?family='+family+'&display=block';
 const css=await(await fetch(cssURL)).text(),url=[...css.matchAll(/url\((https:[^)]+)\)/g)].at(-1)?.[1];if(!url)throw Error(name+': no font');
 const font=await fetch(url);if(!font.ok)throw Error('Font request failed');const bytes=Buffer.from(await font.arrayBuffer());
 await writeFile(new URL(name+'.font',assets),bytes);
 const licenseURL=`https://raw.githubusercontent.com/google/fonts/main/ofl/${dir}/OFL.txt`;await writeFile(new URL(`OFL-${name}.txt`,assets),await(await fetch(licenseURL)).text());sources.push({name,cssURL,url,licenseURL});
}
const gsapURL='https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js';await writeFile(new URL('gsap.min.js',assets),await(await fetch(gsapURL)).text());
await writeFile(new URL('sources.json',assets),JSON.stringify({fonts:sources,gsapURL,house:'Generated using the built-in imagegen tool; see image-prompt.md'},null,2));
console.log('House metadata',await sharp(new URL('house-cutout.png',assets).pathname.replace(/^\/([A-Z]:)/,'$1')).metadata());
