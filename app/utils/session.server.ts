import bcrypt from 'bcrypt';
import { createCookieSessionStorage, redirect } from 'remix';
import { db } from './db.server';

//login user
export async function login({
  username,
  password,
}: {
  username: string;
  password: string;
}) {
  const user = await db.user.findUnique({
    where: {
      username,
    },
  });

  if (!user) return null;

  //check pw
  const isCorrectPassword = await bcrypt.compare(password, user.passwordHash);

  if (!isCorrectPassword) return null;

  return user;
}

const sessionSecret = process.env.SESSION_SECRET;

if (!sessionSecret) {
  throw new Error('No Session Secret');
}

//Register new user
export async function register({
  username,
  password,
}: {
  username: string;
  password: string;
}) {
  const passwordHash = await bcrypt.hash(password, 10);
  return db.user.create({
    data: {
      username,
      passwordHash,
    },
  });
}
//Create Session storage
const storage = createCookieSessionStorage({
  cookie: {
    name: 'remixblog_session',
    secure: process.env.NODE_ENV === 'production',
    secrets: [sessionSecret],
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 60,
    httpOnly: true,
  },
});

export async function createUserSession(userId: string, redirectTo: string) {
  const session = await storage.getSession();
  session.set('userId', userId);

  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await storage.commitSession(session),
    },
  });
}
export function getUserSession(request: Request) {
  return storage.getSession(request.headers.get('Cookie'));
}

export async function getUser(request: Request) {
  const session = await getUserSession(request);
  const userId = session.get('userId');
  if (!userId || typeof userId !== 'string') {
    console.log('No USER');
    return null;
  }
  try {
    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
    });
    console.log(user);

    return user;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function logout(requst: Request) {
  //logout user and destroy session
  const session = await storage.getSession(requst.headers.get('Cookie'));

  return redirect('/auth/logout', {
    headers: {
      'Set-Cookie': await storage.destroySession(session),
    },
  });
}
