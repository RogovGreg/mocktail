import { Button, Form, Input } from "antd"
import { LoginCardStyled } from "./styled.ts"
import { Link, useNavigate } from "react-router";
import { ERoutes } from "#src/router/routes-list.ts";

type TLoginFormValues = Readonly<{
  login: string;
  password: string;
}>;

export const LoginPage = () => {
  const [form] = Form.useForm<TLoginFormValues>();

  const navigate = useNavigate();

  const onFormSubmit = async (values: TLoginFormValues) => {
    // try {
    console.log('> onFormSubmit - 1', values);

      await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      }).then((response => {
        console.log('> onFormSubmit - 2', response);
        if (response.ok) {
          console.log('> onFormSubmit - 3');
          navigate(ERoutes.HomePage);
        }
      }));
      
      // if (response.ok) {
      //   const tokens = await response.json();
      //   storeTokens(tokens);
      //   message.success('Login successful!');
      // } else {
      //   message.error('Invalid credentials');
      // }
    // } catch (error) {
    //   message.error('Login failed. Please try again.');
    // }
  };


  return (<LoginCardStyled>
    <h1>Sign In</h1>
    <Form
      form={form}
      name="loginForm"
      id="loginForm"
      onFinish={onFormSubmit}
      layout="vertical"
    >
      <Form.Item
        label="Email"
        name="email"
        rules={[{ required: true, message: 'Please input your email!' }]}
      >
        <Input
          placeholder="Enter your email"
          prefix={
            <svg style={{ color: 'rgba(0,0,0,.25)' }} width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 21C5 17.134 8.13401 14 12 14C15.866 14 19 17.134 19 21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          }
        />
      </Form.Item>
      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input.Password 
          placeholder="input password"
          prefix={
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
              <g id="SVGRepo_iconCarrier">
                <path d="M15 9H15.01M15 15C18.3137 15 21 12.3137 21 9C21 5.68629 18.3137 3 15 3C11.6863 3 9 5.68629 9 9C9 9.27368 9.01832 9.54308 9.05381 9.80704C9.11218 10.2412 9.14136 10.4583 9.12172 10.5956C9.10125 10.7387 9.0752 10.8157 9.00469 10.9419C8.937 11.063 8.81771 11.1823 8.57913 11.4209L3.46863 16.5314C3.29568 16.7043 3.2092 16.7908 3.14736 16.8917C3.09253 16.9812 3.05213 17.0787 3.02763 17.1808C3 17.2959 3 17.4182 3 17.6627V19.4C3 19.9601 3 20.2401 3.10899 20.454C3.20487 20.6422 3.35785 20.7951 3.54601 20.891C3.75992 21 4.03995 21 4.6 21H6.33726C6.58185 21 6.70414 21 6.81923 20.9724C6.92127 20.9479 7.01881 20.9075 7.10828 20.8526C7.2092 20.7908 7.29568 20.7043 7.46863 20.5314L12.5791 15.4209C12.8177 15.1823 12.937 15.063 13.0581 14.9953C13.1843 14.9248 13.2613 14.8987 13.4044 14.8783C13.5417 14.8586 13.7588 14.8878 14.193 14.9462C14.4569 14.9817 14.7263 15 15 15Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> 
              </g>
            </svg>
          }
        />
      </Form.Item>
    </Form>
    <Button type="primary" form="loginForm" htmlType="submit">Submit</Button>
    <div>
      <span>Have no account? <Link to={ERoutes.Register}>Sign up now!</Link></span>
    </div>
  </LoginCardStyled>)
}