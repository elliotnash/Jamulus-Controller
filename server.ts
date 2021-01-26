const path = require('path');
const os = require('os-utils');

const express = require('express');
const app = express()
const http = require('http').createServer(app);
let jwt = require("jsonwebtoken");
const socketioJwt = require("socketio-jwt");
const io = require('socket.io')(http, {
    cors: {
        origin: '*'
    }
});

const config = require('./config.json');

let recordState = false;


app.use(express.static(path.join(__dirname, 'client/dist')));

app.get('/*', (req,res) => {
    res.sendFile(path.join(__dirname, 'client/dist/index.html'));
});

http.listen(config.port, () => {
    const port = http.address().port;
    console.log('Server listening at http://localhost:%s', port)
});

const totalMem = Math.round(os.totalmem());
function updateInfo() {
    os.cpuUsage( function(cpuUsage) {
        const systemInfo = {
            cpuUsage: Math.round(cpuUsage*100),
            totalMem: totalMem,
            memUsed: Math.round(totalMem-os.freemem())
        }
        io.emit('SYSTEM_INFO', systemInfo)
    })
}

setInterval(updateInfo, 3000)

function changeState(newState){
    recordState = newState
}

io.on('connection', (socket) => {
    console.log('Client connected to the WebSocket');
    socket.emit('RECORD_TOGGLE', {
        newState: recordState
    })

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });

    socket.on('RECORD_TOGGLE', (data) => {
        console.log("Record state toggled");
        console.log(data.newState)
        changeState(data.newState)
        io.emit('RECORD_TOGGLE', {
            newState: recordState
        });
    });
})
