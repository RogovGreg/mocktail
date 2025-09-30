import { useContext } from 'react';
import { Link, useNavigate } from 'react-router';
import { Button, Form, Input } from 'antd';
import { StatusCodes } from 'http-status-codes';

import { AuthService } from '#api';
import { CustomInput } from '#common-components';
import { AUTHORIZED_USER_ID_FIELD_NAME } from '#common-constants';
import { AuthContext } from '#src/global-contexts/index.ts';
import { ERoutes } from '#src/router/routes-list.ts';

import { LoginCardStyled } from './styled.ts';
import { TLoginFormValues } from './types.ts';

export const LoginPage = () => {
  const [form] = Form.useForm<TLoginFormValues>();

  const { updateAccessToken, updateAuthorizedUserData } =
    useContext(AuthContext);

  const navigate = useNavigate();

  const onFormSubmit = async (values: TLoginFormValues) => {
    await AuthService.login({ body: { data: values } }).then(response => {
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

        navigate(ERoutes.Dashboard);
      }
    });
  };

  return (
    <LoginCardStyled>
      <h1>Sign In</h1>
      <Form
        form={form}
        name='loginForm'
        id='loginForm'
        onFinish={onFormSubmit}
        layout='vertical'
      >
        <CustomInput
          formItemProps={{
            label: 'Email',
            name: 'email',
            rules: [{ message: 'Please input your email!', required: true }],
          }}
          inputProps={{ placeholder: 'Enter your email', size: 'large' }}
        />
        {/* // <Form.Item
        //   label='Email'
        //   name='email'
        //   rules={[{ message: 'Please input your email!', required: true }]}
        // >
        //   <Input placeholder='Enter your email' size='large' />
        // </Form.Item> */}
        <Form.Item
          label='Password'
          name='password'
          rules={[{ message: 'Please input your password!', required: true }]}
        >
          <Input.Password placeholder='Enter your password' size='large' />
        </Form.Item>
      </Form>
      <Button type='primary' form='loginForm' htmlType='submit' size='large'>
        Submit
      </Button>
      <div>
        <span>
          Have no account? <Link to={ERoutes.Register}>Sign up now!</Link>
        </span>
      </div>
    </LoginCardStyled>
  );
};
