import axios from 'axios';
import { parse } from 'node-html-parser';

export class FileManager {


  /**
   * looks like multer does all the heavy lifting
   */
  public static async processUpload(file: Express.Multer.File): Promise<string> {
    if (file == null)
      throw new Error('Could not find the file. Please attach it to the "file" field.');
    
    return file.filename;
  }

}