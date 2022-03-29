import { Page } from './Page';

export type CaretLocation = {
  pageId: number;
  blockId: number;
  indexInBlock: number;
};

export type Caret = {};

export type Document = {
  id: number;
  caretLocation: CaretLocation;
  pages: Page[];
};

export const NewDocument = (): Document => {
  const document: Document = {
    id: 1,
    caretLocation: { pageId: 0, blockId: 0, indexInBlock: 0 },
    pages: [],
  };
  return document;
};
