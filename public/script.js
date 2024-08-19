const socket = io("https://extremeboy-live-chaat.vercel.app");

document.getElementById('nickname-button').addEventListener('click', () => {
    const nickname = document.getElementById('nickname-input').value;
    if (nickname) {
        document.getElementById('nickname-container').style.display = 'none';
        document.getElementById('chat-container').style.display = 'flex';
        socket.emit('join', nickname);
    }
});

// Trigger "Join" button by pressing Enter
document.getElementById('nickname-input').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        document.getElementById('nickname-button').click();
    }
});

document.getElementById('send-button').addEventListener('click', () => {
    const message = document.getElementById('message-input').value;
    if (message) {
        socket.emit('message', message);
        document.getElementById('message-input').value = '';
    }
});

// Trigger "Send" button by pressing Enter
document.getElementById('message-input').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        document.getElementById('send-button').click();
    }
});

socket.on('message', (data) => {
    const messages = document.getElementById('messages');
    const messageContainer = document.createElement('div');
    const messageElement = document.createElement('div');
    const nameElement = document.createElement('div');

    const isOwnMessage = data.nickname === document.getElementById('nickname-input').value;

    nameElement.textContent = data.nickname;
    nameElement.className = 'text-xs text-gray-500';

    messageElement.textContent = data.message;
    messageElement.className = `
        inline-block p-2 rounded-lg max-w-xs
        ${isOwnMessage ? 'bg-gray-300 self-end text-right' : 'bg-blue-500 text-white self-start'}
    `;

    messageContainer.appendChild(nameElement);
    messageContainer.appendChild(messageElement);
    messageContainer.className = `${isOwnMessage ? 'self-end' : 'self-start'} space-y-1`;

    messages.appendChild(messageContainer);
    messages.scrollTop = messages.scrollHeight;
});

// Notifikasi ketika ada yang bergabung
socket.on('join', (nickname) => {
    const messages = document.getElementById('messages');
    const notificationElement = document.createElement('div');

    notificationElement.textContent = `${nickname} has joined the chat`;
    notificationElement.className = 'text-center text-green-500 text-sm my-2';

    messages.appendChild(notificationElement);
    messages.scrollTop = messages.scrollHeight;
});
