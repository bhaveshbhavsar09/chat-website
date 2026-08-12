(function() {
    // ----- DOM refs -----
    const toast = document.getElementById('toastMessage');
    const messageInput = document.getElementById('messageInput');
    const sendBtn = document.getElementById('sendBtn');
    const messagesArea = document.getElementById('messagesArea');
    const modalOverlay = document.getElementById('modalOverlay');

    // ----- Toast helper -----
    function showToast(msg) {
        toast.textContent = msg;
        toast.classList.add('show');
        clearTimeout(toast._hideTimer);
        toast._hideTimer = setTimeout(() => {
            toast.classList.remove('show');
        }, 1800);
    }

    // ----- Add sent message (with timestamp) -----
    function addSentMessage(text) {
        if (!text.trim()) return;
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const timeStr = hours + ':' + minutes;

        const row = document.createElement('div');
        row.className = 'message-row sent';

        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        bubble.innerHTML = `
            <p>${text}</p>
            <div class="bubble-time">${timeStr} <i class="fas fa-check-double" style="color:#4fc3f7;"></i></div>
        `;
        row.appendChild(bubble);
        messagesArea.appendChild(row);
        messagesArea.scrollTop = messagesArea.scrollHeight;
        messageInput.value = '';
    }

    // ----- Send handler -----
    function handleSend() {
        const text = messageInput.value.trim();
        if (text) {
            addSentMessage(text);
            showToast('✅ message sent');
        } else {
            showToast('📝 type something first');
        }
    }

    // ----- Event listeners -----
    // Send button
    sendBtn.addEventListener('click', handleSend);
    // Enter key
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSend();
        }
    });

    // Emoji button
    document.getElementById('emojiBtn').addEventListener('click', () => {
        const emojis = ['😊', '😂', '❤️', '🔥', '👍', '👋', '✨', '🎉', '💯', '🤙', '😎', '🤩'];
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
        const input = messageInput;
        const start = input.selectionStart;
        const end = input.selectionEnd;
        const val = input.value;
        input.value = val.substring(0, start) + randomEmoji + val.substring(end);
        input.focus();
        const newPos = start + randomEmoji.length;
        input.setSelectionRange(newPos, newPos);
        showToast('😎 emoji added');
    });

    // Attach button
    document.getElementById('attachBtn').addEventListener('click', () => {
        showToast('📎 attach file (simulated)');
    });

    // Mic button
    document.getElementById('micBtn').addEventListener('click', () => {
        showToast('🎤 voice recording (simulated)');
    });

    // Back button
    document.getElementById('backBtn').addEventListener('click', () => {
        showToast('⬅️ back to chats (simulated)');
    });

    // Video call
    document.getElementById('videoCallBtn').addEventListener('click', () => {
        showToast('📹 video call initiated (simulated)');
    });

    // Voice call
    document.getElementById('voiceCallBtn').addEventListener('click', () => {
        showToast('📞 voice call initiated (simulated)');
    });

    // Menu (three dots) -> open modal
    document.getElementById('menuBtn').addEventListener('click', () => {
        modalOverlay.classList.add('open');
    });

    // Avatar click -> open modal too (show profile)
    document.getElementById('avatarBtn').addEventListener('click', () => {
        modalOverlay.classList.add('open');
    });

    // Close modal
    document.getElementById('modalCloseBtn').addEventListener('click', () => {
        modalOverlay.classList.remove('open');
    });
    // Close modal on overlay click (background)
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            modalOverlay.classList.remove('open');
        }
    });

    // Modal action button (View Profile)
    document.getElementById('modalActionBtn').addEventListener('click', () => {
        showToast('👤 John Doe profile (simulated)');
        modalOverlay.classList.remove('open');
    });

    // ----- Extra: double-click on bubble = reaction -----
    document.addEventListener('dblclick', (e) => {
        const bubble = e.target.closest('.bubble');
        if (bubble && messagesArea.contains(bubble)) {
            showToast('❤️ reacted with heart');
        }
    });

    // ----- Extra: click on bubble-time = message details -----
    document.addEventListener('click', (e) => {
        const timeEl = e.target.closest('.bubble-time');
        if (timeEl) {
            showToast('🕒 message details (simulated)');
        }
    });

    // ----- Extra: click on divider -----
    document.querySelectorAll('.divider').forEach(el => {
        el.addEventListener('click', () => {
            showToast('📅 date divider clicked');
        });
    });

    // ----- Extra: right-click on container (context menu) -----
    document.querySelector('.whatsapp-container').addEventListener('contextmenu', (e) => {
        e.preventDefault();
        showToast('🔄 context menu (simulated)');
    });

    // ----- Focus input on load -----
    messageInput.focus();

    console.log('🚀 WhatsApp full chat with modal & all buttons working!');
})();