import { useEffect } from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';
import Wrapper from '../components/Wrapper';
import Header from '../components/Header';

import styled from 'styled-components';

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
      <Background>
        <Header title='sample'>
          <p>Hello</p>
        </Header>
        <Layout>
          <p>
            <Link href='/about'>
              <a>About</a>
            </Link>
          </p>
        </Layout>
      </Background>
    </Wrapper>
  );
};

const Background = styled.div`
  background-color: #f5f5f5;
  overscroll-behavior: none;
  width: 100%;
  height: 100%;
`;

export default IndexPage;
