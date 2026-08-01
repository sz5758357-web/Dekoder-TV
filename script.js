// ============================================================
// 📺 URL DO PLAYLISTY Z POLSKIMI KANAŁAMI
// ============================================================
const PLAYLIST_URL = 'https://raw.githubusercontent.com/iptv-org/iptv/master/streams/pl.m3u';

// ============================================================
// 🚀 RESZTA KODU – NIE MUSISZ TEGO RUSZAĆ
// ============================================================

let channels = [];
let currentChannel = null;
let hls = null;
const video = document.getElementById('videoPlayer');
const channelList = document.getElementById('channel-list');
const searchInput = document.getElementById('searchInput');
const noChannelMsg = document.getElementById('no-channel-message');

// Parsowanie playlisty M3U
function parsePlaylist(data) {
    const lines = data.split('\n');
    const result = [];
    let current = null;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith('#EXTINF:')) {
            const match = line.match(/#EXTINF:-?\d+(?:\s+group-title="([^"]*)")?,\s*(.*)/);
            if (match) {
                current = {
                    group: match[1] || 'Inne',
                    name: match[2] || 'Nieznany'
                };
            }
        } else if (line && !line.startsWith('#') && current) {
            // Sprawdź, czy to URL (zawiera http:// lub https://)
            if (line.startsWith('http://') || line.startsWith('https://')) {
                current.url = line;
                result.push(current);
            }
            current = null;
        }
    }
    return result;
}

// Wyświetlanie listy kanałów
function renderChannels(filter = '') {
    channelList.innerHTML = '';
    const filtered = channels.filter(ch => 
        ch.name.toLowerCase().includes(filter.toLowerCase()) ||
        ch.group.toLowerCase().includes(filter.toLowerCase())
    );

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
            <span>${ch.name}</span>
            <span class="group-badge">${ch.group}</span>
        `;
        div.addEventListener('click', () => playChannel(ch));
        channelList.appendChild(div);
    });
}

// Odtwarzanie kanału
function playChannel(channel) {
    currentChannel = channel;
    
    // Zatrzymaj poprzednie odtwarzanie
    if (hls) {
        hls.destroy();
        hls = null;
    }
    video.style.display = 'block';
    noChannelMsg.style.display = 'none';

    // Jeśli to strumień HLS (.m3u8)
    if (channel.url.includes('.m3u8') || channel.url.includes('m3u8')) {
        if (Hls.isSupported()) {
            hls = new Hls({
                enableWorker: true,
                lowLatencyMode: true,
            });
            hls.loadSource(channel.url);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                video.play().catch(() => {});
            });
            hls.on(Hls.Events.ERROR, (e, data) => {
                if (data.fatal) {
                    console.error('Błąd odtwarzania:', data);
                }
            });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            // Dla Safari (native HLS)
            video.src = channel.url;
            video.play().catch(() => {});
        }
    } else {
        // Dla zwykłych strumieni (MP4, itp.)
        video.src = channel.url;
        video.play().catch(() => {});
    }

    renderChannels(searchInput.value);
}

// Wczytanie playlisty z URL
function loadPlaylistFromUrl() {
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
            renderChannels();
            if (channels.length > 0) {
                playChannel(channels[0]);
            } else {
                channelList.innerHTML = '<div style="padding:20px;color:#ff4444;text-align:center;">❌ Nie znaleziono kanałów w playliście</div>';
            }
        })
        .catch(error => {
            console.error('Błąd ładowania playlisty:', error);
            channelList.innerHTML = `<div style="padding:20px;color:#ff4444;text-align:center;">❌ Nie udało się wczytać playlisty: ${error.message}</div>`;
        });
}

// Inicjalizacja
document.addEventListener('DOMContentLoaded', loadPlaylistFromUrl);

// Wyszukiwanie
searchInput.addEventListener('input', (e) => {
    renderChannels(e.target.value);
});
