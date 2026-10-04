const messageInput = document.getElementById("message-input");
const emojiButton = document.querySelector('.chat-footer button[aria-label="Add emoji"]');
const chatBody = document.getElementById("chat-body");
const messageForm = document.getElementById("message-form");
const contacts = document.querySelectorAll(".contact");
const emojiPicker = document.createElement("div");
emojiPicker.className = "emoji-picker";
emojiPicker.setAttribute("role", "dialog");
emojiPicker.setAttribute("aria-label", "Emoji picker");
emojiPicker.innerHTML = `
  <button type="button" data-emoji="😊" aria-label="Smile">😊</button>
  <button type="button" data-emoji="😂" aria-label="Laugh">😂</button>
  <button type="button" data-emoji="😍" aria-label="Love">😍</button>
  <button type="button" data-emoji="👍" aria-label="Thumbs up">👍</button>
  <button type="button" data-emoji="🎉" aria-label="Celebrate">🎉</button>
  <button type="button" data-emoji="❤️" aria-label="Heart">❤️</button>
`;
messageForm.appendChild(emojiPicker);

function insertEmojiIntoInput(emoji) {
  const start = messageInput.selectionStart;
  const end = messageInput.selectionEnd;
  messageInput.value = `${messageInput.value.slice(0, start)}${emoji}${messageInput.value.slice(end)}`;
  messageInput.focus();
  const cursorPosition = start + emoji.length;
  messageInput.setSelectionRange(cursorPosition, cursorPosition);
}
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

emojiButton?.addEventListener("click", (event) => {
  event.preventDefault();
  const isOpen = emojiPicker.classList.toggle("open");
  emojiButton.setAttribute("aria-expanded", String(isOpen));
  if (isOpen) {
    messageInput.focus();
  }
});

emojiPicker.querySelectorAll("[data-emoji]").forEach((emojiOption) => {
  emojiOption.addEventListener("click", () => {
    insertEmojiIntoInput(emojiOption.dataset.emoji);
    emojiPicker.classList.remove("open");
    emojiButton.setAttribute("aria-expanded", "false");
  });
});

document.addEventListener("click", (event) => {
  const clickedInsidePicker = emojiPicker.contains(event.target);
  const clickedOnEmojiButton = emojiButton.contains(event.target);

  if (!clickedInsidePicker && !clickedOnEmojiButton) {
    emojiPicker.classList.remove("open");
    emojiButton.setAttribute("aria-expanded", "false");
  }
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

// --- NEW FEATURES ---

// Dark Mode Toggle
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const currentTheme = localStorage.getItem('chat-theme');
if (currentTheme === 'dark') {
  document.body.classList.add('dark-mode');
  if (themeToggleBtn) themeToggleBtn.textContent = '☀';
}
if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    themeToggleBtn.textContent = isDark ? '☀' : '☾';
    localStorage.setItem('chat-theme', isDark ? 'dark' : 'light');
  });
}

// Typing Indicator
const typingIndicator = document.getElementById('typing-indicator');
const chatStatusText = document.getElementById('chat-status');
let typingTimeout;
if (messageInput && typingIndicator && chatStatusText) {
  messageInput.addEventListener('input', () => {
    if (!messageInput.value) return;
    chatStatusText.style.display = 'none';
    typingIndicator.style.display = 'inline';
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
      chatStatusText.style.display = 'inline';
      typingIndicator.style.display = 'none';
    }, 1500);
  });
}

// Attachment Modal
const attachBtn = document.getElementById('attach-btn');
const attachmentModal = document.getElementById('attachment-modal');
const attachmentModalClose = document.getElementById('attachment-modal-close');
const attachmentCancel = document.getElementById('attachment-cancel');
const fileInput = document.getElementById('file-input');
const attachmentPreviewArea = document.getElementById('attachment-preview-area');
const attachmentSubmit = document.getElementById('attachment-submit');
const attachmentForm = document.getElementById('attachment-form');
let currentAttachmentData = null;

function openAttachmentModal() {
  if (attachmentModal) {
    attachmentModal.classList.add('open');
    attachmentModal.setAttribute('aria-hidden', 'false');
  }
}

function closeAttachmentModal() {
  if (attachmentModal) {
    attachmentModal.classList.remove('open');
    attachmentModal.setAttribute('aria-hidden', 'true');
    fileInput.value = '';
    attachmentPreviewArea.innerHTML = '<p>No image selected</p>';
    attachmentSubmit.disabled = true;
    currentAttachmentData = null;
  }
}

