import { ReactNode } from 'react';
import styled from 'styled-components';

type Props = {
  children: ReactNode;
};

const PageWrapper = ({ children }: Props) => {
  return <StyledPageWrapper>{children}</StyledPageWrapper>;
};

const StyledPageWrapper = styled.div`
  position: relative;
  margin-top: 5%;
  width: 100%;
  height: 100%;
`;

export default PageWrapper;
