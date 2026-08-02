const channelsEl=document.getElementById('channels'),
search=document.getElementById('search'),
m3uUrl=document.getElementById('m3uUrl'),
jsonInput=document.getElementById('jsonInput'),
video=document.getElementById('video'),
count=document.getElementById('count'),
scope=document.getElementById('scope'),
nowName=document.getElementById('nowName'),
nowInfo=document.getElementById('nowInfo'),
clock=document.getElementById('clock'),
welcome=document.getElementById('welcome'),
infoBox=document.getElementById('infoBox'),
epgBox=document.getElementById('epgBox'),
settingsBox=document.getElementById('settingsBox'),
infoContent=document.getElementById('infoContent'),
epgContent=document.getElementById('epgContent'),
autostartToggle=document.getElementById('autostartToggle'),
fileInput=document.getElementById('fileInput');

let channels=[],filtered=[],current=-1,hls=null,started=false,showFav=false,
favs=JSON.parse(localStorage.getItem('favs')||'[]'),
lastChannel=JSON.parse(localStorage.getItem('lastChannel')||'null'),
autostart=localStorage.getItem('autostart')==='1';

autostartToggle.checked=autostart;
autostartToggle.onchange=()=>{
  autostart=autostartToggle.checked;
  localStorage.setItem('autostart',autostart?'1':'0');
};

function tick(){
  const d=new Date();
  clock.textContent=d.toLocaleDateString('pl-PL',{weekday:'short',day:'2-digit',month:'2-digit'})+' · '+d.toLocaleTimeString('pl-PL',{hour:'2-digit',minute:'2-digit'});
}
setInterval(tick,1000);
tick();

function saveFavs(){localStorage.setItem('favs',JSON.stringify(favs))}
function saveLast(ch){localStorage.setItem('lastChannel',JSON.stringify(ch||null))}

function render(list){
  filtered=list;
  count.textContent=list.length+' kanałów';
  scope.textContent=showFav?'Ulubione':'Wszystkie';
  channelsEl.innerHTML='';
  list.forEach((ch,i)=>{
    const el=document.createElement('div');
    const fav=favs.includes(ch.url);
    el.className='item'+(i===current?' active':'')+(fav?' favOn':'');
    el.innerHTML=`<div class='dot'></div><div class='num'>${ch.num||(i+1)}</div><div class='name'>${ch.name}</div><div class='fav'>★</div>`;
    el.onclick=()=>{
      current=i;
      render(filtered);
      play(ch);
    };
    el.ondblclick=()=>toggleFav(ch);
    channelsEl.appendChild(el);
  });
}

function applyFilter(){
  const q=search.value.trim().toLowerCase();
  let list=channels.slice();
  if(showFav) list=list.filter(c=>favs.includes(c.url));
  if(q) list=list.filter(c=>c.name.toLowerCase().includes(q));
  render(list);
}

function toggleFav(ch){
  if(!ch||!ch.url)return;
  const i=favs.indexOf(ch.url);
  if(i>=0)favs.splice(i,1);else favs.push(ch.url);
  saveFavs();
  applyFilter();
}

function showInfo(ch){
  infoContent.innerHTML=`<div style="font-weight:700;margin-bottom:4px;">${ch.name||'Kanał'}</div><div style='color:var(--muted);font-size:12px;word-break:break-all;'>${ch.url||''}</div><div style='color:var(--muted);font-size:12px;margin-top:4px;'>Ulubiony: ${favs.includes(ch.url)?'tak':'nie'}</div>`;
  infoBox.style.display='block';
  clearTimeout(showInfo.t);
  showInfo.t=setTimeout(()=>infoBox.style.display='none',3000);
}

function showEpg(ch){
  const now='Program na żywo: Transmisja ciągła',
        next='Następny program: Kolejne pasmo';
  epgContent.innerHTML=`<div style="font-weight:700;margin-bottom:4px;">${ch.name||'Kanał'}</div><div style='font-size:12px;'>${now}</div><div style='color:var(--muted);font-size:12px;margin-top:2px;'>${next}</div>`;
  epgBox.style.display='block';
  clearTimeout(showEpg.t);
  showEpg.t=setTimeout(()=>epgBox.style.display='none',3000);
}

