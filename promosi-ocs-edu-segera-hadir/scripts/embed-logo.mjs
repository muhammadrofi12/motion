// Embed the unchanged logo bytes for CSS masks: file:// masks are blocked by Chrome CORS.
import {readFile,writeFile} from 'node:fs/promises';
const root=new URL('../',import.meta.url),index=new URL('index.html',root);
const logo=(await readFile(new URL('assets/ocs-edu-icon.png',root))).toString('base64');
let html=await readFile(index,'utf8');
html=html.replace(/mask-image:url\('[^']+'\)/,`mask-image:url('data:image/png;base64,${logo}')`);
await writeFile(index,html);
