

export default class RecordingsManager{
    //TODO make sure constructor reads recordings on initialization

    recordings: {name: string, created: Date, processed: boolean}[] = []


    toClient(){
        //TODO return recordings without .zip extension
        return this.recordings;
    }


    readDirectories(deleteNonZip?: boolean){
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
                    const x = a.created; const y = b.created;
                    return ((x > y) ? -1 : ((x < y) ? 1 : 0));
                });
                updateRecordingList();
                resolve(recordings);
            })
        }));
    
    }
}
