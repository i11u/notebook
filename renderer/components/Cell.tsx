import styled from 'styled-components';
import { PAGE_HEIGHT } from './Page';
import { Position } from '../models/Page';
import React from 'react';
import { getCell } from '../utils/util';
import { TextBlock } from '../models/Block';

const StyledCell = styled.textarea`
  width: ${({ props }) => props.cellLength}px;
  height: ${({ props }) => props.cellLength}px;
  font-size: ${({ props }) => props.cellLength - 2}px;
  outline: none;
  text-align: center;
  padding: 1px 0 0 0;
  border: none;
  vertical-align: top;
  resize: none;
  font-family: inherit;
  line-height: 1;
`;

StyledCell.defaultProps = {
  props: {
    cellLength: '',
  },
};

type Props = {
  maxRow: number;
  maxCol: number;
  row: number;
  col: number;
  setCursorPosition: (Position) => void;
  isDrawing: boolean;
  mouseIsPressed: boolean;
  setMouseIsPressed: (boolean) => void;
  textBlocks: TextBlock[];
  setTextBlocks: (textBlocks: TextBlock[]) => void;
  currentBlock: TextBlock;
  setCurrentBlock: (TextBlock) => void;
};

const Cell = ({
  maxRow,
  maxCol,
  row,
  col,
  setCursorPosition,
  isDrawing,
  mouseIsPressed,
  setMouseIsPressed,
  textBlocks,
  setTextBlocks,
  currentBlock,
  setCurrentBlock,
}: Props) => {
  const isLastRow = row == maxRow - 1;
  const isLastCol = col == maxCol - 1;
  const cellLength = PAGE_HEIGHT / maxRow - 1;

  const getBorderStyle = () => {
    let style = {
      borderTop: `1px solid lightgrey`,
      borderLeft: `1px solid lightgrey`,
    };
    if (isLastRow) style['borderBottom'] = `1px solid lightgrey`;
    if (isLastCol) style['borderRight'] = `1px solid lightgrey`;
    return style;
  };

  const handleOnMouseDown = (row, col, setCursorPosition) => {
    const newPosition: Position = { row: row, col: col };
    setCursorPosition(newPosition);
    const newCell = getCell(newPosition.row, newPosition.col);
    // if (isEmpty(newCell)) {
    //   setCurrentBlock(null);
    // }
  };

  const handleOnMouseOver = (row, col, setCursorPosition) => {
    if (!isDrawing || !mouseIsPressed) return;
    const newPosition: Position = { row: row, col: col };
    setCursorPosition(newPosition);
    const current = document.getElementById(`cell-${row}-${col}`) as HTMLInputElement;
    if (current.style.backgroundColor != 'black') {
      current.style.backgroundColor = 'black';
    }
  };

  return (
    <StyledCell
      id={`cell-${row}-${col}`}
      type='text'
      props={{ cellLength: cellLength }}
      style={getBorderStyle()}
      onMouseDown={(e) => {
        handleOnMouseDown(row, col, setCursorPosition);
      }}
      onMouseOver={() => handleOnMouseOver(row, col, setCursorPosition)}
      readOnly
    />
  );
};

export default Cell;
