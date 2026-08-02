const channelsEl=document.getElementById('channels');
const searchEl=document.getElementById('search');
const m3uUrlEl=document.getElementById('m3uUrl');
const video=document.getElementById('video');
const countEl=document.getElementById('count');
const activeGroupEl=document.getElementById('activeGroup');
const nowName=document.getElementById('nowName');
const nowInfo=document.getElementById('nowInfo');
const clockEl=document.getElementById('clock');
const welcome=document.getElementById('welcome');
const infoBox=document.getElementById('infoBox');
const epgBox=document.getElementById('epgBox');
const settingsBox=document.getElementById('settingsBox');
const infoContent=document.getElementById('infoContent');
const epgContent=document.getElementById('epgContent');
const autostartToggle=document.getElementById('autostartToggle');
const fileInput=document.getElementById('fileInput');

let channels=[],filtered=[],current=-1,hls=null,started=false,showFav=false;
let favs=JSON.parse(localStorage.getItem('favs')||'[]');
let lastChannel=JSON.parse(localStorage.getItem('lastChannel')||'null');
let autostart=localStorage.getItem('autostart')==='1';

autostartToggle.checked=autostart;
autostartToggle.onchange=()=>{
  autostart=autostartToggle.checked;
  localStorage.setItem('autostart',autostart?'1':'0');
};

function fmtTime(){
  const d=new Date();
  clockEl.textContent=d.toLocaleDateString('pl-PL',{weekday:'short',day:'2-digit',month:'2-digit'})+' · '+d.toLocaleTimeString('pl-PL',{hour:'2-digit',minute:'2-digit'});
}
setInterval(fmtTime,1000);
fmtTime();

function saveFavs(){localStorage.setItem('favs',JSON.stringify(favs))}
function saveLast(ch){localStorage.setItem('lastChannel',JSON.stringify(ch||null))}
function epgFor(name){return{now:'Teraz: Program na żywo — '+name,next:'Następnie: Kolejny program — '+name}}
function setWelcome(v){welcome.style.display=v?'flex':'none'}

function render(list){
  filtered=list;
  countEl.textContent=list.length+' kanałów';
  activeGroupEl.textContent=showFav?'Ulubione':'Wszystkie';
  channelsEl.innerHTML='';
  list.forEach((ch,i)=>{
    const row=document.createElement('div');
    const isFav=favs.includes(ch.url);
    row.className='channel'+(i===current?' active':'')+(isFav?' isfav':'');
    row.innerHTML=`<div class='dot'></div><div class='num'>${ch.num||''}</div><div class='name'>${ch.name}</div><div class='fav'>★</div>`;
    row.onclick=()=>{
      current=i;
      render(filtered);
      play(ch);
    };
    row.ondblclick=()=>toggleFav(ch);
    channelsEl.appendChild(row);
  });
}

function applyFilter(){
  const q=searchEl.value.trim().toLowerCase();
  let list=channels.slice();
  if(showFav) list=list.filter(c=>favs.includes(c.url));
  if(q) list=list.filter(c=>c.name.toLowerCase().includes(q));
  render(list);
}

function toggleFav(ch){
  if(!ch||!ch.url)return;
  const i=favs.indexOf(ch.url);
  if(i>=0)favs.splice(i,1);
  else favs.push(ch.url);
  saveFavs();
  applyFilter();
}

function showInfo(ch){
  infoContent.innerHTML=`<div><b>${ch.name||'Kanał'}</b></div><div class='muted'>${ch.url||''}</div><div class='muted'>Ulubiony: ${favs.includes(ch.url)?'tak':'nie'}</div><div class='muted'>Numer: ${ch.num||'—'}</div>`;
  infoBox.style.display='block';
  clearTimeout(showInfo.t);
  showInfo.t=setTimeout(()=>infoBox.style.display='none',2500);
}

function showEpg(ch){
  const e=epgFor(ch.name||'Kanał');
  epgContent.innerHTML=`<div><b>${ch.name||'Kanał'}</b></div><div>${e.now}</div><div class='muted'>${e.next}</div>`;
  epgBox.style.display='block';
  clearTimeout(showEpg.t);
  showEpg.t=setTimeout(()=>epgBox.style.display='none',2500);
}

