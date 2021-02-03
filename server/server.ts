import fs from 'fs-extra';
import path from 'path';
import os from 'os-utils';
import { exec } from "child_process";
import nanoid from 'nanoid';
import express from 'express';
const app = express()
const server = require('http').createServer(app);
import * as SocketIO from 'socket.io'
const io = require('socket.io')(server, {cors: {origin: '*'} });
import zipper from 'zip-a-folder';
import passwordHash from 'password-hash';
import exitHook from 'exit-hook';

import store from './storage-utils';
import DownloadUtils from './download-utils';
import RecordingsManager from './recordings-manager';

const config = require('../config.json');
config.recordingDirectory = config.recordingDirectory+"/";
const users: any = config.users

const downloadUtils = new DownloadUtils(config.downloadExpireTime);
const recordingsManager = new RecordingsManager();

//TODO add resync button to sync recording state
//TODO warning prompt when deleting file (client)
//FIXME Clicking delete on dialog box instantly closes dialog

app.use(express.static(path.join(__dirname, './client')));


app.get('/download', function(req, res, next) {
    // Get the download sid
    const token = req.query.token as string;
  
    // Get the download file path
    downloadUtils.getDownload(token).then((path: string) => {
        res.sendFile(path);
    }).catch(() => {
        res.send('download has expired')
    })
});


app.get('/*', (req,res) => {
    res.sendFile(path.join(__dirname, './client/index.html'));
});

server.listen(config.port, () => {
    const port = server.address().port;
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
        authenticatedSockets.forEach((socket: SocketIO.Socket) => {
            socket.emit('SYSTEM_INFO', systemInfo)
        })
    })
}

const stateRegex = /(Recording state )(enabled|disabled)/gm;
function readRecordState(): boolean {

    let recordState = false;

    exec(`journalctl -u ${config.systemdServiceName} --no-pager -q -n 25`, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        const matches = stdout.match(stateRegex);

        if (matches == null){
            return;
        }

        const lastMatch = matches[matches.length-1];

        //have the last state
        recordState = lastMatch === 'Recording state enabled';

    });

    return recordState;

}

function getFirstTime(stats: fs.Stats){
    const times = [stats.birthtime, stats.mtime, stats.ctime]
    const min = times.reduce((first, second) => first < second ? first : second )
    return(min);
}

setInterval(updateInfo, 1000)

let recordState: boolean = readRecordState();

function changeState(newState: boolean, socket?: SocketIO.Socket){
    if (recordState !== newState){
        //state was changed, time to fire recording change

        exec(`sudo systemctl kill -s SIGUSR2 ${config.systemdServiceName}`, {timeout: 200}, (error, stdout, stderr) => {
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

            if (!newState){
                //this means recording was just stopped, we'll need to update our directory index
                recordingsManager.readDirectories();

            }

        });

    } else {
        updateAuthClientState();
    }
}

const authenticatedSockets: Set<SocketIO.Socket> = new Set()

function updateAuthClientState(){
    authenticatedSockets.forEach(function(socket: any){
        socket.emit('RECORD_TOGGLE', {
            newState: recordState
        });
    })
}

function updateRecordingList(){
    authenticatedSockets.forEach((socket: any) => {
        socket.emit('RECORDINGS_UPDATE', recordingsManager.toClient())
    })
}

io.on('connection', (socket: any) => {

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
        socket.emit('RECORDINGS_UPDATE', recordingsManager.toClient())
    }

    socket.on('authenticate', (data: {user: string, passHash: string}, callback: Function) => {
        if (data == null){
            callback(false)
            return;
        }

        if (data.user in config.users){
            //user exists
            if (passwordHash.verify(users[data.user], data.passHash)){
                //password match! return true
                //add socket to authenticated sockets
                addAuth()
                callback(true)
                return;
            }
        }
        callback(false)
    });

    socket.on('RECORD_TOGGLE', (data: {newState: boolean}) => {

        if (authenticatedSockets.has(socket)) {
            changeState(data.newState, socket);
        }
    });


    // socket.on('RECORDINGS_UPDATE', (data) => {

    // });

    socket.on('DOWNLOAD_FILE', (file: string, callback: Function) => {
        
        if (authenticatedSockets.has(socket)) {
            console.log(socket.handshake.address+" is downloading a file");

            downloadUtils.createDownload(config.recordingDirectory+"/"+file+".zip").then((token) => {
                callback(`/download?token=${token}`);
            });

            
        }
    })

    socket.on('RENAME_FILE', (data: {newname: string, oldname: string}) => {
        
        if (authenticatedSockets.has(socket)) {

            const oldpath = config.recordingDirectory+"/"+data.oldname+".zip";
            const newpath = config.recordingDirectory+"/"+data.newname+".zip";


            if (!fs.existsSync(oldpath)) return;

            fs.rename(oldpath, newpath, function(err) {
                if ( err )
                    console.log('ERROR: ' + err);
                else{
                    recordingsManager.readDirectories();
                }
            });
            
        }
    })

    socket.on('DELETE_FILE', (file: string) => {
        
        if (authenticatedSockets.has(socket)) {

            const filepath = config.recordingDirectory+"/"+file


            if (!fs.existsSync(filepath)) return;
            
            console.log('deleting '+filepath)

            fs.remove(filepath).then(() => {
                recordingsManager.readDirectories();
            });
            
        }
    })



})

exitHook(() => {
    console.log('\nShutting down')
    //make sure to stop recordings
    console.log('Stopping recording if running')
    changeState(false);
})
