const SB_URL='https://ozsfnvzqtizptxymtxzf.supabase.co';
const SB_ANON_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96c2ZudnpxdGl6cHR4eW10eHpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEwNjIzMjksImV4cCI6MjEwNjYzODMyOX0.2TuFxRzKL4aHjRsFNyVsG3-LPn4UGre64NzhnT7W1Po';
const API=SB_URL+'/rest/v1',FALLBACK=window.DEFAULT_PRODUCTS||[],$=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
const W='<svg viewBox="0 0 130 110"><use href="#w"/></svg>';
async function api(p,ms=25000){const c=new AbortController(),t=setTimeout(()=>c.abort(),ms);try{const r=await fetch(API+p,{headers:{apikey:SB_ANON_KEY,Accept:'application/json'},signal:c.signal});if(!r.ok)throw new Error('HTTP '+r.status);return await r.json();}finally{clearTimeout(t);}}
const ls={get:k=>{try{return JSON.parse(localStorage.getItem(k)||'null');}catch{return null;}},set:(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));}catch{}}};
let products=[],cardLabel=window.DEF_CARD_LABEL,cardKey='aurora',cardImg='';
const plain=t=>String(t||'').normalize('NFKC');
function applyCard(){const c=cardBgCss(cardKey,cardImg),r=document.documentElement.style;c?r.setProperty('--cardbg',c):r.removeProperty('--cardbg');}
function fitTitles(){document.querySelectorAll('.card b,.card .lab').forEach(b=>{b.style.fontSize='';if(!b.clientWidth)return;const min=b.classList.contains('lab')?7.5:11.5;let s=parseFloat(getComputedStyle(b).fontSize);while(b.scrollWidth>b.clientWidth+1&&s>min){s-=.5;b.style.fontSize=s+'px';}});}
addEventListener('resize',fitTitles);if(document.fonts&&document.fonts.ready)document.fonts.ready.then(fitTitles);
const nameHtml=b=>esc(b).replace(/Store\.ID/i,'<i>Store.ID</i>');
function setText(s){const b=s?.brand||'Witama Store.ID';document.querySelectorAll('.brand-name').forEach(e=>e.innerHTML=nameHtml(b));document.title=b+' — Katalog';$('footBrand').textContent=b;const sb=$('spBrand');if(sb)sb.innerHTML=nameHtml(b);if(s?.description)$('homeDesc').textContent=plain(s.description);if(s&&s.card_label!==undefined&&s.card_label!==null)cardLabel=s.card_label;if(s?.card_bg)cardKey=s.card_bg;applyCard();ls.set('witama_text',{brand:b,description:s?.description||'',card_label:cardLabel,card_bg:cardKey});}
function setLogoSmall(src){const h=src?`<img src="${esc(src)}" alt="">`:'<span>W</span>';document.querySelectorAll('.brand-logo').forEach(e=>e.innerHTML=h);const sl=$('spLogo');if(sl)sl.innerHTML=h;}
function setWall(src){$('wall').style.backgroundImage=src?'url("'+src+'")':'';document.body.classList.toggle('has-wall',!!src);}
const thumb=p=>p.image?`<img src="${esc(p.image)}" alt="">`:W;
function render(){
 $('homeGrid').innerHTML=products.map(p=>`<a class="card neon" data-id="${esc(p.id)}" href="#p/${esc(p.id)}"><span class="ci">${thumb(p)}</span><div class="ct"><b>${esc(p.title)}</b>${cardLabel?`<em class="lab">${esc(cardLabel)}</em>`:''}</div><span class="go">→</span></a>`).join('');fitTitles();
 $('empty').classList.toggle('hidden',products.length>0);route();}
function show(id){['vHome','vDet'].forEach(v=>$(v).classList.toggle('hidden',v!==id));scrollTo(0,0);if(id==='vHome')fitTitles();}

function fmtDesc(t){t=plain(t).trim();if(!t)return '<p class="d-intro">Tidak ada deskripsi.</p>';
 const E=/^\p{Extended_Pictographic}\uFE0F?/u,parts=t.split(/(?=\p{Extended_Pictographic})/u).map(x=>x.trim().replace(/\s*[-–•]\s*$/,'').trim()).filter(Boolean);
 if(parts.length<2)return '<p class="d-intro">'+esc(t).replace(/\n/g,'<br>')+'</p>';
 return parts.map(p=>{const m=p.match(E);if(!m)return '<p class="d-intro">'+esc(p)+'</p>';const rest=p.slice(m[0].length).trim(),k=rest.search(/\s[—–]\s/);
  if(k<0)return '<h4 class="d-sub">'+m[0]+' '+esc(rest)+'</h4>';
  return '<div class="d-item"><span class="e">'+m[0]+'</span><div><b>'+esc(rest.slice(0,k))+'</b><small>'+esc(rest.slice(k).replace(/^\s[—–]\s/,''))+'</small></div></div>';}).join('');}
