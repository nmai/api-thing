import axios from 'axios';
import { v2 } from '@google-cloud/translate';
import { parse } from 'node-html-parser';

const translate = new v2.Translate();

export class TranslateManager {

  /**
   * Expects url to be decoded already
   * This method will fail for large pages, as it dumps the whole <body> to Google's
   * translate API, which has a char limit of 30k.
   * 
   * Possible solutions: 
   * - strip all useless nodes (script tags, etc) before taking the raw html string.
   * - split the page into groups of nodes (chunking it) and using the batch translate api.
   *   this can get very complicated as it would require traversing dom tree and taking
   *   it apart dynamically, then putting the response strings back in the same positions.
   * 
   * Leaving as-is though, should be fine for google.com.
   */
  public static async translateFromUrl(url: string): Promise<string> {
    
    const res = await axios.get(url);
    const parsed = parse(res.data);
    const htmlNode = parsed.childNodes.find( n => (n as any).tagName == 'html' );
    const bodyNode = htmlNode.childNodes.find( n => (n as any).tagName == 'body' );

    /** v3 (advanced API- it's a little more complicated than what we need) */
    // const translated = await translate.translateText({
    //   contents: [bodyNode.rawText],
    //   parent: 'projects/api-thing-287606',
    //   mimeType: 'text/html',
    //   targetLanguageCode: 'zh',
    // });

    const translated = await translate.translate([(bodyNode as any).outerHTML], {
      format: 'html',
      to: 'zh',
    });

    const final = translated[0]?.[0];
    if (final == null)
      throw new Error('Translation failed for unknown reason');

    return final;
  }

}