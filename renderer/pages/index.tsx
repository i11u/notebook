import WindowWrapper from '../components/WindowWrapper';
import Page from '../components/Page';
import Background from '../components/Background';

const IndexPage = () => {
  return (
    <WindowWrapper title='notebook'>
      <Background>
        <Page />
      </Background>
    </WindowWrapper>
  );
};

export default IndexPage;
