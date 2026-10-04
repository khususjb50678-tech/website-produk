const SB_URL = "https://ozsfnvzqtizptxymtxzf.supabase.co";
const SB_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96c2ZudnpxdGl6cHR4eW10eHpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEwNjIzMjksImV4cCI6MjEwNjYzODMyOX0.2TuFxRzKL4aHjRsFNyVsG3-LPn4UGre64NzhnT7W1Po";
const API = SB_URL + "/rest/v1";
const AUTH = SB_URL + "/auth/v1";
const $ = id => document.getElementById(id);
let session = null;
let productsCache = [];
const defaults = {user:"admin", brand:"TAMA STORE"};

function esc(s){return String(s ?? "").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));}
function showLoginError(t){const el=$("loginError"); if(el){el.textContent=t;el.className="notice error";}}
function notice(t,error=false){const el=$("notice");if(!el)return;el.textContent=t;el.className="notice "+(error?"error":"success");setTimeout(()=>el.classList.add("hidden"),4500);}
function headers(token=null){return {"apikey":SB_ANON_KEY,"Content-Type":"application/json",...(token?{"Authorization":"Bearer "+token}:{})};}
async function readError(res){let body="";try{body=await res.json();}catch{}return body?.message||body?.error_description||body?.hint||body?.details||`HTTP ${res.status}`;}

async function authLogin(email,password){
  const res=await fetch(AUTH+"/token?grant_type=password",{method:"POST",headers:headers(),body:JSON.stringify({email,password})});
  if(!res.ok)throw new Error(await readError(res));
  return res.json();
}
async function authRefresh(refresh_token){
  const res=await fetch(AUTH+"/token?grant_type=refresh_token",{method:"POST",headers:headers(),body:JSON.stringify({refresh_token})});
  if(!res.ok)throw new Error(await readError(res));
  return res.json();
}
async function authUser(token){
  const res=await fetch(AUTH+"/user",{headers:{"apikey":SB_ANON_KEY,"Authorization":"Bearer "+token}});
  if(!res.ok)throw new Error(await readError(res));
  return res.json();
}
function saveSession(data){session=data;localStorage.setItem("tama_admin_session",JSON.stringify(data));if(data?.user?.email)localStorage.setItem("tama_admin_auth_email",data.user.email);}
async function restoreSession(){
  const raw=localStorage.getItem("tama_admin_session");if(!raw)return false;
  try{
    let s=JSON.parse(raw);
    if(!s?.access_token)return false;
    try{await authUser(s.access_token);session=s;return true;}
    catch{
      if(!s.refresh_token)throw new Error("Sesi login sudah berakhir.");
      const fresh=await authRefresh(s.refresh_token);saveSession(fresh);return true;
    }
  }catch(e){localStorage.removeItem("tama_admin_session");localStorage.removeItem("tama_admin_auth_email");return false;}
}
async function db(path,options={}){
  const res=await fetch(API+path,{...options,headers:{...headers(session?.access_token),...(options.headers||{})}});
  if(!res.ok)throw new Error(await readError(res));
  if(res.status===204)return null;
  return res.json();
}
async function publicDb(path){
  const res=await fetch(API+path,{headers:headers()});
  if(!res.ok)throw new Error(await readError(res));
  return res.json();
}