let link='';
function route(){const h=decodeURIComponent(location.hash.slice(1));
 if(h.startsWith('p/')){const p=products.find(x=>x.id===h.slice(2));if(p){$('dTitle').textContent=p.title;$('dDesc').innerHTML=fmtDesc(p.description);link=p.link||'';const i=$('dImg');if(p.image){i.src=p.image;i.classList.remove('hidden');$('dPh').classList.add('hidden');}else{i.classList.add('hidden');$('dPh').classList.remove('hidden');}show('vDet');$('dDesc').classList.add('hidden');$('dToggle').classList.remove('open');return;}}
 show('vHome');}
addEventListener('hashchange',route);addEventListener('popstate',route);
document.querySelectorAll('[data-home]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();history.pushState(null,'',location.pathname+location.search);route();}));
$('dToggle').onclick=()=>{$('dDesc').classList.toggle('hidden');$('dToggle').classList.toggle('open');};
$('openProduct').onclick=()=>{if(link)window.open(link,'_blank','noopener');};
const t0=Date.now();let pct=0,gone=false;
function setPct(v,t){const f=$('spFill');if(!f)return;pct=Math.max(pct,Math.min(100,v));f.style.width=pct+'%';$('spPct').textContent=Math.round(pct)+'%';if(t)$('spText').textContent=t;}
function hideSplash(){if(gone)return;gone=true;clearInterval(tick);clearTimeout(failsafe);setPct(100,'Selesai');setTimeout(()=>{const x=$('splash');if(!x)return;x.classList.add('out');setTimeout(()=>x.remove(),950);},350);}
const tick=setInterval(()=>setPct(pct+(90-pct)*.07),120),failsafe=setTimeout(hideSplash,6000);
// tampilan instan dari cache kunjungan sebelumnya
$('yr').textContent=new Date().getFullYear();
{const t=ls.get('witama_text');if(t)setText(t);const a=ls.get('witama_assets');if(a){setLogoSmall(a.small);setWall(a.large);cardImg=a.card||'';}}
applyCard();
// gambar besar dimuat terpisah supaya katalog tidak menunggu
function loadHeavy(){
 api('/site_settings?select=logo_small&id=eq.1').then(r=>{const v=r?.[0]?.logo_small||'';setLogoSmall(v);const a=ls.get('witama_assets')||{};a.small=v;ls.set('witama_assets',a);}).catch(()=>{});
 api('/site_settings?select=logo_large&id=eq.1',40000).then(r=>{const v=r?.[0]?.logo_large||'';setWall(v);const a=ls.get('witama_assets')||{};a.large=v;ls.set('witama_assets',a);}).catch(()=>{});
 api('/site_settings?select=card_bg_img&id=eq.1',40000).then(r=>{cardImg=r?.[0]?.card_bg_img||'';applyCard();const a=ls.get('witama_assets')||{};a.card=cardImg;ls.set('witama_assets',a);}).catch(()=>{});
 products.forEach(p=>{if(FALLBACK.some(f=>f.id===p.id))return;
  api('/products?select=image&id=eq.'+encodeURIComponent(p.id),40000).then(r=>{const img=r?.[0]?.image;if(!img)return;p.image=img;
   const c=[...document.querySelectorAll('.card')].find(x=>x.dataset.id===p.id);if(c)c.querySelector('.ci').innerHTML=`<img src="${esc(img)}" alt="">`;
   if(decodeURIComponent(location.hash.slice(1))==='p/'+p.id){$('dImg').src=img;$('dImg').classList.remove('hidden');$('dPh').classList.add('hidden');}}).catch(()=>{});});}
(async()=>{
 const [t,l]=await Promise.all([
  (async()=>{for(const c of ['brand,description,card_label,card_bg','brand,description','brand']){try{return (await api('/site_settings?select='+c+'&id=eq.1'))?.[0]||null;}catch{}}return null;})(),
  api('/products?select=id,title,description,link,order_num,active&active=eq.true&order=order_num.asc').catch(()=>null)]);
 try{if(t)setText(t);}catch(e){console.error(e);}
 setPct(60,'Memuat katalog...');
 let list=l||[];if(!list.length)list=FALLBACK.filter(x=>Number(x.active)===1).sort((a,b)=>(a.order||0)-(b.order||0));
 products=list;try{render();}catch(e){console.error(e);}
 setPct(85,'Menyiapkan tampilan...');setTimeout(hideSplash,Math.max(0,1500-(Date.now()-t0)));
 loadHeavy();})();
