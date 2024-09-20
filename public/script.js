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
    appendMessage(data);
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
        appendMessage(data);
    });
});

socket.on('leave', (nickname) => {
    const messages = document.getElementById('messages');
    const notificationElement = document.createElement('div');

    notificationElement.textContent = `${nickname} has left the chat`;
    notificationElement.className = 'text-center text-red-500 text-sm my-2';

    messages.appendChild(notificationElement);
    messages.scrollTop = messages.scrollHeight;
});

// Fungsi untuk menambahkan pesan
function appendMessage(data) {
    const messages = document.getElementById('messages');
    const messageContainer = document.createElement('div');
    const messageElement = document.createElement('div');
    const nameElement = document.createElement('div');
    const timestampElement = document.createElement('div');

    const nickname = document.getElementById('nickname-input').value; // Get current nickname
    const isOwnMessage = data.nickname === nickname;

    nameElement.textContent = data.nickname;
    nameElement.className = 'text-xs text-gray-500';

    messageElement.textContent = data.message;
    messageElement.className = `
        inline-block p-2 rounded-lg max-w-xs
        ${isOwnMessage ? 'bg-blue-500 text-white self-end' : 'bg-gray-300 self-start'}
    `;

    // Format tanggal
    const date = new Date(data.timestamp);
    const formattedDate = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()} ${date.toLocaleTimeString('id-ID', {
        timeZone: 'Asia/Jakarta',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    })} WIB`;

    timestampElement.textContent = formattedDate;
    timestampElement.className = 'text-xs text-gray-500 text-right mt-1'; // Right align and add margin top

    messageContainer.appendChild(nameElement);
    messageContainer.appendChild(messageElement);
    messageContainer.appendChild(timestampElement);
    messageContainer.className = `${isOwnMessage ? 'self-end text-right' : 'self-start'} space-y-1`;

    messages.appendChild(messageContainer);
    messages.scrollTop = messages.scrollHeight;
}
