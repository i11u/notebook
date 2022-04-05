import styled from 'styled-components';
import { PAGE_HEIGHT } from './Page';
import { Position } from '../pages';
import React from 'react';

const StyledCell = styled.textarea`
  width: ${({ props }) => props.cellLength}px;
  height: ${({ props }) => props.cellLength}px;
  font-size: ${({ props }) => props.cellLength}px;
  outline: none;
  text-align: center;
  padding: 1px 0 0 0;
  border: none;
  vertical-align: top;
  resize: none;
`;

StyledCell.defaultProps = {
  props: {
    cellLength: '',
  },
};

type Props = {
  maxRowIdx: number;
  maxColIdx: number;
  rowIdx: number;
  colIdx: number;
  setFocusedPosition: (Position) => void;
};

const handleOnClick = (row, col, setFocusedPosition) => {
  const newPosition: Position = { row: row, col: col };
  setFocusedPosition(newPosition);
};

const Cell = ({ maxRowIdx, maxColIdx, rowIdx, colIdx, setFocusedPosition }: Props) => {
  const isLastRow = rowIdx == maxRowIdx - 1;
  const isLastCol = colIdx == maxColIdx - 1;
  let style = {
    borderTop: `1px solid lightgrey`,
    borderLeft: `1px solid lightgrey`,
  };
  if (isLastRow) style['borderBottom'] = `1px solid lightgrey`;
  if (isLastCol) style['borderRight'] = `1px solid lightgrey`;

  const cellLength = PAGE_HEIGHT / maxRowIdx - 1;

  return (
    <StyledCell
      id={`cell-${rowIdx}-${colIdx}`}
      type='text'
      props={{ cellLength: cellLength }}
      style={style}
      onClick={(e) => handleOnClick(rowIdx, colIdx, setFocusedPosition)}
      readOnly
    />
  );
};

export default Cell;
