import styled from 'styled-components';
import { Position } from '../models/Page';
import { useEffect } from 'react';
import { TextBlock } from '../models/Block';

const StyledCursor = styled.div`
  // width: ${({ props }) => props.cellLength}px;
  // height: ${({ props }) => props.cellLength}px;
  outline: none;
  margin: -1px 0 0 -1px;
  border: 2px dotted blue;
  opacity: 0.2;
  background-color: cornflowerblue;
  border-radius: 3px;
  position: absolute;
  z-index: 1;
  display: none;
`;

StyledCursor.defaultProps = {
  props: {
    cellLength: '',
    width: '',
    height: '',
  },
};

type Props = {
  cellLength: number;
  maxRow: number;
  maxCol: number;
  blockCursorPosition: Position;
  setBlockCursorPosition: (Position) => void;
  textBlocks: TextBlock[];
  currentBlock: TextBlock;
  setCurrentBlock: (TextBlock) => void;
};

const BlockCursor = ({
  cellLength,
  maxRow,
  maxCol,
  blockCursorPosition,
  setBlockCursorPosition,
  textBlocks,
  currentBlock,
  setCurrentBlock,
}: Props) => {
  useEffect(() => {
    if (currentBlock) {
      const row = currentBlock.position.row;
      const col = currentBlock.position.col;
      const width = currentBlock.width * cellLength;
      const height = currentBlock.height * cellLength;
      const cursor = document.getElementById('block-cursor');
      cursor.style.top = row * cellLength + 'px';
      cursor.style.left = col * cellLength + 'px';
      cursor.style.width = width + 'px';
      cursor.style.height = height + 'px';
    }
  }, [cellLength, currentBlock]);

  return (
    <>
      <StyledCursor
        id='block-cursor'
        props={{
          cellLength: cellLength - 1,
          width: currentBlock ? currentBlock.width : '',
          height: currentBlock ? currentBlock.width : '',
        }}
      />
    </>
  );
};

export default BlockCursor;
