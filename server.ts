const path = require('path');
const os = require('os-utils');

const express = require('express');
const app = express()
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
        origin: '*'
    }
});
const passwordHash = require('password-hash')

const config = require('./config.json');
// for (const [key, value] of Object.entries(config.users)) {
//     config.users[key] = passwordHash.generate(value)
// }

let recordState = false;


app.use(express.static(path.join(__dirname, 'build')));

app.get('/*', (req,res) => {
    res.sendFile(path.join(__dirname, 'build/index.html'));
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

setInterval(updateInfo, 30000)

function changeState(newState){
    recordState = newState
}

io.on('connection', (socket) => {
    socket.emit('RECORD_TOGGLE', {
        newState: recordState
    })

    socket.on('disconnect', () => {
    });

    socket.on('authenticate', (data, callback) => {
        if (data == null){
            callback(false)
        }

        if (data.user in config.users){
            //user exists
            if (passwordHash.verify(config.users[data.user], data.passHash)){
                //password match! return true
                console.log('passwords match')
                callback(true)
                return;
            }
        }
        console.log('no match, return false')
        callback(false)
    });

    socket.on('RECORD_TOGGLE', (data) => {
        changeState(data.newState)
        io.emit('RECORD_TOGGLE', {
            newState: recordState
        });
    });
})
