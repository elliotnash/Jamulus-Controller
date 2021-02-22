import fs from 'fs-extra';
import store from './storage-utils';


export default class RecordingsManager{

  recordings: {[key: string]: {name: string, created: Date, processed: boolean}} = {}
  recordingDirectory: string
  // this is a callback that need to be called to update the recordings list in the main thread
  onUpdate: {(): void}

  constructor(recordingDirectory: string, onUpdate: {(): void}){
    this.recordingDirectory = recordingDirectory+"/";
    this.onUpdate = onUpdate;
  }

  toClient(): {name: string, created: Date, processed: boolean}[]{
    let recordings: {name: string, created: Date, processed: boolean}[] = [];
    Object.values(this.recordings).forEach((recording) => {
      recordings.push({name: recording.name.slice(0, -4), created: recording.created, processed: recording.processed});
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

  readDirectories(zipFolders = true): Promise<{[key: string]: {name: string, created: Date, processed: boolean}}>{
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
        const promises: Promise<void>[] = [];
        files.forEach(file => {
          promises.push(
            new Promise((resolve) => {
              //only include folders in index
              const stats = fs.statSync(this.recordingDirectory+file);
              // if file is a zip then add to the list, we're done
              if (file.slice(-4)=='.zip'){
                this.recordings[file] = {name: file, created: this.getFirstTime(stats), processed: true};
              // if not then we have to process it if its a folder or delete it otherwise
              } else {
                if (zipFolders){
                  if(stats.isDirectory()){
                    //only do if hasn't already been zipped
                    const zipname = file+".zip";
                    if (!fs.existsSync(this.recordingDirectory+zipname)){
                      //add object with processed set to true false
                      this.recordings[zipname] = {name: zipname, created: this.getFirstTime(stats), processed: false};
                      store(this.recordingDirectory+file).then(() => {
                        this.recordings[zipname].processed = true;
                        //make sure to call update again
                        this.onUpdate();
                      });
                    } else {
                      //TODO should probably delete the folder, not quite wanting to do that now
                    }
                  } else {
                    fs.unlink(file);
                  }
                }
              }
              resolve();
            })
          );
        });
        //Posible implementation with callbacks
        Promise.all(promises).then(() => {
          this.onUpdate();
          resolve(this.recordings);
        });
        
      });
    }));
  
  }
}
