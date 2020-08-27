import axios from 'axios';
import { parse } from 'node-html-parser';
import {
  createReadStream,
  ReadStream,
  promises as fs
} from 'fs';

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