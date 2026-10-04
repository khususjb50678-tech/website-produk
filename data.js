window.DEFAULT_SETTINGS={brand:'Witama Store.ID',logo_small:'',logo_large:''};
window.DEFAULT_PRODUCTS=[
{id:'p1',title:'WSID | Nomor Virtual',description:'Katalog nomor virtual dan bot otomatis untuk kebutuhan digital.',image:'',link:'https://t.me/autoordernokoskrbot',active:1,order:1},
{id:'p2',title:'SMM Murah',description:'Layanan sosial media dengan pilihan layanan yang praktis.',image:'',link:'https://example.com',active:1,order:2},
{id:'p3',title:'Bot Auto Order',description:'Bot otomatis untuk pemesanan produk digital.',image:'',link:'https://example.com',active:1,order:3}
];

window.DEF_CARD_LABEL='Credits By Witama Store.ID';
window.CARD_BGS={
 aurora:{name:'Aurora',layers:['radial-gradient(120% 100% at 0% 0%,rgba(155,92,255,.7),transparent 55%)','radial-gradient(110% 120% at 100% 100%,rgba(63,134,255,.65),transparent 55%)','radial-gradient(70% 60% at 75% 5%,rgba(255,70,130,.4),transparent 60%)','linear-gradient(135deg,#0c0a30,#150b40)']},
 grid:{name:'Neon Grid',layers:['repeating-linear-gradient(0deg,rgba(130,150,255,.2) 0 1px,transparent 1px 20px)','repeating-linear-gradient(90deg,rgba(130,150,255,.2) 0 1px,transparent 1px 20px)','radial-gradient(90% 110% at 50% 130%,rgba(155,92,255,.6),transparent 62%)','linear-gradient(#08081f,#0e0a2e)']},
 galaxy:{name:'Galaksi',layers:['radial-gradient(1.3px 1.3px at 12% 28%,#fffc,transparent)','radial-gradient(1px 1px at 38% 70%,#fffa,transparent)','radial-gradient(1.4px 1.4px at 62% 22%,#fffd,transparent)','radial-gradient(1px 1px at 84% 60%,#fffb,transparent)','radial-gradient(1px 1px at 92% 18%,#fff9,transparent)','radial-gradient(1.2px 1.2px at 24% 86%,#fffa,transparent)','radial-gradient(70% 90% at 15% 15%,rgba(110,70,255,.55),transparent 62%)','radial-gradient(70% 90% at 90% 90%,rgba(40,120,255,.5),transparent 62%)','linear-gradient(#07071c,#0b0824)']},
 flame:{name:'Merah-Biru',layers:['radial-gradient(90% 130% at 0% 100%,rgba(255,45,75,.6),transparent 60%)','radial-gradient(90% 130% at 100% 0%,rgba(63,134,255,.65),transparent 60%)','linear-gradient(#0a0a24,#10081f)']},
 none:{name:'Polos',layers:[]}
};
window.cardBgCss=function(key,img){
 if(img)return 'linear-gradient(rgba(6,6,24,.5),rgba(6,6,24,.65)) padding-box,url("'+img+'") center/cover no-repeat padding-box';
 const p=window.CARD_BGS[key]||window.CARD_BGS.aurora;return p.layers.map(l=>l+' padding-box').join(',');};
