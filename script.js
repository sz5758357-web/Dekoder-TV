// 📺 LISTA KANAŁÓW – wpisz tutaj swoje działające linki M3U
// ============================================================
const PLAYLIST = `https://iptv-org.github.io/iptv/countries/pl.m3u`;

#EXTINF:-1 group-title="TVP",TVP 1 HD
https://ec06-krk3.cache.orange.pl/dai4/org1/vb/104/tvp1hd/index.m3u8

#EXTINF:-1 group-title="TVP",TVP 2 HD
https://streams.polskieradio.pl:8443/tvp2.m3u8

#EXTINF:-1 group-title="TVP",TVP Info
https://dash4.antik.sk/live/test_tvp_info/playlist.m3u8

#EXTINF:-1 group-title="TVP",TVP Sport
https://streams.polskieradio.pl:8443/tvp_sport.m3u8

#EXTINF:-1 group-title="TVP",TVP Kultura
https://streams.polskieradio.pl:8443/tvp_kultura.m3u8

#EXTINF:-1 group-title="TVP",TVP Seriale
https://streams.polskieradio.pl:8443/tvp_seriale.m3u8

#EXTINF:-1 group-title="Muzyka",4Fun TV
https://stream.4fun.tv:8888/hls/4f_high/index.m3u8

#EXTINF:-1 group-title="Muzyka",4Fun Kids
https://stream.4fun.tv:8889/hls/4fk_high/index.m3u8

#EXTINF:-1 group-title="Informacje",Telewizja Republika
https://stream.telewizjarepublika.pl/live/republika.m3u8

#EXTINF:-1 group-title="Informacje",wPolsce.pl
https://wpolsce.pl/live.m3u8

# ============================================================
# 📌 DODAJ TUTAJ SWOJE WŁASNE KANAŁY
# Wzór:
# #EXTINF:-1 group-title="NAZWA_GRUPY",NAZWA_KANAŁU
# https://link.do.strumienia.m3u8
# ============================================================
`;

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
            current.url = line;
            result.push(current);
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

// Inicjalizacja
function init() {
    channels = parsePlaylist(PLAYLIST);
    renderChannels();
    
    // Wyszukiwanie
    searchInput.addEventListener('input', (e) => {
        renderChannels(e.target.value);
    });

    // Automatyczne odtworzenie pierwszego kanału
    if (channels.length > 0) {
        playChannel(channels[0]);
    }
}

// Start
document.addEventListener('DOMContentLoaded', init);
