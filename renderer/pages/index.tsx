import { useEffect } from 'react';
import styled from 'styled-components';

import Link from 'next/link';
import Layout from '../components/Layout';
import Wrapper from '../components/Wrapper';
import Header from '../components/Header';
import Page from '../components/Page';
import PageWrapper from '../components/PageWrapper';

const IndexPage = () => {
  useEffect(() => {
    // add a listener to 'message' channel
    global.ipcRenderer.addListener('message', (_event, args) => {
      alert(args);
    });
  }, []);

  const onSayHiClick = () => {
    global.ipcRenderer.send('message', 'hi from next');
  };

  return (
    <Wrapper title='notebook'>
      <Header>Hello</Header>
      <Background>
        {/* <Layout>
          <p>
            <Link href='/about'>
              <a>About</a>
            </Link>
          </p>
        </Layout> */}
        <PageWrapper>
          <Page />
          <Page />
          <Page />
          <Page />
        </PageWrapper>
      </Background>
    </Wrapper>
  );
};

const Background = styled.div`
  background-color: rgb(226, 226, 226);
  position: fixed;
  top: 5%;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
`;

export default IndexPage;
