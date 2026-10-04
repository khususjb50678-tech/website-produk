const SB_URL='https://ozsfnvzqtizptxymtxzf.supabase.co';
const SB_ANON_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96c2ZudnpxdGl6cHR4eW10eHpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEwNjIzMjksImV4cCI6MjEwNjYzODMyOX0.2TuFxRzKL4aHjRsFNyVsG3-LPn4UGre64NzhnT7W1Po';
const API=SB_URL+'/rest/v1',FALLBACK=window.DEFAULT_PRODUCTS||[],$=id=>document.getElementById(id);
const CACHE_SETTINGS='witama_public_settings_v15',CACHE_PRODUCTS='witama_public_products_v15';
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
const W='<svg viewBox="0 0 130 110"><use href="#w"/></svg>';
function readCache(k,fallback=null){try{const v=localStorage.getItem(k);return v?JSON.parse(v):fallback;}catch{return fallback;}}
function writeCache(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch{}}
async function api(path,opts={}){const c=new AbortController(),t=setTimeout(()=>c.abort(),12000);try{const r=await fetch(API+path,{...opts,signal:c.signal,headers:{apikey:SB_ANON_KEY,Accept:'application/json',...(opts.headers||{})}});if(!r.ok)throw new Error('HTTP '+r.status);return r.json();}finally{clearTimeout(t);}}
let products=[];
function cleanProduct(p){if(!p||typeof p!=='object')return null;const id=String(p.id??'').trim();const title=String(p.title??'').trim();if(!id||!title)return null;return{...p,id,title,description:String(p.description??''),link:String(p.link??''),order_num:Number.isFinite(Number(p.order_num))?Number(p.order_num):0,active:p.active===true||p.active===1||p.active==='true',image:typeof p.image==='string'?p.image:''};}
function applyLogo(el,url,fallback=''){
  if(!el)return;
  el.innerHTML='';
  if(url){
    const img=new Image();
    img.alt='';
    img.decoding='async';
    img.onload=()=>{el.innerHTML='';el.appendChild(img);};
    img.onerror=()=>{el.innerHTML=fallback;};
    img.src=url;
  }else el.innerHTML=fallback;
}
function setBrand(s){
  s=s&&typeof s==='object'?s:{};
  const brand=String(s.brand||'Witama Store.ID');
  const h=esc(brand).replace(/Store\.ID/i,'<i>Store.ID</i>');
  document.querySelectorAll('.brand-name').forEach(e=>e.innerHTML=h);
  document.title=brand+' — Katalog';
  if($('footBrand'))$('footBrand').textContent=brand;
  if($('yr'))$('yr').textContent=new Date().getFullYear();
  splashBrand(brand,s.logo_small||'');
  if($('homeDesc'))$('homeDesc').textContent=s.description||'Solusi digital terbaik untuk kebutuhan online kamu.';
  document.querySelectorAll('.brand-logo').forEach(e=>applyLogo(e,s.logo_small||'','<span>W</span>'));
  const wall=$('wall');
  if(wall){
    if(s.logo_large){
      wall.style.backgroundImage='url("'+String(s.logo_large).replace(/\\/g,'\\\\').replace(/"/g,'\\"')+'")';
      document.body.classList.add('has-wall');
    }else{
      wall.style.backgroundImage='';
      document.body.classList.remove('has-wall');
    }
  }
}
async function loadSettings(){
  for(const c of ['brand,logo_small,logo_large,description','brand,logo_small,logo_large']){
    try{
      const v=(await api('/site_settings?select='+c+'&id=eq.1'))?.[0];
      if(v){writeCache(CACHE_SETTINGS,v);return v;}
    }catch{}
  }
  return readCache(CACHE_SETTINGS,window.DEFAULT_SETTINGS||{});
}
async function loadProducts(){
  try{
    const l=await api('/products?select=id,title,description,image,link,order_num,active&active=eq.true&order=order_num.asc');
    const clean=(Array.isArray(l)?l:[]).map(cleanProduct).filter(Boolean).sort((a,b)=>a.order_num-b.order_num||a.title.localeCompare(b.title));
    writeCache(CACHE_PRODUCTS,clean);
    return clean;
  }catch{
    const cached=readCache(CACHE_PRODUCTS,null);
    if(Array.isArray(cached))return cached.map(cleanProduct).filter(Boolean).filter(x=>x.active);
    return FALLBACK.map(cleanProduct).filter(Boolean).filter(x=>x.active).sort((a,b)=>a.order_num-b.order_num);
  }
}
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
const t0=Date.now();
let pct=0;
function setPct(v,t){pct=Math.max(pct,Math.min(100,v));if($('spFill'))$('spFill').style.width=pct+'%';if($('spPct'))$('spPct').textContent=Math.round(pct)+'%';if(t&&$('spText'))$('spText').textContent=t;}
function splashBrand(b,logo){
  const h=esc(b||'Witama Store.ID').replace(/Store\.ID/i,'<i>Store.ID</i>');
  if($('spBrand'))$('spBrand').innerHTML=h;
  if(logo)applyLogo($('spLogo'),logo,'<span>W</span>');
}
(function hydrateCache(){
  const cs=readCache(CACHE_SETTINGS,null);
  if(cs)setBrand(cs);
  const cp=readCache(CACHE_PRODUCTS,null);
  if(Array.isArray(cp)&&cp.length){
    products=cp.map(cleanProduct).filter(Boolean).filter(x=>x.active);
    render();
    setPct(82,'Memuat pembaruan...');
  }
})();
const cachedSplash=readCache(CACHE_SETTINGS,null);
if(cachedSplash)splashBrand(cachedSplash.brand||'Witama Store.ID',cachedSplash.logo_small||'');
const tick=setInterval(()=>setPct(pct+(90-pct)*.08),90);
const failsafe=setTimeout(hideSplash,7000);
function hideSplash(){
  clearInterval(tick);clearTimeout(failsafe);setPct(100,'Selesai');
  setTimeout(()=>{$('splash')?.classList.add('out');setTimeout(()=>$('splash')?.remove(),650);},120);
}
(async()=>{
  try{
    setPct(Math.max(pct,30),'Memuat pengaturan...');
    const st=await loadSettings();
    setBrand(st);
    setPct(55,'Memuat katalog...');
    products=await loadProducts();
    render();
    setPct(92,'Selesai...');
    setTimeout(hideSplash,180);
  }catch(e){
    console.error(e);
    const cached=readCache(CACHE_PRODUCTS,[]);
    products=(Array.isArray(cached)?cached:FALLBACK).map(cleanProduct).filter(Boolean).filter(x=>x.active);
    render();
    hideSplash();
  }
})();
