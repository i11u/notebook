import styled from 'styled-components';
import { Position } from '../pages';
import { useEffect, useState } from 'react';

const StyledFocusedCell = styled.textarea`
  width: ${({ props }) => props.cellLength}px;
  height: ${({ props }) => props.cellLength - 1}px;
  font-size: ${({ props }) => props.cellLength}px;
  text-align: center;
  padding: 1px 0 0 0;
  outline: none;
  margin: -1px 0 0 -1px;
  border: 2px solid gray;
  opacity: 0.5;
  border-radius: 3px;
  position: absolute;
  resize: none;
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
    const key = e.keyCode || e.charCode;
    if (!elem.value || key == 8 || key == 46 || isComposing) return;

    // Move the focused cell to the next position
    let current = getCurrentFocusPosition();
    const inputLength = elem.value.length;
    let next = getNextPosition(current, inputLength);
    if (next === undefined) {
      alert();
      elem.value = '';
      return;
    }
    setFocusedPosition(next);

    // Copy the input value to proper cells
    next = getNextPosition(current, 1);
    for (let i = 0; i < inputLength; i++) {
      const target = document.getElementById(
        `cell-${current.row}-${current.col}`,
      ) as HTMLInputElement;
      target.value = elem.value[i];
      current = getNextPosition(current, 1);
    }
    // Reset the focused cell value
    elem.value = '';
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
    <StyledFocusedCell
      id='focused-cell'
      props={{ cellLength: cellLength - 1 }}
      onKeyUp={(e) => handleOnKeyUp(e)}
    />
  );
};

export default FocusedCell;
