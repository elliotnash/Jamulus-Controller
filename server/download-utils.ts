import fs from 'fs-extra';
import nanoid from 'nanoid';

export default class DownloadUtils {

    downloadTokens: {[key: string]: {path: string, created: number}} = {}
    expireTime: number

    constructor(expireTime: number){
        this.expireTime = expireTime;
    }

    createDownload(filePath: string): Promise<string> {
    
        return new Promise((resolve, reject) => {
            // Check the existence of the file
            if (!fs.existsSync(filePath)) return;
        
            const downloadToken = nanoid.nanoid(48);
            
            this.downloadTokens[downloadToken] = {
                path: filePath,
                created: Date.now()
            };

            resolve(downloadToken);

        });
    }

    getDownload(token: string){
        return new Promise<string>((resolve, reject) => {
            if (token in this.downloadTokens){
                const download = this.downloadTokens[token];
                
                if (download.created > (Date.now() - (this.expireTime*60000))){
                    
                    return resolve(download.path);
                }
            }

            delete this.downloadTokens[token];
            reject();

        });
    }
}