const SB_URL = "https://ozsfnvzqtizptxymtxzf.supabase.co";
const SB_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96c2ZudnpxdGl6cHR4eW10eHpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEwNjIzMjksImV4cCI6MjEwNjYzODMyOX0.2TuFxRzKL4aHjRsFNyVsG3-LPn4UGre64NzhnT7W1Po";

const $ = id => document.getElementById(id);
let supabase = null;
let productsCache = [];
const defaults = {user:"admin", brand:"TAMA STORE"};

function configured(){return /^https:\/\/.+\.supabase\.co$/.test(SB_URL) && SB_ANON_KEY.length > 20;}
function esc(s){return String(s ?? "").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));}
function showLoginError(t){const el=$("loginError"); if(!el)return; el.textContent=t; el.className="notice error";}
function notice(t,error=false){const el=$("notice"); if(!el)return; el.textContent=t; el.className="notice "+(error?"error":"success"); setTimeout(()=>el.classList.add("hidden"),4000);}

function initSupabase(){
  if(!configured()){showLoginError("Konfigurasi Supabase belum lengkap."); return false;}
  if(!window.supabase || typeof window.supabase.createClient !== "function"){
    showLoginError("Library Supabase gagal dimuat. Refresh halaman atau cek koneksi internet.");
    return false;
  }
  try { supabase = window.supabase.createClient(SB_URL, SB_ANON_KEY); return true; }
  catch(e){ showLoginError("Supabase gagal diinisialisasi: "+e.message); return false; }
}

async function getSettings(){
 const {data,error}=await supabase.from("site_settings").select("id,brand,username").eq("id",1).maybeSingle();
 if(error) throw error; return data || {id:1,...defaults};
}
async function getProducts(){
 const {data,error}=await supabase.from("products").select("id,title,description,image,link,order_num,active").order("order_num",{ascending:true});
 if(error) throw error; productsCache=data||[]; return productsCache;
}
async function showAdmin(){
 $("loginView").classList.add("hidden"); $("adminView").classList.remove("hidden");
 try {await renderAdmin(); await loadSettings();} catch(e){notice("Gagal memuat panel: "+e.message,true);}
}

async function login(){
 const btn=$("loginBtn");
 if(btn){btn.disabled=true; btn.textContent="Memproses...";}
 try{
   const errorEl=$("loginError"); if(errorEl) errorEl.className="notice error hidden";
   if(!supabase && !initSupabase()) return;
   const identifier=$("loginUser").value.trim(); const password=$("loginPass").value;
   if(!identifier || !password){showLoginError("Email dan password wajib diisi."); return;}
   let email=identifier;
   if(!identifier.includes("@")){
     const stored=localStorage.getItem("tama_admin_auth_email");
     if(stored) email=stored;
     else {showLoginError("Untuk login pertama, gunakan email akun Supabase Auth. Setelah berhasil, email akan tersimpan di perangkat ini."); return;}
   }
   const {data,error}=await supabase.auth.signInWithPassword({email,password});
   if(error){showLoginError("Login gagal: "+error.message); return;}
   if(!data?.session){showLoginError("Login belum menghasilkan sesi. Coba lagi."); return;}
   localStorage.setItem("tama_admin_auth_email",email);
   await showAdmin();
 }catch(e){showLoginError("Terjadi kesalahan: "+(e?.message||e));}
 finally{if(btn){btn.disabled=false; btn.textContent="Masuk";}}
}

async function loadSettings(){
 const s=await getSettings();
 $("brandInput").value=s.brand||defaults.brand;
 $("settingsUser").value=s.username||defaults.user;
}
async function renderAdmin(){
 const ps=await getProducts(); const active=ps.filter(p=>p.active).length;
 $("totalStat").textContent=ps.length; $("activeStat").textContent=active; $("inactiveStat").textContent=ps.length-active; $("productCount").textContent=`${ps.length} item`;
 $("adminList").innerHTML=ps.length?ps.map(p=>`<div class="product-row"><div class="row-img">${p.image?`<img src="${esc(p.image)}" alt="">`:"✦"}</div><div class="row-info"><b>${esc(p.title)}</b><small>${esc(p.description)}</small><span class="${p.active?'on':'off'}">${p.active?'Aktif':'Nonaktif'}</span></div><div class="row-actions"><button onclick="editProduct('${esc(p.id)}')">Edit</button><button onclick="toggleProduct('${esc(p.id)}')">${p.active?'Nonaktifkan':'Aktifkan'}</button><button class="danger" onclick="deleteProduct('${esc(p.id)}')">Hapus</button></div></div>`).join(""):`<div class="empty">Belum ada produk.</div>`;
}
function openModal(p=null){$("modalTitle").textContent=p?"Edit Produk":"Tambah Produk";$("editId").value=p?.id||"";$("fTitle").value=p?.title||"";$("fDesc").value=p?.description||"";$("fImage").value=p?.image||"";$("fLink").value=p?.link||"";$("fOrder").value=p?.order_num??0;$("fActive").value=p?.active?1:0;$("modal").classList.remove("hidden")}
function closeModal(){$("modal").classList.add("hidden")}
function editProduct(id){openModal(productsCache.find(p=>p.id===id))}
async function toggleProduct(id){const p=productsCache.find(x=>x.id===id);if(!p)return;const {error}=await supabase.from("products").update({active:!p.active}).eq("id",id);if(error)return notice(error.message,true);await renderAdmin();notice("Status produk diperbarui.")}
async function deleteProduct(id){if(!confirm("Hapus produk ini?"))return;const {error}=await supabase.from("products").delete().eq("id",id);if(error)return notice(error.message,true);await renderAdmin();notice("Produk dihapus.")}

function bindEvents(){
 $("loginBtn").addEventListener("click",login);
 $("loginPass").addEventListener("keydown",e=>{if(e.key==="Enter")login()});
 $("loginUser").addEventListener("keydown",e=>{if(e.key==="Enter")login()});
 $("logoutBtn").addEventListener("click",async()=>{if(supabase)await supabase.auth.signOut();localStorage.removeItem("tama_admin_auth_email");location.reload()});
 $("addBtn").addEventListener("click",()=>openModal()); $("closeModal").addEventListener("click",closeModal); $("cancelBtn").addEventListener("click",closeModal);
 $("productForm").addEventListener("submit",async e=>{e.preventDefault(); const editing=!!$("editId").value; const id=$("editId").value||crypto.randomUUID(); const item={id,title:$("fTitle").value.trim(),description:$("fDesc").value.trim(),image:$("fImage").value.trim(),link:$("fLink").value.trim(),order_num:+$("fOrder").value||0,active:+$("fActive").value===1}; const result=editing?await supabase.from("products").update(item).eq("id",id):await supabase.from("products").insert(item); if(result.error)return notice("Gagal menyimpan: "+result.error.message,true); closeModal(); await renderAdmin(); notice(editing?"Produk diperbarui.":"Produk ditambahkan.");});
 $("saveSettings").addEventListener("click",async()=>{const brand=$("brandInput").value.trim()||defaults.brand;const username=$("settingsUser").value.trim()||defaults.user;const {error}=await supabase.from("site_settings").upsert({id:1,brand,username},{onConflict:"id"});if(error)return notice("Gagal menyimpan: "+error.message,true);notice("Pengaturan tersimpan di Supabase.");});
}

(async function boot(){
 try{
   bindEvents();
   if(!initSupabase()) return;
   const {data:{session}}=await supabase.auth.getSession();
   if(session) await showAdmin();
 }catch(e){showLoginError("Gagal menjalankan Admin Panel: "+(e?.message||e));}
})();
