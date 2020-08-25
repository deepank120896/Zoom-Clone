const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const { v4: uuidv4 } = require("uuid");
const { ExpressPeerServer } = require("peer");
const peerServer = ExpressPeerServer(server, {
  debug: true,
});

app.set("view engine", "ejs");
app.use(express.static("public"));

// specify url for peer server
app.use('/peerjs',peerServer);


app.get("/", (req, res) => {
  // res.status(200).send("Hello There ...");
  //res.render('room');
  res.redirect(`/${uuidv4()}`);
});

app.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room });
});

// create a connection using socket
io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    // join room by roomId
    socket.join(roomId);
    // when someone joins the room
    socket.to(roomId).broadcast.emit('user-connected', userId);
    // console.log("Joined the Room !!!");

    // listen and recieve message sent from other user and send back to same room
    socket.on('message', message => {
      io.to(roomId).emit('createMessage', message)
    })
  })
})

server.listen(process.env.PORT||3030);
