
export interface ParseResponse {
  title: string,
  snippet: string,
  favicon?: string,
  /** probably going to skip this, too much time to set up a puppeteer rig */
  'large-image'?: string,
}
