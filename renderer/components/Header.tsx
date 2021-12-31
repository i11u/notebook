import React, { ReactNode } from 'react';
import Link from 'next/link';

type Props = {
  children: ReactNode;
  title?: string;
};

const Header = ({ children }: Props) => (
  <div>
    <header>
      <nav>
        <Link href='/'>
          <a>Home</a>
        </Link>{' '}
        |{' '}
        <Link href='/about'>
          <a>About</a>
        </Link>{' '}
        |{' '}
        <Link href='/initial-props'>
          <a>With Initial Props</a>
        </Link>
      </nav>
    </header>
    {children}
  </div>
);

export default Header;
