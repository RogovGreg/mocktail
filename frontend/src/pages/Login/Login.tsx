import { useContext } from 'react';
import { Link, useNavigate } from 'react-router';
import { StatusCodes } from 'http-status-codes';

import { AuthService } from '#api';
import { CustomInput } from '#common-components';
import { AUTHORIZED_USER_ID_FIELD_NAME } from '#common-constants';
import { toast } from '#src/common-functions';
import { AuthContext } from '#src/global-contexts';
import { ERoutes } from '#src/router';

import { TLoginFormValues } from './types';

export const LoginPage = () => {
  const { updateAccessToken, updateAuthorizedUserData } =
    useContext(AuthContext);

  const navigate = useNavigate();

  const onFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const values: TLoginFormValues = {
      email: String(formData.get('email') ?? ''),
      password: String(formData.get('password') ?? ''),
    };

    await AuthService.login({ body: { data: values } })
      .then(response => {
        if (
          response.status === StatusCodes.OK &&
          updateAccessToken &&
          updateAuthorizedUserData
        ) {
          const {
            accessToken: { tokenType, accessToken, expiresIn },
            authorizedUser,
          } = response.data;
          const { id: authorizedUserID } = authorizedUser;

          updateAccessToken({
            expiresIn,
            type: tokenType,
            value: accessToken,
          });
          updateAuthorizedUserData(authorizedUser);

          if (authorizedUserID) {
            sessionStorage.setItem(
              AUTHORIZED_USER_ID_FIELD_NAME,
              authorizedUserID,
            );
          }

          navigate(ERoutes.Projects);
        }
      })
      .catch(error => {
        toast.error(
          error.response?.data?.message || 'Login failed. Please try again.',
        );
      });
  };

  return (
    <div>
      <h1 className='text-4xl font-bold mb-2 text-center'>Login</h1>
      <form
        name='loginForm'
        id='loginForm'
        onSubmit={onFormSubmit}
        className='space-y-2'
      >
        <CustomInput
          label='Email'
          name='email'
          placeholder='Enter your email'
        />
        <CustomInput
          label='Password'
          name='password'
          type='password'
          placeholder='Enter your password'
        />
        <button type='submit' className='btn btn-primary my-5 flex mx-auto'>
          Submit
        </button>
      </form>
      <div>
        <span>
          Have no account?{' '}
          <Link to={ERoutes.Register} className='link'>
            Sign up now!
          </Link>
        </span>
      </div>
    </div>
  );
};
