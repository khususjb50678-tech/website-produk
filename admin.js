const SB_URL = "PASTE_SUPABASE_URL_HERE";
const SB_ANON_KEY = "PASTE_SUPABASE_ANON_KEY_HERE";
const supabase = window.supabase.createClient(SB_URL, SB_ANON_KEY);

const defaults = {user:"admin", brand:"TAMA STORE"};
const $=id=>document.getElementById(id);
let productsCache=[];

function configured(){return SB_URL.startsWith("http") && !SB_URL.includes("PASTE_") && !SB_ANON_KEY.includes("PASTE_");}
function esc(s){return String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));}
function notice(t,error=false){$("notice").textContent=t;$("notice").className="notice "+(error?"error":"success");setTimeout(()=>$("notice").classList.add("hidden"),3000)}

async function getSettings(){
 const {data,error}=await supabase.from("site_settings").select("id,brand,username").eq("id",1).maybeSingle();
 if(error) throw error;
 return data||{id:1,...defaults};
}
async function ensureSettings(){
 const s=await getSettings();
 if(!s){return defaults;}
 return s;
}
async function getProducts(){
 const {data,error}=await supabase.from("products").select("id,title,description,image,link,order_num,active").order("order_num",{ascending:true});
 if(error) throw error;
 productsCache=data||[]; return productsCache;
}

async function showAdmin(){
 $("loginView").classList.add("hidden");$("adminView").classList.remove("hidden");
 await renderAdmin(); await loadSettings();
}
async function login(){
 if(!configured()){ $("loginError").textContent="Supabase belum disetting. Isi SUPABASE_URL dan SUPABASE_ANON_KEY di admin.js."; $("loginError").classList.remove("hidden"); return; }
 const email=$("loginUser").value.trim(); const password=$("loginPass").value;
 const {error}=await supabase.auth.signInWithPassword({email,password});
 if(error){$("loginError").textContent="Login gagal: "+error.message;$("loginError").classList.remove("hidden");return;}
 await showAdmin();
}
async function loadSettings(){
 try{const s=await getSettings();$("brandInput").value=s.brand||defaults.brand;$("settingsUser").value=s.username||defaults.user;$("settingsPass").value="";}
 catch(e){notice("Gagal mengambil pengaturan: "+e.message,true)}
}
async function renderAdmin(){
 try{
  const ps=await getProducts(); const active=ps.filter(p=>p.active).length;
  $("totalStat").textContent=ps.length;$("activeStat").textContent=active;$("inactiveStat").textContent=ps.length-active;$("productCount").textContent=`${ps.length} item`;
  $("adminList").innerHTML=ps.length?ps.map(p=>`<div class="product-row"><div class="row-img">${p.image?`<img src="${esc(p.image)}" alt="">`:"✦"}</div><div class="row-info"><b>${esc(p.title)}</b><small>${esc(p.description)}</small><span class="${p.active?'on':'off'}">${p.active?'Aktif':'Nonaktif'}</span></div><div class="row-actions"><button onclick="editProduct('${esc(p.id)}')">Edit</button><button onclick="toggleProduct('${esc(p.id)}')">${p.active?'Nonaktifkan':'Aktifkan'}</button><button class="danger" onclick="deleteProduct('${esc(p.id)}')">Hapus</button></div></div>`).join(""): `<div class="empty">Belum ada produk.</div>`;
 }catch(e){$("adminList").innerHTML=`<div class="empty">Gagal memuat data: ${esc(e.message)}</div>`}
}
function openModal(p=null){$("modalTitle").textContent=p?"Edit Produk":"Tambah Produk";$("editId").value=p?.id||"";$("fTitle").value=p?.title||"";$("fDesc").value=p?.description||"";$("fImage").value=p?.image||"";$("fLink").value=p?.link||"";$("fOrder").value=p?.order_num??0;$("fActive").value=p?.active?1:0;$("modal").classList.remove("hidden")}
function closeModal(){$("modal").classList.add("hidden")}
function editProduct(id){openModal(productsCache.find(p=>p.id===id))}
async function toggleProduct(id){const p=productsCache.find(x=>x.id===id);if(!p)return;const {error}=await supabase.from("products").update({active:!p.active}).eq("id",id);if(error)return notice(error.message,true);await renderAdmin();notice("Status produk diperbarui.")}
async function deleteProduct(id){if(!confirm("Hapus produk ini?"))return;const {error}=await supabase.from("products").delete().eq("id",id);if(error)return notice(error.message,true);await renderAdmin();notice("Produk dihapus.")}

$("loginBtn").onclick=login;$("loginPass").addEventListener("keydown",e=>{if(e.key==="Enter")login()});
$("logoutBtn").onclick=async()=>{await supabase.auth.signOut();location.reload()};
$("addBtn").onclick=()=>openModal();$("closeModal").onclick=closeModal;$("cancelBtn").onclick=closeModal;
$("productForm").onsubmit=async e=>{e.preventDefault();
 const id=$("editId").value||crypto.randomUUID(); const item={id,title:$("fTitle").value.trim(),description:$("fDesc").value.trim(),image:$("fImage").value.trim(),link:$("fLink").value.trim(),order_num:+$("fOrder").value||0,active:+$("fActive").value===1};
 let result; if($("editId").value) result=await supabase.from("products").update(item).eq("id",id); else result=await supabase.from("products").insert(item);
 if(result.error)return notice("Gagal menyimpan: "+result.error.message,true);closeModal();await renderAdmin();notice($("editId").value?"Produk diperbarui.":"Produk ditambahkan.");
};
$("saveSettings").onclick=async()=>{const brand=$("brandInput").value.trim()||defaults.brand;const username=$("settingsUser").value.trim()||defaults.user;const {error}=await supabase.from("site_settings").upsert({id:1,brand,username},{onConflict:"id"});if(error)return notice("Gagal menyimpan: "+error.message,true);notice("Pengaturan tersimpan di Supabase.")};

(async()=>{
 if(!configured()) return;
 const {data:{session}}=await supabase.auth.getSession(); if(session) await showAdmin();
})();
