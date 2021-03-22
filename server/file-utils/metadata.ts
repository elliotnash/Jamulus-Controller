import fs from 'fs-extra';
import uuid from 'uuid-random';

const META_FILE = '/.jamulus';

export function getUuid(folder: string): Promise<string> {
  return new Promise<string>((resolve) => {
    const file = folder+META_FILE;
    fs.readFile(file, 'utf8', (err, data) => {
      if (err || !uuid.test(data) ){
        setUuid(folder, true).then((fileUuid) => {
          resolve(fileUuid);
        });
      } else {
        resolve(data);
      }

    });
  });
}

export function setUuid(folder: string, force = false): Promise<string> {
  return new Promise<string>((resolve) => {
    const file = folder+META_FILE;
    if (fs.existsSync(file) && !force){
      resolve('');
      return;
    }
    if (!fs.pathExistsSync(folder)){
      resolve('');
      return;
    }
    
    const writeStream = fs.createWriteStream(file);
    const fileUuid = uuid();
    writeStream.write(fileUuid);
    writeStream.end();

    resolve(fileUuid);
  });
}

export function hasUuid(folder: string): boolean {
  return fs.existsSync(folder+META_FILE);
}
