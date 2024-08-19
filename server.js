const express=require('express');
const http = require('http');
const socketIo=require('socket.io');

const app=express();
const server=http.Server(app);
const io=socketIo(server);

app.use(express.static('public'));

io.on('connection', (socket)=> {
    console.log("TESSSSSs")
    let nickname;

     socket.on('join', (name) => {
        nickname = name;
        socket.broadcast.emit('join', nickname);
    });

    socket.on('message', (message) => {
        console.log("PESAN")
        io.emit('message', {nickname,message})
    })
    socket.on('disconnect', () => {
        if (nickname) {
            socket.broadcast.emit('leave', nickname);
        }
    });
})
server.listen(process.env.PORT || 5000, () => {
    console.log('listening on port')
})