import { FC } from 'react';
import { Link, useNavigate } from 'react-router';
import { StatusCodes } from 'http-status-codes';

import { AuthService } from '#api';
import { CustomInput } from '#common-components';
import { toast } from '#src/common-functions';
import { ERoutes } from '#src/router/routes-list';

import { TRegisterFormValues } from './inner-types';

export const RegisterPage: FC = () => {
  const navigate = useNavigate();

  const onFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const values: TRegisterFormValues = {
      confirmPassword: String(formData.get('confirmPassword') ?? ''),
      email: String(formData.get('email') ?? ''),
      password: String(formData.get('password') ?? ''),
    };
    const { confirmPassword, ...restFields } = values;

    if (values.password !== confirmPassword) {
      // eslint-disable-next-line no-alert
      alert('Passwords do not match!');
      return;
    }

    await AuthService.register({
      body: {
        data: restFields,
      },
    })
      .then(response => {
        if (response.status === StatusCodes.OK) {
          navigate(ERoutes.RegisterSuccess);
        }
      })
      .catch(error => {
        toast.error(
          error.response?.data?.message ||
            'Registration failed. Please try again.',
        );
      });
  };

  return (
    <div>
      <h1 className='text-4xl font-bold mb-2 text-center'>Register</h1>
      <form
        name='registerForm'
        id='registerForm'
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
          placeholder='Enter your password'
          type='password'
        />
        <CustomInput
          label='Confirm Password'
          name='confirmPassword'
          placeholder='Confirm your password'
          type='password'
        />
        <button type='submit' className='btn btn-primary my-5 flex mx-auto'>
          Submit
        </button>
      </form>
      <div>
        <span>
          Already have an account?{' '}
          <Link to={ERoutes.Login} className='link'>
            Login now!
          </Link>
        </span>
      </div>
    </div>
  );
};
