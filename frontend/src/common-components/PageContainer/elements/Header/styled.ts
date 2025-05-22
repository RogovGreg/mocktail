import styled from '@emotion/styled';

type THeaderStyledProps = Readonly<{
  isAuthorized: boolean;
}>;

export const HeaderStyled = styled.header<THeaderStyledProps>`
  height: ${props => (props.isAuthorized ? '30px' : '50px')};

  transition: all 1s ease;

  position: fixed;
  top: 0;
  display: flex;
  justify-content: space-between;
  width: 100%;

  background-color: violet;

  div {
    display: flex;
  }

  h1 {
    font-size: ${props => (props.isAuthorized ? '24px' : '42px')};
  }
`;

export const HeaderNavigateButtonStyled = styled.button`
  width: 100px;
  height: 100%;
  background: blue;
  color: white;
  font-weight: 900;
  display: flex;
  justify-content: center;
  align-items: center;
  text-transform: capitalize;
  border-radius: 0;

  &:hover {
    border: 1px solid red;
  }
`;
