const select = document.getElementById("channels");
const player = document.getElementById("player");
const nameBox = document.getElementById("channelName");
const search = document.getElementById("search");
const input = document.getElementById("m3uFile");

let channels = [];

// Domacza lista M3U wklejana bezpośrednio do kodu
const defaultM3U = `#EXTM3U
#EXTINF:-1,13 Ulica HD
http://185.236.229.62:9981/play/a03o
#EXTINF:-1,2M MONDE HD
http://185.236.229.62:9981/play/a08r
#EXTINF:-1,2M Monde
http://185.236.229.62:9981/play/a06p
#EXTINF:-1,4Fun Dance
http://185.236.229.62:9981/play/a020
#EXTINF:-1,4Fun Kids
http://185.236.229.62:9981/play/a01z
#EXTINF:-1,4Fun.TV
http://185.236.229.62:9981/play/a01y
#EXTINF:-1,8 TV RU
http://185.236.229.62:9981/play/a08g
#EXTINF:-1,ACISPORT TV
http://185.236.229.62:9981/play/a08u
#EXTINF:-1,ADVENTURE HD
http://185.236.229.62:9981/play/a049
#EXTINF:-1,AMC
http://185.236.229.62:9981/play/a05g
#EXTINF:-1,ANTENA
http://185.236.229.62:9981/play/a04h
#EXTINF:-1,ANTENA
http://185.236.229.62:9981/play/a047
#EXTINF:-1,AXN
http://185.236.229.62:9981/play/a07a
#EXTINF:-1,AXN Black
http://185.236.229.62:9981/play/a075
#EXTINF:-1,AXN HD
http://185.236.229.62:9981/play/a07s
#EXTINF:-1,AXN SPIN HD
http://185.236.229.62:9981/play/a044
#EXTINF:-1,AXN White
http://185.236.229.62:9981/play/a074
#EXTINF:-1,Active Family
http://185.236.229.62:9981/play/a04a
#EXTINF:-1,Al Aoula Inter
http://185.236.229.62:9981/play/a084
#EXTINF:-1,Al Aoula Inter HD
http://185.236.229.62:9981/play/a082
#EXTINF:-1,Al Jazeera HD
http://185.236.229.62:9981/play/a08s
#EXTINF:-1,Al Maghribia HD
http://185.236.229.62:9981/play/a080
#EXTINF:-1,Ale kino+ HD
http://185.236.229.62:9981/play/a056
#EXTINF:-1,Arryadia HD
http://185.236.229.62:9981/play/a086
#EXTINF:-1,Assadissa HD
http://185.236.229.62:9981/play/a085
#EXTINF:-1,Athaqafia HD
http://185.236.229.62:9981/play/a083
#EXTINF:-1,BBC Brit
http://185.236.229.62:9981/play/a06r
#EXTINF:-1,BBC CBeebies
http://185.236.229.62:9981/play/a06s
#EXTINF:-1,BBC Earth HD
http://185.236.229.62:9981/play/a02o
#EXTINF:-1,BBC FIRST
http://185.236.229.62:9981/play/a02n
#EXTINF:-1,BBC Lifestyle HD
http://185.236.229.62:9981/play/a06t
#EXTINF:-1,BIKE
http://185.236.229.62:9981/play/a04n
#EXTINF:-1,BIZNES24 HD
http://185.236.229.62:9981/play/a02s
#EXTINF:-1,Baby TV
http://185.236.229.62:9981/play/a038
#EXTINF:-1,ByoBlu
http://185.236.229.62:9981/play/a04v
#EXTINF:-1,CANAL+ DOKUMENT HD
http://185.236.229.62:9981/play/a059
#EXTINF:-1,CANAL+ DOMO HD
http://185.236.229.62:9981/play/a05u
#EXTINF:-1,CANAL+ FAMILY HD
http://185.236.229.62:9981/play/a04z
#EXTINF:-1,CANAL+ FILM HD
http://185.236.229.62:9981/play/a04y
#EXTINF:-1,CANAL+ FILM HD
http://185.236.229.62:9981/play/a057
#EXTINF:-1,CANAL+ KUCHNIA
http://185.236.229.62:9981/play/a053
#EXTINF:-1,CANAL+ NOW
http://185.236.229.62:9981/play/a045
#EXTINF:-1,CANAL+ NOW
http://185.236.229.62:9981/play/a04f
#EXTINF:-1,CANAL+ PREMIUM HD
http://185.236.229.62:9981/play/a04b
#EXTINF:-1,CANAL+ SERIALE HD
http://185.236.229.62:9981/play/a058
#EXTINF:-1,CANAL+ SERIALE HD
http://185.236.229.62:9981/play/a054
#EXTINF:-1,CANAL+ SPORT 2 HD
http://185.236.229.62:9981/play/a05t
#EXTINF:-1,CANAL+ SPORT 3 HD
http://185.236.229.62:9981/play/a05e
#EXTINF:-1,CANAL+ SPORT 3 HD
http://185.236.229.62:9981/play/a05n
#EXTINF:-1,CANAL+ SPORT 3 HD
http://185.236.229.62:9981/play/a05q
#EXTINF:-1,CANAL+ SPORT 4 HD
http://185.236.229.62:9981/play/a05f
#EXTINF:-1,CANAL+ SPORT 4 HD
http://185.236.229.62:9981/play/a05o
#EXTINF:-1,CANAL+ SPORT 4 HD
http://185.236.229.62:9981/play/a05r
#EXTINF:-1,CANAL+ SPORT 5 HD
http://185.236.229.62:9981/play/a05h
#EXTINF:-1,CANAL+ SPORT HD
http://185.236.229.62:9981/play/a04c
#EXTINF:-1,CANAL+1 HD
http://185.236.229.62:9981/play/a05s
#EXTINF:-1,CBS Europa HD
http://185.236.229.62:9981/play/a06i
#EXTINF:-1,CBS Reality HD
http://185.236.229.62:9981/play/a02v
#EXTINF:-1,CGTN
http://185.236.229.62:9981/play/a08b
#EXTINF:-1,CI Polsat HD
http://185.236.229.62:9981/play/a07w
#EXTINF:-1,CNBC HD
http://185.236.229.62:9981/play/a04o
#EXTINF:-1,CNN Europe HD
http://185.236.229.62:9981/play/a076
#EXTINF:-1,Can TV HD
http://185.236.229.62:9981/play/a08o
#EXTINF:-1,Cartoon Network HD
http://185.236.229.62:9981/play/a06e
#EXTINF:-1,Cartoonito
http://185.236.229.62:9981/play/a02c
#EXTINF:-1,Cinemax 2 HD
http://185.236.229.62:9981/play/a07r
#EXTINF:-1,Cinemax HD
http://185.236.229.62:9981/play/a05p
#EXTINF:-1,Cinemax HD
http://185.236.229.62:9981/play/a05m
#EXTINF:-1,Cinemax HD
http://185.236.229.62:9981/play/a05d
#EXTINF:-1,Class TV Moda
http://185.236.229.62:9981/play/a04s
#EXTINF:-1,Comedy Central HD
http://185.236.229.62:9981/play/a068
#EXTINF:-1,Da Vinci
http://185.236.229.62:9981/play/a024
#EXTINF:-1,Dim TV
http://185.236.229.62:9981/play/a04x
#EXTINF:-1,Disco Polo Music
http://185.236.229.62:9981/play/a078
#EXTINF:-1,Disney Channel HD
http://185.236.229.62:9981/play/a07d
#EXTINF:-1,Disney Junior
http://185.236.229.62:9981/play/a06n
#EXTINF:-1,Disney XD
http://185.236.229.62:9981/play/a07c
#EXTINF:-1,Dla Ciebie TV
http://185.236.229.62:9981/play/a04u
#EXTINF:-1,E! Entertainment
http://185.236.229.62:9981/play/a03j
#EXTINF:-1,ELEVEN SPORTS 4 HD
http://185.236.229.62:9981/play/a046
#EXTINF:-1,EURONEWS ITALIAN SD PAL 1.8
http://185.236.229.62:9981/play/a06q
#EXTINF:-1,Eko TV
http://185.236.229.62:9981/play/a08h
#EXTINF:-1,Eleven Sports 1 4K
http://185.236.229.62:9981/play/a03t
#EXTINF:-1,Eleven Sports 1 HD
http://185.236.229.62:9981/play/a05w
#EXTINF:-1,Eleven Sports 2 HD
http://185.236.229.62:9981/play/a05y
#EXTINF:-1,Eleven Sports 3 HD
http://185.236.229.62:9981/play/a061
#EXTINF:-1,Epic Drama HD
http://185.236.229.62:9981/play/a029
#EXTINF:-1,Eska Rock
http://185.236.229.62:9981/play/a08q
#EXTINF:-1,Eska TV Extra
http://185.236.229.62:9981/play/a021
#EXTINF:-1,Eska TV HD
http://185.236.229.62:9981/play/a02f
#EXTINF:-1,Espresso TV
http://185.236.229.62:9981/play/a04w
#EXTINF:-1,Extreme Sports HD
http://185.236.229.62:9981/play/a06h
#EXTINF:-1,FX HD
http://185.236.229.62:9981/play/a07u
#EXTINF:-1,Fightbox HD
http://185.236.229.62:9981/play/a03n
#EXTINF:-1,Fightklub HD
http://185.236.229.62:9981/play/a02l
#EXTINF:-1,FilmBox Action
http://185.236.229.62:9981/play/a033
#EXTINF:-1,FilmBox Extra HD
http://185.236.229.62:9981/play/a036
#EXTINF:-1,FilmBox Family
http://185.236.229.62:9981/play/a032
#EXTINF:-1,FilmBox Family
http://185.236.229.62:9981/play/a037
#EXTINF:-1,Filmbox Arthouse
http://185.236.229.62:9981/play/a028
#EXTINF:-1,Filmbox Premium HD
http://185.236.229.62:9981/play/a02x
#EXTINF:-1,Fokus TV
http://185.236.229.62:9981/play/a02g
#EXTINF:-1,Food Network HD
http://185.236.229.62:9981/play/a073
#EXTINF:-1,Fx Comedy HD
http://185.236.229.62:9981/play/a07t
#EXTINF:-1,Golf Channel
http://185.236.229.62:9981/play/a03m
#EXTINF:-1,HBO HD
http://185.236.229.62:9981/play/a06k
#EXTINF:-1,HBO2 HD
http://185.236.229.62:9981/play/a05x
#EXTINF:-1,HBO3 HD
http://185.236.229.62:9981/play/a062
#EXTINF:-1,HOME TV
http://185.236.229.62:9981/play/a048
#EXTINF:-1,History 2 HD
http://185.236.229.62:9981/play/a03l
#EXTINF:-1,History HD
http://185.236.229.62:9981/play/a07v
#EXTINF:-1,Horse TV HD
http://185.236.229.62:9981/play/a04r
#EXTINF:-1,Iran e Aryaee
http://185.236.229.62:9981/play/a08p
#EXTINF:-1,Italian Fishing TV
http://185.236.229.62:9981/play/a08t
#EXTINF:-1,Jin TV
http://185.236.229.62:9981/play/a08n
#EXTINF:-1,KINO POLSKA HD
http://185.236.229.62:9981/play/a05v
#EXTINF:-1,KaravanTV
http://185.236.229.62:9981/play/a08l
#EXTINF:-1,Kino Polska Muzyka
http://185.236.229.62:9981/play/a030
#EXTINF:-1,Kino TV HD
http://185.236.229.62:9981/play/a031
#EXTINF:-1,LN24SA
http://185.236.229.62:9981/play/a04t
#EXTINF:-1,Laayoune TV HD
http://185.236.229.62:9981/play/a081
#EXTINF:-1,MTV 00s
http://185.236.229.62:9981/play/a066
#EXTINF:-1,MTV 90s
http://185.236.229.62:9981/play/a07f
#EXTINF:-1,MTV Live HD
http://185.236.229.62:9981/play/a063
#EXTINF:-1,MTV Polska HD
http://185.236.229.62:9981/play/a06b
#EXTINF:-1,Metro HD
http://185.236.229.62:9981/play/a06z
#EXTINF:-1,Milady
http://185.236.229.62:9981/play/a08i
#EXTINF:-1,MiniMini+ HD
http://185.236.229.62:9981/play/a04e
#EXTINF:-1,Motowizja HD
http://185.236.229.62:9981/play/a02r
#EXTINF:-1,NATIONAL GEO HD
http://185.236.229.62:9981/play/a04d
#EXTINF:-1,NOVELAS+
http://185.236.229.62:9981/play/a05a
#EXTINF:-1,NOVELAS+
http://185.236.229.62:9981/play/a05k
#EXTINF:-1,NUTA GOLD
http://185.236.229.62:9981/play/a04k
#EXTINF:-1,NUTA TV
http://185.236.229.62:9981/play/a04j
#EXTINF:-1,Nat Geo People HD
http://185.236.229.62:9981/play/a06f
#EXTINF:-1,Nataly
http://185.236.229.62:9981/play/a08j
#EXTINF:-1,National Geographic Wild HD
http://185.236.229.62:9981/play/a05z
#EXTINF:-1,Nick Jr
http://185.236.229.62:9981/play/a065
#EXTINF:-1,Nick Music
http://185.236.229.62:9981/play/a064
#EXTINF:-1,Nickelodeon
http://185.236.229.62:9981/play/a067
#EXTINF:-1,Nicktoons HD
http://185.236.229.62:9981/play/a06a
#EXTINF:-1,Noursat English
http://185.236.229.62:9981/play/a08v
#EXTINF:-1,Nowa TV
http://185.236.229.62:9981/play/a02h
#EXTINF:-1,POWER TV
http://185.236.229.62:9981/play/a04i
#EXTINF:-1,Paramount Network Polska
http://185.236.229.62:9981/play/a069
#EXTINF:-1,Planete+ HD
http://185.236.229.62:9981/play/a052
#EXTINF:-1,Polo TV
http://185.236.229.62:9981/play/a02e
#EXTINF:-1,Polsat 2 HD 
http://185.236.229.62:9981/play/a042
#EXTINF:-1,Polsat Cafe HD
http://185.236.229.62:9981/play/a03z
#EXTINF:-1,Polsat Comedy Central Extra
http://185.236.229.62:9981/play/a06c
#EXTINF:-1,Polsat Doku HD
http://185.236.229.62:9981/play/a07z
#EXTINF:-1,Polsat Film HD
http://185.236.229.62:9981/play/a040
#EXTINF:-1,Polsat Games
http://185.236.229.62:9981/play/a025
#EXTINF:-1,Polsat HD
http://185.236.229.62:9981/play/a03v
#EXTINF:-1,Polsat Jim Jam
http://185.236.229.62:9981/play/a07e
#EXTINF:-1,Polsat Music HD
http://185.236.229.62:9981/play/a02b
#EXTINF:-1,Polsat News 2
http://185.236.229.62:9981/play/a03u
#EXTINF:-1,Polsat News HD
http://185.236.229.62:9981/play/a041
#EXTINF:-1,Polsat News Polityka HD
http://185.236.229.62:9981/play/a07h
#EXTINF:-1,Polsat Play HD
http://185.236.229.62:9981/play/a03w
#EXTINF:-1,Polsat Rodzina HD
http://185.236.229.62:9981/play/a079
#EXTINF:-1,Polsat Seriale HD
http://185.236.229.62:9981/play/a07b
#EXTINF:-1,Polsat Sport Extra HD
http://185.236.229.62:9981/play/a07q
#EXTINF:-1,Polsat Sport Fight HD
http://185.236.229.62:9981/play/a06l
#EXTINF:-1,Polsat Sport HD
http://185.236.229.62:9981/play/a07n
#EXTINF:-1,Polsat Sport News HD
http://185.236.229.62:9981/play/a06m
#EXTINF:-1,Polsat Sport Premium 1
http://185.236.229.62:9981/play/a03r
#EXTINF:-1,Polsat Sport Premium 2
http://185.236.229.62:9981/play/a03s
#EXTINF:-1,Polsat Sport Premium PPV3
http://185.236.229.62:9981/play/a03p
#EXTINF:-1,Polsat Sport Premium PPV4
http://185.236.229.62:9981/play/a03q
#EXTINF:-1,Polsat Sport Premium PPV5
http://185.236.229.62:9981/play/a07x
#EXTINF:-1,Polsat Sport Premium PPV6
http://185.236.229.62:9981/play/a07y
#EXTINF:-1,Polsat Viasat Explore HD
http://185.236.229.62:9981/play/a07i
#EXTINF:-1,Polsat Viasat History HD
http://185.236.229.62:9981/play/a07o
#EXTINF:-1,Polsat Viasat Nature HD
http://185.236.229.62:9981/play/a06g
#EXTINF:-1,Provence
http://185.236.229.62:9981/play/a08k
#EXTINF:-1,Puls 2 HD
http://185.236.229.62:9981/play/a02y
#EXTINF:-1,Red Carpet TV
http://185.236.229.62:9981/play/a02q
#EXTINF:-1,Romance TV
http://185.236.229.62:9981/play/a05j
#EXTINF:-1,SOYUZ
http://185.236.229.62:9981/play/a08f
#EXTINF:-1,SRS - TV
http://185.236.229.62:9981/play/a08w
#EXTINF:-1,STARS.TV
http://185.236.229.62:9981/play/a01x
#EXTINF:-1,SciFi HD
http://185.236.229.62:9981/play/a03k
#EXTINF:-1,Sportklub HD
http://185.236.229.62:9981/play/a02k
#EXTINF:-1,Stopklatka
http://185.236.229.62:9981/play/a023
#EXTINF:-1,StudioMed TV HD
http://185.236.229.62:9981/play/a050
#EXTINF:-1,Sundance HD
http://185.236.229.62:9981/play/a03i
#EXTINF:-1,Super Polsat HD
http://185.236.229.62:9981/play/a043
#EXTINF:-1,Super!
http://185.236.229.62:9981/play/a08y
#EXTINF:-1,THT
http://185.236.229.62:9981/play/a08a
#EXTINF:-1,TTV HD
http://185.236.229.62:9981/play/a071
#EXTINF:-1,TV CORAN
http://185.236.229.62:9981/play/a088
#EXTINF:-1,TV Okazje
http://185.236.229.62:9981/play/a07m
#EXTINF:-1,TV Okazje
http://185.236.229.62:9981/play/a07l
#EXTINF:-1,TV PULS HD
http://185.236.229.62:9981/play/a034
#EXTINF:-1,TV Republika
http://185.236.229.62:9981/play/a027
#EXTINF:-1,TV TAMAZIGHT
http://185.236.229.62:9981/play/a089
#EXTINF:-1,TV4 HD
http://185.236.229.62:9981/play/a03x
#EXTINF:-1,TV6 HD
http://185.236.229.62:9981/play/a03y
#EXTINF:-1,TVC
http://185.236.229.62:9981/play/a04l
#EXTINF:-1,TVN 24 HD
http://185.236.229.62:9981/play/a06x
#EXTINF:-1,TVN 7 HD
http://185.236.229.62:9981/play/a06y
#EXTINF:-1,TVN Fabula
http://185.236.229.62:9981/play/a070
#EXTINF:-1,TVN HD
http://185.236.229.62:9981/play/a06u
#EXTINF:-1,TVN STYLE HD
http://185.236.229.62:9981/play/a06v
#EXTINF:-1,TVN TURBO HD
http://185.236.229.62:9981/play/a06w
#EXTINF:-1,TVP 1 HD
http://185.236.229.62:9981/play/a05i
#EXTINF:-1,TVP 2 HD
http://185.236.229.62:9981/play/a07p
#EXTINF:-1,TVP 3
http://185.236.229.62:9981/play/a060
#EXTINF:-1,TVP ABC
http://185.236.229.62:9981/play/a02z
#EXTINF:-1,TVP Dokument HD
http://185.236.229.62:9981/play/a05b
#EXTINF:-1,TVP HD
http://185.236.229.62:9981/play/a02i
#EXTINF:-1,TVP Historia
http://185.236.229.62:9981/play/a035
#EXTINF:-1,TVP INFO HD
http://185.236.229.62:9981/play/a02j
#EXTINF:-1,TVP Kultura HD
http://185.236.229.62:9981/play/a02t
#EXTINF:-1,TVP Polonia
http://185.236.229.62:9981/file/play/a08m
#EXTINF:-1,TVP Rozrywka
http://185.236.229.62:9981/play/a026
#EXTINF:-1,TVP SERIALE
http://185.236.229.62:9981/play/a02w
#EXTINF:-1,TVP Sport HD
http://185.236.229.62:9981/play/a05l
#EXTINF:-1,TVP Sport HD
http://185.236.229.62:9981/play/a05c
#EXTINF:-1,TVRUS
http://185.236.229.62:9981/play/a08c
#EXTINF:-1,TVRUS Plus
http://185.236.229.62:9981/play/a08d
#EXTINF:-1,TVS
http://185.236.229.62:9981/play/a02p
#EXTINF:-1,Tamazight HD
http://185.236.229.62:9981/play/a087
#EXTINF:-1,TeenNick
http://185.236.229.62:9981/play/a055
#EXTINF:-1,Travel Channel HD
http://185.236.229.62:9981/play/a072
#EXTINF:-1,UA WORLD TV
http://185.236.229.62:9981/play/a08e
#EXTINF:-1,UATV
http://185.236.229.62:9981/play/a04p
#EXTINF:-1,VOX Music TV
http://185.236.229.62:9981/play/a02d
#EXTINF:-1,Vatican Media Europa
http://185.236.229.62:9981/play/a06o
#EXTINF:-1,WP
http://185.236.229.62:9981/play/a02u
#EXTINF:-1,Warner TV
http://185.236.229.62:9981/play/a06d
#EXTINF:-1,Wydarzenia 24 HD
http://185.236.229.62:9981/play/a06j
#EXTINF:-1,Zoom TV
http://185.236.229.62:9981/play/a02a
#EXTINF:-1,teleTOON+ HD
http://185.236.229.62:9981/play/a051
#EXTINF:-1,wPolsce.pl
http://185.236.229.62:9981/play/a022`;

