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
const PROFILE_STORAGE_KEY = "chat-profile-data";
const defaultProfileData = {
  name: "Bhavesh Kumar",
  phone: "+1 (415) 555-0187",
  status: "Online",
  about: "Designing ideas and building better chats."
};
const profileNameField = document.getElementById("profile-name");
const profilePhoneField = document.getElementById("profile-phone");
const profileStatusField = document.getElementById("profile-status");
const profileAboutField = document.getElementById("profile-about");
let activeContact = null;
const newChatModal = document.getElementById("new-chat-modal");
const newChatForm = document.getElementById("new-chat-form");
const newChatType = document.getElementById("new-chat-type");
const newChatName = document.getElementById("new-chat-name");
const newChatNameLabel = document.getElementById("new-chat-name-label");
const newChatSubmit = document.getElementById("new-chat-submit");
const newChatCancel = document.getElementById("new-chat-cancel");
const newChatModalClose = document.getElementById("new-chat-modal-close");
const statusBtn = document.getElementById("status-btn");
const statusMenu = document.getElementById("status-menu");
const statusViewer = document.getElementById("status-viewer");
const statusAvatar = document.getElementById("status-avatar");
const statusName = document.getElementById("status-name");
const statusMessage = document.getElementById("status-message");
const statusClose = document.getElementById("status-close");
const statusReplyBtn = document.getElementById("status-reply-btn");
const statusCloseBtn = document.getElementById("status-close-btn");

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

function toggleStatusMenu() {
  const isOpen = statusMenu.classList.toggle("open");
  statusBtn.setAttribute("aria-expanded", String(isOpen));
}

function openStatusViewer(name, text, color = "coral") {
  statusName.textContent = name;
  statusMessage.textContent = text;
  statusAvatar.textContent = name.charAt(0).toUpperCase();
  statusAvatar.className = `status-avatar avatar avatar-${color}`;
  statusViewer.classList.add("open");
  statusViewer.setAttribute("aria-hidden", "false");
}

function closeStatusViewer() {
  statusViewer.classList.remove("open");
  statusViewer.setAttribute("aria-hidden", "true");
}

profileTrigger.addEventListener("click", openProfilePanel);
profileTrigger.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    openProfilePanel();
  }
});

function getProfileDataFromFields() {
  return {
    name: (profileNameField?.textContent || "").trim() || defaultProfileData.name,
    phone: (profilePhoneField?.textContent || "").trim() || defaultProfileData.phone,
    status: (profileStatusField?.textContent || "").trim() || defaultProfileData.status,
    about: (profileAboutField?.textContent || "").trim() || defaultProfileData.about
  };
}

function getStoredProfileData() {
  try {
    const savedData = JSON.parse(localStorage.getItem(PROFILE_STORAGE_KEY));
    return { ...defaultProfileData, ...(savedData || {}) };
  } catch (error) {
    return { ...defaultProfileData };
  }
}

function saveProfileData(data = getProfileDataFromFields()) {
  const nextProfileData = { ...defaultProfileData, ...data };
  try {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(nextProfileData));
  } catch (error) {
    console.warn("Profile could not be saved:", error);
  }
  return nextProfileData;
}

function applyProfileData(data = getStoredProfileData()) {
  const profileData = { ...defaultProfileData, ...data };
  if (profileNameField) profileNameField.textContent = profileData.name;
  if (profilePhoneField) profilePhoneField.textContent = profileData.phone;
  if (profileStatusField) profileStatusField.textContent = profileData.status;
  if (profileAboutField) profileAboutField.textContent = profileData.about;
  const avatar = document.querySelector(".profile-avatar-large");
  if (avatar) {
    avatar.textContent = (profileData.name || "B").charAt(0).toUpperCase();
  }
}

function setProfileEditingMode(enabled) {
  profileFields.forEach((field) => {
    field.contentEditable = String(enabled);
    field.setAttribute("spellcheck", "false");
  });
  profileEditBtn.dataset.editing = String(enabled);
  profileEditBtn.textContent = enabled ? "Save" : "Edit";
}

