import React, { ReactNode } from 'react';
import {
  Outlet,
  LiveReload,
  Link,
  Links,
  Meta,
  useLoaderData,
  LoaderFunction,
} from 'remix';
import globalStylesUrl from '~/styles/global.css';
import { getUser } from './utils/session.server';

export const links = () => [{ rel: 'stylesheet', href: globalStylesUrl }];

export const meta = () => {
  const description = 'A cool blog built with Remix';
  const keywords = 'remix, react, javascript';

  return {
    description,
    keywords,
  };
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);

  const data = {
    user,
  };
  return data;
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
  const { user } = useLoaderData();
  console.log(user);
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
          {user ? (
            <li>
              <form action='/auth/logout' method='POST'>
                <button className='btn' type='submit'>
                  Logout {user.username}
                </button>
              </form>
            </li>
          ) : (
            <li>
              <Link to='/auth/login'>Login</Link>
            </li>
          )}
        </ul>
      </nav>
      <div className='container'>{children}</div>
    </>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.log(error);
  return (
    <Document>
      <Layout>
        <h1>Error</h1>
        <pre>{error.message}</pre>
      </Layout>
    </Document>
  );
}
