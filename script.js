const messageInput = document.getElementById("message-input");
const chatBody = document.getElementById("chat-body");
const messageForm = document.getElementById("message-form");
const contacts = document.querySelectorAll(".contact");
const chatName = document.getElementById("chat-name");
const chatStatus = document.getElementById("chat-status");
const chatAvatar = document.getElementById("chat-avatar");
const searchInput = document.getElementById("search-input");

messageForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const message = messageInput.value.trim();
  if (!message) return;

  const messageElement = document.createElement("div");
  const escapedMessage = message.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[character]));
  messageElement.className = "message sent";
  messageElement.innerHTML = `<span>${escapedMessage}</span><time>${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} <b>✓✓</b></time>`;
  chatBody.appendChild(messageElement);
  messageInput.value = "";
  chatBody.scrollTop = chatBody.scrollHeight;
});

contacts.forEach((contact) => {
  contact.addEventListener("click", () => {
    contacts.forEach((item) => item.classList.remove("active"));
    contact.classList.add("active");
    chatName.textContent = contact.dataset.name;
    chatStatus.textContent = contact.dataset.status;
    chatAvatar.textContent = contact.dataset.name.charAt(0);
    chatAvatar.className = `avatar avatar-${contact.dataset.color}`;
    document.getElementById("call-name").textContent = contact.dataset.name;
    document.querySelector(".app").classList.add("chat-open");
  });
});

document.querySelector(".back-button").addEventListener("click", () => {
  document.querySelector(".app").classList.remove("chat-open");
});

searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();
  contacts.forEach((contact) => {
    contact.hidden = !contact.dataset.name.toLowerCase().includes(query);
  });
});

const videoCallBtn = document.getElementById("video-call-btn");
const videoCall = document.getElementById("video-call");
const localVideo = document.getElementById("localVideo");
const remoteVideo = document.getElementById("remoteVideo");
const endCallBtn = document.getElementById("end-call-btn");
let localStream;
let peerConnection;
const servers = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };

videoCallBtn.addEventListener("click", async () => {
  videoCall.style.display = "grid";
  videoCall.setAttribute("aria-hidden", "false");
  if (!navigator.mediaDevices?.getUserMedia) return;
  try {
    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localVideo.srcObject = localStream;
    peerConnection = new RTCPeerConnection(servers);
    localStream.getTracks().forEach((track) => peerConnection.addTrack(track, localStream));
    peerConnection.ontrack = (event) => { remoteVideo.srcObject = event.streams[0]; };
  } catch (error) {
    videoCall.querySelector(".call-label").textContent = "Camera preview unavailable";
  }
});

endCallBtn.addEventListener("click", () => {
  videoCall.style.display = "none";
  videoCall.setAttribute("aria-hidden", "true");
  localStream?.getTracks().forEach((track) => track.stop());
  peerConnection?.close();
  localVideo.srcObject = null;
  remoteVideo.srcObject = null;
});
