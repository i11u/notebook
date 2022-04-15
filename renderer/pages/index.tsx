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
import { getNextTextBlock, TextBlock } from '../models/Block';
import BlockCursor from '../components/BlockCursor';

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
  const [blockCursorPosition, setBlockCursorPosition] = useState<Position>({
    row: 0,
    col: 0,
  });
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [mouseIsPressed, setMouseIsPressed] = useState<boolean>(false);
  const cursorPositionRef = useRef<Position>(null);
  cursorPositionRef.current = cursorPosition;
  const isDrawingRef = useRef<boolean>(null);
  isDrawingRef.current = isDrawing;
  const [textBlocks, setTextBlocks] = useState<TextBlock[]>([]);
  const textBlocksRef = useRef<TextBlock[]>(null);
  textBlocksRef.current = textBlocks;
  const [currentBlockId, setCurrentBlockId] = useState<string>(null);
  const [currentBlock, setCurrentBlock] = useState<TextBlock>(null);
  const currentBlockRef = useRef<TextBlock>(null);
  currentBlockRef.current = currentBlock;
  const [shiftKeyCount, setShiftKeyCount] = useState(0);
  const shiftKeyCountRef = useRef<number>(null);
  shiftKeyCountRef.current = shiftKeyCount;
  const [isSelectingBlock, setIsSelectingBlock] = useState<boolean>(false);
  const isSelectingBlockRef = useRef<boolean>(null);
  isSelectingBlockRef.current = isSelectingBlock;

  // useEffect(() => {
  //   if (shiftKeyCountRef.current < 2) {
  //     const blockCursor = document.getElementById('block-cursor');
  //     setTimeout(() => {
  //       if (shiftKeyCountRef.current === 2) {
  //         if (blockCursor.style.display === 'none') {
  //           blockCursor.style.display = 'block';
  //         } else {
  //           blockCursor.style.display = 'none';
  //         }
  //       }
  //       setShiftKeyCount(0);
  //     }, 200);
  //   }
  // }, [shiftKeyCount]);

  useEffect(() => {
    const blockCursor = document.getElementById('block-cursor');
    const cursor = document.getElementById('cursor');
    if (blockCursor.style.display === 'none') {
      blockCursor.style.display = 'block';
      cursor.style.display = 'none';
      blockCursor.focus();
    } else {
      blockCursor.style.display = 'none';
      cursor.style.display = 'block';
      cursor.focus();
    }
  }, [isSelectingBlock]);

  useEffect(() => {
    document.addEventListener('keydown', (e) => {
      const key = getKeyCode(e);

      // When meta key is pressed
      if (e.metaKey) {
        if (key === 68) {
          setIsDrawing((value) => !value);
        }
      }

      // When shift key is pressed twice, enter Block Select mode
      if (!isDrawingRef.current) {
        if (e.shiftKey) {
          // setShiftKeyCount((shiftKeyCount) => shiftKeyCount + 1);
          setIsSelectingBlock((value) => !value);
        }
      }

      if (isSelectingBlockRef.current) {
        switch (key) {
          case 9:
            const nextTextBlock = getNextTextBlock(textBlocksRef.current, currentBlockRef.current);
            setCurrentBlock(nextTextBlock);
            break;
          case 8 || 46: // Backspace or Delete
            // Delete current block
            break;
          case 37: // ArrowLeft
            if (currentBlockRef.current.position.col > 0) {
              // move block content to left
              for (let row = 0; row < currentBlockRef.current.height; row++) {
                for (let col = 0; col < currentBlockRef.current.width; col++) {
                  const prev = document.getElementById(
                    `cell-${currentBlockRef.current.position.row + row}-${
                      currentBlockRef.current.position.col + col
                    }`,
                  ) as HTMLTextAreaElement;
                  const next = document.getElementById(
                    `cell-${currentBlockRef.current.position.row + row}-${
                      currentBlockRef.current.position.col + col - 1
                    }`,
                  ) as HTMLTextAreaElement;
                  next.value = prev.value;
                  prev.value = '';
                }
              }
              setCurrentBlock((prev) => {
                return {
                  ...prev,
                  position: { row: prev.position.row, col: prev.position.col - 1 },
                };
              });
              setTextBlocks(
                textBlocksRef.current.map((block) =>
                  block.blockId === currentBlockRef.current.blockId
                    ? {
                        ...block,
                        position: {
                          row: block.position.row,
                          col: block.position.col - 1,
                        },
                      }
                    : block,
                ),
              );
            }
            break;
          case 38: // ArrowUp
            if (currentBlockRef.current.position.row > 0) {
              // move block content to above
              for (let row = 0; row < currentBlockRef.current.height; row++) {
                for (let col = 0; col < currentBlockRef.current.width; col++) {
                  const prev = document.getElementById(
                    `cell-${currentBlockRef.current.position.row + row}-${
                      currentBlockRef.current.position.col + col
                    }`,
                  ) as HTMLTextAreaElement;
                  const next = document.getElementById(
                    `cell-${currentBlockRef.current.position.row + row - 1}-${
                      currentBlockRef.current.position.col + col
                    }`,
                  ) as HTMLTextAreaElement;
                  next.value = prev.value;
                  prev.value = '';
                }
              }
              setCurrentBlock((prev) => {
                return {
                  ...prev,
                  position: { row: prev.position.row - 1, col: prev.position.col },
                };
              });
              setTextBlocks(
                textBlocksRef.current.map((block) =>
                  block.blockId === currentBlockRef.current.blockId
                    ? {
                        ...block,
                        position: {
                          row: block.position.row - 1,
                          col: block.position.col,
                        },
                      }
                    : block,
                ),
              );
            }
            break;
          case 39: // ArrowRight
            if (currentBlockRef.current.position.col + currentBlockRef.current.width < maxCol) {
              // move block content to right
              for (let row = 0; row < currentBlockRef.current.height; row++) {
                for (let col = currentBlockRef.current.width - 1; col >= 0; col--) {
                  const prev = document.getElementById(
                    `cell-${currentBlockRef.current.position.row + row}-${
                      currentBlockRef.current.position.col + col
                    }`,
                  ) as HTMLTextAreaElement;
                  const next = document.getElementById(
                    `cell-${currentBlockRef.current.position.row + row}-${
                      currentBlockRef.current.position.col + col + 1
                    }`,
                  ) as HTMLTextAreaElement;
                  console.log(currentBlockRef.current.position.col + col + 1);
                  next.value = prev.value;
                  prev.value = '';
                }
              }
              setCurrentBlock((prev) => {
                return {
                  ...prev,
                  position: { row: prev.position.row, col: prev.position.col + 1 },
                };
              });
              setTextBlocks(
                textBlocksRef.current.map((block) =>
                  block.blockId === currentBlockRef.current.blockId
                    ? {
                        ...block,
                        position: {
                          row: block.position.row,
                          col: block.position.col + 1,
                        },
                      }
                    : block,
                ),
              );
            }
            break;
          case 40: // ArrowDown
            if (currentBlockRef.current.position.row + currentBlockRef.current.height < maxRow) {
              // move block content to below
              for (let row = currentBlockRef.current.height - 1; row >= 0; row--) {
                for (let col = 0; col < currentBlockRef.current.width; col++) {
                  const prev = document.getElementById(
                    `cell-${currentBlockRef.current.position.row + row}-${
                      currentBlockRef.current.position.col + col
                    }`,
                  ) as HTMLTextAreaElement;
                  const next = document.getElementById(
                    `cell-${currentBlockRef.current.position.row + row + 1}-${
                      currentBlockRef.current.position.col + col
                    }`,
                  ) as HTMLTextAreaElement;
                  next.value = prev.value;
                  prev.value = '';
                }
              }
              setCurrentBlock((prev) => {
                return {
                  ...prev,
                  position: { row: prev.position.row + 1, col: prev.position.col },
                };
              });
              setTextBlocks(
                textBlocksRef.current.map((block) =>
                  block.blockId === currentBlockRef.current.blockId
                    ? {
                        ...block,
                        position: {
                          row: block.position.row + 1,
                          col: block.position.col,
                        },
                      }
                    : block,
                ),
              );
            }
            break;
          default:
            return;
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
            textBlocks={textBlocks}
            setTextBlocks={setTextBlocks}
            currentBlock={currentBlock}
            setCurrentBlock={setCurrentBlock}
          />
          <BlockCursor
            cellLength={cellLength}
            maxRow={maxRow}
            maxCol={maxCol}
            blockCursorPosition={blockCursorPosition}
            setBlockCursorPosition={setBlockCursorPosition}
            textBlocks={textBlocks}
            currentBlock={currentBlock}
            setCurrentBlock={setCurrentBlock}
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
                      textBlocks={textBlocks}
                      setTextBlocks={setTextBlocks}
                      currentBlock={currentBlock}
                      setCurrentBlock={setCurrentBlock}
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