function play(ch){
  if(!ch)return;
  started=true;
  setWelcome(false);
  nowName.textContent=ch.name;
  nowInfo.textContent='Kanał '+(ch.num||'');
  showInfo(ch);
  showEpg(ch);
  saveLast(ch);
  if(hls){hls.destroy();hls=null}
  if(video.canPlayType('application/vnd.apple.mpegurl')){
    video.src=ch.url;
  }else{
    hls=new Hls();
    hls.loadSource(ch.url);
    hls.attachMedia(video);
  }
  video.play().catch(()=>{});
}

async function loadM3UText(text){
  const lines=text.split(/\r?\n/);
  const parsed=[];
  for(let i=0;i<lines.length;i++){
    const line=lines[i].trim();
    if(line.startsWith('#EXTINF:')){
      const name=(line.split(',').pop().trim()||'Kanał');
      const numMatch=line.match(/tvg-chno="(.*?)"/i);
      const num=numMatch?numMatch[1]:'';
      const next=(lines[i+1]||'').trim();
      if(next&&!next.startsWith('#')) parsed.push({name,url:next,num});
    }
  }
  channels=parsed;
  applyFilter();
  if(parsed[0]) nowName.textContent=parsed[0].name;
}

document.getElementById('loadUrlBtn').onclick=async()=>{
  const url=m3uUrlEl.value.trim();
  if(!url)return;
  const txt=await fetch(url).then(r=>r.text());
  await loadM3UText(txt);
};

document.getElementById('fileBtn').onclick=()=>fileInput.click();
fileInput.onchange=async()=>{
  const f=fileInput.files[0];
  if(!f)return;
  await loadM3UText(await f.text());
};

document.getElementById('favBtn').onclick=()=>{
  showFav=true;
  applyFilter();
};

document.getElementById('allBtn').onclick=()=>{
  showFav=false;
  applyFilter();
};

document.getElementById('settingsBtn').onclick=()=>{
  settingsBox.style.display=settingsBox.style.display==='block'?'none':'block';
};

document.getElementById('fullscreenBtn').onclick=()=>{
  if(!document.fullscreenElement) document.documentElement.requestFullscreen().catch(()=>{});
  else document.exitFullscreen().catch(()=>{});
};

searchEl.addEventListener('input',applyFilter);

document.addEventListener('click',()=>{
  if(!started)setWelcome(false);
});

document.addEventListener('keydown',e=>{
  if(!started&&!['Shift','Control','Alt','Meta'].includes(e.key)) setWelcome(false);

  if(e.key==='Enter'&&filtered[current>=0?current:0]){
    if(current<0)current=0;
    play(filtered[current]);
  }
  if(e.key==='ArrowDown'){
    current=Math.min(filtered.length-1,current+1);
    if(current<0)current=0;
    render(filtered);
  }
  if(e.key==='ArrowUp'){
    current=Math.max(0,current-1);
    render(filtered);
  }
  if(e.key.toLowerCase()==='f'&&filtered[current]) toggleFav(filtered[current]);
  if(e.key.toLowerCase()==='i'&&filtered[current]) showInfo(filtered[current]);
  if(e.key.toLowerCase()==='e'&&filtered[current]) showEpg(filtered[current]);
  if(e.key.toLowerCase()==='s') settingsBox.style.display=settingsBox.style.display==='block'?'none':'block';
  if(e.key.toLowerCase()==='m') video.muted=!video.muted;
  if(e.key==='ArrowRight'&&filtered.length){
    current=(current+1)%filtered.length;
    render(filtered);
  }
  if(e.key==='ArrowLeft'&&filtered.length){
    current=(current-1+filtered.length)%filtered.length;
    render(filtered);
  }
});

function playLast(){
  if(autostart&&lastChannel&&lastChannel.url){
    channels=[lastChannel];
    filtered=[lastChannel];
    render(filtered);
    play(lastChannel);
  }
}

setWelcome(true);
render([]);
playLast();
