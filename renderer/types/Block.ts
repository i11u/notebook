import { Style, FontFamily } from '../config/config';
import { Page } from './Page';

export type Block = {
  blockId: number;
  parentPageId: number;
};

export type IndexInSideBlock = {
  x: number;
  y: number;
};

export type TextBlock = Block & {
  text: string;
  index: IndexInSideBlock;
  gridScale: number;
  font: FontFamily;
  fontSize: number;
  style: Style;
  subBlocks: TextBlock[] | null;
};

export const createTextBlock = (page: Page): void => {
  const block: TextBlock = {
    blockId: 1,
    parentPageId: 1,
    text: '',
    index: { x: 0, y: 0 },
    gridScale: 1,
    font: 'SF Mono',
    fontSize: 14,
    style: 'Plain',
    subBlocks: [],
  };
  page.blocks.push(block);
};

export const storeTextInGrids = (e: EventListener): void => {
  /*
    Store each character or word into a sequence of grid.
    If text is written in Japanese, the character will be stored in a grid.
    In other languages, the text will be stored in a sequence of grids with almost same length
  */
};

export default Block;
