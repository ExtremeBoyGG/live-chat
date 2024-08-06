const socket = io();

document.getElementById('nickname-button').addEventListener('click', () => {
    const nickname = document.getElementById('nickname-input').value;
    if (nickname) {
        console.log("User joined:", nickname); // Debug log
        document.getElementById('nickname-container').style.display = 'none';
        document.getElementById('chat-container').style.display = 'block';
        socket.emit('join', nickname);
    }
});

document.getElementById('send-button').addEventListener('click', () => {
    const message = document.getElementById('message-input').value;
    if (message) {
        console.log("Message sent:", message); // Debug log
        socket.emit('message', message);
        document.getElementById('message-input').value = '';
    }
});

socket.on('connect', () => {
    console.log('Connected to server'); // Debug log
});

socket.on('connect_error', (err) => {
    console.error('Connection error:', err); // Debug log
});

socket.on('message', (data) => {
    console.log('Message received:', data); // Debug log
    const messages = document.getElementById('messages');
    const messageElement = document.createElement('div');
    messageElement.textContent = `${data.nickname}: ${data.message}`;
    messages.appendChild(messageElement);
    messages.scrollTop = messages.scrollHeight;
});
