import { IDocument } from './document';

/**
 * This is Document model class to store Document data
 */

export class Document implements IDocument {
  constructor(
    public id: string,
    public shipid: string,
    public affil: string,
    public city: string,
    public dealerName: string,
      public loadNumber: string
  ) { }
}
