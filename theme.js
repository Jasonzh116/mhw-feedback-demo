'use strict';
(()=>{
 const root=document.documentElement,button=document.getElementById('theme-toggle');
 const key='mhw-feedback-theme';
 function apply(theme){
  const dark=theme==='dark';
  root.dataset.theme=dark?'dark':'light';
  button.textContent='主题 · '+(dark?'深色':'浅色');
  button.setAttribute('aria-pressed',String(dark));
  button.title=dark?'切换为浅色主题':'切换为深色主题';
 }
 let initial='dark';
 try{if(localStorage.getItem(key)==='light')initial='light';}catch{}
 apply(initial);
 button.onclick=()=>{
  const next=root.dataset.theme==='dark'?'light':'dark';
  apply(next);
  // Only a local appearance preference is stored; no replay data or network calls.
  try{localStorage.setItem(key,next);}catch{}
 };
})();
