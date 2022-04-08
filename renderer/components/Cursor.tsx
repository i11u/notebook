import styled from 'styled-components';
import { useEffect, useState } from 'react';

import { Position } from '../models/Page';
import {
  getCell,
  getCurrentCursorPosition,
  getKeyCode,
  getNextCursorPosition,
  getPreviousCursorPosition,
  isEmpty,
  makeAlert,
} from '../utils/util';

const StyledCursor = styled.div`
  width: ${({ props }) => props.cellLength}px;
  height: ${({ props }) => props.cellLength}px;
  font-size: ${({ props }) => props.cellLength}px;
  text-align: center;
  outline: none;
  margin: -1px 0 0 -1px;
  border: 2px solid gray;
  opacity: 0.5;
  background-color: white;
  border-radius: 3px;
  position: absolute;
  resize: none;
  z-index: 0;
  line-height: 1;
  white-space: nowrap;
`;

StyledCursor.defaultProps = {
  props: {
    cellLength: '',
  },
};

type Props = {
  cellLength: number;
  maxRow: number;
  maxCol: number;
  cursorPosition: Position;
  setCursorPosition: (Position) => void;
  isDrawing: boolean;
  mouseIsPressed: boolean;
  setMouseIsPressed: (boolean) => void;
};

const Cursor = ({
  cellLength,
  maxRow,
  maxCol,
  cursorPosition,
  setCursorPosition,
  isDrawing,
  mouseIsPressed,
  setMouseIsPressed,
}: Props) => {
  const [isComposing, setIsComposing] = useState(false);

  const handleOnKeyUp = (e) => {
    const cursor = document.getElementById('cursor');
    const key = getKeyCode(e);

    // Resize cursor w.r.t. text length
    if (cursor.textContent.length >= 1) {
      cursor.style.width = cellLength * cursor.textContent.length + 'px';
    }

    // When there is no input value, BackSpace or Delete is pressed,
    // or user hasn't ENTER the text, do nothing
    if (!cursor.textContent.length || key == 8 || key == 46 || isComposing) return;

    // Move cursor to the next position
    const current = getCurrentCursorPosition(cursorPosition);
    const next = getNextCursorPosition(current, cursor.textContent.length, maxRow, maxCol);

    // When next is undefined, clear the text
    if (next === undefined) {
      makeAlert('Input text exceeds the page');
      cursor.textContent = '';
      cursor.style.width = cellLength - 1 + 'px';
      return;
    }

    setCursorPosition(next);

    // Copy the input value to proper cells
    let targetPosition = current;
    for (let i = 0; i < cursor.textContent.length; i++) {
      const target = getCell(targetPosition.row, targetPosition.col);
      target.value = cursor.textContent[i];
      targetPosition = getNextCursorPosition(targetPosition, 1, maxRow, maxCol);
    }

    // Reset the focused cell value
    cursor.textContent = '';
    cursor.style.width = cellLength - 1 + 'px';
  };

  const handleOnKeyDown = (e) => {
    const key = e.keyCode || e.charCode;
    const current = getCurrentCursorPosition(cursorPosition);
    const cursor = document.getElementById('cursor');
    switch (key) {
      case 8 || 46:
        if (current.col > 0) {
          const previous: Position = { row: current.row, col: current.col - 1 };
          const previousCell = getCell(previous.row, previous.col);
          if (!isEmpty(previousCell)) {
            previousCell.value = '';
            setCursorPosition(getPreviousCursorPosition(current));
          }
        }
        break;
      case 37: // ArrowLeft
        if (current.col > 0) {
          setCursorPosition({ row: current.row, col: current.col - 1 });
        }
        break;
      case 38: // ArrowUp
        if (current.row > 0) {
          setCursorPosition({ row: current.row - 1, col: current.col });
        }
        break;
      case 39: // ArrowRight
        if (current.col < maxCol - 1) {
          setCursorPosition({ row: current.row, col: current.col + 1 });
        }
        break;
      case 40: // ArrowDown
        if (current.row < maxRow - 1) {
          setCursorPosition({ row: current.row + 1, col: current.col });
        }
        break;
      default:
        return;
    }
  };

  const handleOnMouseDown = () => {
    setMouseIsPressed(true);
    if (!isDrawing) return;
    const current = document.getElementById(
      `cell-${cursorPosition.row}-${cursorPosition.col}`,
    ) as HTMLInputElement;
    if (current.style.backgroundColor != 'black') {
      current.style.backgroundColor = 'black';
    }
  };

  const handleOnMouseUp = () => {
    setMouseIsPressed(false);
  };

  // Change focus position visually, responding to the change of 'focusedPosition'
  useEffect(() => {
    const cursor = document.getElementById('cursor');
    cursor.addEventListener('compositionstart', () => {
      setIsComposing(true);
    });
    cursor.addEventListener('compositionend', () => {
      setIsComposing(false);
    });
    cursor.focus();
  }, []);

  useEffect(() => {
    const row = cursorPosition.row;
    const col = cursorPosition.col;
    const cursor = document.getElementById('cursor');
    cursor.style.top = row * cellLength + 'px';
    cursor.style.left = col * cellLength + 'px';
    cursor.focus();
  }, [cellLength, cursorPosition]);

  return (
    <>
      <StyledCursor
        id='cursor'
        contentEditable='true'
        props={{
          cellLength: cellLength - 1,
        }}
        onKeyUp={(e) => handleOnKeyUp(e)}
        onKeyDown={(e) => handleOnKeyDown(e)}
        onMouseDown={(e) => handleOnMouseDown()}
        onMouseUp={() => handleOnMouseUp()}
      />
    </>
  );
};

export default Cursor;