async function getSettings(){
  const data=await db('/site_settings?select=id,brand,username&id=eq.1');
  return data?.[0]||{id:1,...defaults};
}
async function getProducts(){
  const data=await db('/products?select=id,title,description,image,link,order_num,active&order=order_num.asc');
  productsCache=data||[];return productsCache;
}
async function showAdmin(){
  $("loginView").classList.add("hidden");$("adminView").classList.remove("hidden");
  try{await renderAdmin();await loadSettings();}catch(e){notice("Gagal memuat panel: "+e.message,true);}
}
async function login(){
  const btn=$("loginBtn");if(btn){btn.disabled=true;btn.textContent="Memproses...";}
  try{
    $("loginError").className="notice error hidden";
    const identifier=$("loginUser").value.trim();const password=$("loginPass").value;
    if(!identifier||!password){showLoginError("Email dan password wajib diisi.");return;}
    let email=identifier;
    if(!identifier.includes("@")){
      const stored=localStorage.getItem("tama_admin_auth_email");
      if(!stored){showLoginError("Login pertama wajib memakai email akun Supabase. Setelah berhasil, username bisa dipakai di perangkat ini.");return;}
      email=stored;
    }
    const data=await authLogin(email,password);
    if(!data?.access_token){showLoginError("Supabase tidak memberikan sesi login.");return;}
    saveSession(data);await showAdmin();
  }catch(e){showLoginError("Login gagal: "+e.message);}
  finally{if(btn){btn.disabled=false;btn.textContent="Masuk";}}
}
async function loadSettings(){const s=await getSettings();$("brandInput").value=s.brand||defaults.brand;$("settingsUser").value=s.username||defaults.user;}
async function renderAdmin(){
  const ps=await getProducts();const active=ps.filter(p=>p.active).length;
  $("totalStat").textContent=ps.length;$("activeStat").textContent=active;$("inactiveStat").textContent=ps.length-active;$("productCount").textContent=`${ps.length} item`;
  $("adminList").innerHTML=ps.length?ps.map(p=>`<div class="product-row"><div class="row-img">${p.image?`<img src="${esc(p.image)}" alt="">`:"✦"}</div><div class="row-info"><b>${esc(p.title)}</b><small>${esc(p.description)}</small><span class="${p.active?'on':'off'}">${p.active?'Aktif':'Nonaktif'}</span></div><div class="row-actions"><button onclick="editProduct('${esc(p.id)}')">Edit</button><button onclick="toggleProduct('${esc(p.id)}')">${p.active?'Nonaktifkan':'Aktifkan'}</button><button class="danger" onclick="deleteProduct('${esc(p.id)}')">Hapus</button></div></div>`).join(""):`<div class="empty">Belum ada produk.</div>`;
}
function openModal(p=null){$("modalTitle").textContent=p?"Edit Produk":"Tambah Produk";$("editId").value=p?.id||"";$("fTitle").value=p?.title||"";$("fDesc").value=p?.description||"";$("fImage").value=p?.image||"";$("fLink").value=p?.link||"";$("fOrder").value=p?.order_num??0;$("fActive").value=p?.active?1:0;$("modal").classList.remove("hidden");}
function closeModal(){$("modal").classList.add("hidden");}
function editProduct(id){openModal(productsCache.find(p=>String(p.id)===String(id)));}
async function toggleProduct(id){try{const p=productsCache.find(x=>String(x.id)===String(id));if(!p)return;await db(`/products?id=eq.${encodeURIComponent(id)}`,{method:"PATCH",headers:{"Prefer":"return=minimal"},body:JSON.stringify({active:!p.active})});await renderAdmin();notice("Status produk diperbarui.");}catch(e){notice(e.message,true);}}
async function deleteProduct(id){if(!confirm("Hapus produk ini?"))return;try{await db(`/products?id=eq.${encodeURIComponent(id)}`,{method:"DELETE",headers:{"Prefer":"return=minimal"}});await renderAdmin();notice("Produk dihapus.");}catch(e){notice(e.message,true);}}

function bindEvents(){
  $("loginBtn").addEventListener("click",login);$("loginPass").addEventListener("keydown",e=>{if(e.key==="Enter")login()});$("loginUser").addEventListener("keydown",e=>{if(e.key==="Enter")login()});
  $("logoutBtn").addEventListener("click",()=>{session=null;localStorage.removeItem("tama_admin_session");localStorage.removeItem("tama_admin_auth_email");location.reload();});
  $("addBtn").addEventListener("click",()=>openModal());$("closeModal").addEventListener("click",closeModal);$("cancelBtn").addEventListener("click",closeModal);
  $("productForm").addEventListener("submit",async e=>{e.preventDefault();try{const editing=!!$("editId").value;const id=$("editId").value||crypto.randomUUID();const item={id,title:$("fTitle").value.trim(),description:$("fDesc").value.trim(),image:$("fImage").value.trim(),link:$("fLink").value.trim(),order_num:+$("fOrder").value||0,active:+$("fActive").value===1};if(editing)await db(`/products?id=eq.${encodeURIComponent(id)}`,{method:"PATCH",headers:{"Prefer":"return=minimal"},body:JSON.stringify(item)});else await db('/products',{method:"POST",headers:{"Prefer":"return=minimal"},body:JSON.stringify(item)});closeModal();await renderAdmin();notice(editing?"Produk diperbarui.":"Produk ditambahkan.");}catch(e){notice("Gagal menyimpan: "+e.message,true);}});
  $("saveSettings").addEventListener("click",async()=>{try{const brand=$("brandInput").value.trim()||defaults.brand;const username=$("settingsUser").value.trim()||defaults.user;await db('/site_settings?on_conflict=id',{method:"POST",headers:{"Prefer":"resolution=merge-duplicates,return=minimal"},body:JSON.stringify({id:1,brand,username})});notice("Pengaturan tersimpan di Supabase.");}catch(e){notice("Gagal menyimpan: "+e.message,true);}});
}

(async function boot(){
  try{bindEvents();if(await restoreSession())await showAdmin();}
  catch(e){showLoginError("Admin gagal dijalankan: "+(e?.message||e));}
})();
