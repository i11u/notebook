import { Style, FontFamily } from '../config/config';
import { Page } from './Page';

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

export const createTextBlock = (page: Page): void => {
  const block: TextBlock = {
    blockId: 1,
    parentPageId: 1,
    text: '',
    font: 'SF Mono',
    fontSize: 14,
    style: 'Plain',
    subBlocks: [],
  };
  page.blocks.push(block);
};

export default Block;
