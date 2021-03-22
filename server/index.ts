import fs from 'fs-extra';
import path from 'path';
import os from 'os-utils';
import { exec } from "child_process";
import express from 'express';
const app = express();
import * as http from "http";
const server = http.createServer(app);
import * as SocketIO from 'socket.io';
import * as archiver from 'archiver';
const io = new SocketIO.Server(server, {cors: {origin: '*'} });
import passwordHash from 'password-hash';
import exitHook from 'exit-hook';

import DownloadUtils from './download-utils';
import RecordingsManager from './recordings-manager';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require('./config.json') as { port: string, users: { [key: string]: string }, systemdServiceName: string, recordingDirectory: string, downloadExpireTime: number };
config.recordingDirectory = config.recordingDirectory + "/";

const users: { [key: string]: string } = {};
for (const [key, value] of Object.entries(config.users)) {
  users[key.toLowerCase()] = value;
}


const recordingsManager = new RecordingsManager(config.recordingDirectory, () => {
  updateRecordingList();
});
const downloadUtils = new DownloadUtils(config.downloadExpireTime, recordingsManager);

//TODO really need to figure out file lock - the renaming system right now is probably super jank
//Potentially add a socket channel for closing dialog remotely? or at least updating info (maybe unneccesarry)
//TODO use uuids instead of file names
//TODO setup nodemon to allow auto reload for dev
//TODO add resync button to sync recording state
//TODO warning prompt when deleting file (client)

app.set('trust proxy', true);
app.use(express.static(path.join(__dirname, './client')));


//TODO send client session key when login and reauth, then use session key for downloads and stuff
//instead of creating per download tokens
app.get('/download', function(req, res, next) {
  // Get the download sid
  const token = req.query.token as string;
  const track = req.query.track as string;

  if (track == "master"){
    downloadUtils.getDownload(token).then((path) => {

      console.log(`${req.ip.substr( req.ip.lastIndexOf(':')+1 )} is downloading ${path}/master.mp3`);
  
      res.sendFile(`${path}/master.mp3`);
  
    }).catch(() => {
      next();
    });
  } else {
    // Get the download file path for zip
    downloadUtils.getDownload(token).then((path) => {

      console.log(`${req.ip.substr( req.ip.lastIndexOf(':')+1 )} is downloading ${path}`);

      const zip = archiver.create('zip');
      res.attachment(`${path.substr( path.lastIndexOf('/')+1 )}.zip`);
      zip.pipe(res);
      zip.directory(path, false).finalize();

    }).catch(() => {
      next();
    });
  }
});


app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, './client/index.html'));
});

server.listen(config.port, () => {
  console.log('Server listening at http://localhost:' + config.port);
});

const totalMem = Math.round(os.totalmem());
function updateInfo() {
  os.cpuUsage(function (cpuUsage) {
    const systemInfo = {
      cpuUsage: Math.round(cpuUsage * 100),
      totalMem: totalMem,
      memUsed: Math.round(totalMem - os.freemem())
    };
    authenticatedSockets.forEach((socket: SocketIO.Socket) => {
      socket.emit('SYSTEM_INFO', systemInfo);
    });
  });
}

//FIXME when read record state, also check if jamulus server is online, if it's offline default to false

const stateRegex = /(Recording state )(enabled|disabled)/gm;
function readRecordState(): Promise<boolean> {
  return new Promise<boolean>(((resolve) => {

    //first test make sure jamulus is running
    exec(`systemctl is-active --quiet ${config.systemdServiceName}`, (error) => {
      const running = error ? error.code == 0 : true;
      console.log(running ? "jamulus is running" : "jamulus is not running");
      if (!running) resolve(false);

      //now read logs
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

        if (matches == null) {
          resolve(false);
          return;
        }

        const lastMatch = matches[matches.length - 1];
        //have the last state
        resolve(lastMatch == 'Recording state enabled');

      });
    });

  }));
}

