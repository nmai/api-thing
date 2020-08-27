import multer from 'multer';
import { v4 as uuid } from 'uuid';
import { promises as fs } from 'fs';

/**
 * Just sets up a multer instance with disk storage config for uploads
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
