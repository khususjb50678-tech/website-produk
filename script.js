const KEY="tama_store_products_v1";
const products=()=>JSON.parse(localStorage.getItem(KEY)||"null")||window.DEFAULT_PRODUCTS;
function esc(s){return String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));}
function render(){
 const list=products().filter(x=>Number(x.active)===1).sort((a,b)=>(a.order||0)-(b.order||0));
 const grid=document.getElementById("productGrid"), empty=document.getElementById("empty");
 document.getElementById("count").textContent=`${list.length} produk aktif`;
 grid.innerHTML=list.map(p=>`<a class="card" href="${esc(p.link)}" target="_blank" rel="noopener noreferrer">
 ${p.image?`<img class="card-img" src="${esc(p.image)}" alt="${esc(p.title)}" loading="lazy">`:`<div class="card-placeholder">✦</div>`}
 <div class="card-body"><h3>${esc(p.title)}</h3><p>${esc(p.description)}</p><div class="card-bottom"><span>● Aktif</span><b>Lihat Produk ↗</b></div></div></a>`).join("");
 empty.classList.toggle("hidden",list.length!==0); grid.classList.toggle("hidden",list.length===0);
}
document.getElementById("year").textContent=new Date().getFullYear(); render();