const PKEY="tama_store_products_v1", SKEY="tama_store_settings_v1", AUTH="tama_store_auth_v1";
const defaults={user:"admin",pass:"admin123",brand:"TAMA STORE"};
const getSettings=()=>({...defaults,...JSON.parse(localStorage.getItem(SKEY)||"{}")});
const getProducts=()=>JSON.parse(localStorage.getItem(PKEY)||"null")||window.DEFAULT_PRODUCTS;
const saveProducts=p=>localStorage.setItem(PKEY,JSON.stringify(p));
const $=id=>document.getElementById(id);
function esc(s){return String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));}
function showAdmin(){ $("loginView").classList.add("hidden");$("adminView").classList.remove("hidden");renderAdmin();loadSettings();}
function login(){const s=getSettings();if($("loginUser").value===s.user&&$("loginPass").value===s.pass){localStorage.setItem(AUTH,"1");showAdmin()}else{$("loginError").textContent="Username atau password salah."; $("loginError").classList.remove("hidden")}}
function loadSettings(){const s=getSettings();$("brandInput").value=s.brand;$("settingsUser").value=s.user;$("settingsPass").value=s.pass}
function notice(t,error=false){$("notice").textContent=t;$("notice").className="notice "+(error?"error":"success");setTimeout(()=>$("notice").classList.add("hidden"),2500)}
function renderAdmin(){
 const ps=getProducts().sort((a,b)=>(a.order||0)-(b.order||0)); const active=ps.filter(p=>+p.active).length;
 $("totalStat").textContent=ps.length;$("activeStat").textContent=active;$("inactiveStat").textContent=ps.length-active;$("productCount").textContent=`${ps.length} item`;
 $("adminList").innerHTML=ps.length?ps.map(p=>`<div class="product-row"><div class="row-img">${p.image?`<img src="${esc(p.image)}" alt="">`:"✦"}</div><div class="row-info"><b>${esc(p.title)}</b><small>${esc(p.description)}</small><span class="${+p.active?'on':'off'}">${+p.active?'Aktif':'Nonaktif'}</span></div><div class="row-actions"><button onclick="editProduct('${p.id}')">Edit</button><button onclick="toggleProduct('${p.id}')">${+p.active?'Nonaktifkan':'Aktifkan'}</button><button class="danger" onclick="deleteProduct('${p.id}')">Hapus</button></div></div>`).join(""):`<div class="empty">Belum ada produk.</div>`;
}
function openModal(p=null){$("modalTitle").textContent=p?"Edit Produk":"Tambah Produk";$("editId").value=p?.id||"";$("fTitle").value=p?.title||"";$("fDesc").value=p?.description||"";$("fImage").value=p?.image||"";$("fLink").value=p?.link||"";$("fOrder").value=p?.order||0;$("fActive").value=p?.active?1:0;$("modal").classList.remove("hidden")}
function closeModal(){$("modal").classList.add("hidden")}
function editProduct(id){openModal(getProducts().find(p=>p.id===id))}
function toggleProduct(id){const p=getProducts();const x=p.find(a=>a.id===id);x.active=x.active?0:1;saveProducts(p);renderAdmin();notice("Status produk diperbarui.")}
function deleteProduct(id){if(!confirm("Hapus produk ini?"))return;saveProducts(getProducts().filter(p=>p.id!==id));renderAdmin();notice("Produk dihapus.")}
$("loginBtn").onclick=login;$("loginPass").addEventListener("keydown",e=>{if(e.key==="Enter")login()});
$("logoutBtn").onclick=()=>{localStorage.removeItem(AUTH);location.reload()};
$("addBtn").onclick=()=>openModal();$("closeModal").onclick=closeModal;$("cancelBtn").onclick=closeModal;
$("productForm").onsubmit=e=>{e.preventDefault();const p=getProducts();const id=$("editId").value||"p_"+Date.now();const item={id,title:$("fTitle").value.trim(),description:$("fDesc").value.trim(),image:$("fImage").value.trim(),link:$("fLink").value.trim(),order:+$("fOrder").value||0,active:+$("fActive").value};const i=p.findIndex(x=>x.id===id);i>=0?p[i]=item:p.push(item);saveProducts(p);closeModal();renderAdmin();notice(i>=0?"Produk diperbarui.":"Produk ditambahkan.")};
$("saveSettings").onclick=()=>{const s={brand:$("brandInput").value.trim()||"TAMA STORE",user:$("settingsUser").value.trim()||"admin",pass:$("settingsPass").value||"admin123"};localStorage.setItem(SKEY,JSON.stringify(s));notice("Pengaturan tersimpan.")};
if(localStorage.getItem(AUTH)==="1")showAdmin();