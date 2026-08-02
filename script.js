const channelsEl=document.getElementById('channels'),
searchEl=document.getElementById('search'),
m3uUrlEl=document.getElementById('m3uUrl'),
video=document.getElementById('video'),
previewVideo=document.getElementById('previewVideo'),
previewBox=document.getElementById('previewBox'),
countEl=document.getElementById('count'),
statusEl=document.getElementById('status'),
startScreen=document.getElementById('startScreen'),
infoBox=document.getElementById('infoBox'),
infoTitle=document.getElementById('infoTitle'),
infoUrl=document.getElementById('infoUrl'),
infoExtra=document.getElementById('infoExtra'),
epgBox=document.getElementById('epgBox'),
epgTitle=document.getElementById('epgTitle'),
epgNow=document.getElementById('epgNow'),
epgNext=document.getElementById('epgNext'),
settingsBox=document.getElementById('settingsBox'),
autostartToggle=document.getElementById('autostartToggle'),
fileInput=document.getElementById('fileInput');

let channels=[],filtered=[],hls,current=-1,started=false,showFav=false,
favs=JSON.parse(localStorage.getItem('favs')||'[]'),
lastChannel=JSON.parse(localStorage.getItem('lastChannel')||'null'),
autostart=localStorage.getItem('autostart')==='1';

autostartToggle.checked=autostart;
autostartToggle.onchange=()=>{
  autostart=autostartToggle.checked;
  localStorage.setItem('autostart',autostart?'1':'0');
};

function saveFavs(){localStorage.setItem('favs',JSON.stringify(favs))}
function saveLast(ch){localStorage.setItem('lastChannel',JSON.stringify(ch||null))}
function showStart(v){startScreen.style.display=v?'flex':'none'}
function setStatus(t){statusEl.textContent=t}
function epgFor(name){
  return {
    now:'Teraz: Program na żywo — '+name,
    next:'Następnie: Kolejny program — '+name
  };
}

function render(list){
  filtered=list;
  countEl.textContent=list.length+' pozycji';
  channelsEl.innerHTML='';
  list.forEach((ch,i)=>{
    const d=document.createElement('div');
    const isFav=favs.includes(ch.url);
    d.className='channel'+(i===current?' active':'')+(isFav?' isfav':'');
    d.innerHTML=`<div class="dot"></div><div class="num">${ch.num||''}</div><div class="name">${ch.name}</div><div class="fav">★</div>`;
    d.onclick=()=>{
      current=i;
      render(filtered);
      play(ch.url,ch.name,ch);
    };
    d.ondblclick=()=>toggleFav(ch);
    d.onmouseenter=()=>showPreview(ch);
    channelsEl.appendChild(d);
  });
}

function setPreview(url){
  previewBox.style.display='block';
  if(previewVideo.canPlayType('application/vnd.apple.mpegurl')) previewVideo.src=url;
}

function showPreview(ch){
  if(!ch||!ch.url) return;
  setPreview(ch.url);
}

function play(url,name,ch){
  started=true;
  showStart(false);
  setStatus(name||'kanał');
  showInfo(ch||{name,url});
  showEpg(ch||{name});
  saveLast(ch);
  previewBox.style.display='none';

  if(hls){hls.destroy();hls=null}
  if(video.canPlayType('application/vnd.apple.mpegurl')) video.src=url;
  else{
    hls=new Hls();
    hls.loadSource(url);
    hls.attachMedia(video);
  }
  video.play().catch(()=>{});
}

function showInfo(ch){
  infoTitle.textContent=ch.name||'Kanał';
  infoUrl.textContent=ch.url||'';
  infoExtra.textContent='Ulubiony: '+(favs.includes(ch.url)?'tak':'nie');
  infoBox.style.display='block';
  clearTimeout(showInfo.t);
  showInfo.t=setTimeout(()=>infoBox.style.display='none',2200);
}

function showEpg(ch){
  const e=epgFor(ch.name||'Kanał');
  epgTitle.textContent='EPG: '+(ch.name||'Kanał');
  epgNow.textContent=e.now;
  epgNext.textContent=e.next;
  epgBox.style.display='block';
  clearTimeout(showEpg.t);
  showEpg.t=setTimeout(()=>epgBox.style.display='none',2200);
}

function toggleFav(ch){
  if(!ch||!ch.url) return;
  const i=favs.indexOf(ch.url);
  if(i>=0) favs.splice(i,1);
  else favs.push(ch.url);
  saveFavs();
  applyFilter();
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
  if(parsed[0]) setStatus(parsed[0].name);
  return parsed;
}

function applyFilter(){
  let list=channels;
  const q=searchEl.value.trim().toLowerCase();
  if(showFav) list=list.filter(c=>favs.includes(c.url));
  if(q) list=list.filter(c=>c.name.toLowerCase().includes(q));
  render(list);
}

function playSaved(){
  if(autostart&&lastChannel&&lastChannel.url){
    channels=[lastChannel];
    filtered=[lastChannel];
    render(filtered);
    play(lastChannel.url,lastChannel.name,lastChannel);
  }
}

document.getElementById('loadBtn').onclick=async()=>{
  const url=m3uUrlEl.value.trim();
  if(!url) return;
  const text=await fetch(url).then(r=>r.text());
  await loadM3UText(text);
};

document.getElementById('fileBtn').onclick=()=>fileInput.click();
fileInput.onchange=async()=>{
  const f=fileInput.files[0];
  if(!f) return;
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
document.getElementById('clearFavBtn').onclick=()=>{
  favs=[];
  saveFavs();
  applyFilter();
};

searchEl.addEventListener('input',applyFilter);

document.addEventListener('keydown',e=>{
  if(!started&&!['Shift','Control','Alt','Meta'].includes(e.key)) showStart(false);
  if(e.key.toLowerCase()==='l'){
    searchEl.focus();
    showStart(false);
  }
  if(e.key==='Enter'&&filtered[0]){
    current=0;
    render(filtered);
    play(filtered[0].url,filtered[0].name,filtered[0]);
  }
  if(e.key==='ArrowDown'){
    current=Math.min(filtered.length-1,current+1);
    if(current<0) current=0;
    render(filtered);
  }
  if(e.key==='ArrowUp'){
    current=Math.max(0,current-1);
    render(filtered);
  }
  if(e.key.toLowerCase()==='m') video.muted=!video.muted;
  if(e.key.toLowerCase()==='i'&&filtered[current]) showInfo(filtered[current]);
  if(e.key.toLowerCase()==='e'&&filtered[current]) showEpg(filtered[current]);
  if(e.key.toLowerCase()==='f'&&filtered[current]){
    toggleFav(filtered[current]);
    applyFilter();
  }
  if(e.key.toLowerCase()==='s') settingsBox.style.display=settingsBox.style.display==='block'?'none':'block';
  if(e.key==='ArrowRight'&&filtered.length){
    current=(current+1)%filtered.length;
    render(filtered);
  }
  if(e.key==='ArrowLeft'&&filtered.length){
    current=(current-1+filtered.length)%filtered.length;
    render(filtered);
  }
});

document.addEventListener('click',()=>{
  if(!started) showStart(false);
});

showStart(true);
applyFilter();
playSaved();
