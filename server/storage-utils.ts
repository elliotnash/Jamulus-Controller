import fs from 'fs-extra';
import { exec } from "child_process";
import zipper from 'zip-a-folder';


export function zip(path: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {

        const zippath = path+".zip";

        zipper.zipFolder(path, zippath, (err) => {
            err ? reject(err) : resolve(zippath);
        });
    });
}

export function encodeAll(folder: string): Promise<void> {
    return new Promise<void>(((resolve, reject) => {

        folder = folder+"/";

        fs.readdir(folder, (err, files) => {
            if (err != null){
                console.log(`There was an error reading the recording directory: ${err}`);
                reject(err);
                return;
            }

            const promises: Promise<void>[] = [];
            let inLength = 0;
            let args = "";

            files.forEach((file) => {
                if (file.slice(-4)=='.wav'){

                    args+=(` -i "${folder+file}"`);
                    ++inLength;

                    promises.push(
                        new Promise<void>(((resolve, reject) => {
                            exec(`ffmpeg -y -i "${folder+file}" -acodec libmp3lame "${folder+file.replace('.wav', '.mp3')}"`, (error, stdout, stderr) => {
                                
                                if (error) {
                                    console.log(`error: ${error.message}`);
                                    reject();
                                    return;
                                }

                                resolve();
                                //file converted to mp3 successfully
                    
                            });
                        }))
                    );
                }
            });

            promises.push(
                new Promise<void>(((resolve, reject) => {
                    exec(`ffmpeg -y${args} -filter_complex amix=inputs=${inLength}:duration=longest "${folder}master.mp3"`, (error, stdout, stderr) => {
                                
                        if (error) {
                            console.log(`error: ${error.message}`);
                            reject();
                            return;
                        }
        
                        resolve();
                        //file converted to mp3 successfully
            
                    });
                }))
            );

            Promise.all(promises).then(() => {
                resolve();
            });

        });

    }));
}

export function deleteWav(folder: string): Promise<void>{
    return new Promise<void>(((resolve, reject) => {
        folder = folder+"/";

        fs.readdir(folder, (err, files) => {
            if (err != null){
                console.log(`There was an error reading the recording directory: ${err}`);
                reject(err);
                return;
            }

            const promises: Promise<void>[] = [];
            
            files.forEach((file) => {
                if (file.slice(-4)=='.wav'){
                    promises.push(
                        new Promise<void>(((resolve, reject) => {
                            fs.unlink(folder+file, (err) => {
                                if (err) {
                                    console.log(err);
                                    reject();
                                } else {
                                    resolve();
                                }
                            });
                        }))
                    );
                }
            });

            Promise.all(promises).then(() => {
                resolve();
            });

        });
    }));
}

export default function store(folder: string): Promise<void> {
    return new Promise<void>(((resolve) => {
        encodeAll(folder).then(() => {
            console.log('converting done');
            deleteWav(folder).then(() => {
                console.log('wavs deleted');
                zip(folder).then(() => {
                    console.log('zipping done');
                    fs.remove(folder).then(() => {
                        console.log('folder deleted');
                        resolve();
                    });
                });
            });
        });
    }));
}
