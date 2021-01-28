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
const fs = require('fs');

const config = require('./config.example.json');
// for (const [key, value] of Object.entries(config.users)) {
//     config.users[key] = passwordHash.generate(value)
// }


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

const stateRegex = /(Recording state )(enabled|disabled)/gm;
function readRecordState(){

    exec(`journalctl -u ${config.systemdServiceName} --no-pager -q -n 25`, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return false;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return false;
        }
        let matches = stdout.match(stateRegex);

        if (matches == null){
            return false;
        }

        let lastMatch = matches[matches.length-1];

        //have the last state
        return lastMatch === 'Recording state enabled';

    });

}

function readDirectories(){
    return new Promise(((resolve, reject) => {
        fs.readdir(config.recordingDirectory, (err, files) => {
            if (err != null){
                console.log(`There was an error reading the recording directory: ${err}`)
                reject(err);
                return;
            }

            //clear array
            recordings = []

            files.forEach(file => {
                recordings.push({name: file});
            })
            resolve();
        })
    }));

}

readDirectories()

setInterval(updateInfo, 1000)
//setInterval(readRecordState, 900)

let recordState = readRecordState();

function changeState(newState, socket){
    if (recordState !== newState){
        //state was changed, time to fire recording change

        exec(`sudo systemctl kill -s SIGUSR2 ${config.systemdServiceName}`, {timeout: 20}, (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                console.log('Jamulus is most likely not running')
                //emit error to socket who initiated if socket passed
                //TODO make client handle socket NOT_RUNNING
                if (socket) {
                    socket.emit('NOT_RUNNING');
                }
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }
            //command went through
            //set local status
            recordState = newState

            //update all clients
            updateAuthClientState();

            //sync real state now - seems like time with least interference
            recordState = readRecordState();

            if (!newState){
                //this means recording was just stopped, we'll need to update our directory index
                readDirectories().then(() => {
                    //now push files to all
                    updateRecordingList();
                });
                //

            }

        });

    } else {
        updateAuthClientState();
    }
}

let authenticatedSockets = new Set()

let recordings = []

function updateAuthClientState(){
    authenticatedSockets.forEach((socket) => {
        socket.emit('RECORD_TOGGLE', {
            newState: recordState
        });
    })
}

function updateRecordingList(){
    authenticatedSockets.forEach((socket) => {
        socket.emit('RECORDINGS_UPDATE', recordings)
    })
}

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
        //and recording list
        socket.emit('RECORDINGS_UPDATE', recordings)
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
            changeState(data.newState, socket);
        }
    });

    socket.on('RECORDINGS_UPDATE', (data) => {

    });

})

exitHook(() => {
    console.log('\nShutting down')
    //make sure to stop recordings
    console.log('Stopping recording if running')
    changeState(false);
})
