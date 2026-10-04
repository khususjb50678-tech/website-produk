const SB_URL = "PASTE_SUPABASE_URL_HERE";
const SB_ANON_KEY = "PASTE_SUPABASE_ANON_KEY_HERE";
const supabase = window.supabase.createClient(SB_URL, SB_ANON_KEY);
const FALLBACK = window.DEFAULT_PRODUCTS || [];
function esc(s){return String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));}
async function loadBrand(){
 if(!(SB_URL.startsWith("http") && !SB_URL.includes("PASTE_") && !SB_ANON_KEY.includes("PASTE_"))) return;
 const {data}=await supabase.from("site_settings").select("brand").eq("id",1).maybeSingle();
 if(data?.brand){ document.querySelectorAll(".brand b").forEach(el=>{el.innerHTML=esc(data.brand);}); document.querySelectorAll(".phone-top b").forEach(el=>el.textContent=data.brand); document.title=data.brand+" — Katalog Digital"; document.querySelector("meta[name=description]")?.setAttribute("content",data.brand+" — katalog produk dan layanan digital."); document.querySelector("footer .wrap")?.replaceWith(Object.assign(document.querySelector("footer .wrap"),{innerHTML:"© <span id=\"year\"></span> "+esc(data.brand)+". All rights reserved."})); document.getElementById("year").textContent=new Date().getFullYear(); }
}
async function render(){
 let list=[];
 if(SB_URL.startsWith("http") && !SB_URL.includes("PASTE_") && !SB_ANON_KEY.includes("PASTE_")){
  const {data,error}=await supabase.from("products").select("id,title,description,image,link,order_num,active").eq("active",true).order("order_num",{ascending:true});
  if(!error) list=data||[];
 }
 if(!list.length) list=FALLBACK.filter(x=>Number(x.active)===1).sort((a,b)=>(a.order||0)-(b.order||0));
 const grid=document.getElementById("productGrid"), empty=document.getElementById("empty");
 document.getElementById("count").textContent=`${list.length} produk aktif`;
 grid.innerHTML=list.map(p=>`<a class="card" href="${esc(p.link)}" target="_blank" rel="noopener noreferrer">${p.image?`<img class="card-img" src="${esc(p.image)}" alt="${esc(p.title)}" loading="lazy">`:`<div class="card-placeholder">✦</div>`}<div class="card-body"><h3>${esc(p.title)}</h3><p>${esc(p.description)}</p><div class="card-bottom"><span>● Aktif</span><b>Lihat Produk ↗</b></div></div></a>`).join("");
 empty.classList.toggle("hidden",list.length!==0);grid.classList.toggle("hidden",list.length===0);
}
document.getElementById("year").textContent=new Date().getFullYear();loadBrand().finally(render);
