// ============================================================
// 📺 URL DO PLAYLISTY Z POLSKIMI KANAŁAMI
// ============================================================
// Używamy oficjalnej playlisty z projektu iptv-org
const PLAYLIST_URL = 'https://iptv-org.github.io/iptv/countries/pl.m3u';

// ============================================================
// 🚀 RESZTA KODU
// ============================================================

let channels = [];
let currentChannel = null;
let hls = null;
let isPlaying = false;

const video = document.getElementById('videoPlayer');
const channelList = document.getElementById('channel-list');
const searchInput = document.getElementById('searchInput');
const noChannelMsg = document.getElementById('no-channel-message');

// ============================================================
// 📝 PARSOWANIE PLAYLISTY M3U
// ============================================================
function parsePlaylist(data) {
    const lines = data.split('\n');
    const result = [];
    let current = null;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        if (line.startsWith('#EXTINF:')) {
            // Wyciągamy group-title i nazwę kanału
            const groupMatch = line.match(/group-title="([^"]*)"/);
            const nameMatch = line.match(/#EXTINF:-?\d+[^,]*,(.*)/);
            
            const group = groupMatch ? groupMatch[1] : 'Inne';
            const name = nameMatch ? nameMatch[1].trim() : 'Nieznany';
            
            current = {
                group: group,
                name: name,
                url: null
            };
        } 
        else if (line && !line.startsWith('#') && current) {
            // To jest URL - sprawdzamy czy zaczyna się od http
            if (line.startsWith('http://') || line.startsWith('https://')) {
                current.url = line;
                result.push(current);
            }
            current = null;
        }
    }
    
    return result;
}

// ============================================================
// 🖥️ WYŚWIETLANIE KANAŁÓW
// ============================================================
function renderChannels(filter = '') {
    channelList.innerHTML = '';
    
    const filtered = channels.filter(ch => {
        const searchTerm = filter.toLowerCase();
        return ch.name.toLowerCase().includes(searchTerm) ||
               ch.group.toLowerCase().includes(searchTerm);
    });

    if (filtered.length === 0) {
        channelList.innerHTML = '<div style="padding:20px;color:#555;text-align:center;">Brak kanałów</div>';
        return;
    }

    filtered.forEach(ch => {
        const div = document.createElement('div');
        div.className = 'channel-item';
        if (currentChannel && currentChannel.url === ch.url) {
            div.classList.add('active');
        }
        div.innerHTML = `
            <span style="flex:1;">${ch.name}</span>
            <span class="group-badge">${ch.group}</span>
        `;
        div.addEventListener('click', () => playChannel(ch));
        channelList.appendChild(div);
    });
}

// ============================================================
// ▶️ ODTWARZANIE KANAŁU
// ============================================================
function playChannel(channel) {
    if (!channel.url) {
        console.error('Brak URL dla kanału:', channel.name);
        return;
    }

    currentChannel = channel;
    
    // Zatrzymaj poprzednie odtwarzanie
    if (hls) {
        hls.destroy();
        hls = null;
    }
    
    video.style.display = 'block';
    noChannelMsg.style.display = 'none';
    
    // Sprawdź czy to strumień HLS (.m3u8)
    const isHls = channel.url.includes('.m3u8') || channel.url.includes('m3u8');
    
    if (isHls && Hls.isSupported()) {
        // Użyj hls.js dla strumieni HLS
        hls = new Hls({
            enableWorker: true,
            lowLatencyMode: true,
            debug: false
        });
        
        hls.loadSource(channel.url);
        hls.attachMedia(video);
        
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
            video.play().catch(err => console.warn('Autoplay blokowany:', err));
        });
        
        hls.on(Hls.Events.ERROR, (event, data) => {
            if (data.fatal) {
                console.error('Błąd odtwarzania:', data);
                // Spróbuj odtworzyć ponownie
                if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
                    hls.startLoad();
                }
            }
        });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // Dla Safari - natywna obsługa HLS
        video.src = channel.url;
        video.play().catch(err => console.warn('Autoplay blokowany:', err));
    } else {
        // Dla zwykłych strumieni
        video.src = channel.url;
        video.play().catch(err => console.warn('Autoplay blokowany:', err));
    }
    
    renderChannels(searchInput.value);
}

// ============================================================
// 📥 WCZYTYWANIE PLAYLISTY
// ============================================================
function loadPlaylist() {
    channelList.innerHTML = '<div style="padding:20px;color:#aaa;text-align:center;">⏳ Ładowanie listy kanałów...</div>';
    
    fetch(PLAYLIST_URL)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            channels = parsePlaylist(data);
            
            // Filtrujemy kanały, które mają URL
            channels = channels.filter(ch => ch.url !== null);
            
            if (channels.length === 0) {
                channelList.innerHTML = '<div style="padding:20px;color:#ff4444;text-align:center;">❌ Nie znaleziono kanałów w playliście</div>';
                return;
            }
            
            renderChannels();
            
            // Automatycznie odtwórz pierwszy kanał
            if (channels.length > 0) {
                playChannel(channels[0]);
            }
        })
        .catch(error => {
            console.error('Błąd ładowania playlisty:', error);
            channelList.innerHTML = `
                <div style="padding:20px;color:#ff4444;text-align:center;">
                    ❌ Nie udało się wczytać playlisty<br>
                    <small style="color:#888;">${error.message}</small>
                </div>
            `;
        });
}

// ============================================================
// 🔍 WYSZUKIWANIE
// ============================================================
searchInput.addEventListener('input', (e) => {
    renderChannels(e.target.value);
});

// ============================================================
// 🚀 START
// ============================================================
document.addEventListener('DOMContentLoaded', loadPlaylist);
