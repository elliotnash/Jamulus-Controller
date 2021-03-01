import fs from 'fs-extra';
import nanoid from 'nanoid';
import RecordingsManager from './recordings-manager';
export default class DownloadUtils {

  downloadTokens: {[key: string]: {uuid: string, created: number}} = {};
  expireTime: number;
  recordingsManger: RecordingsManager;

  constructor(expireTime: number, recordingsManager: RecordingsManager){
    this.expireTime = expireTime;
    this.recordingsManger = recordingsManager;
  }

  createDownload(uuid: string): Promise<string> {
  
    return new Promise((resolve) => {

      //get file path
      const file = this.recordingsManger.recordings[uuid]?.name;
      console.log("Create download clicked");
      console.log(uuid);
      console.log(file);

      // Check the existence of the file
      if (!fs.existsSync(file)) return;
      
      const downloadToken = nanoid.nanoid(48);
          
      this.downloadTokens[downloadToken] = {
        uuid: uuid,
        created: Date.now()
      };

      resolve(downloadToken);

    });
  }

  getDownload(token: string): Promise<string>{
    return new Promise<string>((resolve, reject) => {
      if (token in this.downloadTokens){
        const download = this.downloadTokens[token];
        
        if (download.created > (Date.now() - (this.expireTime*60000))){
          const file = this.recordingsManger.recordings[download.uuid]?.name;
          return resolve(file);
        }
      }

      delete this.downloadTokens[token];
      reject();

    });
  }
}