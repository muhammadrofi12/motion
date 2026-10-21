// Local-only reference capture. Credentials are read from stdin, never saved.
import {createRequire} from 'node:module';
import {mkdir,writeFile} from 'node:fs/promises';
import {pathToFileURL,fileURLToPath} from 'node:url';
const require=createRequire('C:/Belajar_Pemograman/Project/landing-page-ocs-edu/package.json');
const puppeteer=require('puppeteer-core');
let input='';for await(const chunk of process.stdin)input+=chunk;
const config=JSON.parse(input);
const root=new URL('../',import.meta.url);
const browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const result=[];
try{for(const account of config){
 const context=await browser.createBrowserContext();const page=await context.newPage();
 await page.setViewport({width:1440,height:1050,deviceScaleFactor:1});
 await page.goto('http://ocs-edu.test/s/sma-al-azhar-nusantara-jakarta/login',{waitUntil:'networkidle0'});
 await page.type('#input-identitas-akun',account.user);await page.type('#input-kata-sandi',account.password);
 await Promise.all([page.waitForNavigation({waitUntil:'networkidle0'}),page.click('button[type=submit]')]);
 const home=page.url();const routes=[...(account.skipHome?[]:[{name:'dashboard',url:home}]),...(account.routes||[])];
 for(const route of routes){
  if(page.url()!==route.url)await page.goto(route.url,{waitUntil:'networkidle0'});
  for(const width of [1440,430]){
   await page.setViewport({width,height:width===430?932:1050,deviceScaleFactor:width===430?2:1});
   await page.evaluate(async()=>{await document.fonts.ready;document.querySelector('#main-scroll-container')?.scrollTo(0,0);await new Promise(r=>setTimeout(r,600));});
   if(route.scrollText)await page.evaluate(async text=>{const e=[...document.querySelectorAll('h1,h2,h3,h4')].find(e=>e.textContent.includes(text));e?.scrollIntoView({block:'start'});document.querySelector('#main-scroll-container')?.scrollBy(0,-90);await new Promise(r=>setTimeout(r,400));},route.scrollText);
   if(route.clickText)await page.evaluate(async text=>{const e=[...document.querySelectorAll('button')].find(e=>e.textContent.includes(text));e?.click();await new Promise(r=>setTimeout(r,400));},route.clickText);
   await page.screenshot({path:fileURLToPath(new URL(`assets/${account.role}-${route.name}-${width}.png`,root))});
   if(width===430&&route.name==='dashboard'){
    await page.evaluate(()=>{const el=document.querySelector('#main-scroll-container');if(el)el.style.height=el.scrollHeight+'px';document.documentElement.style.overflow='visible';document.body.style.overflow='visible';});
    await page.screenshot({path:fileURLToPath(new URL(`review/${account.role}-full.png`,root)),fullPage:true});
   }
  }
  const data=await page.evaluate(()=>({url:location.href,text:document.body.innerText,links:[...document.querySelectorAll('a[href]')].map(a=>({text:a.innerText,url:a.href})),buttons:[...document.querySelectorAll('button')].map(e=>e.innerText),font:getComputedStyle(document.body).fontFamily}));
  result.push({role:account.role,route:route.name,...data});
 }
 await context.close();
}
await writeFile(new URL('review/capture-info.json',root),JSON.stringify(result,null,2));
console.log(JSON.stringify(result.map(r=>({...r,text:r.text.slice(0,6500),links:r.links.slice(0,30)}))));
}finally{await browser.close();}
