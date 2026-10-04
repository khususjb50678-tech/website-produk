const SB_URL='https://ozsfnvzqtizptxymtxzf.supabase.co';
const SB_ANON_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJIUzI1NiIsInR5cCI6ImFub24iLCJpYXQiOjE3OTEwNjIzMjksImV4cCI6MjEwNjYzODMyOX0.2TuFxRzKL4aHjRsFNyVsG3-LPn4UGre64NzhnT7W1Po';
const API=SB_URL+'/rest/v1',FALLBACK=window.DEFAULT_PRODUCTS||[],$=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
const W='<svg viewBox="0 0 130 110"><use href="#w"/></svg>';
async function api(p){const r=await fetch(API+p,{headers:{apikey:SB_ANON_KEY,Accept:'application/json'}});if(!r.ok)throw new Error('HTTP '+r.status);return r.json();}
let products=[];
function cleanProduct(p){if(!p||typeof p!=='object')return null;const id=String(p.id??'').trim();const title=String(p.title??'').trim();if(!id||!title)return null;return{...p,id,title,description:String(p.description??''),link:String(p.link??''),order_num:Number.isFinite(Number(p.order_num))?Number(p.order_num):0,active:p.active===true||p.active===1||p.active==='true',image:typeof p.image==='string'?p.image:''};}
function setBrand(s){s=s&&typeof s==='object'?s:{};const b=esc(s.brand||'Witama Store.ID'),h=b.replace(/Store\.ID/i,'<i>Store.ID</i>');document.querySelectorAll('.brand-name').forEach(e=>e.innerHTML=h);document.title=(s.brand||'Witama Store.ID')+' — Katalog';$('footBrand').textContent=s.brand||'Witama Store.ID';$('yr').textContent=new Date().getFullYear();splashBrand(s.brand||'Witama Store.ID',s.logo_small);if(s.description)$('homeDesc').textContent=s.description;document.querySelectorAll('.brand-logo').forEach(e=>e.innerHTML=s.logo_small?`<img src="${esc(s.logo_small)}" alt="">`:'<span>W</span>');if(s.logo_large){$('wall').style.backgroundImage='url("'+s.logo_large.replace(/"/g,'\\"')+'")';document.body.classList.add('has-wall');}}
async function loadSettings(){for(const c of ['brand,logo_small,logo_large,description','brand,logo_small,logo_large']){try{return (await api('/site_settings?select='+c+'&id=eq.1'))?.[0]||window.DEFAULT_SETTINGS;}catch{}}return window.DEFAULT_SETTINGS||{};}
async function loadImages(list){
 const jobs=list.map(async p=>{try{const d=await api('/products?select=image&id=eq.'+encodeURIComponent(p.id));const image=d?.[0]?.image;return image?{...p,image}:p;}catch{return p;}});
 return Promise.all(jobs);
}
const thumb=p=>p.image?`<img src="${esc(p.image)}" alt="" loading="lazy">`:W;
function render(){
 const safe=products.map(cleanProduct).filter(Boolean).sort((a,b)=>a.order_num-b.order_num||a.title.localeCompare(b.title));products=safe;
 $('homeGrid').innerHTML=products.map(p=>`<a class="card neon" href="#p/${encodeURIComponent(p.id)}"><span class="ci">${thumb(p)}</span><b>${esc(p.title)}</b><span class="go">→</span></a>`).join('');
 $('empty').classList.toggle('hidden',products.length>0);route();
}
function show(id){['vHome','vDet'].forEach(v=>$(v).classList.toggle('hidden',v!==id));scrollTo(0,0);}
function fmtDesc(t){t=String(t||'').trim();if(!t)return '<p class="d-intro">Tidak ada deskripsi.</p>';const E=/^\p{Extended_Pictographic}\uFE0F?/u,parts=t.split(/(?=\p{Extended_Pictographic})/u).map(x=>x.trim().replace(/\s*[-–•]\s*$/,'').trim()).filter(Boolean);if(parts.length<2)return '<p class="d-intro">'+esc(t).replace(/\n/g,'<br>')+'</p>';return parts.map(p=>{const m=p.match(E);if(!m)return '<p class="d-intro">'+esc(p)+'</p>';const rest=p.slice(m[0].length).trim(),k=rest.search(/\s[—–]\s/);if(k<0)return '<h4 class="d-sub">'+m[0]+' '+esc(rest)+'</h4>';return '<div class="d-item"><span class="e">'+m[0]+'</span><div><b>'+esc(rest.slice(0,k))+'</b><small>'+esc(rest.slice(k).replace(/^\s[—–]\s/,''))+'</small></div></div>';}).join('');}
let link='';
async function route(){const h=decodeURIComponent(location.hash.slice(1));if(h.startsWith('p/')){const id=h.slice(2),p=products.find(x=>String(x.id)===id);if(p){$('dTitle').textContent=p.title;$('dDesc').innerHTML=fmtDesc(p.description);link=p.link||'';let image=p.image||'';if(!image){try{const d=await api('/products?select=image&id=eq.'+encodeURIComponent(id));image=d?.[0]?.image||'';p.image=image;}catch{}}const i=$('dImg');if(image){i.src=image;i.classList.remove('hidden');$('dPh').classList.add('hidden');}else{i.classList.add('hidden');$('dPh').classList.remove('hidden');}show('vDet');$('dDesc').classList.add('hidden');$('dToggle').classList.remove('open');return;}}show('vHome');}
addEventListener('hashchange',route);addEventListener('popstate',route);document.querySelectorAll('[data-home]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();history.pushState(null,'',location.pathname+location.search);route();}));
$('dToggle').onclick=()=>{$('dDesc').classList.toggle('hidden');$('dToggle').classList.toggle('open');};$('openProduct').onclick=()=>{if(link)window.open(link,'_blank','noopener');};
const t0=Date.now();let pct=0;function setPct(v,t){pct=Math.max(pct,Math.min(100,v));$('spFill').style.width=pct+'%';$('spPct').textContent=Math.round(pct)+'%';if(t)$('spText').textContent=t;}
function splashBrand(b,logo){const h=esc(b||'Witama Store.ID').replace(/Store\.ID/i,'<i>Store.ID</i>');$('spBrand').innerHTML=h;if(logo)$('spLogo').innerHTML=`<img src="${esc(logo)}" alt="">`;}
try{const c=JSON.parse(localStorage.getItem('witama_splash')||'null');if(c)splashBrand(c.brand||'Witama Store.ID',c.logo);}catch{}
const tick=setInterval(()=>setPct(pct+(90-pct)*.07),120),failsafe=setTimeout(hideSplash,10000);function hideSplash(){clearInterval(tick);clearTimeout(failsafe);setPct(100,'Selesai');setTimeout(()=>{$('splash')?.classList.add('out');setTimeout(()=>$('splash')?.remove(),950);},350);}
(async()=>{try{const st=await loadSettings();setBrand(st);setPct(40,'Memuat katalog...');try{localStorage.setItem('witama_splash',JSON.stringify({brand:st?.brand||'Witama Store.ID',logo:st?.logo_small||''}));}catch{}
 let l=[];try{l=await api('/products?select=id,title,description,link,order_num,active&active=eq.true&order=order_num.asc');}catch{}
 l=(Array.isArray(l)?l:[]).map(cleanProduct).filter(Boolean);if(!l.length)l=FALLBACK.map(cleanProduct).filter(Boolean).filter(x=>x.active).sort((a,b)=>a.order_num-b.order_num);setPct(62,'Memuat gambar katalog...');products=await loadImages(l);render();setPct(88,'Menyiapkan tampilan...');setTimeout(hideSplash,Math.max(0,1500-(Date.now()-t0)));}catch(e){console.error(e);products=FALLBACK.map(cleanProduct).filter(Boolean).filter(x=>x.active);render();setPct(100,'Selesai');setTimeout(hideSplash,500);}})();
