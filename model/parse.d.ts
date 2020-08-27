
export interface ParseResponse {
  title: string,
  favicon: string,
  snippet: string,
  /** probably going to skip this, too much time to set up a puppeteer rig */
  'large-image'?: string,
}
