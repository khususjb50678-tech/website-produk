const SB_URL='https://ozsfnvzqtizptxymtxzf.supabase.co';
const SB_ANON_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96c2ZudnpxdGl6cHR4eW10eHpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEwNjIzMjksImV4cCI6MjEwNjYzODMyOX0.2TuFxRzKL4aHjRsFNyVsG3-LPn4UGre64NzhnT7W1Po';
const API=SB_URL+'/rest/v1',FALLBACK=window.DEFAULT_PRODUCTS||[],$=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
const W='<svg viewBox="0 0 130 110"><use href="#w"/></svg>';
async function api(p){const r=await fetch(API+p,{headers:{apikey:SB_ANON_KEY,Accept:'application/json'}});if(!r.ok)throw new Error('HTTP '+r.status);return r.json();}
let products=[];
function setBrand(s){const b=s?.brand||'Witama Store.ID',h=esc(b).replace(/Store\.ID/i,'<i>Store.ID</i>');document.querySelectorAll('.brand-name').forEach(e=>e.innerHTML=h);document.title=b+' — Katalog';if(s?.description)$('homeDesc').textContent=s.description;
 document.querySelectorAll('.brand-logo').forEach(e=>e.innerHTML=s?.logo_small?`<img src="${esc(s.logo_small)}" alt="">`:'<span>W</span>');
 if(s?.logo_large){$('wall').style.backgroundImage='url("'+s.logo_large+'")';document.body.classList.add('has-wall');}}
async function loadSettings(){for(const c of ['brand,logo_small,logo_large,description','brand,logo_small,logo_large']){try{return (await api('/site_settings?select='+c+'&id=eq.1'))?.[0]||window.DEFAULT_SETTINGS;}catch{}}return window.DEFAULT_SETTINGS;}
const thumb=p=>p.image?`<img src="${esc(p.image)}" alt="">`:W;
function render(){
 $('homeGrid').innerHTML=products.map(p=>`<a class="card neon" href="#p/${esc(p.id)}"><span class="ci">${thumb(p)}</span><b>${esc(p.title)}</b><span class="go">→</span></a>`).join('');
 $('empty').classList.toggle('hidden',products.length>0);route();}
function show(id){['vHome','vDet'].forEach(v=>$(v).classList.toggle('hidden',v!==id));scrollTo(0,0);}

function fmtDesc(t){t=String(t||'').trim();if(!t)return '<p class="d-intro">Tidak ada deskripsi.</p>';
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
(async()=>{setBrand(await loadSettings());let l=[];try{l=await api('/products?select=id,title,description,image,link,order_num,active&active=eq.true&order=order_num.asc');}catch{}
 if(!l.length)l=FALLBACK.filter(x=>Number(x.active)===1).sort((a,b)=>(a.order||0)-(b.order||0));products=l;render();})();
