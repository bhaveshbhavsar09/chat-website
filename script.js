const messageInput = document.getElementById("message-input");
const chatBody = document.getElementById("chat-body");
const messageForm = document.getElementById("message-form");
const contacts = document.querySelectorAll(".contact");
const chatName = document.getElementById("chat-name");
const chatStatus = document.getElementById("chat-status");
const chatAvatar = document.getElementById("chat-avatar");
const searchInput = document.getElementById("search-input");
const profileTrigger = document.getElementById("profile-trigger");
const profilePanel = document.getElementById("profile-panel");
const profileBackdrop = document.getElementById("profile-backdrop");
const profileClose = document.getElementById("profile-close");
const moreOptionsBtn = document.getElementById("more-options-btn");
const contextMenu = document.getElementById("context-menu");
const profileMenuItem = document.getElementById("profile-menu-item");
const newChatBtn = document.getElementById("new-chat-btn");
const newChatMenu = document.getElementById("new-chat-menu");
const chatMoreOptionsBtn = document.getElementById("chat-more-options-btn");
const chatContextMenu = document.getElementById("chat-context-menu");
const profileEditBtn = document.getElementById("profile-edit-btn");
const profileFields = document.querySelectorAll(".profile-field-editable");
const toast = document.getElementById("toast");
const contactInfoBtn = document.querySelector('#chat-context-menu [data-action="contact-info"]');
let activeContact = null;
const newChatModal = document.getElementById("new-chat-modal");
const newChatForm = document.getElementById("new-chat-form");
const newChatType = document.getElementById("new-chat-type");
const newChatName = document.getElementById("new-chat-name");
const newChatNameLabel = document.getElementById("new-chat-name-label");
const newChatSubmit = document.getElementById("new-chat-submit");
const newChatCancel = document.getElementById("new-chat-cancel");
const newChatModalClose = document.getElementById("new-chat-modal-close");

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timeoutId);
  showToast.timeoutId = setTimeout(() => toast.classList.remove("show"), 1800);
}

function openProfilePanel() {
  profilePanel.classList.add("open");
  profilePanel.setAttribute("aria-hidden", "false");
}

function closeProfilePanel() {
  profilePanel.classList.remove("open");
  profilePanel.setAttribute("aria-hidden", "true");
}

function toggleContextMenu() {
  const isOpen = contextMenu.classList.toggle("open");
  moreOptionsBtn.setAttribute("aria-expanded", String(isOpen));
}

profileTrigger.addEventListener("click", openProfilePanel);
profileTrigger.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    openProfilePanel();
  }
});

function setProfileEditingMode(enabled) {
  profileFields.forEach((field) => {
    field.contentEditable = String(enabled);
    field.setAttribute("spellcheck", "false");
  });
  profileEditBtn.dataset.editing = String(enabled);
  profileEditBtn.textContent = enabled ? "Save" : "Edit";
}

profileFields.forEach((field) => {
  const activateField = () => {
    if (profileEditBtn.dataset.editing !== "true") {
      setProfileEditingMode(true);
    }
    field.focus();
    const range = document.createRange();
    const selection = window.getSelection();
    range.selectNodeContents(field);
    selection.removeAllRanges();
    selection.addRange(range);
  };

  field.addEventListener("click", activateField);
  field.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      activateField();
    }
  });
});

profileEditBtn.addEventListener("click", () => {
  const editing = profileEditBtn.dataset.editing === "true";
  setProfileEditingMode(!editing);
  if (!editing) {
    const firstField = profileFields[0];
    firstField.focus();
    const range = document.createRange();
    const selection = window.getSelection();
    range.selectNodeContents(firstField);
    selection.removeAllRanges();
    selection.addRange(range);
  }
});

