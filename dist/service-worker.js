if(!self.define){let e,i={};const s=(s,d)=>(s=new URL(s+".js",d).href,i[s]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=s,e.onload=i,document.head.appendChild(e)}else e=s,importScripts(s),i()})).then((()=>{let e=i[s];if(!e)throw new Error(`Module ${s} didn’t register its module`);return e})));self.define=(d,r)=>{const c=e||("document"in self?document.currentScript.src:"")||location.href;if(i[c])return;let n={};const o=e=>s(e,c),t={module:{uri:c},exports:n,require:o};i[c]=Promise.all(d.map((e=>t[e]||o(e)))).then((e=>(r(...e),n)))}}define(["./workbox-6567b62a"],(function(e){"use strict";e.setCacheNameDetails({prefix:"Shootout"}),self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"/dist/android-chrome-192x192.png",revision:"1c75c75e9cde80078eece5178cc770b6"},{url:"/dist/android-chrome-512x512.png",revision:"e024a34cba72a24622d4e49ecc01f15e"},{url:"/dist/apple-touch-icon.png",revision:"0238f12e9ddf429fbf9f979c26bddbb3"},{url:"/dist/beep-08b.mp3",revision:"b76b0645d3ba50d44def821b619ab0b6"},{url:"/dist/browserconfig.xml",revision:"50fbafb31fef9b3398f6182fe2da742d"},{url:"/dist/button-4.mp3",revision:"3959f938ad32fc6ed291d956079c3506"},{url:"/dist/buzzer.mp3",revision:"4718706b29e472df739be8d9d500cbe1"},{url:"/dist/css/app.15621f1f.css",revision:null},{url:"/dist/css/chunk-vendors.30118143.css",revision:null},{url:"/dist/favicon-16x16.png",revision:"e45755512d9cfd971a8677c5a7c72a4d"},{url:"/dist/favicon-32x32.png",revision:"c6e5a7d7808f5053baf3ffc6e961aa6b"},{url:"/dist/game-over-voice.mp3",revision:"c696d661981bab4fcc7e09d68a2e3538"},{url:"/dist/index.html",revision:"f957f3a21754fcd555b3b7ad573d7c43"},{url:"/dist/js/app.2c34238f.js",revision:null},{url:"/dist/js/chunk-vendors.1f7dd64b.js",revision:null},{url:"/dist/limited-shot-clock-activated.mp3",revision:"e99d0b383582b2d60de60ccecf61c63e"},{url:"/dist/manifest.json",revision:"beebf945d0e6ddd70751b45ae2ab88c3"},{url:"/dist/mstile-150x150.png",revision:"fbe41b9ce8d16ce72b3853787f41c94e"},{url:"/dist/robots.txt",revision:"b6216d61c03e6ce0c9aea6ca7808f7ca"},{url:"/dist/safari-pinned-tab.svg",revision:"095af32ac5a28e4eccee2cdfdfd4f5c4"}],{})}));
//# sourceMappingURL=service-worker.js.map
