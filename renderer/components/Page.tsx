import styled from 'styled-components';

const Page = () => {
  return <StyledCanvas />;
};

const StyledCanvas = styled.canvas`
  width: 500px;
  height: 360px;
  background-color: #ffffff;
  margin-left: 50%;
  transform: translateX(-50%);
`;

export default Page;
