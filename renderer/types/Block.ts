type Block = {
  id: number;
  parentPageId: number;
};

type Style = 'Plain' | 'Bold' | 'Italic' | 'Underline' | 'StrikeThrough';

export type TextBlock = Block & {
  text: string;
  font: string;
  fontSize: number;
  style: Style;
  subBlocks: TextBlock[];
};

export default Block;
