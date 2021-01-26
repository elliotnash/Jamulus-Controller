const path = require('path');

const express = require('express');
const app = express()
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const config = require('./config.json');


app.use(express.static(path.join(__dirname, 'vue/dist')));

app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, 'vue/dist/index.html'));
});

http.listen(config.port, () => {
    const port = http.address().port;
    console.log('Server listening at http://localhost:%s', port)
});

io.on('connection', function(socket) {
    console.log('Client connected to the WebSocket');

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });

    socket.on('chat message', function(msg) {
        console.log("Received a chat message");
        io.emit('chat message', msg);
    });
})
