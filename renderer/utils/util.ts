import { Position } from '../models/Page';
import { PAGE_HEIGHT, PAGE_WIDTH } from '../components/Page';

export const getMaxCol = (maxRow) => {
  return PAGE_WIDTH / (PAGE_HEIGHT / maxRow);
};

export const getCellLength = (maxRow) => {
  return PAGE_HEIGHT / maxRow;
};

export const getInitialGrid = (maxRow, maxCol) => {
  const grid = [];
  for (let row = 0; row < maxRow; row++) {
    const currentRow = [];
    for (let col = 0; col < maxCol; col++) {
      currentRow.push({ row: row, col: col });
    }
    grid.push(currentRow);
  }
  return grid;
};

export const getKeyCode = (e) => {
  return e.keyCode || e.charCode;
};

export const makeAlert = (msg: string) => {
  console.log(msg);
  return;
};

export const isEmpty = (cell: HTMLTextAreaElement) => {
  return cell.value.length === 0;
};

export const getCurrentCursorPosition = (cursorPosition: Position): Position => {
  return cursorPosition;
};

// Get next cursor when you "Enter"
export const getNextCursorPosition = (current: Position, inputLength: number, maxRow, maxCol) => {
  if (current.col + inputLength > maxCol - 1) {
    return undefined;
  } else {
    return { row: current.row, col: current.col + inputLength };
  }
};

export const getPreviousCursorPosition = (current: Position) => {
  if (current.col == 0) {
    return undefined;
  } else {
    return { row: current.row, col: current.col - 1 };
  }
};

export const turnCellColorBlack = (cell: HTMLTextAreaElement) => {
  const old = cell.style.backgroundColor;
  if (old != 'black') {
    cell.style.backgroundColor = 'black';
  }
};

export const getCell = (row: number, col: number) => {
  return document.getElementById(`cell-${row}-${col}`) as HTMLTextAreaElement;
};