profileBackdrop.addEventListener("click", closeProfilePanel);
profileClose.addEventListener("click", closeProfilePanel);
profileMenuItem.addEventListener("click", () => {
  contextMenu.classList.remove("open");
  moreOptionsBtn.setAttribute("aria-expanded", "false");
  openProfilePanel();
});
moreOptionsBtn.addEventListener("click", toggleContextMenu);
contactInfoBtn.addEventListener("click", () => {
  if (!activeContact) return;
  fillProfileFromContact(activeContact);
  openProfilePanel();
  chatContextMenu.classList.remove("open");
  chatMoreOptionsBtn.setAttribute("aria-expanded", "false");
});
newChatBtn.addEventListener("click", () => {
  const isOpen = newChatMenu.classList.toggle("open");
  newChatBtn.setAttribute("aria-expanded", String(isOpen));
});
chatMoreOptionsBtn.addEventListener("click", () => {
  const isOpen = chatContextMenu.classList.toggle("open");
  chatMoreOptionsBtn.setAttribute("aria-expanded", String(isOpen));
});
document.addEventListener("click", (event) => {
  const clickedInsideMenu = contextMenu.contains(event.target);
  const clickedOnMore = moreOptionsBtn.contains(event.target);
  const clickedInsideNewChatMenu = newChatMenu.contains(event.target);
  const clickedOnNewChat = newChatBtn.contains(event.target);
  const clickedInsideChatMenu = chatContextMenu.contains(event.target);
  const clickedOnChatMore = chatMoreOptionsBtn.contains(event.target);
  if (!clickedInsideMenu && !clickedOnMore) {
    contextMenu.classList.remove("open");
    moreOptionsBtn.setAttribute("aria-expanded", "false");
  }
  if (!clickedInsideNewChatMenu && !clickedOnNewChat) {
    newChatMenu.classList.remove("open");
    newChatBtn.setAttribute("aria-expanded", "false");
  }
  if (!clickedInsideChatMenu && !clickedOnChatMore) {
    chatContextMenu.classList.remove("open");
    chatMoreOptionsBtn.setAttribute("aria-expanded", "false");
  }
});

function fillProfileFromContact(contact) {
  const contactName = contact.dataset.name || "Contact";
  const contactStatus = contact.dataset.status || "online";
  const contactPhone = contact.dataset.phone || "+1 (415) 555-0100";
  const contactAbout = contact.dataset.about || "Available to chat and share updates.";

  document.getElementById("profile-name").textContent = contactName;
  document.getElementById("profile-status").textContent = contactStatus;
  document.getElementById("profile-phone").textContent = contactPhone;
  document.getElementById("profile-about").textContent = contactAbout;
  document.querySelector(".profile-avatar-large").textContent = contactName.charAt(0).toUpperCase();
  document.querySelector(".profile-avatar-large").className = `avatar avatar-me profile-avatar-large avatar-${contact.dataset.color || "coral"}`;
}

function bindContactSelection(contact) {
  contact.addEventListener("click", () => {
    const allContacts = document.querySelectorAll(".contact");
    allContacts.forEach((item) => item.classList.remove("active"));
    contact.classList.add("active");
    activeContact = contact;
    chatName.textContent = contact.dataset.name;
    chatStatus.textContent = contact.dataset.status;
    chatAvatar.textContent = contact.dataset.name.charAt(0);
    chatAvatar.className = `avatar avatar-${contact.dataset.color}`;
    document.getElementById("call-name").textContent = contact.dataset.name;
    document.getElementById("voice-call-name").textContent = contact.dataset.name;
    document.getElementById("voice-call-avatar").textContent = contact.dataset.name.charAt(0);
    fillProfileFromContact(contact);
    document.querySelector(".app").classList.add("chat-open");
  });
}

function addContactItem(name, status = "online", color = "coral", firstLine = "New chat") {
  const contactList = document.getElementById("contacts");
  const contact = document.createElement("li");
  const initial = name.charAt(0).toUpperCase();
  contact.className = "contact";
  contact.dataset.name = name;
  contact.dataset.status = status;
  contact.dataset.color = color;
  contact.innerHTML = `
    <div class="avatar avatar-${color}">${initial}</div>
    <div class="contact-copy">
      <strong>${name}</strong>
      <span>${firstLine}</span>
    </div>
    <time>Now</time>
  `;
  contactList.appendChild(contact);
  bindContactSelection(contact);
  return contact;
}

