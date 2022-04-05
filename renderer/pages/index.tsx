import DocumentWrapper from '../components/DocumentWrapper';
import Page, { PAGE_HEIGHT, PAGE_WIDTH } from '../components/Page';
import Background from '../components/Background';
import React, { useEffect, useState } from 'react';
import Cell from '../components/Cell';
import FocusedCell from '../components/FocusedCell';

const getMaxCol = (maxRow) => {
  return PAGE_WIDTH / (PAGE_HEIGHT / maxRow);
};

export type Position = {
  row: number;
  col: number;
};

const IndexPage = () => {
  const [maxRow, setMaxRow] = useState(42);
  const [maxCol, setMaxCol] = useState(getMaxCol(maxRow));
  const [cellLength, setCellLength] = useState(PAGE_HEIGHT / maxRow);
  const [grid, setGrid] = useState(getInitialGrid(maxRow, maxCol));
  // const [mouseIsPressed, setMouseIsPressed] = useState(false);
  let pos: Position = { row: 0, col: 0 };
  const [focusedPosition, setFocusedPosition] = useState(pos);

  useEffect(() => {
    setMaxCol(getMaxCol(maxRow));
    setCellLength(PAGE_HEIGHT / maxRow);
  }, [maxRow]);

  // const [scale, setScale] = useState(1);
  // const documentRef = useRef(null);
  // useGesture(
  //   {
  //     onPinch: ({ offset: [d] }) => {
  //       setScale(d);
  //     },
  //   },
  //   {
  //     target: documentRef,
  //   },
  // );

  return (
    <DocumentWrapper title='notebook'>
      <Background>
        <div
        // ref={documentRef}
        // style={{ width: '100vw', height: '100vh', transform: `scale(${scale}` }}
        >
          <Page>
            <FocusedCell
              cellLength={cellLength}
              maxRow={maxRow}
              maxCol={maxCol}
              focusedPosition={focusedPosition}
              setFocusedPosition={setFocusedPosition}
            />
            {grid.map((row, rowIdx) => {
              return (
                <div key={rowIdx} style={{ height: cellLength }}>
                  {row.map((cell, colIdx) => {
                    return (
                      <Cell
                        key={colIdx}
                        maxRowIdx={maxRow}
                        maxColIdx={maxCol}
                        rowIdx={rowIdx}
                        colIdx={colIdx}
                        setFocusedPosition={setFocusedPosition}
                      />
                    );
                  })}
                </div>
              );
            })}
          </Page>
        </div>
      </Background>
    </DocumentWrapper>
  );
};

const createCell = (row: number, col: number) => {
  return {
    row,
    col,
  };
};

const getInitialGrid = (maxRowIdx, maxColIdx) => {
  const grid = [];
  for (let row = 0; row < maxRowIdx; row++) {
    const currentRow = [];
    for (let col = 0; col < maxColIdx; col++) {
      currentRow.push(createCell(row, col));
    }
    grid.push(currentRow);
  }
  return grid;
};

export default IndexPage;
