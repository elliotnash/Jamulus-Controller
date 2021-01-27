const path = require('path');
const os = require('os-utils');
const { exec } = require("child_process");

const express = require('express');
const app = express()
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
        origin: '*'
    }
});
const passwordHash = require('password-hash')
const exitHook = require('exit-hook')

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
        authenticatedSockets.forEach((socket) => {
            socket.emit('SYSTEM_INFO', systemInfo)
        })
    })
}

setInterval(updateInfo, 1000)

function changeState(newState){
    if (recordState !== newState){
        recordState = newState

        //state was changed, time to fire recording change



    } else {

    }

    authenticatedSockets.forEach((socket) => {
        socket.emit('RECORD_TOGGLE', {
            newState: recordState
        });
    })
}

const stateRegex = /(Recording state )(enabled|disabled)/gm;
function readRecordState(){

    exec(`journalctl -u ${config.systemdServiceName} --no-pager -q -n 25`, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        let matches = stdout.match(stateRegex);
        let lastMatch = matches[matches.length-1];

        //have the last state
        if (lastMatch === 'Recording state enabled'){
            console.log('Recording is enabled')
        } else {
            console.log('Recording is disabled')
        }

    });

}

readRecordState();

let authenticatedSockets = new Set()

io.on('connection', (socket) => {

    socket.on('disconnect', () => {
        //remove socket from authenticated users
        authenticatedSockets.delete(socket);
    });

    function addAuth(){
        authenticatedSockets.add(socket)
        //make sure to update recording state on authentication
        socket.emit('RECORD_TOGGLE', {
            newState: recordState
        });
    }

    socket.on('authenticate', (data, callback) => {
        if (data == null){
            callback(false)
            return;
        }

        if (data.user in config.users){
            //user exists
            if (passwordHash.verify(config.users[data.user], data.passHash)){
                //password match! return true
                //add socket to authenticated sockets
                addAuth()
                callback(true)
                return;
            }
        }
        callback(false)
    });

    socket.on('RECORD_TOGGLE', (data) => {

        if (authenticatedSockets.has(socket)) {
            changeState(data.newState)
        }
    });
})

exitHook(() => {
    console.log('Shutting down')
    //make sure to stop recordings
    changeState(false);
})
