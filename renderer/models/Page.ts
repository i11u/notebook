import { Block } from './Block';
import { Document } from './Document';

export type Page = {
  id: number;
  isCurrentPage: boolean;
  blocks: Block[];
};

export const createPage = (document: Document): void => {
  const page = {
    id: 1,
    isCurrentPage: true,
    blocks: [],
  };
  document.pages.push(page);
};

export type Position = {
  row: number;
  col: number;
};
