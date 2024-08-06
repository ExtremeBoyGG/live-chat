const express=require('express');
const http = require('http');
const socketIo=require('socket.io');

const app=express();
const server=http.createServer(app);
const io=socketIo(server);

app.use(express.static(__dirname+'/public'));

io.on('connection', (socket)=> {
    console.log("TESSSSSs")
    let nickname;

    socket.on('join',(name)=> {
        nickname=name;
        console.log(`${nickname} join the chat`);
    })
    socket.on('message', (message) => {
        console.log("PESAN")
        io.emit('message', {nickname,message})
    })
    socket.on('disconnect', () => {
        console.log(`${nickname} has left the chat`)
    })
})
server.listen(300,() => {
    console.log('listening on port 3000')
})