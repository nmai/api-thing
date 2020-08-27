import axios from 'axios';
import { parse } from 'node-html-parser';
import { ParseResponse } from '../model/parse';

export class ParseManager {

  public static async parseFromUrl(url: string): Promise<ParseResponse> {
    const res = await axios.get(url);

    // @todo - handle exceptions. this lib can't process malformed html
    const parsed = parse(res.data);

    const htmlNode = parsed.childNodes.find( n => (n as any).tagName == 'html' );

    const headNode = htmlNode.childNodes.find( n => (n as any).tagName == 'head' );
    const bodyNode = htmlNode.childNodes.find( n => (n as any).tagName == 'body' );

    const titleNode = headNode.childNodes.find( n => (n as any).tagName == 'title' );
    const descriptionNode = headNode.childNodes.find( n => (n as any).tagName == 'meta' && (n as any).attributes?.['name'] == 'description');

    return {
      title: titleNode?.text ?? 'No title found',
      favicon: 'asdf',
      snippet: (descriptionNode as any)?.attributes?.['content'] ?? 'No description found',
    };
  }

}