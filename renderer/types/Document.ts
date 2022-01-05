type CaretLocation = {
  pageId: number;
  blockId: number;
  indexInBlock: number;
};

export type Caret = {};

export type Document = {
  id: number;
  caretLocation: CaretLocation;
};
