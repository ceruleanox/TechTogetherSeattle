var video = document.getElementById("vid");
var video_btn = document.getElementById("demo");

function Play() {
    if(video.paused) {
        video.play();
        video_btn.style.background = "url(../images/play.png) no-repeat";
    } else {
        video.pause();
        video_btn.style.background = "url(../images/pause.png) no-repeat"
    }
}


function swapVideo() {
    player.src = this.getAttribute("data-video-url");
    player.load();
    player.play();
}

var videoPlayButtons = document.querySelectorAll("button"),
    player = document.getElementById("player");

for (var i=0; i<videoPlayButtons.length; i++){
    videoPlayButtons[i].addEventListener('click', swapVideo);
}