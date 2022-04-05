import styled from 'styled-components';

import Page from '../components/Page';

type Props = {
  pageCount: number;
};

const PageList = ({ pageCount }: Props) => {
  return (
    <StyledPageList>
      {pageCount != 0 ? (
        (() => {
          const items = [];
          for (let i = 0; i < pageCount; i++) {
            items.push(
              <Page>
                <></>
              </Page>,
            );
          }
          return <div>{items}</div>;
        })()
      ) : (
        <Page>
          <></>
        </Page>
      )}
    </StyledPageList>
  );
};

const StyledPageList = styled.div`
  position: relative;
  margin-top: 5%;
  width: 100%;
  height: 100%;
`;

export default PageList;
