import fs from 'fs-extra';
import store from './storage-utils';
import * as metadata from './file-utils/metadata';


export default class RecordingsManager{

  recordings: {[key: string]: {name: string, uuid: string, created: Date, processed: boolean}} = {}
  recordingDirectory: string
  // this is a callback that need to be called to update the recordings list in the main thread
  onUpdate: {(): void}

  constructor(recordingDirectory: string, onUpdate: {(): void}){
    this.recordingDirectory = recordingDirectory+"/";
    this.onUpdate = onUpdate;
  }

  toClient(): {name: string, uuid: string, created: Date, processed: boolean}[]{
    let recordings: {name: string, uuid: string, created: Date, processed: boolean}[] = [];
    Object.values(this.recordings).forEach((recording) => {
      recordings.push({name: recording.name, uuid: recording.uuid, created: recording.created, processed: recording.processed});
    });
    recordings = recordings.sort(function(a, b) {
      const x = a.created; const y = b.created;
      return ((x > y) ? -1 : ((x < y) ? 1 : 0));
    });
    return recordings;
  }

  private getFirstTime(stats: fs.Stats){
    const times = [stats.birthtime, stats.mtime, stats.ctime];
    const min = times.reduce((first, second) => first < second ? first : second );
    return(min);
  }

  //TODO optimize readDirectories to only process new files and not old ones
  readDirectories(processFolders = true): Promise<{[key: string]: {name: string, created: Date, processed: boolean}}>{
    return new Promise(((resolve, reject) => {
      fs.readdir(this.recordingDirectory, (err, files) => {
        if (err != null){
          console.log(`There was an error reading the recording directory: ${err.message}`);
          reject(err);
          return;
        }

        //clear array
        this.recordings = {};
        
        //add each iteration as a promise to do async, then promise.all to join it back up
        const readPromises: Promise<void>[] = [];
        const pushPromises: Promise<void>[] = [];
        files.forEach(file => {
          readPromises.push(
            new Promise((resolve) => {
              const fullFile = this.recordingDirectory+file;
              //only include folders in index
              const stats = fs.statSync(fullFile);
              // if file is a zip then add to the list, we're done
              if (stats.isDirectory()){

                if (metadata.hasUuid(fullFile)){
                  //save by uuid
                  pushPromises.push(new Promise<void> ((resolve) => {
                    metadata.getUuid(fullFile).then((uuid) => {
                      this.recordings[uuid] = {name: file, uuid: uuid, created: this.getFirstTime(stats), processed: true};
                      resolve();
                    });
                  }));
                } else {
                  //we'll need to generate a uuid before we can do anything
                  pushPromises.push(new Promise<void> ((resolve) => {
                    metadata.setUuid(fullFile).then((uuid) => {
                      this.recordings[uuid] = {name: file, uuid: uuid, created: this.getFirstTime(stats), processed: false};
                      store(file).then(() => {
                        this.recordings[uuid].processed = true;
                        //make sure to call update again
                        this.onUpdate();
                      });
                      resolve();
                    });
                  }));
                }

              // if not then we have to process it if its a folder or delete it otherwise
              } else {
                fs.unlink(fullFile);
              }
              resolve();
            })
          );
        });
        //Posible implementation with callbacks
        Promise.all(readPromises).then(() => {
          Promise.all(pushPromises).then(() => {
            this.onUpdate();
            resolve(this.recordings);
          });
        });
        
      });
    }));
  
  }
}
