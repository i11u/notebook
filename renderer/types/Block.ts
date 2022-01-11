import { Style, FontFamily } from '../config/config';

type Block = {
  blockId: number;
  parentPageId: number;
};

export type TextBlock = Block & {
  text: string;
  font: FontFamily;
  fontSize: number;
  style: Style;
  subBlocks: TextBlock[] | null;
};

export const createBlock = (): TextBlock => {
  const block: TextBlock = {
    blockId: 1,
    parentPageId: 1,
    text: '',
    font: 'SF Mono',
    fontSize: 14,
    style: 'Plain',
    subBlocks: [],
  };
  return block;
};

export default Block;
