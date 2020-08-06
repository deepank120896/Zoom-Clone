// Javascript for Front-End

const socket = io("/");
const videoGrid = document.getElementById("video-grid");
// console.log(videoGrid)
const myVideo = document.createElement("video");
myVideo.muted = true;

// create  new peer connection
var peer = new Peer(undefined, {
  path: "/peerjs",
  host: "/",
  port: "3030",
});

let myVideoStream;
// get video and audio output from chrome
navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);

    // answer the incoming user call
    peer.on("call", (call) => {
      call.answer(stream);
      const video = document.createElement("video");
      call.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream);
      });
    });

    // listen to user connected
    socket.on("user-connected", (userId) => {
      connectToNewUser(userId, stream);
    });
  });

// a unique ID gets generated here
peer.on("open", (id) => {
  // emit join room and accept it on server
  socket.emit("join-room", ROOM_ID, id);
});

// when user gets connected
const connectToNewUser = (userId, stream) => {
  //console.log("new user ID connected", userId);
  // add other users' videos, trying to connect
  const call = peer.call(userId, stream);
  const video = document.createElement("video");
  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });
};

//  add video to view
const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  videoGrid.append(video);
};
