import React, { ReactNode } from 'react';
import styled from 'styled-components';

type Props = {
  children: ReactNode;
  title?: string;
};

const Header = ({ children }: Props) => {
  return <StyledHeader>{children}</StyledHeader>;
};

const StyledHeader = styled.header`
  position: fixed;
  width: 100%;
  height: 5%;
  background-color: #ffffff;
`;

export default Header;
