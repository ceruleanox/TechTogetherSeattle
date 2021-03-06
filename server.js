const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// set static folder
app.use(express.static(path.join(__dirname, 'public')));


/****************** addition */
const {ExpressPeerServer} = require('peer');

const peerServer = ExpressPeerServer(server, {
    proxied: true,
    debug: true,
    path: '/myapp',
    ssl: {}
});

app.use(peerServer);

app.use(express.static(path.join(__dirname)));

app.get("/", (request, response) => {
    response.sendFile(__dirname + "/index.html");
});

/****************** end addition */


const botName = 'Aida Bot'; // a nod to AI and to Ada Lovelace, the world's first computer programmer

// run when client connects
io.on('connection', socket => {
  // console.log("Establishing new WebSocket connection...");
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    // automatic message upon loading or reloading page
    // n.b. chat loads after the yoga game/competition
    socket.emit(
      "message",
      formatMessage(
        botName,
        "Hope you enjoyed this session with Yoga Remastered! Feel free to stay in the room to chat and connect with one another here."
      )
    );

    // broadcast when a user connects
    // does not broadcast to user entering room
    socket.broadcast
        .to(user.room)
        .emit(
            "message",
            formatMessage(botName, `${user.username} has joined the room`)
    );

    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    });
  });

  // listen for chat message
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });
  
    // run when client disconnects
    socket.on("disconnect", () => {
      const user = userLeave(socket.id);

      if (user){
        io.to(user.room)
        .emit("message", formatMessage(botName, `${user.username} has left the room`));

        io.to(user.room).emit('roomUsers', {
          room: user.room,
          users: getRoomUsers(user.room)
        });
      }
    });
  });

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));