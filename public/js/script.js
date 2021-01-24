const play_btn = document.querySelector(".play-btn");
const chat_btn = document.querySelector(".chat-btn");
const info_chat = document.querySelector(".chat-container");
const info_chat_btn = document.querySelector(".chat-btn-container");
const info_play_btn = document.querySelector(".play-btn-container");

play_btn.onclick = ()=>{
    play_btn.remove("activePlay");
    info_chat_btn.classList.add("activeChat");
}

chat_btn.onclick = ()=>{
    info_chat.classList.add("activeInfo");
}

/* global Peer */


/**
 * Gets the local audio stream of the current caller
 * @param callbacks - an object to set the success/error behaviour
 * @returns {void}
 */

/*
function getLocalStream() {
    navigator.mediaDevices.getUserMedia({video: false, audio: true}).then( stream => {
        window.localStream = stream;
        window.localAudio.srcObject = stream;
        window.localAudio.autoplay = true;
    }).catch( err => {
        console.log("u got an error:" + err)
    });
}

getLocalStream();
*/