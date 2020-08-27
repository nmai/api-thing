import multer from 'multer';
import { v4 as uuid } from 'uuid';
import {
  createReadStream,
  ReadStream,
  promises as fs
} from 'fs';

/**
 * Set up a multer instance with disk storage config for uploads
 */

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './file-cabinet')
  },
  filename: function (req, file, cb) {
    // make a unique name so we don't see collisions
    cb(null, `${uuid()}.${file.originalname.split('.').pop()}`);
  }
})
export const uploader = multer({ storage });

/** manager */
export class FileManager {

  /**
   * looks like multer does all the heavy lifting
   */
  public static async processUpload(file: Express.Multer.File): Promise<string> {
    if (file == null)
      throw new Error('Could not find the file. Please attach it to the "file" field.');
    
    return file.filename;
  }

  /** assist with downloads */
  public static async getFilestream(filename: string): Promise<ReadStream> {
    // the unhandled error would be sufficient but is messy, and exposes internal filesystem paths
    try {
      await fs.access(`./file-cabinet/${filename}`);
    } catch(e) {
      throw new Error('Bad identifier provided, file not found');
    }
    return createReadStream(`./file-cabinet/${filename}`);
  }

}



// ensures the directory exists on app launch.
// this will execute in subsequent cycles but should be fine, unless we get
// an upload request in the very first millisecond of app launch
(async () => {
  try {
    // try to make the folder
    await fs.mkdir('./file-cabinet');
  } catch(e) {
    // suppress - the folder already exists 
  }
})();