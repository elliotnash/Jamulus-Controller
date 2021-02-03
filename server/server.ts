import path from 'path';
import os from 'os-utils';
import { exec } from "child_process";
import nanoid from 'nanoid';
import express from 'express';
const app = express()
const server = require('http').createServer(app);
import * as SocketIO from 'socket.io'
const io = require('socket.io')(server, {
    cors: {
        origin: '*'
    }
});
import zipper from 'zip-a-folder';
import passwordHash from 'password-hash';
import exitHook from 'exit-hook';
import fs from 'fs';


const config = require('../config.json');
const users: any = config.users

//TODO add resync button to sync recording state

app.use(express.static(path.join(__dirname, './client')));


app.get('/download', function(req, res, next) {
    // Get the download sid
    let token = req.query.token as string;
  
    // Get the download file path
    getDownload(token).then((path: string) => {
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
function readRecordState(): Boolean {

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
        let matches = stdout.match(stateRegex);

        if (matches == null){
            return;
        }

        let lastMatch = matches[matches.length-1];

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

function readDirectories(deleteNonZip?: Boolean){
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
                //only include folders in index
                const stats = fs.statSync(config.recordingDirectory+"/"+file);
                if (stats.isDirectory()){
                    recordings.push({name: file, created: getFirstTime(stats)});
                } else if (deleteNonZip){
                    //then we should delete all other files
                    fs.unlink(config.recordingDirectory+"/"+file, (err) => {
                        if (err) console.log(err);
                    });
                }
            })
            recordings = recordings.sort(function(a, b) {
                var x = a.created; var y = b.created;
                return ((x > y) ? -1 : ((x < y) ? 1 : 0));
            });
            updateRecordingList();
            resolve(recordings);
        })
    }));

}

readDirectories(false);

setInterval(updateInfo, 1000)

let recordState: Boolean = readRecordState();

function changeState(newState: Boolean, socket?: SocketIO.Socket){
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
                readDirectories(false).then(() => {
                });
                //

            }

        });

    } else {
        updateAuthClientState();
    }
}

let authenticatedSockets: Set<SocketIO.Socket> = new Set()

let recordings: {name: string, created: Date}[] = []

function updateAuthClientState(){
    authenticatedSockets.forEach(function(socket: any){
        socket.emit('RECORD_TOGGLE', {
            newState: recordState
        });
    })
}

function updateRecordingList(){
    authenticatedSockets.forEach((socket: any) => {
        socket.emit('RECORDINGS_UPDATE', recordings)
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
        socket.emit('RECORDINGS_UPDATE', recordings)
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

            createDownload(config.recordingDirectory+"/"+file).then((token) => {
                //zip-a-file sometimes calls the callback before zip is done,
                //need to set small timeout before sending ready callback
            setTimeout(() => {
                callback(`/download?token=${token}`);
            }, 500);
            });

            
        }
    })

    socket.on('RENAME_FILE', (data: {newname: string, oldname: string}) => {
        
        if (authenticatedSockets.has(socket)) {

            const oldpath = config.recordingDirectory+"/"+data.oldname
            const newpath = config.recordingDirectory+"/"+data.newname


            if (!fs.existsSync(oldpath)) return;

            fs.rename(oldpath, newpath, function(err) {
                if ( err )
                    console.log('ERROR: ' + err);
                else{
                    readDirectories(false);
                }
            });
            
        }
    })

    socket.on('DELETE_FILE', (file: string) => {
        
        if (authenticatedSockets.has(socket)) {

            const filepath = config.recordingDirectory+"/"+file


            if (!fs.existsSync(filepath)) return;
            
            console.log('deleting '+filepath)

            fs.rmdir(filepath, {recursive: true}, (err) => {
                if ( err )
                    console.log('ERROR: ' + err);
                else{
                    readDirectories(false);
                }
            });
            
        }
    })



})


function zip(path: string) {
    return new Promise((resolve, reject) => {

        const zippath = path+".zip";

        if (fs.existsSync(zippath)) {
            console.log('path exists, not zipping')
            resolve(zippath);
            return;
        }
        zipper.zipFolder(path, zippath, (err) => {
            err ? reject(err) : resolve(zippath);
        })
    });
}


let downloadTokens: {[key: string]: {path: string, created: number}} = {}

function createDownload(filePath: string) {
  
    return new Promise((resolve, reject) => {
        // Check the existence of the file
        if (!fs.existsSync(filePath)) return;
    
        zip(filePath).then((zippath) => {
                // Generate the download token
            let downloadToken = nanoid.nanoid(48);
            
            downloadTokens[downloadToken] = {
                path: filePath+".zip",
                created: Date.now()
            }

            resolve(downloadToken);

        }).catch((err) => {
            console.log(err);
        })

    });
}

function getDownload(token: string){
    return new Promise<string>((resolve, reject) => {
        if (token in downloadTokens){
            let download = downloadTokens[token];
            
            if (download.created > (Date.now() - (config.downloadExpireTime*60000))){
                ;
                return resolve(download.path);
            }
        }

        delete downloadTokens[token];
        reject();

    })
}

exitHook(() => {
    console.log('\nShutting down')
    //make sure to stop recordings
    console.log('Stopping recording if running')
    changeState(false);
})