function openNewChatModal(type = "group") {
  const normalizedType = type === "new-group" ? "group" : type === "new-contact" ? "contact" : type;
  newChatType.value = normalizedType;
  const typeMap = {
    group: { title: "Create new group", label: "Group name", submit: "Create" },
    contact: { title: "Add new contact", label: "Contact name", submit: "Save" },
    starred: { title: "Starred messages", label: "Quick note", submit: "Open" }
  };

  const config = typeMap[type] || typeMap.group;
  document.getElementById("new-chat-modal-title").textContent = config.title;
  newChatNameLabel.textContent = config.label;
  newChatSubmit.textContent = config.submit;
  newChatName.value = "";
  newChatName.placeholder = type === "starred" ? "Optional note" : "Enter a name";
  newChatName.style.display = type === "starred" ? "none" : "block";
  newChatNameLabel.style.display = type === "starred" ? "none" : "block";
  newChatModal.classList.add("open");
  newChatModal.setAttribute("aria-hidden", "false");
}

function closeNewChatModal() {
  newChatModal.classList.remove("open");
  newChatModal.setAttribute("aria-hidden", "true");
}

const newChatMenuActions = document.querySelectorAll("#new-chat-menu .menu-item");
newChatMenuActions.forEach((button) => {
  button.addEventListener("click", () => {
    const action = button.dataset.action;
    newChatMenu.classList.remove("open");
    newChatBtn.setAttribute("aria-expanded", "false");
    openNewChatModal(action);
  });
});

newChatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const action = newChatType.value;

  if (action === "group") {
    const name = newChatName.value.trim();
    if (!name) {
      newChatName.focus();
      return;
    }
    addContactItem(name, "5 members", "blue", "Group started");
    showToast("Group created");
  }

  if (action === "contact") {
    const name = newChatName.value.trim();
    if (!name) {
      newChatName.focus();
      return;
    }
    addContactItem(name, "online", "green", "Available");
    showToast("Contact added");
  }

  if (action === "starred") {
    showToast("Starred messages opened");
  }

  closeNewChatModal();
});

newChatCancel.addEventListener("click", closeNewChatModal);
newChatModalClose.addEventListener("click", closeNewChatModal);
newChatModal.addEventListener("click", (event) => {
  if (event.target === newChatModal) {
    closeNewChatModal();
  }
});

newChatType.addEventListener("change", (event) => {
  openNewChatModal(event.target.value);
});

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
  bindContactSelection(contact);
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

const voiceCallBtn = document.getElementById("voice-call-btn");
const voiceCall = document.getElementById("voice-call");
const voiceCallName = document.getElementById("voice-call-name");
const voiceCallAvatar = document.getElementById("voice-call-avatar");
const endVoiceCallBtn = document.getElementById("end-voice-call-btn");
const videoCallBtn = document.getElementById("video-call-btn");
const videoCall = document.getElementById("video-call");
const localVideo = document.getElementById("localVideo");
const remoteVideo = document.getElementById("remoteVideo");
const endCallBtn = document.getElementById("end-call-btn");
let localStream;
let peerConnection;
const servers = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };

voiceCallBtn.addEventListener("click", () => {
  const currentName = chatName.textContent;
  voiceCallName.textContent = currentName;
  voiceCallAvatar.textContent = currentName.charAt(0);
  voiceCall.style.display = "grid";
  voiceCall.setAttribute("aria-hidden", "false");
});

endVoiceCallBtn.addEventListener("click", () => {
  voiceCall.style.display = "none";
  voiceCall.setAttribute("aria-hidden", "true");
});

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
