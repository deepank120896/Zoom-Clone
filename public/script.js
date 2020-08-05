// Javascript for Front-End

const videoGrid = document.getElementById('video-grid');
console.log(videoGrid)
const myVideo = document.createElement('video');
myVideo.muted =true;

let myVideoStream
// get video and audio output from chrome
navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then(stream => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);
  });


//  add my video to view
const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    })
    videoGrid.append(video);
 }
