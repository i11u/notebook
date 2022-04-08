import React, { useEffect, useRef, useState } from 'react';

import DocumentWrapper from '../components/DocumentWrapper';
import Page, { PAGE_HEIGHT } from '../components/Page';
import Background from '../components/Background';
import Cell from '../components/Cell';
import Cursor from '../components/Cursor';
import { Position } from '../models/Page';
import {
  getCell,
  getCellLength,
  getInitialGrid,
  getKeyCode,
  getMaxCol,
  getPreviousCursorPosition,
  isEmpty,
  turnCellColorBlack,
} from '../utils/util';
import Block from '../models/Block';

const IndexPage = () => {
  // const [maxRow, setMaxRow] = useState(63);
  const [maxRow, setMaxRow] = useState(42);
  const [maxCol, setMaxCol] = useState(getMaxCol(maxRow));
  const [cellLength, setCellLength] = useState<number>(getCellLength(maxRow));
  const [grid, setGrid] = useState(getInitialGrid(maxRow, maxCol));
  const [cursorPosition, setCursorPosition] = useState<Position>({
    row: 0,
    col: 0,
  });
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [mouseIsPressed, setMouseIsPressed] = useState<boolean>(false);
  const cursorPositionRef = useRef<Position>(null);
  cursorPositionRef.current = cursorPosition;
  const isDrawingRef = useRef<boolean>(null);
  isDrawingRef.current = isDrawing;
  const [blocks, setBlocks] = useState<Block[]>([]);

  useEffect(() => {
    document.addEventListener('keydown', (e) => {
      const key = getKeyCode(e);

      // When meta key is pressed
      if (e.metaKey) {
        if (key === 68) {
          setIsDrawing((value) => !value);
        }
      }

      // When drawing mode is on
      if (isDrawingRef.current) {
        const currentCell = getCell(cursorPositionRef.current.row, cursorPositionRef.current.col);

        const previous = getPreviousCursorPosition(cursorPositionRef.current);
        const previousCell = getCell(previous.row, previous.col);

        switch (key) {
          case 8 || 46: // Backspace or Delete
            if (cursorPositionRef.current.col > 0) {
              if (e.shiftKey) {
                if (isEmpty(previousCell)) {
                  if (previousCell.style.backgroundColor === 'black') {
                    previousCell.style.backgroundColor = 'white';
                    setCursorPosition(previous);
                  }
                }
              }
            }
            break;
          case 37: // ArrowLeft
            if (cursorPositionRef.current.col > 0) {
              if (e.shiftKey) {
                turnCellColorBlack(currentCell);
              }
              setCursorPosition({
                row: cursorPositionRef.current.row,
                col: cursorPositionRef.current.col - 1,
              });
            }
            break;
          case 38: // ArrowUp
            if (cursorPositionRef.current.row > 0) {
              if (e.shiftKey) {
                turnCellColorBlack(currentCell);
              }
              setCursorPosition({
                row: cursorPositionRef.current.row - 1,
                col: cursorPositionRef.current.col,
              });
            }
            break;
          case 39: // ArrowRight
            if (cursorPositionRef.current.col < maxCol - 1) {
              if (e.shiftKey) {
                turnCellColorBlack(currentCell);
              }
              setCursorPosition({
                row: cursorPositionRef.current.row,
                col: cursorPositionRef.current.col + 1,
              });
            }
            break;
          case 40: // ArrowDown
            if (cursorPositionRef.current.row < maxRow - 1) {
              if (e.shiftKey) {
                turnCellColorBlack(currentCell);
              }
              setCursorPosition({
                row: cursorPositionRef.current.row + 1,
                col: cursorPositionRef.current.col,
              });
            }
            break;
          default:
            return;
        }
      }
    });
  }, []);

  // Prohibit entering text in drawing mode.
  useEffect(() => {
    const cursor = document.getElementById('cursor');
    if (isDrawing) {
      cursor.contentEditable = 'false';
    } else {
      cursor.contentEditable = 'true';
      cursor.focus();
    }
  }, [isDrawing]);

  // Recalculation of grid happens when maxRow is changed.
  useEffect(() => {
    setMaxCol(getMaxCol(maxRow));
    setCellLength(PAGE_HEIGHT / maxRow);
  }, [maxRow]);

  return (
    <DocumentWrapper title='notebook'>
      <Background>
        <Page>
          <Cursor
            cellLength={cellLength}
            maxRow={maxRow}
            maxCol={maxCol}
            cursorPosition={cursorPosition}
            setCursorPosition={setCursorPosition}
            isDrawing={isDrawing}
            mouseIsPressed={mouseIsPressed}
            setMouseIsPressed={setMouseIsPressed}
          />
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx} style={{ height: cellLength }}>
                {row.map((cell, colIdx) => {
                  return (
                    <Cell
                      key={colIdx}
                      maxRow={maxRow}
                      maxCol={maxCol}
                      row={cell.row}
                      col={cell.col}
                      setCursorPosition={setCursorPosition}
                      isDrawing={isDrawing}
                      mouseIsPressed={mouseIsPressed}
                      setMouseIsPressed={setMouseIsPressed}
                    />
                  );
                })}
              </div>
            );
          })}
        </Page>
      </Background>
    </DocumentWrapper>
  );
};

export default IndexPage;
