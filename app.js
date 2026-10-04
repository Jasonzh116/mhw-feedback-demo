'use strict';
(()=>{
 const $=id=>document.getElementById(id);let records=null,scenario='converging',position=0,playing=true,last=0;
 const messages={warming_up:'正在收集信号…',unavailable:'信号暂不可用',hidden:'保持已练习的跑姿',paused:'训练已暂停',finished:'本次训练已结束'};
 const hints={converging:'前 10 秒收集信号，随后逐渐进入目标区；目标范围为 −3° 至 +3°。',dropout:'11–14 秒模拟标记点丢失：数值隐藏，恢复有效信号后重新显示。',stable:'完成前 10 秒信号收集后，保持约 +6°，持续位于目标区外。',zero:'完成信号收集后显示有效的 0.0°；零值不是缺失数据。',hidden:'使用原有对照组规则：整个时段隐藏反馈数值。'};
 function render(data){
  const visible=['in_target','outside_target'].includes(data.state)&&Number.isFinite(data.error_deg);
  $('feedback-panel').hidden=!visible;
  if(!visible){$('value').textContent='—';$('direction').textContent='';$('message').textContent=messages[data.state]||'信号暂不可用';return;}
  const error=data.error_deg,good=error>=-3&&error<=3;
  $('message').textContent=good?'保持在绿色目标区':'进入绿色目标区';
  $('value').textContent=(error>0?'+':'')+error.toFixed(1)+'°';$('value').className='value '+(good?'good':'outside');
  $('cursor').style.left=(50+Math.max(-12,Math.min(12,error))/24*100)+'%';
  $('direction').textContent=good?'两侧内侧幅度相近':error>0?'症状侧内侧幅度更大':'对侧内侧幅度更大';
 }
 function show(){if(!records)return;const i=Math.min(1200,Math.floor(position));render(records[scenario][i]);$('seek').value=i;$('time').textContent=(i/10).toFixed(1)+' / 120.0 秒';$('hint').textContent=hints[scenario];$('play').textContent=playing?'暂停':position>=1200?'再播放':'继续';$('connection').textContent=position>=1200?'模拟回放已结束':playing?'模拟回放中 · 1×':'模拟回放已暂停';}
 $('play').onclick=()=>{if(!records)return;if(position>=1200)position=0;playing=!playing;last=performance.now();show();};
 $('restart').onclick=()=>{position=0;playing=true;last=performance.now();show();};
 $('scenario').onchange=()=>{scenario=$('scenario').value;position=0;playing=true;last=performance.now();show();};
 $('seek').oninput=()=>{position=Number($('seek').value);last=performance.now();show();};
 $('fullscreen').onclick=()=>{if(document.documentElement.requestFullscreen)document.documentElement.requestFullscreen().catch(()=>{});};
 function tick(now){if(last&&playing&&records&&!document.hidden){position=Math.min(1200,position+(now-last)/100);if(position>=1200)playing=false;show();}last=now;requestAnimationFrame(tick);}
 document.addEventListener('visibilitychange',()=>{last=performance.now();});
 fetch('./records.json').then(r=>{if(!r.ok)throw Error('load');return r.json();}).then(d=>{records=d;show();requestAnimationFrame(tick);}).catch(()=>{$('message').textContent='模拟记录载入失败，请刷新页面';$('connection').textContent='尚未开始';$('play').disabled=true;});
})();