if (attachBtn) attachBtn.addEventListener('click', openAttachmentModal);
if (attachmentModalClose) attachmentModalClose.addEventListener('click', closeAttachmentModal);
if (attachmentCancel) attachmentCancel.addEventListener('click', closeAttachmentModal);
if (attachmentModal) {
  attachmentModal.addEventListener('click', (e) => {
    if (e.target === attachmentModal) closeAttachmentModal();
  });
}

if (fileInput) {
  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        currentAttachmentData = event.target.result;
        attachmentPreviewArea.innerHTML = `<img src="${currentAttachmentData}" alt="Preview">`;
        attachmentSubmit.disabled = false;
      };
      reader.readAsDataURL(file);
    } else {
      attachmentPreviewArea.innerHTML = '<p>Invalid image file</p>';
      attachmentSubmit.disabled = true;
    }
  });
}

if (attachmentForm) {
  attachmentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!currentAttachmentData) return;
    const messageElement = document.createElement("div");
    messageElement.className = "message sent";
    messageElement.innerHTML = `<img src="${currentAttachmentData}" alt="Attached Image"><time>${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} <b>✓✓</b></time>`;
    chatBody.appendChild(messageElement);
    chatBody.scrollTop = chatBody.scrollHeight;
    closeAttachmentModal();
  });
}

// Message Context Menu
const msgContextMenu = document.getElementById('msg-context-menu');
let activeMessageElement = null;

if (chatBody && msgContextMenu) {
  chatBody.addEventListener('contextmenu', (e) => {
    const msgEl = e.target.closest('.message');
    if (msgEl) {
      e.preventDefault();
      activeMessageElement = msgEl;
      msgContextMenu.classList.add('open');
      msgContextMenu.style.top = `${e.clientY}px`;
      msgContextMenu.style.left = `${e.clientX}px`;
    }
  });

  document.addEventListener('click', (e) => {
    if (!msgContextMenu.contains(e.target)) {
      msgContextMenu.classList.remove('open');
    }
  });

  document.getElementById('msg-delete-btn').addEventListener('click', () => {
    if (activeMessageElement) {
      activeMessageElement.remove();
      msgContextMenu.classList.remove('open');
      showToast('Message deleted');
    }
  });

  document.getElementById('msg-reply-btn').addEventListener('click', () => {
    msgContextMenu.classList.remove('open');
    messageInput.focus();
    showToast('Replying to message');
  });

  document.getElementById('msg-forward-btn').addEventListener('click', () => {
    msgContextMenu.classList.remove('open');
    showToast('Message forwarded');
  });
}

// Chat Wallpaper Customization
const changeWallpaperBtn = document.getElementById('change-wallpaper-btn');
const wallpapers = [
  'radial-gradient(var(--chat-pattern) 0.7px, transparent 0.7px)',
  'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.1) 100%)',
  'linear-gradient(to top, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.15) 100%)',
  'none'
];
let currentWallpaperIdx = 0;

if (changeWallpaperBtn) {
  changeWallpaperBtn.addEventListener('click', () => {
    currentWallpaperIdx = (currentWallpaperIdx + 1) % wallpapers.length;
    chatBody.style.backgroundImage = wallpapers[currentWallpaperIdx];
    chatContextMenu.classList.remove('open');
    chatMoreOptionsBtn.setAttribute('aria-expanded', 'false');
    showToast('Wallpaper changed');
  });
}

// --- MORE ADVANCED FEATURES ---

// Input has-text toggle
if (messageInput && messageForm) {
  messageInput.addEventListener('input', () => {
    if (messageInput.value.trim().length > 0) {
      messageForm.classList.add('has-text');
    } else {
      messageForm.classList.remove('has-text');
    }
  });

  // Also hook into original submit to clear has-text and group messages
  messageForm.addEventListener('submit', () => {
    setTimeout(() => {
      messageForm.classList.remove('has-text');
      groupMessages();
    }, 10);
  });
}

// Voice Recording UI
const micBtn = document.getElementById('mic-btn');
const recordingCancel = document.getElementById('recording-cancel');
const recordingSend = document.getElementById('recording-send');
const recordingTimer = document.getElementById('recording-timer');
let recordInterval;
let recordSeconds = 0;