applyProfileData();

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

  if (editing) {
    const nextProfileData = getProfileDataFromFields();
    saveProfileData(nextProfileData);
    applyProfileData(nextProfileData);
    setProfileEditingMode(false);
    showToast("Profile saved");
    return;
  }

  setProfileEditingMode(true);
  const firstField = profileFields[0];
  firstField.focus();
  const range = document.createRange();
  const selection = window.getSelection();
  range.selectNodeContents(firstField);
  selection.removeAllRanges();
  selection.addRange(range);
});

profileBackdrop.addEventListener("click", closeProfilePanel);
profileClose.addEventListener("click", closeProfilePanel);
profileMenuItem?.addEventListener("click", () => {
  contextMenu.classList.remove("open");
  moreOptionsBtn.setAttribute("aria-expanded", "false");
  openProfilePanel();
});
moreOptionsBtn.addEventListener("click", toggleContextMenu);
statusBtn.addEventListener("click", toggleStatusMenu);
statusClose.addEventListener("click", closeStatusViewer);
statusCloseBtn.addEventListener("click", closeStatusViewer);
statusReplyBtn.addEventListener("click", () => {
  showToast("Reply sent");
  closeStatusViewer();
});
contactInfoBtn?.addEventListener("click", () => {
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
  const clickedInsideStatusMenu = statusMenu.contains(event.target);
  const clickedOnStatus = statusBtn.contains(event.target);
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
  if (!clickedInsideStatusMenu && !clickedOnStatus) {
    statusMenu.classList.remove("open");
    statusBtn.setAttribute("aria-expanded", "false");
  }
});

function fillProfileFromContact(contact) {
  const contactName = contact.dataset.name || "Contact";
  const contactStatus = contact.dataset.status || "online";
  const contactPhone = contact.dataset.phone || "+1 (415) 555-0100";
  const contactAbout = contact.dataset.about || "Available to chat and share updates.";

  if (profileNameField) profileNameField.textContent = contactName;
  if (profileStatusField) profileStatusField.textContent = contactStatus;
  if (profilePhoneField) profilePhoneField.textContent = contactPhone;
  if (profileAboutField) profileAboutField.textContent = contactAbout;

  const avatar = document.querySelector(".profile-avatar-large");
  if (avatar) {
    avatar.textContent = contactName.charAt(0).toUpperCase();
    avatar.className = `avatar avatar-me profile-avatar-large avatar-${contact.dataset.color || "coral"}`;
  }
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

document.querySelectorAll("#status-menu .menu-item").forEach((button) => {
  button.addEventListener("click", () => {
    const action = button.dataset.statusAction;
    statusMenu.classList.remove("open");
    statusBtn.setAttribute("aria-expanded", "false");

    if (action === "my-status") {
      openStatusViewer("Bhavesh Kumar", "Available and ready to chat.", "me");
      return;
    }

    if (action === "add-status") {
      showToast("Status updated");
      const currentContact = activeContact || contacts[0];
      if (currentContact) {
        openStatusViewer(currentContact.dataset.name, currentContact.dataset.statusMessage || "A fresh update from today.", currentContact.dataset.color || "coral");
      }
      return;
    }

    const targetContact = activeContact || contacts[0];
    if (targetContact) {
      openStatusViewer(targetContact.dataset.name, targetContact.dataset.statusMessage || "A fresh update from today.", targetContact.dataset.color || "coral");
    }
  });
});

statusViewer.addEventListener("click", (event) => {
  if (event.target === statusViewer) {
    closeStatusViewer();
  }
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
  remoteVideo.play().catch(() => {});
  if (!navigator.mediaDevices?.getUserMedia) return;
  try {
    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localVideo.srcObject = localStream;
    peerConnection = new RTCPeerConnection(servers);
    localStream.getTracks().forEach((track) => peerConnection.addTrack(track, localStream));
    peerConnection.ontrack = (event) => {
      if (remoteVideo.tagName === "VIDEO") {
        remoteVideo.srcObject = event.streams[0];
      }
    };
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
  remoteVideo.pause();
  remoteVideo.currentTime = 0;
  videoCall.querySelector(".call-label").textContent = "Video call";
});
