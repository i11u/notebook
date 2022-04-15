import { FontFamily, Style } from '../constants/Character';
import { Position } from './Page';

export type Block = {
  blockId: number;
  parentPageId: number;
  position: Position;
  width: number;
  height: number;
};

export type IndexInBlock = {
  x: number;
  y: number;
};

export type TextBlock = {
  blockId: number;
  parentPageId: number;
  position: Position;
  width: number;
  height: number;
  text: string;
  parentBlockId: string;
  index: IndexInBlock;
  gridScale: number;
  font: FontFamily;
  fontSize: number;
  style: Style;
  subBlocks: TextBlock[] | null;
};

export const createTextBlock = (
  blockId: number,
  position: Position,
  width: number,
  height: number,
  text: string,
  parentBlockId: string,
  index: IndexInBlock,
  cellLength: number,
): TextBlock => {
  return {
    blockId: blockId,
    parentPageId: 1,
    position: { row: position.row, col: position.col },
    width: width,
    height: height,
    text: text,
    parentBlockId: null,
    index: parentBlockId === null ? null : { x: index.x, y: index.y },
    gridScale: 1,
    font: 'SF Mono',
    fontSize: cellLength,
    style: 'Plain',
    subBlocks: [],
  };
};

export const getTextBlock = (blocks: TextBlock[], blockId) => {
  return blocks.filter((block) => (block.blockId = blockId))[0];
};

export const getNextTextBlock = (blocks: TextBlock[], block: TextBlock): TextBlock => {
  for (let i = 0; i < blocks.length; i++) {
    if (blocks[i].blockId === block.blockId) {
      if (i + 1 === blocks.length) return blocks[0];
      return blocks[i + 1];
    }
  }
};

export const isInTextBlock = (blocks: TextBlock[], position: Position): boolean => {
  for (const block of blocks) {
    if (
      block.position.row <= position.row &&
      position.row < block.position.row + block.height &&
      block.position.col <= position.col &&
      position.col <= block.position.col + block.width
    )
      return true;
  }
  return false;
};

const storeTextInGrids = (e: EventListener): void => {
  /*
    Store each character or word into a sequence of grid.
    If text is written in Japanese, the character will be stored in a grid.
    In other languages, the text will be stored in a sequence of grids with almost same length
  */
};