function formatTime(sec) {
  const m = Math.floor(sec / 60).toString().padStart(2, '0');
  const s = (sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

if (micBtn && messageForm) {
  micBtn.addEventListener('click', () => {
    messageForm.classList.add('recording');
    recordSeconds = 0;
    recordingTimer.textContent = '00:00';
    recordInterval = setInterval(() => {
      recordSeconds++;
      recordingTimer.textContent = formatTime(recordSeconds);
    }, 1000);
  });
}

if (recordingCancel && messageForm) {
  recordingCancel.addEventListener('click', () => {
    messageForm.classList.remove('recording');
    clearInterval(recordInterval);
  });
}

if (recordingSend && messageForm) {
  recordingSend.addEventListener('click', () => {
    messageForm.classList.remove('recording');
    clearInterval(recordInterval);
    const messageElement = document.createElement("div");
    messageElement.className = "message sent";
    messageElement.innerHTML = `<span>🎤 Voice message (${formatTime(recordSeconds)})</span><time>${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} <b>✓✓</b></time>`;
    chatBody.appendChild(messageElement);
    chatBody.scrollTop = chatBody.scrollHeight;
    groupMessages();
  });
}

// Chat Search Logic
const chatSearchBtn = document.getElementById('chat-search-btn');
const chatSearchBar = document.getElementById('chat-search-bar');
const closeSearchBtn = document.getElementById('close-search-btn');
const chatSearchInput = document.getElementById('chat-search-input');

if (chatSearchBtn) {
  chatSearchBtn.addEventListener('click', () => {
    chatSearchBar.classList.add('active');
    chatSearchInput.focus();
  });
}
if (closeSearchBtn) {
  closeSearchBtn.addEventListener('click', () => {
    chatSearchBar.classList.remove('active');
    chatSearchInput.value = '';
    const messages = chatBody.querySelectorAll('.message');
    messages.forEach(m => m.classList.remove('hidden-by-search'));
  });
}
if (chatSearchInput) {
  chatSearchInput.addEventListener('input', () => {
    const query = chatSearchInput.value.toLowerCase();
    const messages = chatBody.querySelectorAll('.message');
    messages.forEach(m => {
      const text = m.textContent.toLowerCase();
      if (text.includes(query)) {
        m.classList.remove('hidden-by-search');
      } else {
        m.classList.add('hidden-by-search');
      }
    });
  });
}

// Contact Info Sidebar
const chatHeaderClickable = document.getElementById('chat-header-clickable');
const contactSidebarClose = document.getElementById('contact-sidebar-close');
const appContainer = document.querySelector('.app');
const csAvatar = document.getElementById('cs-avatar');
const csName = document.getElementById('cs-name');
const csPhone = document.getElementById('cs-phone');
const csAbout = document.getElementById('cs-about');

if (chatHeaderClickable) {
  chatHeaderClickable.addEventListener('click', (e) => {
    // Only open if clicking the header itself, not buttons
    if (e.target.closest('button') || e.target.closest('.chat-search-bar') || e.target.closest('.chat-context-menu')) return;
    appContainer.classList.add('contact-sidebar-open');
  });
}
if (contactSidebarClose) {
  contactSidebarClose.addEventListener('click', () => {
    appContainer.classList.remove('contact-sidebar-open');
  });
}

// Update Contact Info on selection
const contactsListContainer = document.getElementById('contacts');
if (contactsListContainer) {
  contactsListContainer.addEventListener('click', (e) => {
    const contact = e.target.closest('.contact');
    if (contact) {
      if (csName) csName.textContent = contact.dataset.name;
      if (csPhone) csPhone.textContent = contact.dataset.phone || "+1 (555) 123-4567";
      if (csAbout) csAbout.textContent = contact.dataset.statusMessage || "Hey there! I am using WhatsApp.";
      if (csAvatar) {
        csAvatar.textContent = contact.dataset.name.charAt(0);
        csAvatar.className = `avatar avatar-${contact.dataset.color || 'coral'}`;
      }
    }
  });
}

// Message Grouping
function groupMessages() {
  if (!chatBody) return;
  const messages = Array.from(chatBody.querySelectorAll('.message'));
  
  // Clear previous grouping
  messages.forEach(m => {
    m.classList.remove('grouped-top', 'grouped-middle', 'grouped-bottom');
  });
  
  for (let i = 0; i < messages.length; i++) {
    const prev = messages[i - 1];
    const curr = messages[i];
    const next = messages[i + 1];
    
    const currType = curr.classList.contains('sent') ? 'sent' : 'received';
    const prevType = prev && prev.classList.contains('sent') ? 'sent' : (prev && prev.classList.contains('received') ? 'received' : null);
    const nextType = next && next.classList.contains('sent') ? 'sent' : (next && next.classList.contains('received') ? 'received' : null);
    
    const samePrev = prevType === currType;
    const sameNext = nextType === currType;
    
    if (samePrev && sameNext) {
      curr.classList.add('grouped-middle');
    } else if (samePrev && !sameNext) {
      curr.classList.add('grouped-bottom');
    } else if (!samePrev && sameNext) {
      curr.classList.add('grouped-top');
    }
  }
}
// Run once on load
groupMessages();

// --- NEW FEATURES LOGIC ---

// 1. Service Worker Registration (PWA)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').then(registration => {
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }).catch(err => {
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}

// 2. Login Screen Mock & Skeleton Loader
const loginScreen = document.getElementById('login-screen');
const mainApp = document.getElementById('main-app');
const mockLoginBtn = document.getElementById('mock-login-btn');
const skeletonContacts = document.getElementById('skeleton-contacts');
const contactsList = document.getElementById('contacts');

if (mockLoginBtn && loginScreen && mainApp) {
  mockLoginBtn.addEventListener('click', () => {
    loginScreen.style.display = 'none';
    mainApp.style.display = 'flex';
    
    // Show skeleton loaders for 1.5s
    contactsList.style.display = 'none';
    skeletonContacts.style.display = 'block';
    
    setTimeout(() => {
      skeletonContacts.style.display = 'none';
      contactsList.style.display = 'block';
    }, 1500);
  });
}

// 3. Settings Panel
const settingsMenuItem = document.getElementById('settings-menu-item');
const settingsPanel = document.getElementById('settings-panel');
const settingsClose = document.getElementById('settings-close');
const settingsBackdrop = document.getElementById('settings-backdrop');

function openSettingsPanel() {
  if (settingsPanel) {
    settingsPanel.classList.add("open");
    settingsPanel.setAttribute("aria-hidden", "false");
    contextMenu.classList.remove("open");
    moreOptionsBtn.setAttribute("aria-expanded", "false");
  }
}

function closeSettingsPanel() {
  if (settingsPanel) {
    settingsPanel.classList.remove("open");
    settingsPanel.setAttribute("aria-hidden", "true");
  }
}

if (settingsMenuItem) settingsMenuItem.addEventListener('click', openSettingsPanel);
if (settingsClose) settingsClose.addEventListener('click', closeSettingsPanel);
if (settingsBackdrop) settingsBackdrop.addEventListener('click', closeSettingsPanel);

// 4. Settings Toggles
const settingsThemeToggle = document.getElementById('settings-theme-toggle');
if (settingsThemeToggle) {
  settingsThemeToggle.checked = document.body.classList.contains('dark-mode');
  settingsThemeToggle.addEventListener('change', (e) => {
    if (e.target.checked) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('chat-theme', 'dark');
      if (themeToggleBtn) themeToggleBtn.textContent = '☀';
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('chat-theme', 'light');
      if (themeToggleBtn) themeToggleBtn.textContent = '☾';
    }
  });
}