function play(ch){
  if(!ch)return;
  started=true;
  welcome.classList.add('hidden');
  nowName.textContent=ch.name;
  nowInfo.textContent='Odtwarzanie strumienia HLS/M3U';
  showInfo(ch);
  showEpg(ch);
  saveLast(ch);
  if(hls){hls.destroy();hls=null}
  if(video.canPlayType('application/vnd.apple.mpegurl')){
    video.src=ch.url;
  }else if(Hls.isSupported()){
    hls=new Hls();
    hls.loadSource(ch.url);
    hls.attachMedia(video);
  }else{
    video.src=ch.url;
  }
  video.play().catch(()=>{});
}

async function loadJSONText(text){
  const arr=JSON.parse(text);
  channels=Array.isArray(arr)?arr:[];
  applyFilter();
  if(channels[0] && !started){
    nowName.textContent=channels[0].name;
    nowInfo.textContent='Gotowy do startu';
  }
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
      if(next&&!next.startsWith('#'))parsed.push({name,url:next,num});
    }
  }
  channels=parsed;
  applyFilter();
  if(parsed[0] && !started){
    nowName.textContent=parsed[0].name;
    nowInfo.textContent='Gotowy do startu';
  }
}

const defaultChannels = [
  {num:"1", name:"NASA TV Public", url:"https://ntv1.nasa.gov/hls/live/576629/ntv-1/master.m3u8", logo:""},
  {num:"2", name:"Big Buck Bunny (Test)", url:"https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8", logo:""},
  {num:"3", name:"Sintel Trailer (HLS)", url:"https://bitmovin-a.akamaihd.net/content/sintel/hls/playlist.m3u8", logo:""},
  {num:"4", name:"Tears of Steel (Test)", url:"https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8", logo:""}
];

document.getElementById('loadJsonBtn').onclick=async()=>{
  const t=jsonInput.value.trim();
  if(!t)return;
  try{
    if(t.startsWith('http://')||t.startsWith('https://')) await loadJSONText(await fetch(t).then(r=>r.text()));
    else await loadJSONText(t);
  }catch(e){
    alert('Błędny format JSON');
  }
};

document.getElementById('sampleBtn').onclick=()=>{
  jsonInput.value=JSON.stringify(defaultChannels,null,2);
  loadJSONText(jsonInput.value);
};

document.getElementById('loadM3uBtn').onclick=async()=>{
  const url=m3uUrl.value.trim();
  if(!url)return;
  try{
    const txt=await fetch(url).then(r=>r.text());
    await loadM3UText(txt);
  }catch(e){
    alert('Nie udało się pobrać playlisty M3U (sprawdź CORS lub URL)');
  }
};

document.getElementById('fileBtn').onclick=()=>fileInput.click();
fileInput.onchange=async()=>{
  const f=fileInput.files[0];
  if(!f)return;
  const ext=f.name.toLowerCase();
  const text=await f.text();
  if(ext.endsWith('.json')) await loadJSONText(text);
  else await loadM3UText(text);
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
  if(!document.fullscreenElement)document.documentElement.requestFullscreen().catch(()=>{});
  else document.exitFullscreen().catch(()=>{});
};

search.addEventListener('input',applyFilter);

document.addEventListener('click',(e)=>{
  if(!started && !e.target.closest('aside')) welcome.classList.add('hidden');
});

document.addEventListener('keydown',e=>{
  if(!started&&!['Shift','Control','Alt','Meta'].includes(e.key))welcome.classList.add('hidden');
  if(e.key==='Enter'&&filtered[current>=0?current:0]){
    if(current<0)current=0;
    play(filtered[current]);
  }
  if(e.key==='ArrowDown'){
    current=Math.min(filtered.length-1,current+1);
    if(current<0)current=0;
    render(filtered);
    if(filtered[current]) play(filtered[current]);
  }
  if(e.key==='ArrowUp'){
    current=Math.max(0,current-1);
    render(filtered);
    if(filtered[current]) play(filtered[current]);
  }
  if(e.key.toLowerCase()==='f'&&filtered[current]) toggleFav(filtered[current]);
  if(e.key.toLowerCase()==='i'&&filtered[current]) showInfo(filtered[current]);
  if(e.key.toLowerCase()==='e'&&filtered[current]) showEpg(filtered[current]);
  if(e.key.toLowerCase()==='s') settingsBox.style.display=settingsBox.style.display==='block'?'none':'block';
  if(e.key.toLowerCase()==='m') video.muted=!video.muted;
});

function playLast(){
  if(autostart&&lastChannel&&lastChannel.url){
    channels=[lastChannel];
    filtered=[lastChannel];
    render(filtered);
    play(lastChannel);
  } else {
    channels=defaultChannels;
    applyFilter();
  }
}

playLast();
