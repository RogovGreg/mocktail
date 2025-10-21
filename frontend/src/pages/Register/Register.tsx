import { FC } from 'react';
import { Link, useNavigate } from 'react-router';
import { StatusCodes } from 'http-status-codes';

import { AuthService } from '#api';
import { CustomInput } from '#common-components';
import { ERoutes } from '#src/router/routes-list.ts';

import { TRegisterFormValues } from './inner-types.ts';

/**
 * 
 * if (!value) {
                  return Promise.reject(new Error('Password is required!'));
                }

                const errors: string[] = [];
                const minLength = 8;
                if (value.length < minLength) {
                  errors.push(`at least ${minLength} characters long`);
                }
                if (!/[A-Z]/.test(value)) {
                  errors.push('one uppercase letter');
                }
                if (!/[a-z]/.test(value)) {
                  errors.push('one lowercase letter');
                }
                if (!/\d/.test(value)) {
                  errors.push('one number');
                }
                if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
                  errors.push('one special character');
                }

 */

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
    }).then(response => {
      if (response.status === StatusCodes.OK) {
        navigate(ERoutes.RegisterSuccess);
      }
    });
  };

  return (
    <div>
      <h1 className='text-7xl text-center mb-8'>Register</h1>
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
        <button type='submit' className='btn btn-primary flex mx-auto'>
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
