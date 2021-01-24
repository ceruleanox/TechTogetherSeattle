const roomForm = document.getElementById('room-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const userLeaderboard = document.getElementById('leaderboard');

// get username and room from URL parameters

const queryString = window.location.search;
console.log(queryString);

const urlParams = new URLSearchParams(queryString);
// ?username=name&room=Gaming

//const username = urlParams.get('username'); // username
//const room = urlParams.get('room'); // room

const { username, room } = 
Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

/***********SET UP VIDEO***************/

const videoGrid = document.getElementById('video-grid');

/*
const peer = new Peer(username); 

const conn = peer.connect('yes');
conn.on('open', () => {
  conn.send('hi!');
});

peer.on('connection', (conn) => {
  conn.on('data', (data) => {
    // Will print 'hi!'
    console.log(data);
  });
  conn.on('open', () => {
    conn.send('hello!');
  });
});

navigator.mediaDevices.getUserMedia({video: true, audio: true}, (stream) => {
  const call = peer.call('yes', stream);
  call.on('stream', (remoteStream) => {
    // Show stream in some <video> element.
  });
}, (err) => {
  console.error('Failed to get local stream', err);
});

peer.on('call', (call) => {
  navigator.mediaDevices.getUserMedia({video: true, audio: true}, (stream) => {
    call.answer(stream); // Answer the call with an A/V stream.
    call.on('stream', (remoteStream) => {
      // Show stream in some <video> element.
    });
  }, (err) => {
    console.error('Failed to get local stream', err);
  });
});
*/

/*
// create connection to peer server
const myPeer = new Peer(username, {
    host: '/',
    port: '3001'
});

var conn = myPeer.connect('yes');

myPeer.on('open', id => {
    socket.emit('join-room', { username, room })
});
*/

const myVideo = document.createElement('video');
myVideo.muted = true;
const peerVideo = document.createElement('video');

const peers = {};

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    addVideoStream(myVideo, stream);
    addVideoStream(peerVideo, stream);
});

/*
myPeer.on('call', call => {
    call.answer(stream); 
});
*/

function addVideoStream(video, stream) {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play()
    });
    videoGrid.append(video);
}

/*
function connectToNewUser(userId, stream) {
    const call = myPeer.call(userId, stream);
    const video = document.createElement('video');
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
    });
    call.on('close', () => {
        video.remove();
    });
}
*/

/***********************************/

var socket = io();

// join chatroom
socket.emit('joinRoom', { username, room });

// get room and users
socket.on('roomUsers', ({room, users}) => {
    outputRoomName(room);
    outputUsers(users);
});

// message from server
socket.on('message', message => {
    console.log(message);
    outputMessage(message);

    // scroll down to latest chat
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// submit a message in chat
roomForm.addEventListener('submit', e => {
    e.preventDefault();
    
    // get message text
    let msg = e.target.elements.msg.value;

    msg = msg.trim();

    if (!msg) {
        return false;
    }
    
    // broadcast message to server
    socket.emit('chatMessage', msg);

    // clear input text for next input message and scroll down to latest message
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

// output message to DOM
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message'); 
    /*
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
                     <p class="text">
                        ${message.text}
                     </p>`;
    */
    const p = document.createElement('p');
    p.classList.add('meta');
    p.innerText = message.username;
    p.innerHTML += ` <span>${message.time}</span>`;
    div.appendChild(p);
    const para = document.createElement("p");
    para.classList.add("text");
    para.innerText = message.text;
    div.appendChild(para);
    document.querySelector('.chat-messages').appendChild(div);
}

// add room name to DOM
function outputRoomName(room) {
    roomName.innerText = room;
}

// add users to DOM
function outputUsers(users) {
   userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
   `;
   userLeaderboard.innerHTML = `
   ${users.map(user => `<li>${user.username}</li>`).join('')}
  `;
}
