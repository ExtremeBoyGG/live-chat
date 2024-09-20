const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const dbPath = path.join(__dirname, 'chat.db');
const db = new sqlite3.Database(dbPath);

// Create messages table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nickname TEXT,
    message TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

let activeUsers = {}; // Store active users

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Add a route to serve the index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Fetch previous chat messages from the database
function fetchPreviousMessages(callback) {
    db.all('SELECT * FROM messages ORDER BY timestamp ASC', [], (err, rows) => {
        if (err) {
            console.error(err); // Log error
            return;
        }
        callback(rows);
    });
}

// Save new chat messages to the database with UTC timestamp
function saveMessage(nickname, message) {
    const timestamp = new Date().toISOString(); // Simpan dalam format UTC
    db.run('INSERT INTO messages (nickname, message, timestamp) VALUES (?, ?, ?)', [nickname, message, timestamp], (err) => {
        if (err) {
            console.error(err); // Log error
        }
    });
}

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('join', (nickname) => {
        if (Object.values(activeUsers).includes(nickname)) {
            socket.emit('usernameError', 'Username is already taken');
            return;
        }
        activeUsers[socket.id] = nickname;

        // Notify the user that they successfully joined
        console.log(`${nickname} has joined the chat.`);
        socket.emit('joinSuccess', nickname);

        // Send previous messages
        fetchPreviousMessages((messages) => {
            socket.emit('previousMessages', messages);
        });

        socket.broadcast.emit('join', nickname);
    });

    socket.on('message', (message) => {
        const nickname = activeUsers[socket.id];
        if (nickname) {
            const timestamp = new Date().toISOString(); // Simpan dalam format UTC
            const messageData = { nickname, message, timestamp };
            io.emit('message', messageData);
            saveMessage(nickname, message);
        }
    });

    socket.on('disconnect', () => {
        const nickname = activeUsers[socket.id];
        if (nickname) {
            delete activeUsers[socket.id];
            console.log(`${nickname} has left the chat.`);
            socket.broadcast.emit('leave', nickname);
        }
    });
});

server.listen(5000, () => {
    console.log('Server is running on port 5000');
});
