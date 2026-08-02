const input = document.getElementById("m3uFile");
const select = document.getElementById("channels");
const player = document.getElementById("player");
const nameBox = document.getElementById("channelName");
const search = document.getElementById("search");

let channels = [];


input.addEventListener("change", e=>{

const file=e.target.files[0];

const reader=new FileReader();

reader.onload=()=>{
parseM3U(reader.result);
}

reader.readAsText(file);

});


function parseM3U(text){

channels=[];

let lines=text.split("\n");


for(let i=0;i<lines.length;i++){

if(lines[i].startsWith("#EXTINF")){

let name=lines[i].split(",")[1].trim();
let url=lines[i+1].trim();

channels.push({
name:name,
url:url
});

}

}


showChannels(channels);


if(channels.length){
playChannel(0);
}

}



function showChannels(list){

select.innerHTML="";

list.forEach((c,index)=>{

let option=document.createElement("option");

option.value=index;
option.textContent=c.name;

select.appendChild(option);

});

}



function playChannel(i){

let c=channels[i];

player.src=c.url;
nameBox.textContent=c.name;

}



select.addEventListener("change",()=>{

playChannel(select.value);

});



search.addEventListener("input",()=>{

let value=search.value.toLowerCase();

let filtered=channels.filter(c=>
c.name.toLowerCase().includes(value)
);

showChannels(filtered);

});
