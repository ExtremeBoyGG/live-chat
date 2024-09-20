const socket = io();

document.getElementById('nickname-button').addEventListener('click', () => {
    const nickname = document.getElementById('nickname-input').value;
    if (nickname) {
        socket.emit('join', nickname);
    }
});

// Trigger "Join" button by pressing Enter
document.getElementById('nickname-input').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        document.getElementById('nickname-button').click();
    }
});

socket.on('joinSuccess', (nickname) => {
    document.getElementById('nickname-container').style.display = 'none';
    document.getElementById('chat-container').style.display = 'flex';
});

socket.on('usernameError', (message) => {
    alert(message); // Show error message if username is taken
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
    const timestampElement = document.createElement('div');

    const isOwnMessage = data.nickname === document.getElementById('nickname-input').value;

    nameElement.textContent = data.nickname;
    nameElement.className = 'text-xs text-gray-500';

    messageElement.textContent = data.message;
    messageElement.className = `
        inline-block p-2 rounded-lg max-w-xs
        ${isOwnMessage ? 'bg-blue-500 text-white self-end' : 'bg-gray-300 self-start'}
    `;

    // Mengonversi waktu dari UTC ke WIB
    const localTimestamp = new Date(data.timestamp).toLocaleString('id-ID', {
        timeZone: 'Asia/Jakarta',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });

    timestampElement.textContent = `${localTimestamp} WIB`;
    timestampElement.className = 'text-xs text-gray-400';

    messageContainer.appendChild(nameElement);
    messageContainer.appendChild(messageElement);
    messageContainer.appendChild(timestampElement);
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

// Handle previous messages when joining
socket.on('previousMessages', (messages) => {
    messages.forEach((data) => {
        const messageContainer = document.createElement('div');
        const messageElement = document.createElement('div');
        const nameElement = document.createElement('div');
        const timestampElement = document.createElement('div');

        nameElement.textContent = data.nickname;
        nameElement.className = 'text-xs text-gray-500';

        messageElement.textContent = data.message;
        messageElement.className = `
            inline-block p-2 rounded-lg max-w-xs
            ${data.nickname === document.getElementById('nickname-input').value ? 'bg-blue-500 text-white self-end' : 'bg-gray-300 self-start'}
        `;

        // Tampilkan waktu dengan format Indonesia
        timestampElement.textContent = `${new Date(data.timestamp).toLocaleString('id-ID', {
            timeZone: 'Asia/Jakarta', // Pastikan kita menggunakan zona waktu Jakarta
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        })} WIB`;
        
        timestampElement.className = 'text-xs text-gray-400';

        messageContainer.appendChild(nameElement);
        messageContainer.appendChild(messageElement);
        messageContainer.appendChild(timestampElement);
        messageContainer.className = `${data.nickname === document.getElementById('nickname-input').value ? 'self-end' : 'self-start'} space-y-1`;

        document.getElementById('messages').appendChild(messageContainer);
    });
});
