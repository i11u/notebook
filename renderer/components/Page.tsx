import styled from 'styled-components';

const Page = () => {
  return (
    <PageWrapper>
      <StyledPage />
    </PageWrapper>
  );
};

const PageWrapper = styled.div`
  width: 540px;
  justify-content: center;
  margin-left: 50vw;
  margin-top: calc(50vh - 382.05px);
  transform: translateX(-50%);
`;

const StyledPage = styled.canvas`
  width: 540px;
  height: 764.1px;
  background-color: #ffffff;
`;

export default Page;
