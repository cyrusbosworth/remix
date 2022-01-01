import React, { ReactNode } from 'react';
import { Outlet, LiveReload, Link, Links, Meta } from 'remix';
import globalStylesUrl from '~/styles/global.css';

export const links = () => [{ rel: 'stylesheet', href: globalStylesUrl }];

export const meta = () => {
  const description = 'A cool blog built with Remix';
  const keywords = 'remix, react, javascript';

  return {
    description,
    keywords,
  };
};

export default function App() {
  return (
    <Document>
      <Layout>
        <Outlet />
      </Layout>
    </Document>
  );
}

function Document({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <html lang='en'>
      <head>
        <Meta />
        <Links />
        <title>{title ? title : 'My Remix Blog'}</title>
      </head>
      <body>
        {children}
        {process.env.NODE_ENV === 'development' ? <LiveReload /> : null}
      </body>
    </html>
  );
}

function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <nav className='navbar'>
        <Link to='/' className='logo'>
          Remix
        </Link>
        <ul className='nav'>
          <li>
            <Link to='/posts'>Posts</Link>
          </li>
        </ul>
      </nav>
      <div className='container'>{children}</div>
    </>
  );
}
