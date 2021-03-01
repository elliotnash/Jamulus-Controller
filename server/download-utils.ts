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
      const file = this.recordingsManger.recordingDirectory + this.recordingsManger.recordings[uuid]?.name;

      // Check the existence of the file
      if (!fs.existsSync(file)) return;
      
      const downloadToken = nanoid.nanoid(48);
          
      this.downloadTokens[downloadToken] = {
        uuid: uuid,
        created: Date.now()
      };
      // schedule downloadToken to be deleted
      setTimeout(() => {
        delete this.downloadTokens[downloadToken];
      }, this.expireTime*60*1000);

      resolve(downloadToken);

    });
  }

  getDownload(token: string): Promise<string>{
    return new Promise<string>((resolve, reject) => {
      if (token in this.downloadTokens){
        const download = this.downloadTokens[token];
        
        const file = this.recordingsManger.recordingDirectory + this.recordingsManger.recordings[download.uuid]?.name;
        return resolve(file);

      }
      
      reject();

    });
  }
}