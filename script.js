// Chat functionality
const sendBtn = document.getElementById("send-btn");
const messageInput = document.getElementById("message-input");
const chatBody = document.getElementById("chat-body");

sendBtn.addEventListener("click", () => {
  const message = messageInput.value.trim();
  if (message !== "") {
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("message", "sent");
    msgDiv.textContent = message;
    chatBody.appendChild(msgDiv);
    messageInput.value = "";
    chatBody.scrollTop = chatBody.scrollHeight;
  }
});

// Video call functionality
const videoCallBtn = document.getElementById("video-call-btn");
const videoCallDiv = document.getElementById("video-call");
const localVideo = document.getElementById("localVideo");
const remoteVideo = document.getElementById("remoteVideo");
const endCallBtn = document.getElementById("end-call-btn");

let localStream;
let peerConnection;
const servers = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };

videoCallBtn.addEventListener("click", async () => {
  videoCallDiv.style.display = "flex";
  localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  localVideo.srcObject = localStream;

  peerConnection = new RTCPeerConnection(servers);
  localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

  peerConnection.ontrack = event => {
    remoteVideo.srcObject = event.streams[0];
  };

  // Normally you'd use signaling server here to exchange SDP offers/answers
  // For demo, we just show local video
});

endCallBtn.addEventListener("click", () => {
  videoCallDiv.style.display = "none";
  localStream.getTracks().forEach(track => track.stop());
  if (peerConnection) peerConnection.close();
});