// Obsługa wczytywania pliku z dysku (jeśli ktoś nadal będzie chciał wgrać własny)
input.addEventListener("change", e => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
        parseM3U(reader.result);
    };
    reader.readAsText(file);
});

function parseM3U(text) {
    channels = [];
    let lines = text.split("\n");

    for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith("#EXTINF")) {
            let parts = lines[i].split(",");
            let name = parts[1] ? parts[1].trim() : "Kanał";
            let url = lines[i + 1] ? lines[i + 1].trim() : "";

            if (url) {
                channels.push({
                    name: name,
                    url: url
                });
            }
        }
    }

    showChannels(channels);

    if (channels.length) {
        playChannel(0);
    }
}

function showChannels(list) {
    select.innerHTML = "";
    list.forEach((c, index) => {
        let option = document.createElement("option");
        option.value = index;
        option.textContent = c.name;
        select.appendChild(option);
    });
}

function playChannel(i) {
    let c = channels[i];
    if (c) {
        player.src = c.url;
        nameBox.textContent = c.name;
        player.play().catch(e => console.log("Autoplay zablokowany przez przeglądarkę:", e));
    }
}

select.addEventListener("change", () => {
    playChannel(select.value);
});

search.addEventListener("input", () => {
    let value = search.value.toLowerCase();
    let filtered = channels.filter(c =>
        c.name.toLowerCase().includes(value)
    );
    showChannels(filtered);
});

function clock() {
    let d = new Date();
    document.getElementById("clock").innerHTML = d.toLocaleTimeString("pl-PL");
}

setInterval(clock, 1000);
clock();

document.getElementById("fullscreen").onclick = function() {
    let video = document.getElementById("player");
    if (video.requestFullscreen) {
        video.requestFullscreen();
    }
};

// Automatyczne załadowanie domyślnej listy od razu po uruchomieniu skryptu
parseM3U(defaultM3U);