// Push Notifications Mock
const settingsNotificationsToggle = document.getElementById('settings-notifications-toggle');
if (settingsNotificationsToggle) {
  settingsNotificationsToggle.addEventListener('change', (e) => {
    if (e.target.checked) {
      if ('Notification' in window) {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification('WhatsApp Web Clone', {
              body: 'Notifications are now enabled!',
              icon: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg'
            });
          } else {
            e.target.checked = false;
            showToast('Notification permission denied');
          }
        });
      } else {
        showToast('Notifications not supported by browser');
        e.target.checked = false;
      }
    }
  });
}

// Pin Message Logic
const msgPinBtn = document.getElementById('msg-pin-btn');
if (msgPinBtn) {
  msgPinBtn.addEventListener('click', () => {
    if (activeMessageElement) {
      activeMessageElement.style.borderLeft = '3px solid var(--green)';
      msgContextMenu.classList.remove('open');
      showToast('Message pinned');
    }
  });
}

// Global Page Loader Logic
window.addEventListener('load', () => {
  const globalLoader = document.getElementById('global-loader');
  if (globalLoader) {
    // Add a slight delay to ensure a smooth transition and visibility of the beautiful loader
    setTimeout(() => {
      globalLoader.classList.add('hidden');
    }, 800);
  }
});