setInterval(updateInfo, 1000);

let recordState = false;
readRecordState().then((state) => {
  recordState = state;
  recordingsManager.readDirectories(!recordState);
  updateAuthClientState();
});

function changeState(newState: boolean, socket?: SocketIO.Socket) {
  if (recordState !== newState) {
    //state was changed, time to fire recording change

    exec(`sudo systemctl kill -s SIGUSR2 ${config.systemdServiceName}`, { timeout: 200 }, (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`);
        console.log('Jamulus is most likely not running');
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
      recordState = newState;

      //update all clients
      updateAuthClientState();

      if (!newState) {
        //this means recording was just stopped, we'll need to encode audio + zip directory
        recordingsManager.readDirectories();

      }

    });

  } else {
    updateAuthClientState();
  }
}

const authenticatedSockets: Set<SocketIO.Socket> = new Set();

function updateAuthClientState() {
  authenticatedSockets.forEach(function (socket) {
    socket.emit('RECORD_TOGGLE', {
      newState: recordState
    });
  });
}

function updateRecordingList() {
  authenticatedSockets.forEach((socket) => {
    socket.emit('RECORDINGS_UPDATE', recordingsManager.toClient());
  });
}

io.on('connection', (socket: SocketIO.Socket) => {

  socket.on('disconnect', () => {
    //remove socket from authenticated users
    authenticatedSockets.delete(socket);
  });

  function addAuth() {
    authenticatedSockets.add(socket);
    //make sure to update recording state on authentication
    socket.emit('RECORD_TOGGLE', {
      newState: recordState
    });
    //and recording list
    socket.emit('RECORDINGS_UPDATE', recordingsManager.toClient());
  }

  socket.on('authenticate', (data: { user: string, passHash: string }, callback: { (status: string): void }) => {
    if (data == null) {
      callback('');
      return;
    }

    data.user = data.user.toLowerCase();
    if (data.user in users) {
      //user exists
      if (passwordHash.verify(users[data.user], data.passHash)) {
        //password match! return true
        //add socket to authenticated sockets
        addAuth();
        callback('success');
      } else {
        callback('password');
      }
    } else {
      callback('username');
    }
  });

  socket.on('RECORD_TOGGLE', (data: { newState: boolean }) => {

    if (authenticatedSockets.has(socket)) {
      changeState(data.newState, socket);
    }
  });


  // socket.on('RECORDINGS_UPDATE', (data) => {

  // });

  socket.on('DOWNLOAD_FILE', (uuid: string, callback: {(token: string): void}) => {
      
    if (authenticatedSockets.has(socket)) {
      downloadUtils.createDownload(uuid).then((token) => {
        callback(`/download?token=${token}`);
      });


    }
  });

  socket.on('RENAME_FILE', (data: {uuid: string, newname: string}) => {
      
    if (authenticatedSockets.has(socket)) {

      const oldpath = config.recordingDirectory+"/"+recordingsManager.recordings[data.uuid]?.name;
      const newpath = config.recordingDirectory+"/"+data.newname;


      if (!fs.existsSync(oldpath)) return;

      fs.rename(oldpath, newpath, function (err) {
        if (err)
          console.log(`ERROR: ${err.message}`);
        else {
          recordingsManager.readDirectories();
        }
      });

    }
  });

  socket.on('DELETE_FILE', (uuid: string) => {
      
    if (authenticatedSockets.has(socket)) {

      const filepath = config.recordingDirectory+"/"+recordingsManager.recordings[uuid]?.name;


      if (!fs.existsSync(filepath)) return;

      console.log('deleting ' + filepath);

      fs.remove(filepath).then(() => {
        recordingsManager.readDirectories();
      });

    }
  });



});

exitHook(() => {
  console.log('\nShutting down');
  //make sure to stop recordings
  console.log('Stopping recording if running');
  changeState(false);
});
