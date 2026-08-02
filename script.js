const input = document.getElementById("m3uFile");
const select = document.getElementById("channels");
const player = document.getElementById("player");

let channels = [];

input.addEventListener("change", e => {
    const file = e.target.files[0];

    const reader = new FileReader();

    reader.onload = () => {
        parseM3U(reader.result);
    };

    reader.readAsText(file);
});

function parseM3U(text){

    channels = [];
    const lines = text.split("\n");

    for(let i=0;i<lines.length;i++){

        if(lines[i].startsWith("#EXTINF")){
            const name = lines[i].split(",")[1].trim();
            const url = lines[i+1].trim();

            channels.push({name,url});
        }
    }

    select.innerHTML="";

    channels.forEach((c,index)=>{
        const option=document.createElement("option");
        option.value=index;
        option.textContent=c.name;
        select.appendChild(option);
    });

    if(channels.length){
        player.src=channels[0].url;
    }
}

select.addEventListener("change",()=>{
    player.src=channels[select.value].url;
});
