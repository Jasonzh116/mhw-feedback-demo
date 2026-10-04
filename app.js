'use strict';
(()=>{
 const $=id=>document.getElementById(id);let records=null,scenario='continuous',position=0,playing=true,last=0,symptomaticSide='right';
 let displayedIndex=-1,displayedSide=null;
 const messages={warming_up:'正在收集信号…',unavailable:'信号暂不可用',hidden:'保持已练习的跑姿',paused:'训练已暂停',finished:'本次训练已结束'};
 function formatError(error){
  // Preserve the inclusive boundary visually: 3.02 must not look like an in-range 3.0.
  let digits=1;
  while(Math.abs(error)>3&&Number(Math.abs(error).toFixed(digits))===3&&digits<12)digits++;
  if(Math.abs(error)>3&&Number(Math.abs(error).toFixed(digits))===3)return error>0?'>+3°':'<−3°';
  return (error>0?'+':'')+error.toFixed(digits)+'°';
 }
 function renderFeet(error,abnormal=false){
  const valid=Number.isFinite(error)&&['left','right'].includes(symptomaticSide);
  const large=valid&&Math.abs(error)>3?(error>0?symptomaticSide:(symptomaticSide==='left'?'right':'left')):null;
  $('target-center').setAttribute('class','center-region'+(valid&&Math.abs(error)<=3?' active':''));
  for(const side of ['left','right']){
   const active=side===large;
   $('foot-'+side).setAttribute('class','foot'+(active?' emphasized':''));
   $('role-'+side).textContent=side===symptomaticSide?'症状侧':'对侧';
   $('role-'+side).setAttribute('class','role'+(side===symptomaticSide?' symptom':''));
   $('sector-'+side).setAttribute('class','arc-sector '+side+(active?' active':''));
  }
 }
 function render(data){
  data=data||{state:'unavailable',error_deg:null};
  const abnormal=data.state==='anomaly'||(data.synthetic_quality_flag===true&&data.state!=='hidden');
  if(abnormal)data={state:'anomaly',error_deg:null};
  $('message').className=abnormal?'anomaly':'';
  document.body.classList.toggle('anomaly-active',abnormal);
  const visible=['in_target','outside_target'].includes(data.state)&&Number.isFinite(data.error_deg)&&['left','right'].includes(symptomaticSide);
  $('feedback-panel').hidden=!(visible||abnormal);
  $('gauge').hidden=false;
  $('value').hidden=!visible;
  $('cursor').style.visibility=visible?'visible':'hidden';
  if(!visible){renderFeet(null,abnormal);$('cursor').style.transform='rotate(0deg)';$('value').textContent='—';$('direction').textContent='';$('message').textContent=data.state==='anomaly'?'数据异常':messages[data.state]||'信号暂不可用';return;}
  const error=data.error_deg,good=Math.abs(error)<=3;renderFeet(error);
  $('message').textContent='';
  $('value').textContent=formatError(error);$('value').className='value '+(good?'good':'outside');
  // Arc geometry follows the actual larger side, while E retains its symptom-minus-opposite sign.
  const anatomicalError=error*(symptomaticSide==='right'?1:-1);
  $('cursor').style.transform='rotate('+(Math.max(-12,Math.min(12,anatomicalError))*7.5)+'deg)';
  const largeSide=error>0?symptomaticSide:(symptomaticSide==='left'?'right':'left');
  $('direction').textContent=good?'已在目标区内':(largeSide==='left'?'左侧':'右侧')+'偏大';
 }
 // Records are emitted at actual synthetic excursion availability, plus safety and
 // first-full-window boundaries. RAF advances the clock, not the feedback value.
 function recordIndexAt(t){
  const rows=records[scenario];let lo=0,hi=rows.length;
  while(lo<hi){const mid=(lo+hi)>>1;if(rows[mid].available_s<=t+1e-9)lo=mid+1;else hi=mid;}
  return lo-1;
 }
 function show(reset=false){
  if(!records)return;
  const t=Math.min(120,position/10),index=recordIndexAt(t);
  if(reset||index!==displayedIndex||symptomaticSide!==displayedSide){
   const row=records[scenario][index];
   const normal=row&&['in_target','outside_target'].includes(row.state);
   const eligible=normal&&row.available_s>=10&&row.counts&&Math.min(row.counts.L,row.counts.R)>=5;
   render(normal&&!eligible?{state:'unavailable',error_deg:null}:row);
   $('feedback-panel').dataset.eventId=row?.new_valid_excursions?.map(e=>e.id).join(',')||row?.update_kind||'';
   $('feedback-panel').dataset.availableS=String(row?.available_s??'');
   displayedIndex=index;displayedSide=symptomaticSide;
  }
  $('seek').value=Math.floor(position);$('time').textContent=t.toFixed(1)+' / 120.0 秒';
  $('play').textContent=playing?'暂停':position>=1200?'再播放':'继续';
  $('connection').textContent=position>=1200?'模拟回放已结束':playing?'模拟回放中 · 1×':'模拟回放已暂停';
 }
 $('symptomatic-side').onchange=()=>{symptomaticSide=$('symptomatic-side').value;show();};
 $('play').onclick=()=>{if(!records)return;if(position>=1200){position=0;displayedIndex=-1;}playing=!playing;last=performance.now();show();};
 $('restart').onclick=()=>{position=0;playing=true;last=performance.now();show(true);};
 $('seek').oninput=()=>{position=Number($('seek').value);last=performance.now();show(true);};
 $('fullscreen').onclick=()=>{if(document.fullscreenElement){document.exitFullscreen?.().catch(()=>{});}else if(document.documentElement.requestFullscreen)document.documentElement.requestFullscreen().catch(()=>{});};
 document.addEventListener('fullscreenchange',()=>{$('fullscreen').textContent=document.fullscreenElement?'退出全屏':'全屏';});
 function tick(now){if(last&&playing&&records&&!document.hidden){position=Math.min(1200,position+(now-last)/100);if(position>=1200)playing=false;show();}last=now;requestAnimationFrame(tick);}
 document.addEventListener('visibilitychange',()=>{last=performance.now();});
 fetch('./records.json?v=irregular-arc-1').then(r=>{if(!r.ok)throw Error('load');return r.json();}).then(d=>{records=d;show();requestAnimationFrame(tick);}).catch(()=>{$('message').textContent='模拟记录载入失败，请刷新页面';$('connection').textContent='尚未开始';$('play').disabled=true;});
})();


