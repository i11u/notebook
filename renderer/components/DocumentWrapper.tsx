import Head from 'next/head';

type Props = {
  children: any;
  title?: string;
};

const DocumentWrapper = ({ children, title }: Props) => {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Head>
        <title>{title}</title>
        <meta charSet='utf-8' />
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      </Head>
      {children}
    </div>
  );
};

export default DocumentWrapper;
