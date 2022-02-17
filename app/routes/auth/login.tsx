import { useActionData, json, redirect, ActionFunction } from 'remix';
import { db } from '~/utils/db.server';
import { login, createUserSession, register } from '~/utils/session.server';

function badRequest(data: any) {
  return json(data, { status: 400 });
}
type myActionData = {
  fieldErrors: {
    username: string;
    password: string;
  };
  fields: {
    username: string;
    password: string;
    loginType: string;
  };
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();

  const loginType = form.get('loginType');
  const username = String(form.get('username'));
  const password = String(form.get('password'));

  const fields = { loginType, username, password };

  const fieldErrors = {
    username: validateUsername(username),
    password: validatePassword(password),
  };

  if (Object.values(fieldErrors).some(Boolean)) {
    console.log(fieldErrors);
    return badRequest({ fieldErrors, fields });
  }

  switch (loginType) {
    case 'login': {
      const user = await login({ username, password });
      //find user

      if (!user) {
        return badRequest({
          fields,
          fieldErrors: { username: 'Invalid Credentials' },
        });
      }
      //check user

      return createUserSession(user.id, '/posts');
      //create user session
    }
    case 'register': {
      //check if user exists
      const userExists = await db.user.findFirst({
        where: {
          username,
        },
      });
      if (userExists)
        return badRequest({
          fields,
          fieldErrors: { username: 'User already exists' },
        });
      //create user

      const user = await register({ username, password });

      if (!user)
        return badRequest({ fields, formError: 'Something went wrong' });
      //create user session

      return createUserSession(user.id, '/posts');
    }

    default: {
      return badRequest({ fields, formError: 'Login type is not valid' });
    }
  }
};

function validateUsername(username: FormDataEntryValue | null) {
  if (typeof username !== 'string' || username.length < 3)
    return 'Username must be at least 3 characters';
}

function validatePassword(password: FormDataEntryValue | null) {
  if (typeof password !== 'string' || password.length < 3)
    return 'Password must be at least 3 characters';
}

function Login() {
  const actionData = useActionData<myActionData>();
  return (
    <div className='auth-container'>
      <div className='page-header'>
        <h1>Login</h1>
      </div>
      <div className='page-content'>
        <form method='post'>
          <fieldset>
            <legend>Login or Register</legend>
            <label>
              <input
                type='radio'
                defaultChecked={
                  !actionData?.fields?.loginType ||
                  actionData?.fields?.loginType === 'login'
                }
                name='loginType'
                value='login'
              />
              Login
              <input type='radio' name='loginType' value='register' /> Register
            </label>
          </fieldset>
          <div className='form-control'>
            <label htmlFor='username'>Username</label>
            <input
              type='text'
              name='username'
              id='username'
              defaultValue={actionData?.fields?.username}
            />
            <div className='error'>
              {actionData?.fieldErrors?.username &&
                actionData?.fieldErrors?.username}
            </div>
          </div>

          <div className='form-control'>
            <label htmlFor='password'>Password</label>
            <input type='text' name='password' id='password' />
            <div className='error'>
              {actionData?.fieldErrors?.password &&
                actionData?.fieldErrors?.password}
            </div>
          </div>
          <button className='btn btn-block' type='submit'>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
