import styled from 'styled-components';
import { Position } from '../pages';
import { useEffect, useState } from 'react';

const StyledFocusedCell = styled.div`
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

StyledFocusedCell.defaultProps = {
  props: {
    cellLength: '',
  },
};

type Props = {
  cellLength: number;
  maxRow: number;
  maxCol: number;
  focusedPosition: Position;
  setFocusedPosition: (Position) => void;
};

const FocusedCell = ({
  cellLength,
  maxRow,
  maxCol,
  focusedPosition,
  setFocusedPosition,
}: Props) => {
  const [isComposing, setIsComposing] = useState(false);

  const getNextPosition = (current: Position, inputLength: number) => {
    const row = current.row;
    const col = current.col;

    if (col + inputLength > maxCol - 1) {
      return undefined;
    } else {
      return { row: row, col: col + inputLength };
    }
  };

  const getCurrentFocusPosition = (): Position => {
    return focusedPosition;
  };

  const alert = () => {
    console.log('Input text exceeds the page');
    return;
  };

  const handleOnKeyUp = (e) => {
    // When there is no input value, do nothing
    // When BackSpace is pressed, do nothing
    const elem = e.target;
    const focus = document.getElementById('focused-cell');
    const key = e.keyCode || e.charCode;
    if (elem.textContent.length >= 1) {
      focus.style.width = cellLength * elem.textContent.length + 'px';
    }
    if (!elem.textContent || key == 8 || key == 46 || isComposing) return;

    // Move the focused cell to the next position
    let current = getCurrentFocusPosition();
    const inputLength = elem.textContent.length;
    let next = getNextPosition(current, inputLength);
    if (next === undefined) {
      alert();
      elem.textContent = '';
      focus.style.width = cellLength + 'px';
      return;
    }
    setFocusedPosition(next);

    // Copy the input value to proper cells
    next = getNextPosition(current, 1);
    for (let i = 0; i < inputLength; i++) {
      const target = document.getElementById(
        `cell-${current.row}-${current.col}`,
      ) as HTMLInputElement;

      target.value = elem.textContent[i];
      current = getNextPosition(current, 1);
    }
    // Reset the focused cell value
    elem.textContent = '';
    focus.style.width = cellLength + 'px';
  };

  const handleOnKeyDown = (e) => {
    const key = e.keyCode || e.charCode;
    const current = getCurrentFocusPosition();
    switch (key) {
      case 37: // ArrowLeft
        console.log('left');
        if (current.col > 0) {
          setFocusedPosition({ row: current.row, col: current.col - 1 });
        }
        break;
      case 38: // ArrowUp
        console.log('up');
        if (current.row > 0) {
          setFocusedPosition({ row: current.row - 1, col: current.col });
        }
        break;
      case 39: // ArrowRight
        console.log('right');
        if (current.col < maxCol - 1) {
          setFocusedPosition({ row: current.row, col: current.col + 1 });
        }
        break;
      case 40: // ArrowDown
        console.log('down');
        if (current.row < maxRow - 1) {
          setFocusedPosition({ row: current.row + 1, col: current.col });
        }
        break;
      default:
        return;
    }
  };

  // Change focus position visually, responding to the change of 'focusedPosition'
  useEffect(() => {
    const focusedCell = document.getElementById('focused-cell');
    focusedCell.addEventListener('compositionstart', () => {
      setIsComposing(true);
    });
    focusedCell.addEventListener('compositionend', () => {
      setIsComposing(false);
    });
    focusedCell.focus();
  }, []);

  useEffect(() => {
    const row = focusedPosition.row;
    const col = focusedPosition.col;
    const focused = document.getElementById('focused-cell');
    focused.style.top = row * cellLength + 'px';
    focused.style.left = col * cellLength + 'px';
  }, [cellLength, focusedPosition]);

  return (
    <>
      <StyledFocusedCell
        id='focused-cell'
        props={{
          cellLength: cellLength - 1,
        }}
        onKeyUp={(e) => handleOnKeyUp(e)}
        onKeyDown={(e) => handleOnKeyDown(e)}
        contentEditable='true'
      />
    </>
  );
};

export default FocusedCell;
