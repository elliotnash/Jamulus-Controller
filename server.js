const path = require('path');
const os = require('os-utils');
const { exec } = require("child_process");
const nanoid = require('nanoid')
const express = require('express');
const app = express()
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
        origin: '*'
    }
});
const zipper = require('zip-a-folder');
const passwordHash = require('password-hash')
const exitHook = require('exit-hook')
const fs = require('fs');

const config = require('./config.json');

//TODO add resync button to sync recording state

app.use(express.static(path.join(__dirname, 'build')));


app.get('/download', function(req, res, next) {
    // Get the download sid
    let token = req.query.token;
  
    // Get the download file path
    getDownload(token).then((path) => {
        res.sendFile(path);
    }).catch(() => {
        res.send('download has expired')
    })
});


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

function getFirstTime(stats){
    const times = [stats.birthtime, stats.mtime, stats.ctime]
    const min = times.reduce((first, second) => first < second ? first : second )
    return(min);
}

function readDirectories(deleteNonDir){
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
                } else if (deleteNonDir){
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
            resolve();
        })
    }));

}

readDirectories(true);

setInterval(updateInfo, 1000)

let recordState = readRecordState();

function changeState(newState, socket){
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
                readDirectories().then(() => {
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
        console.log('')
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

    socket.on('DOWNLOAD_FILE', (file, callback) => {
        
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

    socket.on('RENAME_FILE', (data) => {
        
        if (authenticatedSockets.has(socket)) {

            const oldpath = config.recordingDirectory+"/"+data.oldname
            const newpath = config.recordingDirectory+"/"+data.newname


            if (!fs.existsSync(oldpath)) return;

            fs.rename(oldpath, newpath, function(err) {
                if ( err )
                    console.log('ERROR: ' + err);
                else{
                    readDirectories();
                }
            });
            
        }
    })



})


function zip(path) {
    return new Promise((resolve, reject) => {

        const zippath = path+".zip";

        if (!fs.existsSync(zippath)) resolve(zippath);

        zipper.zipFolder(path, zippath, (err) => {
            err ? reject(err) : resolve(zippath);
        })
    });
}


let downloadTokens = {}

function createDownload(filePath) {
  
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

function getDownload(token){
    return new Promise((resolve, reject) => {
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
